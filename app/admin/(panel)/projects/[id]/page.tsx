import { notFound } from "next/navigation"
import { requireArea } from "@/lib/admin/access"
import { getProjectForEdit } from "@/lib/projects"
import { AdminTopbar } from "@/components/admin/page-header"
import { ProjectForm } from "../project-form"

export const metadata = { title: "Edit project" }

export default async function EditProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ saved?: string }>
}) {
  await requireArea("content")
  const [{ id }, sp] = await Promise.all([params, searchParams])
  const isNew = id === "new"
  const row = isNew ? null : await getProjectForEdit(id)
  if (!isNew && !row) notFound()

  return (
    <>
      <AdminTopbar crumb="Projects" />
      <ProjectForm
        justCreated={sp.saved === "1"}
        project={
          row
            ? {
                id: row.id,
                title: row.title,
                slug: row.slug,
                category: row.category,
                description: row.description,
                sector: row.sector,
                year: row.year,
                scope: row.scope,
                tech: row.tech.join(", "),
                imageUrl: row.imageUrl ?? "",
                domain: row.domain ?? "",
                url: row.url ?? "",
                featured: row.featured,
                published: row.published,
              }
            : null
        }
      />
    </>
  )
}
