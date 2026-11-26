"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"
import { z } from "zod"
import { assertArea, audit } from "@/lib/admin/access"
import { getDb, schema } from "@/lib/db"
import { CONSULTATION_STATUS, CONSULTATION_STATUSES, fromLocalInput } from "@/lib/consultations"
import type { FormState } from "@/components/admin/form"
import type { ConsultationStatus } from "@/lib/db/schema"

const { consultations } = schema
const opt = (max: number) => z.string().trim().max(max).transform((v) => v || null)

const consultationSchema = z.object({
  id: z.union([z.uuid(), z.literal("")]),
  leadId: z.union([z.uuid(), z.literal("")]),
  name: z.string().trim().min(2, "Add the client's name.").max(120),
  email: z.union([z.email("Check the email address."), z.literal("")]),
  phone: opt(40),
  company: opt(160),
  topic: z.string().trim().min(2, "Add a topic.").max(200),
  scheduledAt: z.string(),
  durationMinutes: z.coerce.number().int().min(15).max(480),
  mode: z.enum(["online", "office", "onsite", "phone"]),
  location: opt(500),
  notes: opt(4000),
  status: z.enum(CONSULTATION_STATUSES as [ConsultationStatus, ...ConsultationStatus[]]),
  ownerId: z.union([z.uuid(), z.literal("")]),
})

export async function saveConsultation(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await assertArea("consultations")
  const parsed = consultationSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the form and try again." }
  const d = parsed.data
  const at = fromLocalInput(d.scheduledAt)
  if (!at) return { error: "Pick a date and time." }

  const values = {
    leadId: d.leadId || null,
    name: d.name,
    email: d.email || null,
    phone: d.phone,
    company: d.company,
    topic: d.topic,
    scheduledAt: at,
    durationMinutes: d.durationMinutes,
    mode: d.mode,
    location: d.location,
    notes: d.notes,
    status: d.status,
    ownerId: d.ownerId || null,
    updatedAt: new Date(),
  }
  const db = getDb()
  let id = d.id
  if (id) {
    const [row] = await db.update(consultations).set(values).where(eq(consultations.id, id)).returning({ id: consultations.id })
    if (!row) return { error: "This consultation no longer exists." }
    await audit(user, { action: "update", entity: "consultation", entityId: id, summary: `Updated consultation with ${d.name} (${d.status})` })
  } else {
    const [row] = await db.insert(consultations).values(values).returning({ id: consultations.id })
    id = row.id
    await audit(user, { action: "create", entity: "consultation", entityId: id, summary: `Scheduled consultation with ${d.name}` })
    if (d.leadId) {
      await db.insert(schema.leadActivities).values({ leadId: d.leadId, userId: user.id, type: "note", body: `Consultation scheduled: ${d.topic}` })
    }
  }
  revalidatePath("/admin/consultations")
  if (!d.id) redirect(`/admin/consultations/${id}?saved=1`)
  return { ok: true, message: "Saved." }
}

export async function setConsultationStatus(formData: FormData) {
  const user = await assertArea("consultations")
  const id = String(formData.get("id") ?? "")
  const status = formData.get("status") as ConsultationStatus
  if (!/^[0-9a-f-]{36}$/i.test(id) || !CONSULTATION_STATUSES.includes(status)) return
  const [row] = await getDb()
    .update(consultations)
    .set({ status, updatedAt: new Date() })
    .where(eq(consultations.id, id))
    .returning({ name: consultations.name })
  if (row) await audit(user, { action: "update", entity: "consultation", entityId: id, summary: `Marked consultation with ${row.name} as ${CONSULTATION_STATUS[status].label}` })
  revalidatePath("/admin/consultations")
}

export async function deleteConsultation(formData: FormData) {
  const user = await assertArea("consultations")
  const id = String(formData.get("id") ?? "")
  if (!/^[0-9a-f-]{36}$/i.test(id)) return
  const [row] = await getDb().delete(consultations).where(eq(consultations.id, id)).returning({ name: consultations.name })
  if (row) await audit(user, { action: "delete", entity: "consultation", entityId: id, summary: `Deleted consultation with ${row.name}` })
  revalidatePath("/admin/consultations")
  redirect("/admin/consultations")
}
