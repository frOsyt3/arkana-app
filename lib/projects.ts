import "server-only"
import { unstable_cache } from "next/cache"
import { asc, eq } from "drizzle-orm"
import { getDb, isDatabaseConfigured, schema } from "@/lib/db"
import { projects as staticProjects, type Project } from "@/lib/projects-data"
import type { ProjectRow } from "@/lib/db/schema"

export const PROJECTS_TAG = "projects"

export function toProject(row: ProjectRow): Project {
  return {
    slug: row.slug,
    title: row.title,
    category: row.category,
    description: row.description,
    sector: row.sector,
    year: row.year,
    scope: row.scope,
    tech: row.tech,
    image: row.imageUrl ?? undefined,
    domain: row.domain ?? undefined,
    url: row.url ?? undefined,
    featured: row.featured,
  }
}

const readPublished = unstable_cache(
  async () =>
    getDb()
      .select()
      .from(schema.projects)
      .where(eq(schema.projects.published, true))
      .orderBy(asc(schema.projects.sortOrder), asc(schema.projects.createdAt)),
  ["projects-published"],
  { tags: [PROJECTS_TAG] }
)

/** Published portfolio entries in display order, from Admin, Projects. */
export async function getPublicProjects(): Promise<Project[]> {
  if (!isDatabaseConfigured()) return staticProjects
  try {
    return (await readPublished()).map(toProject)
  } catch (err) {
    console.error("projects read failed", err)
    return staticProjects
  }
}

export async function listProjectsAdmin() {
  return getDb().select().from(schema.projects).orderBy(asc(schema.projects.sortOrder), asc(schema.projects.createdAt))
}

export async function getProjectForEdit(id: string) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null
  const [row] = await getDb().select().from(schema.projects).where(eq(schema.projects.id, id)).limit(1)
  return row ?? null
}
