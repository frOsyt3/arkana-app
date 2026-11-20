import "server-only"
import { and, asc, count, desc, eq, gte, ilike, lt, or, sql, type SQL } from "drizzle-orm"
import { getDb, schema } from "@/lib/db"
import type { LeadStatus } from "@/lib/db/schema"

const { leads, leadActivities, users } = schema

export const LEAD_STATUSES: LeadStatus[] = ["new", "contacted", "proposal", "won", "lost"]

export function isLeadStatus(value: unknown): value is LeadStatus {
  return typeof value === "string" && (LEAD_STATUSES as string[]).includes(value)
}

const DAY = 24 * 60 * 60 * 1000

/** Leads per Jakarta calendar day, oldest first, with empty days filled in. */
async function dailyCounts(from: Date, days: number) {
  const day = sql<string>`to_char(${leads.createdAt} at time zone 'Asia/Jakarta', 'YYYY-MM-DD')`
  const rows = await getDb()
    .select({ day, total: count() })
    .from(leads)
    .where(gte(leads.createdAt, from))
    .groupBy(day)

  const byDay = new Map(rows.map((r) => [r.day, Number(r.total)]))
  const fmt = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta" })
  return Array.from({ length: days }, (_, i) => {
    const date = new Date(from.getTime() + (i + 1) * DAY)
    const key = fmt.format(date)
    return { date: key, total: byDay.get(key) ?? 0 }
  })
}

export async function getOverview(days: number) {
  const db = getDb()
  const now = new Date()
  const from = new Date(now.getTime() - days * DAY)
  const prevFrom = new Date(now.getTime() - 2 * days * DAY)

  const [[current], [previous], byStatus, bySource, daily, recent] = await Promise.all([
    db.select({ total: count() }).from(leads).where(gte(leads.createdAt, from)),
    db
      .select({ total: count() })
      .from(leads)
      .where(and(gte(leads.createdAt, prevFrom), lt(leads.createdAt, from))),
    db.select({ status: leads.status, total: count() }).from(leads).groupBy(leads.status),
    db
      .select({ source: leads.source, total: count() })
      .from(leads)
      .where(gte(leads.createdAt, from))
      .groupBy(leads.source)
      .orderBy(desc(count())),
    dailyCounts(from, days),
    db.select().from(leads).orderBy(desc(leads.createdAt)).limit(6),
  ])

  const statusCounts = Object.fromEntries(LEAD_STATUSES.map((s) => [s, 0])) as Record<LeadStatus, number>
  for (const row of byStatus) statusCounts[row.status] = Number(row.total)

  return {
    leadsInRange: Number(current.total),
    leadsPrevious: Number(previous.total),
    statusCounts,
    sources: bySource.map((r) => ({ source: r.source, total: Number(r.total) })),
    daily,
    recent,
  }
}

export async function countNewLeads() {
  const [row] = await getDb().select({ total: count() }).from(leads).where(eq(leads.status, "new"))
  return Number(row.total)
}

export const LEADS_PAGE_SIZE = 10

export async function listLeads(opts: {
  status?: LeadStatus
  q?: string
  source?: string
  page: number
}) {
  const db = getDb()
  const filters: SQL[] = []
  if (opts.q) {
    const term = `%${opts.q.replace(/[%_]/g, "\\$&")}%`
    filters.push(
      or(
        ilike(leads.firstName, term),
        ilike(leads.lastName, term),
        ilike(leads.email, term),
        ilike(leads.company, term),
        ilike(leads.subject, term)
      )!
    )
  }
  if (opts.source) filters.push(eq(leads.source, opts.source))

  const base = filters.length ? and(...filters) : undefined
  const where = opts.status ? and(base, eq(leads.status, opts.status)) : base

  const [rows, [{ total }], statusRows, sourceRows] = await Promise.all([
    db
      .select()
      .from(leads)
      .where(where)
      .orderBy(desc(leads.createdAt))
      .limit(LEADS_PAGE_SIZE)
      .offset((opts.page - 1) * LEADS_PAGE_SIZE),
    db.select({ total: count() }).from(leads).where(where),
    db.select({ status: leads.status, total: count() }).from(leads).where(base).groupBy(leads.status),
    db.selectDistinct({ source: leads.source }).from(leads).orderBy(asc(leads.source)),
  ])

  const statusCounts = Object.fromEntries(LEAD_STATUSES.map((s) => [s, 0])) as Record<LeadStatus, number>
  let all = 0
  for (const row of statusRows) {
    statusCounts[row.status] = Number(row.total)
    all += Number(row.total)
  }

  return {
    rows,
    total: Number(total),
    statusCounts,
    allCount: all,
    sources: sourceRows.map((r) => r.source),
  }
}

export async function getLeadDetail(id: string) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null
  const db = getDb()
  const [lead] = await db.select().from(leads).where(eq(leads.id, id)).limit(1)
  if (!lead) return null

  const activities = await db
    .select({
      id: leadActivities.id,
      type: leadActivities.type,
      body: leadActivities.body,
      createdAt: leadActivities.createdAt,
      userName: users.name,
    })
    .from(leadActivities)
    .leftJoin(users, eq(leadActivities.userId, users.id))
    .where(eq(leadActivities.leadId, id))
    .orderBy(desc(leadActivities.createdAt))

  return { lead, activities }
}

export async function listTeam() {
  return getDb()
    .select({ id: users.id, name: users.name })
    .from(users)
    .orderBy(asc(users.name))
}

export async function exportLeads() {
  const owner = sql<string | null>`(select name from users where users.id = ${leads.ownerId})`
  return getDb()
    .select({
      createdAt: leads.createdAt,
      firstName: leads.firstName,
      lastName: leads.lastName,
      email: leads.email,
      phone: leads.phone,
      company: leads.company,
      subject: leads.subject,
      message: leads.message,
      status: leads.status,
      owner,
      source: leads.source,
      utmSource: leads.utmSource,
      utmMedium: leads.utmMedium,
      utmCampaign: leads.utmCampaign,
      landingPage: leads.landingPage,
      device: leads.device,
    })
    .from(leads)
    .orderBy(desc(leads.createdAt))
}
