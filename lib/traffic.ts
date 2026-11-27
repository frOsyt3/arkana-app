import "server-only"
import { count, desc, eq, gte, sql, sum } from "drizzle-orm"
import { getDb, schema } from "@/lib/db"

const { leads, articles, articleViews, projects, jobs } = schema

export async function getTrafficReport(days: number) {
  const db = getDb()
  const from = new Date(Date.now() - days * 86400000)
  const fromDay = from.toISOString().slice(0, 10)
  const landing = sql<string>`coalesce(nullif(split_part(${leads.landingPage}, '?', 1), ''), '(unknown)')`

  const [bySource, byLanding, byDevice, topArticles, [viewTotal], [counts]] = await Promise.all([
    db
      .select({ label: leads.source, total: count(), won: sql<number>`count(*) filter (where ${leads.status} = 'won')` })
      .from(leads)
      .where(gte(leads.createdAt, from))
      .groupBy(leads.source)
      .orderBy(desc(count())),
    db.select({ label: landing, total: count() }).from(leads).where(gte(leads.createdAt, from)).groupBy(landing).orderBy(desc(count())).limit(8),
    db
      .select({ label: sql<string>`coalesce(${leads.device}, 'Unknown')`, total: count() })
      .from(leads)
      .where(gte(leads.createdAt, from))
      .groupBy(leads.device)
      .orderBy(desc(count())),
    db
      .select({ title: articles.title, slug: articles.slug, views: sum(articleViews.count) })
      .from(articleViews)
      .innerJoin(articles, eq(articleViews.articleId, articles.id))
      .where(gte(articleViews.day, fromDay))
      .groupBy(articles.id, articles.title, articles.slug)
      .orderBy(desc(sum(articleViews.count)))
      .limit(8),
    db.select({ total: sum(articleViews.count) }).from(articleViews).where(gte(articleViews.day, fromDay)),
    db
      .select({
        published: sql<number>`(select count(*) from ${articles} where ${articles.status} = 'published' and ${articles.publishedAt} <= now())`,
        missingMeta: sql<number>`(select count(*) from ${articles} where ${articles.status} = 'published' and (${articles.metaDescription} is null or ${articles.metaDescription} = ''))`,
        noCover: sql<number>`(select count(*) from ${articles} where ${articles.status} = 'published' and ${articles.coverUrl} is null)`,
        lastPublished: sql<string | null>`(select max(${articles.publishedAt}) from ${articles} where ${articles.status} = 'published')`,
        projects: sql<number>`(select count(*) from ${projects} where ${projects.published})`,
        projectsNoImage: sql<number>`(select count(*) from ${projects} where ${projects.published} and ${projects.imageUrl} is null)`,
        jobs: sql<number>`(select count(*) from ${jobs} where ${jobs.status} = 'open')`,
        leads: sql<number>`(select count(*) from ${leads} where ${leads.createdAt} >= ${from.toISOString()})`,
        tagged: sql<number>`(select count(*) from ${leads} where ${leads.createdAt} >= ${from.toISOString()} and ${leads.utmSource} is not null)`,
      })
      .from(sql`(select 1) as one`),
  ])

  const num = (v: unknown) => Number(v ?? 0)
  return {
    bySource: bySource.map((r) => ({ label: r.label, total: num(r.total), won: num(r.won) })),
    byLanding: byLanding.map((r) => ({ label: r.label, total: num(r.total) })),
    byDevice: byDevice.map((r) => ({ label: r.label, total: num(r.total) })),
    topArticles: topArticles.map((r) => ({ title: r.title || "Untitled", slug: r.slug, views: num(r.views) })),
    articleViews: num(viewTotal?.total),
    counts: {
      published: num(counts.published),
      missingMeta: num(counts.missingMeta),
      noCover: num(counts.noCover),
      lastPublished: counts.lastPublished ? new Date(counts.lastPublished) : null,
      daysSincePost: counts.lastPublished ? (Date.now() - new Date(counts.lastPublished).getTime()) / 86400000 : Infinity,
      projects: num(counts.projects),
      projectsNoImage: num(counts.projectsNoImage),
      jobs: num(counts.jobs),
      leads: num(counts.leads),
      tagged: num(counts.tagged),
    },
  }
}

/** Visitors and page views the site records itself, per day and per page. */
export async function getVisitorReport(days: number) {
  const { pageViews } = schema
  const db = getDb()
  const today = sql`(now() at time zone 'Asia/Jakarta')::date`
  const inRange = sql`${pageViews.day} > ${today} - ${days}::int`

  const [daily, topPages, [todayRow]] = await Promise.all([
    db
      .select({ day: sql<string>`${pageViews.day}::text`, visitors: sum(pageViews.visitors), views: sum(pageViews.views) })
      .from(pageViews)
      .where(inRange)
      .groupBy(pageViews.day)
      .orderBy(pageViews.day),
    db
      .select({ label: pageViews.path, total: sum(pageViews.views) })
      .from(pageViews)
      .where(inRange)
      .groupBy(pageViews.path)
      .orderBy(desc(sum(pageViews.views)))
      .limit(8),
    db
      .select({ visitors: sum(pageViews.visitors), views: sum(pageViews.views) })
      .from(pageViews)
      .where(eq(pageViews.day, sql`${today}` as unknown as string)),
  ])

  const num = (v: unknown) => Number(v ?? 0)
  const byDay = new Map(daily.map((d) => [d.day, { visitors: num(d.visitors), views: num(d.views) }]))
  // Fill every day in the range so quiet days show as zero.
  const series: { day: string; visitors: number; views: number }[] = []
  const end = new Date(new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" }) + "T00:00:00Z")
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(end.getTime() - i * 86400000).toISOString().slice(0, 10)
    series.push({ day: d, ...(byDay.get(d) ?? { visitors: 0, views: 0 }) })
  }

  return {
    series,
    topPages: topPages.map((p) => ({ label: p.label, total: num(p.total) })),
    visitors: series.reduce((a, d) => a + d.visitors, 0),
    views: series.reduce((a, d) => a + d.views, 0),
    todayVisitors: num(todayRow?.visitors),
    todayViews: num(todayRow?.views),
  }
}
