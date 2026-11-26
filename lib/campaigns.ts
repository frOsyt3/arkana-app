import "server-only"
import { and, count, desc, eq, gte, isNotNull, sql } from "drizzle-orm"
import { getDb, schema } from "@/lib/db"
import { SITE_URL } from "@/lib/seo"

const { campaigns, leads } = schema

export const CHANNELS: Record<string, { source: string; medium: string }> = {
  "Meta Ads": { source: "facebook", medium: "paid_social" },
  "Instagram Ads": { source: "instagram", medium: "paid_social" },
  "LinkedIn Ads": { source: "linkedin", medium: "paid_social" },
  "Google Ads": { source: "google", medium: "cpc" },
  "WhatsApp broadcast": { source: "whatsapp", medium: "message" },
  "Email newsletter": { source: "newsletter", medium: "email" },
  "Instagram bio or post": { source: "instagram", medium: "social" },
  Other: { source: "", medium: "" },
}

export function campaignUrl(c: { landingPath: string; utmSource: string; utmMedium: string; utmCampaign: string }) {
  const url = new URL(c.landingPath || "/", SITE_URL)
  url.searchParams.set("utm_source", c.utmSource)
  url.searchParams.set("utm_medium", c.utmMedium)
  url.searchParams.set("utm_campaign", c.utmCampaign)
  return url.toString()
}

export async function listCampaigns() {
  const db = getDb()
  const won = sql<number>`count(*) filter (where ${leads.status} = 'won')`
  const [rows, stats, untracked] = await Promise.all([
    db.select().from(campaigns).orderBy(desc(campaigns.createdAt)),
    db
      .select({ campaign: sql<string>`lower(${leads.utmCampaign})`, total: count(), won })
      .from(leads)
      .where(isNotNull(leads.utmCampaign))
      .groupBy(sql`lower(${leads.utmCampaign})`),
    db
      .select({ campaign: leads.utmCampaign, total: count() })
      .from(leads)
      .where(and(isNotNull(leads.utmCampaign), gte(leads.createdAt, new Date(Date.now() - 90 * 86400000))))
      .groupBy(leads.utmCampaign)
      .orderBy(desc(count()))
      .limit(10),
  ])
  const byName = new Map(stats.map((s) => [s.campaign, { leads: Number(s.total), won: Number(s.won) }]))
  const known = new Set(rows.map((r) => r.utmCampaign.toLowerCase()))
  return {
    rows: rows.map((r) => {
      const s = byName.get(r.utmCampaign.toLowerCase()) ?? { leads: 0, won: 0 }
      return { ...r, ...s, cpl: s.leads > 0 && r.spend > 0 ? Math.round(r.spend / s.leads) : null, url: campaignUrl(r) }
    }),
    /** Leads tagged with a campaign name that has no campaign in this list. */
    untracked: untracked.filter((u) => u.campaign && !known.has(u.campaign.toLowerCase())).map((u) => ({ name: u.campaign!, total: Number(u.total) })),
  }
}

export async function getCampaign(id: string) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null
  const [row] = await getDb().select().from(campaigns).where(eq(campaigns.id, id)).limit(1)
  return row ?? null
}

export function rupiah(n: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n)
}
