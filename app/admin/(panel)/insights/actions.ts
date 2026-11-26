"use server"

import { randomBytes } from "node:crypto"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { and, eq, ne } from "drizzle-orm"
import { z } from "zod"
import { assertArea } from "@/lib/admin/access"
import { getDb, schema } from "@/lib/db"
import { readingMinutes, sanitizeArticleHtml, slugify } from "@/lib/articles"
import type { ArticleStatus } from "@/lib/db/schema"

const { articles, media } = schema

function revalidateArticle(slug?: string) {
  revalidatePath("/admin/insights")
  revalidatePath("/insight")
  if (slug) revalidatePath(`/insight/${slug}`)
  revalidatePath("/sitemap.xml")
}

export async function createArticle() {
  const user = await assertArea("content")
  const [row] = await getDb()
    .insert(articles)
    .values({ slug: `untitled-${randomBytes(3).toString("hex")}`, authorId: user.id })
    .returning({ id: articles.id })
  redirect(`/admin/insights/${row.id}`)
}

const saveSchema = z.object({
  id: z.uuid(),
  intent: z.enum(["save", "publish", "schedule", "unpublish"]),
  title: z.string().trim().max(200),
  slug: z.string().trim().max(100),
  excerpt: z.string().trim().max(400),
  content: z.string().max(500_000),
  coverUrl: z.string().trim().max(500).nullable(),
  category: z.string().trim().min(1).max(60),
  tags: z.array(z.string().trim().min(1).max(40)).max(12),
  authorId: z.uuid().nullable(),
  metaTitle: z.string().trim().max(120),
  metaDescription: z.string().trim().max(320),
  publishAt: z.iso.datetime({ offset: true }).nullable(),
})

export type SaveArticleInput = z.input<typeof saveSchema>
export type SaveArticleResult =
  | { ok: true; status: ArticleStatus; publishedAt: string | null; slug: string; savedAt: string }
  | { ok: false; error: string }

export async function saveArticle(input: SaveArticleInput): Promise<SaveArticleResult> {
  await assertArea("content")
  const parsed = saveSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: "Some fields are too long or invalid. Check the form and try again." }
  const data = parsed.data

  const db = getDb()
  const [current] = await db.select().from(articles).where(eq(articles.id, data.id)).limit(1)
  if (!current) return { ok: false, error: "This article no longer exists." }

  const slug = slugify(data.slug || data.title) || current.slug
  const [clash] = await db
    .select({ id: articles.id })
    .from(articles)
    .where(and(eq(articles.slug, slug), ne(articles.id, data.id)))
    .limit(1)
  if (clash) return { ok: false, error: `Another article already uses the URL /insight/${slug}.` }

  let status: ArticleStatus = current.status
  let publishedAt = current.publishedAt
  const now = new Date()

  if (data.intent === "publish" || data.intent === "schedule") {
    if (!data.title) return { ok: false, error: "Add a title before publishing." }
    if (!data.excerpt) return { ok: false, error: "Add a short summary before publishing. It shows on the article list and Google." }
  }
  if (data.intent === "publish") {
    status = "published"
    publishedAt = current.status === "published" && current.publishedAt ? current.publishedAt : now
  } else if (data.intent === "schedule") {
    const at = data.publishAt ? new Date(data.publishAt) : null
    if (!at || at <= now) return { ok: false, error: "Pick a publish time in the future to schedule this article." }
    status = "scheduled"
    publishedAt = at
  } else if (data.intent === "unpublish") {
    status = "draft"
    publishedAt = null
  }

  const content = sanitizeArticleHtml(data.content)
  await db
    .update(articles)
    .set({
      title: data.title,
      slug,
      excerpt: data.excerpt,
      content,
      coverUrl: data.coverUrl,
      category: data.category,
      tags: Array.from(new Set(data.tags)),
      authorId: data.authorId,
      metaTitle: data.metaTitle || null,
      metaDescription: data.metaDescription || null,
      readingMinutes: readingMinutes(content),
      status,
      publishedAt,
      updatedAt: now,
    })
    .where(eq(articles.id, data.id))

  revalidateArticle(slug)
  if (slug !== current.slug) revalidatePath(`/insight/${current.slug}`)

  return {
    ok: true,
    status,
    publishedAt: publishedAt?.toISOString() ?? null,
    slug,
    savedAt: now.toISOString(),
  }
}

function idFrom(formData: FormData) {
  const id = String(formData.get("id") ?? "")
  return /^[0-9a-f-]{36}$/i.test(id) ? id : null
}

export async function deleteArticle(formData: FormData) {
  await assertArea("content")
  const id = idFrom(formData)
  if (!id) return
  const [row] = await getDb().delete(articles).where(eq(articles.id, id)).returning({ slug: articles.slug })
  revalidateArticle(row?.slug)
  if (formData.get("redirect")) redirect("/admin/insights")
}

export async function duplicateArticle(formData: FormData) {
  const user = await assertArea("content")
  const id = idFrom(formData)
  if (!id) return
  const db = getDb()
  const [src] = await db.select().from(articles).where(eq(articles.id, id)).limit(1)
  if (!src) return
  const [copy] = await db
    .insert(articles)
    .values({
      slug: `${src.slug.slice(0, 70)}-copy-${randomBytes(2).toString("hex")}`,
      title: src.title ? `${src.title} (copy)` : "",
      excerpt: src.excerpt,
      content: src.content,
      coverUrl: src.coverUrl,
      category: src.category,
      tags: src.tags,
      authorId: user.id,
      metaTitle: src.metaTitle,
      metaDescription: src.metaDescription,
      readingMinutes: src.readingMinutes,
    })
    .returning({ id: articles.id })
  revalidatePath("/admin/insights")
  redirect(`/admin/insights/${copy.id}`)
}

const MAX_UPLOAD = 2.5 * 1024 * 1024
const IMAGE_TYPES = ["image/webp", "image/jpeg", "image/png", "image/gif"]

export async function uploadImage(formData: FormData): Promise<{ url: string } | { error: string }> {
  const user = await assertArea("content")
  const file = formData.get("file")
  if (!(file instanceof File)) return { error: "No file received." }
  if (!IMAGE_TYPES.includes(file.type)) return { error: "Use a JPG, PNG, WebP, or GIF image." }
  if (file.size > MAX_UPLOAD) return { error: "Image is too large. Keep it under 2.5 MB." }

  const width = Number(formData.get("width")) || null
  const height = Number(formData.get("height")) || null
  const data = Buffer.from(await file.arrayBuffer()).toString("base64")
  const [row] = await getDb()
    .insert(media)
    .values({ mime: file.type, data, size: file.size, width, height, uploadedBy: user.id })
    .returning({ id: media.id })
  return { url: `/media/${row.id}` }
}
