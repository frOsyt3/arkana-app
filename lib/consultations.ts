import "server-only"
import { and, asc, count, desc, eq, gte, lt, type SQL } from "drizzle-orm"
import { getDb, schema } from "@/lib/db"
import type { ConsultationStatus } from "@/lib/db/schema"

const { consultations, users } = schema

export const CONSULTATION_STATUS: Record<ConsultationStatus, { label: string; badge: string }> = {
  requested: { label: "Requested", badge: "bg-amber-100 text-amber-700" },
  confirmed: { label: "Confirmed", badge: "bg-primary/12 text-[#2F7F81]" },
  done: { label: "Done", badge: "bg-green-100 text-green-700" },
  cancelled: { label: "Cancelled", badge: "bg-slate-100 text-slate-500" },
}
export const CONSULTATION_STATUSES = Object.keys(CONSULTATION_STATUS) as ConsultationStatus[]

export const MODES: Record<string, string> = {
  online: "Online meeting",
  office: "At Arkana office",
  onsite: "At client site",
  phone: "Phone or WhatsApp call",
}

export type ConsultationView = "upcoming" | "past" | "requested"

export async function listConsultations(view: ConsultationView) {
  const now = new Date()
  const startOfToday = new Date(now.getTime() - 12 * 60 * 60 * 1000)
  let where: SQL | undefined
  if (view === "requested") where = eq(consultations.status, "requested")
  else if (view === "upcoming") where = gte(consultations.scheduledAt, startOfToday)
  else where = lt(consultations.scheduledAt, startOfToday)

  const db = getDb()
  const [rows, counts, [{ upcoming }]] = await Promise.all([
    db
      .select({ c: consultations, ownerName: users.name })
      .from(consultations)
      .leftJoin(users, eq(consultations.ownerId, users.id))
      .where(where)
      .orderBy(view === "past" ? desc(consultations.scheduledAt) : asc(consultations.scheduledAt))
      .limit(100),
    db.select({ status: consultations.status, n: count() }).from(consultations).groupBy(consultations.status),
    db
      .select({ upcoming: count() })
      .from(consultations)
      .where(and(gte(consultations.scheduledAt, now), eq(consultations.status, "confirmed"))),
  ])
  const byStatus = Object.fromEntries(CONSULTATION_STATUSES.map((s) => [s, 0])) as Record<ConsultationStatus, number>
  for (const r of counts) byStatus[r.status] = Number(r.n)
  return { rows: rows.map((r) => ({ ...r.c, ownerName: r.ownerName })), byStatus, upcomingConfirmed: Number(upcoming) }
}

export async function getConsultation(id: string) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null
  const [row] = await getDb().select().from(consultations).where(eq(consultations.id, id)).limit(1)
  return row ?? null
}

const TZ = "Asia/Jakarta"

/** "2026-11-26T14:00" in WIB, for datetime-local inputs. */
export function toLocalInput(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date)
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "00"
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`
}

/** Reads a datetime-local value as WIB. */
export function fromLocalInput(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) return null
  const d = new Date(`${value}:00+07:00`)
  return Number.isNaN(d.getTime()) ? null : d
}

export function dayKey(date: Date) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(date)
}

export function formatDay(date: Date) {
  return new Intl.DateTimeFormat("en-GB", { timeZone: TZ, weekday: "long", day: "numeric", month: "long" }).format(date)
}

export function formatTime(date: Date) {
  return new Intl.DateTimeFormat("en-GB", { timeZone: TZ, hour: "2-digit", minute: "2-digit" }).format(date)
}

export function googleCalendarLink(c: { topic: string; name: string; company: string | null; scheduledAt: Date; durationMinutes: number; email: string | null; location: string | null; notes: string | null }) {
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")
  const end = new Date(c.scheduledAt.getTime() + c.durationMinutes * 60000)
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `Arkana x ${c.company || c.name}: ${c.topic}`,
    dates: `${fmt(c.scheduledAt)}/${fmt(end)}`,
    details: c.notes ?? "",
    location: c.location ?? "",
  })
  if (c.email) params.set("add", c.email)
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}
