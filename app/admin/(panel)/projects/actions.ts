"use server"

import { revalidatePath, updateTag } from "next/cache"
import { redirect } from "next/navigation"
import { and, asc, eq, ne, sql } from "drizzle-orm"
import { z } from "zod"
import { assertArea, audit } from "@/lib/admin/access"
import { getDb, schema } from "@/lib/db"
import { slugify } from "@/lib/articles"
import { PROJECTS_TAG } from "@/lib/projects"
import type { FormState } from "@/components/admin/form"

const { projects } = schema

function refresh() {
  updateTag(PROJECTS_TAG)
  revalidatePath("/projects")
  revalidatePath("/admin/projects")
}

const optionalUrl = z.union([z.url().max(500), z.literal("")])

const projectSchema = z.object({
  id: z.union([z.uuid(), z.literal("")]),
  title: z.string().trim().min(2, "Add a project title.").max(120),
  slug: z.string().trim().max(100),
  category: z.string().trim().min(2, "Pick a category.").max(60),
  description: z.string().trim().min(20, "Write a description of at least 20 characters.").max(600),
  sector: z.string().trim().max(120),
  year: z.string().trim().max(20),
  scope: z.string().trim().max(160),
  tech: z.string().max(400),
  imageUrl: z.string().trim().max(500),
  domain: z.string().trim().max(120),
  url: optionalUrl,
  featured: z.boolean(),
  published: z.boolean(),
})

export async function saveProject(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await assertArea("content")
  const raw = Object.fromEntries(formData)
  const parsed = projectSchema.safeParse({ ...raw, featured: raw.featured === "on", published: raw.published === "on" })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the form and try again." }
  const d = parsed.data

  const slug = slugify(d.slug || d.title)
  if (!slug) return { error: "Add a title with letters or numbers." }

  const db = getDb()
  const [clash] = await db
    .select({ id: projects.id })
    .from(projects)
    .where(d.id ? and(eq(projects.slug, slug), ne(projects.id, d.id)) : eq(projects.slug, slug))
    .limit(1)
  if (clash) return { error: `Another project already uses the short name "${slug}". Change the title or short name.` }

  const domain = d.domain || (d.url ? new URL(d.url).hostname.replace(/^www\./, "") : "")
  const values = {
    title: d.title,
    slug,
    category: d.category,
    description: d.description,
    sector: d.sector,
    year: d.year,
    scope: d.scope,
    tech: Array.from(new Set(d.tech.split(",").map((t) => t.trim()).filter(Boolean))).slice(0, 12),
    imageUrl: d.imageUrl || null,
    domain: domain || null,
    url: d.url || null,
    featured: d.featured,
    published: d.published,
    updatedAt: new Date(),
  }

  let id = d.id
  if (id) {
    const [row] = await db.update(projects).set(values).where(eq(projects.id, id)).returning({ id: projects.id })
    if (!row) return { error: "This project no longer exists." }
    await audit(user, { action: "update", entity: "project", entityId: id, summary: `Updated project ${d.title}` })
  } else {
    const [{ next }] = await db.select({ next: sql<number>`coalesce(max(${projects.sortOrder}), 0) + 1` }).from(projects)
    const [row] = await db.insert(projects).values({ ...values, sortOrder: Number(next) }).returning({ id: projects.id })
    id = row.id
    await audit(user, { action: "create", entity: "project", entityId: id, summary: `Added project ${d.title}` })
  }

  refresh()
  if (!d.id) redirect(`/admin/projects/${id}?saved=1`)
  return { ok: true, message: d.published ? "Saved. It is live on /projects." : "Saved as hidden. Turn on Show on website to publish it." }
}

function idFrom(formData: FormData) {
  const id = String(formData.get("id") ?? "")
  return /^[0-9a-f-]{36}$/i.test(id) ? id : null
}

export async function deleteProject(formData: FormData) {
  const user = await assertArea("content")
  const id = idFrom(formData)
  if (!id) return
  const [row] = await getDb().delete(projects).where(eq(projects.id, id)).returning({ title: projects.title })
  if (row) await audit(user, { action: "delete", entity: "project", entityId: id, summary: `Deleted project ${row.title}` })
  refresh()
  redirect("/admin/projects")
}

export async function toggleProject(formData: FormData) {
  const user = await assertArea("content")
  const id = idFrom(formData)
  const field = formData.get("field")
  if (!id || (field !== "featured" && field !== "published")) return
  const db = getDb()
  const [row] = await db.select().from(projects).where(eq(projects.id, id)).limit(1)
  if (!row) return
  const value = !row[field]
  await db.update(projects).set({ [field]: value, updatedAt: new Date() }).where(eq(projects.id, id))
  const label = field === "featured" ? (value ? "Featured" : "Unfeatured") : value ? "Showed" : "Hid"
  await audit(user, { action: "update", entity: "project", entityId: id, summary: `${label} project ${row.title}` })
  refresh()
}

/** Swaps a project with its neighbour so the order on /projects changes. */
export async function moveProject(formData: FormData) {
  await assertArea("content")
  const id = idFrom(formData)
  const dir = formData.get("dir") === "up" ? -1 : 1
  if (!id) return
  const db = getDb()
  const rows = await db
    .select({ id: projects.id })
    .from(projects)
    .orderBy(asc(projects.sortOrder), asc(projects.createdAt))
  const i = rows.findIndex((r) => r.id === id)
  const j = i + dir
  if (i < 0 || j < 0 || j >= rows.length) return
  ;[rows[i], rows[j]] = [rows[j], rows[i]]
  await Promise.all(rows.map((r, idx) => db.update(projects).set({ sortOrder: idx + 1 }).where(eq(projects.id, r.id))))
  refresh()
}
