import type { UserRole } from "@/lib/db/schema"

/** Which roles may use each area of the admin. Owner can do everything. */
export const AREAS = {
  leads: ["owner", "admin", "sales"],
  consultations: ["owner", "admin", "sales"],
  content: ["owner", "admin", "editor"],
  careers: ["owner", "admin", "editor"],
  growth: ["owner", "admin", "sales", "editor"],
  settings: ["owner", "admin"],
  team: ["owner", "admin"],
} satisfies Record<string, UserRole[]>

export type Area = keyof typeof AREAS

export function canAccess(role: UserRole, area: Area | null) {
  return area === null || (AREAS[area] as UserRole[]).includes(role)
}
