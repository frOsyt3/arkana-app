import { notFound } from "next/navigation"
import { requireArea } from "@/lib/admin/access"
import { getJobForEdit } from "@/lib/careers"
import { AdminTopbar } from "@/components/admin/page-header"
import { JobForm } from "../job-form"

export const metadata = { title: "Edit opening" }

export default async function EditJobPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ saved?: string }>
}) {
  await requireArea("careers")
  const [{ id }, sp] = await Promise.all([params, searchParams])
  const job = id === "new" ? null : await getJobForEdit(id)
  if (id !== "new" && !job) notFound()

  return (
    <>
      <AdminTopbar crumb="Careers" />
      <JobForm job={job} justCreated={sp.saved === "1"} />
    </>
  )
}
