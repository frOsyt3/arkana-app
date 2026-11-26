"use server"

import { and, eq, gt } from "drizzle-orm"
import { z } from "zod"
import { getDb, isDatabaseConfigured, schema } from "@/lib/db"
import { getOpenJobs } from "@/lib/careers"
import { getContactSettings } from "@/lib/site-settings"

export interface ApplyState {
  status: "idle" | "success" | "error"
  message?: string
  fieldErrors?: Partial<Record<string, string>>
}

const MAX_CV = 2 * 1024 * 1024
const CV_TYPES: Record<string, string> = {
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
}

const applySchema = z.object({
  jobId: z.union([z.uuid(), z.literal("")]),
  name: z.string().trim().min(2, "Mohon isi nama lengkap Anda").max(120),
  email: z.email("Mohon masukkan alamat email yang valid").max(160),
  phone: z.string().trim().min(8, "Mohon isi nomor WhatsApp atau telepon").max(40),
  portfolioUrl: z.union([z.url("Tautan harus diawali https://").max(300), z.literal("")]),
  coverLetter: z.string().trim().max(3000),
})

export async function submitApplication(_prev: ApplyState, formData: FormData): Promise<ApplyState> {
  if (String(formData.get("website") ?? "")) return { status: "success" }

  const parsed = applySchema.safeParse({
    jobId: formData.get("jobId") ?? "",
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    portfolioUrl: formData.get("portfolioUrl") ?? "",
    coverLetter: formData.get("coverLetter") ?? "",
  })
  const fieldErrors: Record<string, string> = {}
  if (!parsed.success) for (const i of parsed.error.issues) fieldErrors[String(i.path[0])] ??= i.message

  const cv = formData.get("cv")
  if (!(cv instanceof File) || cv.size === 0) fieldErrors.cv = "Mohon lampirkan CV Anda"
  else if (!CV_TYPES[cv.type]) fieldErrors.cv = "Gunakan file PDF, DOC, atau DOCX"
  else if (cv.size > MAX_CV) fieldErrors.cv = "Ukuran file maksimal 2 MB"

  if (!parsed.success || Object.keys(fieldErrors).length)
    return { status: "error", message: "Mohon periksa kembali kolom yang ditandai.", fieldErrors }

  const contact = await getContactSettings()
  if (!isDatabaseConfigured())
    return { status: "error", message: `Formulir sedang tidak dapat digunakan. Silakan kirim CV ke ${contact.email}.` }

  const d = parsed.data
  const file = cv as File
  try {
    // Only open roles can receive applications. Anything else is filed as a general application.
    const jobId = d.jobId && (await getOpenJobs()).some((j) => j.id === d.jobId) ? d.jobId : null
    const db = getDb()
    const recent = new Date(Date.now() - 10 * 60 * 1000)
    const [dup] = await db
      .select({ id: schema.jobApplications.id })
      .from(schema.jobApplications)
      .where(and(eq(schema.jobApplications.email, d.email.toLowerCase()), gt(schema.jobApplications.createdAt, recent)))
      .limit(1)
    if (dup) return { status: "success" }

    const ext = CV_TYPES[file.type]
    const safeName = `CV ${d.name}`.replace(/[^\w\- ]/g, "").trim().slice(0, 60) || "CV"
    await db.insert(schema.jobApplications).values({
      jobId,
      name: d.name,
      email: d.email.toLowerCase(),
      phone: d.phone,
      portfolioUrl: d.portfolioUrl || null,
      coverLetter: d.coverLetter || null,
      cvName: `${safeName}.${ext}`,
      cvMime: file.type,
      cvSize: file.size,
      cvData: Buffer.from(await file.arrayBuffer()).toString("base64"),
    })
    return { status: "success" }
  } catch (err) {
    console.error("application failed", err)
    return { status: "error", message: `Terjadi kendala saat mengirim. Silakan coba lagi atau kirim CV ke ${contact.email}.` }
  }
}
