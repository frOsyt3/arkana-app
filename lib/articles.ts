import "server-only"
import sanitizeHtml from "sanitize-html"
import { and, count, desc, eq, gt, ilike, lte, ne, or, sql, sum, type SQL } from "drizzle-orm"
import { getDb, isDatabaseConfigured, schema } from "@/lib/db"
import type { Article, ArticleStatus } from "@/lib/db/schema"

const { articles, articleViews, users } = schema

export const DEFAULT_CATEGORIES = [
  "Pengadaan",
  "Cloud",
  "Keamanan",
  "Infrastruktur",
  "Pengembangan Web",
  "Studi Kasus",
]

export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
}

export function readingMinutes(html: string) {
  const words = html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

export function sanitizeArticleHtml(html: string) {
  return sanitizeHtml(html, {
    allowedTags: [
      "p", "h2", "h3", "h4", "strong", "b", "em", "i", "u", "s", "a", "ul", "ol", "li",
      "blockquote", "code", "pre", "img", "hr", "br",
      "table", "thead", "tbody", "tr", "th", "td", "colgroup", "col",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "width", "height"],
      th: ["colspan", "rowspan"],
      td: ["colspan", "rowspan"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesByTag: { img: ["http", "https"] },
    allowProtocolRelative: false,
    transformTags: {
      a: (tagName, attribs) => {
        const href = attribs.href ?? "#"
        const external = /^https?:\/\//.test(href) && !href.includes("arkanacorp.id")
        const out: Record<string, string> = { href }
        if (external) Object.assign(out, { target: "_blank", rel: "noopener noreferrer" })
        return { tagName, attribs: out }
      },
    },
  })
}

/** A scheduled article counts as published once its go live time has passed. */
export function effectiveStatus(a: Pick<Article, "status" | "publishedAt">, now = new Date()): ArticleStatus {
  if (a.status === "scheduled" && a.publishedAt && a.publishedAt <= now) return "published"
  return a.status
}

const isLive = () =>
  and(or(eq(articles.status, "published"), eq(articles.status, "scheduled")), lte(articles.publishedAt, sql`now()`))!

/* ---------- Public ---------- */

export type PublicArticleCard = Pick<
  Article,
  "id" | "slug" | "title" | "excerpt" | "coverUrl" | "category" | "publishedAt" | "readingMinutes"
>

const cardFields = {
  id: articles.id,
  slug: articles.slug,
  title: articles.title,
  excerpt: articles.excerpt,
  coverUrl: articles.coverUrl,
  category: articles.category,
  publishedAt: articles.publishedAt,
  readingMinutes: articles.readingMinutes,
}

export async function listPublishedArticles(category?: string) {
  if (!isDatabaseConfigured()) return { articles: [] as PublicArticleCard[], categories: [] as { name: string; total: number }[] }
  const db = getDb()
  const [rows, cats] = await Promise.all([
    db
      .select(cardFields)
      .from(articles)
      .where(category ? and(isLive(), eq(articles.category, category)) : isLive())
      .orderBy(desc(articles.publishedAt)),
    db
      .select({ name: articles.category, total: count() })
      .from(articles)
      .where(isLive())
      .groupBy(articles.category)
      .orderBy(desc(count())),
  ])
  return { articles: rows, categories: cats.map((c) => ({ name: c.name, total: Number(c.total) })) }
}

export async function getArticleBySlug(slug: string, { includeDrafts = false } = {}) {
  if (!isDatabaseConfigured()) return null
  const [row] = await getDb()
    .select({ article: articles, authorName: users.name })
    .from(articles)
    .leftJoin(users, eq(articles.authorId, users.id))
    .where(includeDrafts ? eq(articles.slug, slug) : and(eq(articles.slug, slug), isLive()))
    .limit(1)
  return row ?? null
}

export async function relatedArticles(article: Pick<Article, "id" | "category">, limit = 3) {
  const db = getDb()
  const sameCategory = await db
    .select(cardFields)
    .from(articles)
    .where(and(isLive(), ne(articles.id, article.id), eq(articles.category, article.category)))
    .orderBy(desc(articles.publishedAt))
    .limit(limit)
  if (sameCategory.length >= limit) return sameCategory
  const others = await db
    .select(cardFields)
    .from(articles)
    .where(and(isLive(), ne(articles.id, article.id), ne(articles.category, article.category)))
    .orderBy(desc(articles.publishedAt))
    .limit(limit - sameCategory.length)
  return [...sameCategory, ...others]
}

export async function sitemapArticles() {
  if (!isDatabaseConfigured()) return []
  return getDb()
    .select({ slug: articles.slug, updatedAt: articles.updatedAt })
    .from(articles)
    .where(isLive())
}

export async function recordView(articleId: string) {
  const db = getDb()
  const day = sql`(now() at time zone 'Asia/Jakarta')::date`
  await Promise.all([
    db
      .insert(articleViews)
      .values({ articleId, day: sql`${day}` as unknown as string, count: 1 })
      .onConflictDoUpdate({
        target: [articleViews.articleId, articleViews.day],
        set: { count: sql`${articleViews.count} + 1` },
      }),
    db
      .update(articles)
      .set({ views: sql`${articles.views} + 1` })
      .where(and(eq(articles.id, articleId), isLive())),
  ])
}

/* ---------- Admin ---------- */

export const ARTICLES_PAGE_SIZE = 10
export type ArticleTab = "all" | "published" | "draft" | "scheduled"

function tabFilter(tab: ArticleTab): SQL | undefined {
  if (tab === "published") return isLive()
  if (tab === "draft") return eq(articles.status, "draft")
  if (tab === "scheduled") return and(eq(articles.status, "scheduled"), gt(articles.publishedAt, sql`now()`))
  return undefined
}

export async function listArticlesAdmin(opts: { tab: ArticleTab; q?: string; category?: string; page: number }) {
  const db = getDb()
  const filters: SQL[] = []
  if (opts.q) {
    const term = `%${opts.q.replace(/[%_]/g, "\\$&")}%`
    filters.push(or(ilike(articles.title, term), ilike(articles.slug, term), ilike(articles.excerpt, term))!)
  }
  if (opts.category) filters.push(eq(articles.category, opts.category))
  const base = filters.length ? and(...filters) : undefined
  const where = and(base, tabFilter(opts.tab))

  const [rows, [{ total }], [counts], cats] = await Promise.all([
    db
      .select({
        id: articles.id,
        slug: articles.slug,
        title: articles.title,
        coverUrl: articles.coverUrl,
        category: articles.category,
        status: articles.status,
        publishedAt: articles.publishedAt,
        views: articles.views,
        updatedAt: articles.updatedAt,
        authorName: users.name,
        authorEmail: users.email,
      })
      .from(articles)
      .leftJoin(users, eq(articles.authorId, users.id))
      .where(where)
      .orderBy(desc(articles.updatedAt))
      .limit(ARTICLES_PAGE_SIZE)
      .offset((opts.page - 1) * ARTICLES_PAGE_SIZE),
    db.select({ total: count() }).from(articles).where(where),
    db
      .select({
        all: count(),
        published: sql<number>`count(*) filter (where ${isLive()})`,
        draft: sql<number>`count(*) filter (where ${articles.status} = 'draft')`,
        scheduled: sql<number>`count(*) filter (where ${articles.status} = 'scheduled' and ${articles.publishedAt} > now())`,
      })
      .from(articles)
      .where(base),
    db.selectDistinct({ name: articles.category }).from(articles).orderBy(articles.category),
  ])

  return {
    rows,
    total: Number(total),
    counts: {
      all: Number(counts.all),
      published: Number(counts.published),
      draft: Number(counts.draft),
      scheduled: Number(counts.scheduled),
    },
    categories: cats.map((c) => c.name),
  }
}

export async function articleStats() {
  const db = getDb()
  const [[c], [views30], [viewsPrev], [nextScheduled], [oldestDraft]] = await Promise.all([
    db
      .select({
        published: sql<number>`count(*) filter (where ${isLive()})`,
        publishedThisMonth: sql<number>`count(*) filter (where ${isLive()} and ${articles.publishedAt} >= date_trunc('month', now()))`,
        draft: sql<number>`count(*) filter (where ${articles.status} = 'draft')`,
        scheduled: sql<number>`count(*) filter (where ${articles.status} = 'scheduled' and ${articles.publishedAt} > now())`,
      })
      .from(articles),
    db
      .select({ total: sum(articleViews.count) })
      .from(articleViews)
      .where(sql`${articleViews.day} > (now() at time zone 'Asia/Jakarta')::date - 30`),
    db
      .select({ total: sum(articleViews.count) })
      .from(articleViews)
      .where(
        sql`${articleViews.day} <= (now() at time zone 'Asia/Jakarta')::date - 30 and ${articleViews.day} > (now() at time zone 'Asia/Jakarta')::date - 60`
      ),
    db
      .select({ at: articles.publishedAt })
      .from(articles)
      .where(and(eq(articles.status, "scheduled"), gt(articles.publishedAt, sql`now()`)))
      .orderBy(articles.publishedAt)
      .limit(1),
    db
      .select({ at: articles.createdAt })
      .from(articles)
      .where(eq(articles.status, "draft"))
      .orderBy(articles.createdAt)
      .limit(1),
  ])
  return {
    published: Number(c.published),
    publishedThisMonth: Number(c.publishedThisMonth),
    draft: Number(c.draft),
    scheduled: Number(c.scheduled),
    views30: Number(views30?.total ?? 0),
    viewsPrev: Number(viewsPrev?.total ?? 0),
    nextScheduledAt: nextScheduled?.at ?? null,
    oldestDraftAt: oldestDraft?.at ?? null,
  }
}

export async function getArticleForEdit(id: string) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null
  const [row] = await getDb().select().from(articles).where(eq(articles.id, id)).limit(1)
  return row ?? null
}

export async function articleCategories() {
  const rows = await getDb().selectDistinct({ name: articles.category }).from(articles)
  return Array.from(new Set([...DEFAULT_CATEGORIES, ...rows.map((r) => r.name)])).sort()
}
