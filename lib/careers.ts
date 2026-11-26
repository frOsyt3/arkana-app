import "server-only"
import { unstable_cache } from "next/cache"
import { and, count, desc, eq, getTableColumns } from "drizzle-orm"
import { getDb, isDatabaseConfigured, schema } from "@/lib/db"
import type { ApplicationStatus, Job } from "@/lib/db/schema"

export const JOBS_TAG = "jobs"
const { jobs, jobApplications } = schema

export const APPLICATION_STATUS: Record<ApplicationStatus, { label: string; badge: string }> = {
  new: { label: "New", badge: "bg-primary/12 text-[#2F7F81]" },
  review: { label: "Reviewing", badge: "bg-blue-100 text-blue-700" },
  interview: { label: "Interview", badge: "bg-violet-100 text-violet-700" },
  offer: { label: "Offer", badge: "bg-amber-100 text-amber-700" },
  hired: { label: "Hired", badge: "bg-green-100 text-green-700" },
  rejected: { label: "Not a fit", badge: "bg-slate-100 text-slate-500" },
}

export const APPLICATION_STATUSES = Object.keys(APPLICATION_STATUS) as ApplicationStatus[]

const readOpen = unstable_cache(
  async () => getDb().select().from(jobs).where(eq(jobs.status, "open")).orderBy(desc(jobs.createdAt)),
  ["jobs-open"],
  { tags: [JOBS_TAG] }
)

export async function getOpenJobs(): Promise<Job[]> {
  if (!isDatabaseConfigured()) return []
  try {
    return await readOpen()
  } catch (err) {
    console.error("jobs read failed", err)
    return []
  }
}

export async function getOpenJob(slug: string) {
  return (await getOpenJobs()).find((j) => j.slug === slug) ?? null
}

export async function listJobsAdmin() {
  const db = getDb()
  const [rows, counts] = await Promise.all([
    db.select().from(jobs).orderBy(desc(jobs.createdAt)),
    db.select({ jobId: jobApplications.jobId, total: count() }).from(jobApplications).groupBy(jobApplications.jobId),
  ])
  const byJob = new Map(counts.map((c) => [c.jobId, Number(c.total)]))
  return { rows: rows.map((r) => ({ ...r, applicants: byJob.get(r.id) ?? 0 })), general: byJob.get(null) ?? 0 }
}

export async function getJobForEdit(id: string) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null
  const [row] = await getDb().select().from(jobs).where(eq(jobs.id, id)).limit(1)
  return row ?? null
}

/** Applicants without the CV bytes, newest first. */
export async function listApplications(opts: { status?: ApplicationStatus; jobId?: string }) {
  const { cvData: _omit, ...cols } = getTableColumns(jobApplications)
  void _omit
  const filters = []
  if (opts.status) filters.push(eq(jobApplications.status, opts.status))
  if (opts.jobId) filters.push(eq(jobApplications.jobId, opts.jobId))
  return getDb()
    .select({ ...cols, jobTitle: jobs.title })
    .from(jobApplications)
    .leftJoin(jobs, eq(jobApplications.jobId, jobs.id))
    .where(filters.length ? and(...filters) : undefined)
    .orderBy(desc(jobApplications.createdAt))
    .limit(200)
}

/** Splits a textarea into bullet points, one per line. */
export function lines(text: string) {
  return text
    .split("\n")
    .map((l) => l.replace(/^[\s*•·-]+/, "").trim())
    .filter(Boolean)
}
