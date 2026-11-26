"use server"

import { randomBytes } from "node:crypto"
import bcrypt from "bcryptjs"
import { revalidatePath } from "next/cache"
import { and, count, eq, ne } from "drizzle-orm"
import { z } from "zod"
import { assertArea, audit } from "@/lib/admin/access"
import { requireUser, verifyPassword, type CurrentUser } from "@/lib/auth"
import { getDb, schema } from "@/lib/db"
import type { UserRole } from "@/lib/db/schema"
import type { FormState } from "@/components/admin/form"

const { users, sessions } = schema
const ROLES = ["owner", "admin", "editor", "sales"] as const

export type TeamFormState = FormState & { password?: string; email?: string }

function tempPassword() {
  return randomBytes(9).toString("base64url")
}

async function target(id: string) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null
  const [row] = await getDb()
    .select({ id: users.id, name: users.name, email: users.email, role: users.role })
    .from(users)
    .where(eq(users.id, id))
    .limit(1)
  return row ?? null
}

/** Admins manage everyone except owners. Only an owner can create, change, or remove an owner. */
function mayManage(actor: CurrentUser, role: UserRole) {
  return actor.role === "owner" || role !== "owner"
}

async function ownerCount() {
  const [row] = await getDb().select({ n: count() }).from(users).where(eq(users.role, "owner"))
  return Number(row.n)
}

export async function addMember(_prev: TeamFormState, formData: FormData): Promise<TeamFormState> {
  const actor = await assertArea("team")
  const parsed = z
    .object({ name: z.string().trim().min(2).max(80), email: z.email().max(160), role: z.enum(ROLES) })
    .safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: "Enter a name, a valid email, and a role." }
  const { name, role } = parsed.data
  const email = parsed.data.email.toLowerCase()
  if (!mayManage(actor, role)) return { error: "Only an owner can add another owner." }

  const db = getDb()
  const [exists] = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1)
  if (exists) return { error: "This email already has an account." }

  const password = tempPassword()
  const [row] = await db
    .insert(users)
    .values({ name, email, role, passwordHash: await bcrypt.hash(password, 12) })
    .returning({ id: users.id })
  await audit(actor, { action: "create", entity: "user", entityId: row.id, summary: `Added ${name} (${email}) as ${role}` })
  revalidatePath("/admin/team")
  return { ok: true, message: `${name} can now sign in.`, password, email }
}

export async function changeRole(formData: FormData) {
  const actor = await assertArea("team")
  const member = await target(String(formData.get("id") ?? ""))
  const role = z.enum(ROLES).safeParse(formData.get("role"))
  if (!member || !role.success || member.id === actor.id) return
  if (!mayManage(actor, member.role) || !mayManage(actor, role.data)) return
  if (member.role === "owner" && role.data !== "owner" && (await ownerCount()) <= 1) return

  await getDb().update(users).set({ role: role.data }).where(eq(users.id, member.id))
  await audit(actor, { action: "update", entity: "user", entityId: member.id, summary: `Changed ${member.name} from ${member.role} to ${role.data}` })
  revalidatePath("/admin/team")
}

export async function resetMemberPassword(_prev: TeamFormState, formData: FormData): Promise<TeamFormState> {
  const actor = await assertArea("team")
  const member = await target(String(formData.get("id") ?? ""))
  if (!member) return { error: "Member not found." }
  if (member.id === actor.id) return { error: "Use My account to change your own password." }
  if (!mayManage(actor, member.role)) return { error: "Only an owner can reset an owner's password." }

  const password = tempPassword()
  const db = getDb()
  await db.update(users).set({ passwordHash: await bcrypt.hash(password, 12) }).where(eq(users.id, member.id))
  await db.delete(sessions).where(eq(sessions.userId, member.id))
  await audit(actor, { action: "update", entity: "user", entityId: member.id, summary: `Reset the password of ${member.name}` })
  return { ok: true, message: `New password for ${member.name}. They have been signed out everywhere.`, password, email: member.email }
}

export async function removeMember(formData: FormData) {
  const actor = await assertArea("team")
  const member = await target(String(formData.get("id") ?? ""))
  if (!member || member.id === actor.id || !mayManage(actor, member.role)) return
  if (member.role === "owner" && (await ownerCount()) <= 1) return

  await getDb().delete(users).where(and(eq(users.id, member.id), ne(users.id, actor.id)))
  await audit(actor, { action: "delete", entity: "user", entityId: member.id, summary: `Removed ${member.name} (${member.email})` })
  revalidatePath("/admin/team")
}

export async function changeOwnPassword(_prev: FormState, formData: FormData): Promise<FormState> {
  const actor = await requireUser()
  const current = String(formData.get("current") ?? "")
  const next = String(formData.get("next") ?? "")
  const confirm = String(formData.get("confirm") ?? "")
  if (next.length < 10) return { error: "Use at least 10 characters for the new password." }
  if (next.length > 200) return { error: "That password is too long." }
  if (next !== confirm) return { error: "The two new passwords do not match." }

  const db = getDb()
  const [row] = await db.select({ hash: users.passwordHash }).from(users).where(eq(users.id, actor.id)).limit(1)
  if (!row || !(await verifyPassword(current, row.hash))) return { error: "Your current password is not correct." }

  await db.update(users).set({ passwordHash: await bcrypt.hash(next, 12) }).where(eq(users.id, actor.id))
  await audit(actor, { action: "update", entity: "user", entityId: actor.id, summary: `${actor.name} changed their password` })
  return { ok: true, message: "Password changed." }
}
