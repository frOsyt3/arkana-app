"use server"

import { revalidatePath, updateTag } from "next/cache"
import { redirect } from "next/navigation"
import { and, eq, ne } from "drizzle-orm"
import { z } from "zod"
import { assertArea, audit } from "@/lib/admin/access"
import { getDb, schema } from "@/lib/db"
import { slugify } from "@/lib/articles"
import { APPLICATION_STATUS, APPLICATION_STATUSES, JOBS_TAG } from "@/lib/careers"
import type { FormState } from "@/components/admin/form"

const { jobs, jobApplications } = schema

function refresh(slug?: string) {
  updateTag(JOBS_TAG)
  revalidatePath("/careers")
  if (slug) revalidatePath(`/careers/${slug}`)
  revalidatePath("/admin/careers")
  revalidatePath("/sitemap.xml")
}

const jobSchema = z.object({
  id: z.union([z.uuid(), z.literal("")]),
  title: z.string().trim().min(2, "Add a job title.").max(120),
  department: z.string().trim().max(80),
  location: z.string().trim().min(2, "Add a location.").max(80),
  employmentType: z.string().trim().max(40),
  workMode: z.string().trim().max(40),
  summary: z.string().trim().min(20, "Write a short summary of at least 20 characters.").max(800),
  responsibilities: z.string().trim().max(4000),
  requirements: z.string().trim().max(4000),
  status: z.enum(["draft", "open", "closed"]),
})

export async function saveJob(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await assertArea("careers")
  const parsed = jobSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the form and try again." }
  const d = parsed.data
  const db = getDb()

  const slug = slugify(`${d.title} ${d.location}`)
  const [clash] = await db
    .select({ id: jobs.id })
    .from(jobs)
    .where(d.id ? and(eq(jobs.slug, slug), ne(jobs.id, d.id)) : eq(jobs.slug, slug))
    .limit(1)
  if (clash) return { error: "Another opening already has this title and location." }

  const { id: _id, ...fields } = d
  void _id
  const values = { ...fields, slug, updatedAt: new Date() }
  let id = d.id
  if (id) {
    const [row] = await db.update(jobs).set(values).where(eq(jobs.id, id)).returning({ id: jobs.id })
    if (!row) return { error: "This opening no longer exists." }
    await audit(user, { action: "update", entity: "job", entityId: id, summary: `Updated opening ${d.title} (${d.status})` })
  } else {
    const [row] = await db.insert(jobs).values(values).returning({ id: jobs.id })
    id = row.id
    await audit(user, { action: "create", entity: "job", entityId: id, summary: `Added opening ${d.title}` })
  }

  refresh(slug)
  if (!d.id) redirect(`/admin/careers/${id}?saved=1`)
  return {
    ok: true,
    message: d.status === "open" ? "Saved. The opening is live on /careers." : "Saved. It is not shown on the website while it is not Open.",
  }
}

export async function deleteJob(formData: FormData) {
  const user = await assertArea("careers")
  const id = String(formData.get("id") ?? "")
  if (!/^[0-9a-f-]{36}$/i.test(id)) return
  const [row] = await getDb().delete(jobs).where(eq(jobs.id, id)).returning({ title: jobs.title, slug: jobs.slug })
  if (row) await audit(user, { action: "delete", entity: "job", entityId: id, summary: `Deleted opening ${row.title}` })
  refresh(row?.slug)
  redirect("/admin/careers")
}

export async function updateApplicationStatus(formData: FormData) {
  const user = await assertArea("careers")
  const id = String(formData.get("id") ?? "")
  const status = formData.get("status")
  if (!/^[0-9a-f-]{36}$/i.test(id) || !APPLICATION_STATUSES.includes(status as never)) return
  const [row] = await getDb()
    .update(jobApplications)
    .set({ status: status as (typeof APPLICATION_STATUSES)[number] })
    .where(eq(jobApplications.id, id))
    .returning({ name: jobApplications.name })
  if (row) {
    const label = APPLICATION_STATUS[status as keyof typeof APPLICATION_STATUS].label
    await audit(user, { action: "update", entity: "application", entityId: id, summary: `Moved applicant ${row.name} to ${label}` })
  }
  revalidatePath("/admin/careers")
}
