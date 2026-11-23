"use server"

import { headers } from "next/headers"
import { z } from "zod"
import { and, eq, gt } from "drizzle-orm"
import { getDb, isDatabaseConfigured, schema } from "@/lib/db"
import { deriveSource, deviceFromUserAgent } from "@/lib/lead-source"
import { notifyNewLead } from "@/lib/notify"
import { companyInfo } from "@/lib/company-data"

export interface ContactFormState {
  status: "idle" | "success" | "error"
  message?: string
  fieldErrors?: Partial<Record<string, string>>
}

const optional = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((v) => (v === "" ? null : v))
    .nullable()
    .optional()

const leadSchema = z.object({
  firstName: z.string().trim().min(1, "Mohon isi nama depan Anda").max(80),
  lastName: z.string().trim().min(1, "Mohon isi nama belakang Anda").max(80),
  email: z.email("Mohon masukkan alamat email yang valid").max(160),
  phone: optional(40),
  company: optional(160),
  subject: z.string().trim().min(2, "Mohon isi subjek pesan").max(160),
  message: z.string().trim().min(10, "Mohon jelaskan sedikit lebih detail (minimal 10 karakter)").max(5000),
  utmSource: optional(120),
  utmMedium: optional(120),
  utmCampaign: optional(160),
  utmTerm: optional(160),
  utmContent: optional(160),
  referrer: optional(500),
  landingPage: optional(300),
})

export async function submitLead(_prev: ContactFormState, formData: FormData): Promise<ContactFormState> {
  // Honeypot: real visitors never see or fill this field.
  if (String(formData.get("website") ?? "").length > 0) {
    return { status: "success" }
  }

  const parsed = leadSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0])
      fieldErrors[key] ??= issue.message
    }
    return { status: "error", message: "Mohon periksa kembali kolom yang ditandai.", fieldErrors }
  }

  if (!isDatabaseConfigured()) {
    return {
      status: "error",
      message: `Formulir sedang tidak dapat digunakan. Silakan kirim email ke ${companyInfo.contact.email.general}.`,
    }
  }

  const data = parsed.data
  const db = getDb()

  try {
    // Ignore accidental double submits of the same message.
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000)
    const [duplicate] = await db
      .select({ id: schema.leads.id })
      .from(schema.leads)
      .where(
        and(
          eq(schema.leads.email, data.email),
          eq(schema.leads.message, data.message),
          gt(schema.leads.createdAt, tenMinutesAgo)
        )
      )
      .limit(1)
    if (duplicate) return { status: "success" }

    const ua = (await headers()).get("user-agent")
    const [lead] = await db
      .insert(schema.leads)
      .values({
        ...data,
        source: deriveSource(data),
        device: deviceFromUserAgent(ua),
      })
      .returning()

    await db.insert(schema.leadActivities).values({
      leadId: lead.id,
      type: "created",
      body: "Contact form submitted",
    })

    await notifyNewLead(lead)
    return { status: "success" }
  } catch (error) {
    console.error("Failed to save lead", error)
    return {
      status: "error",
      message: `Terjadi kendala saat mengirim. Silakan coba lagi atau kirim email ke ${companyInfo.contact.email.general}.`,
    }
  }
}
