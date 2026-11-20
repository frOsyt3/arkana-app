"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"
import { z } from "zod"
import { createSession, destroySession, requireUser, verifyPassword } from "@/lib/auth"
import { getDb, schema } from "@/lib/db"
import { isLeadStatus } from "@/lib/admin/queries"
import { STATUS_META } from "@/lib/admin/format"

export interface LoginState {
  error?: string
}

// A hash of a random password, compared when the email is unknown so the
// response time does not reveal which emails have accounts.
const DUMMY_HASH = "$2b$12$OAwTmW7HBhsqiJnBi0my6e5Vv5Z.lxkzVhqzR5kMawh4qcBgq0xd6"

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = z
    .object({ email: z.email(), password: z.string().min(1).max(200) })
    .safeParse({ email: formData.get("email"), password: formData.get("password") })

  if (!parsed.success) return { error: "Enter your email and password." }

  const email = parsed.data.email.toLowerCase()
  const [user] = await getDb().select().from(schema.users).where(eq(schema.users.email, email)).limit(1)
  const valid = await verifyPassword(parsed.data.password, user?.passwordHash ?? DUMMY_HASH)

  if (!user || !valid) return { error: "That email and password do not match." }

  await createSession(user.id)
  await getDb().update(schema.users).set({ lastLoginAt: new Date() }).where(eq(schema.users.id, user.id))

  const next = String(formData.get("next") ?? "")
  redirect(next.startsWith("/admin") && !next.startsWith("//") ? next : "/admin")
}

export async function logout() {
  await destroySession()
  redirect("/admin/login")
}

function leadIdFrom(formData: FormData) {
  const id = String(formData.get("leadId") ?? "")
  return /^[0-9a-f-]{36}$/i.test(id) ? id : null
}

export async function updateLeadStatus(formData: FormData) {
  const user = await requireUser()
  const leadId = leadIdFrom(formData)
  const status = formData.get("status")
  if (!leadId || !isLeadStatus(status)) return

  const db = getDb()
  const [current] = await db
    .select({ status: schema.leads.status })
    .from(schema.leads)
    .where(eq(schema.leads.id, leadId))
    .limit(1)
  if (!current || current.status === status) return

  await db.update(schema.leads).set({ status, updatedAt: new Date() }).where(eq(schema.leads.id, leadId))
  await db.insert(schema.leadActivities).values({
    leadId,
    userId: user.id,
    type: "status_change",
    body: `Status changed to ${STATUS_META[status].label}`,
    meta: { from: current.status, to: status },
  })
  revalidatePath("/admin", "layout")
}

export async function updateLeadOwner(formData: FormData) {
  const user = await requireUser()
  const leadId = leadIdFrom(formData)
  const ownerRaw = String(formData.get("ownerId") ?? "")
  const ownerId = /^[0-9a-f-]{36}$/i.test(ownerRaw) ? ownerRaw : null
  if (!leadId) return

  const db = getDb()
  let ownerName = "nobody"
  if (ownerId) {
    const [owner] = await db
      .select({ name: schema.users.name })
      .from(schema.users)
      .where(eq(schema.users.id, ownerId))
      .limit(1)
    if (!owner) return
    ownerName = owner.name
  }

  await db.update(schema.leads).set({ ownerId, updatedAt: new Date() }).where(eq(schema.leads.id, leadId))
  await db.insert(schema.leadActivities).values({
    leadId,
    userId: user.id,
    type: "owner_change",
    body: `Assigned to ${ownerName}`,
  })
  revalidatePath("/admin", "layout")
}

export async function addLeadNote(formData: FormData) {
  const user = await requireUser()
  const leadId = leadIdFrom(formData)
  const note = String(formData.get("note") ?? "").trim().slice(0, 2000)
  if (!leadId || !note) return

  const db = getDb()
  await db.insert(schema.leadActivities).values({ leadId, userId: user.id, type: "note", body: note })
  await db.update(schema.leads).set({ updatedAt: new Date() }).where(eq(schema.leads.id, leadId))
  revalidatePath("/admin/leads")
}
