import "server-only"
import { redirect } from "next/navigation"
import { requireUser, type CurrentUser } from "@/lib/auth"
import { getDb, schema } from "@/lib/db"
import { canAccess, type Area } from "@/lib/admin/roles"

export { canAccess, type Area }

/** For pages: sends people without access back to the overview. */
export async function requireArea(area: Area): Promise<CurrentUser> {
  const user = await requireUser()
  if (!canAccess(user.role, area)) redirect("/admin?denied=1")
  return user
}

/** For server actions: throws instead of redirecting. */
export async function assertArea(area: Area): Promise<CurrentUser> {
  const user = await requireUser()
  if (!canAccess(user.role, area)) throw new Error("You do not have access to this area.")
  return user
}

export async function audit(
  user: Pick<CurrentUser, "id">,
  entry: { action: string; entity: string; entityId?: string | null; summary: string }
) {
  try {
    await getDb()
      .insert(schema.auditLogs)
      .values({ userId: user.id, action: entry.action, entity: entry.entity, entityId: entry.entityId ?? null, summary: entry.summary })
  } catch (err) {
    // The change itself already succeeded, a missing log line must not undo it for the user.
    console.error("audit log failed", err)
  }
}
