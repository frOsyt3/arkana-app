import Link from "next/link"
import { ArrowDown, ArrowUp, ArrowUpRight, BriefcaseBusiness, Eye, EyeOff, Plus, Star } from "lucide-react"
import { requireArea } from "@/lib/admin/access"
import { listProjectsAdmin } from "@/lib/projects"
import { formatRelative } from "@/lib/admin/format"
import { AdminTopbar, PageTitle } from "@/components/admin/page-header"
import { btnPrimary, btnSecondary } from "@/components/admin/form"
import { moveProject, toggleProject } from "./actions"
import { cn } from "@/lib/utils"

export const metadata = { title: "Projects" }

function IconButton({
  action,
  id,
  name,
  value,
  title,
  active,
  disabled,
  children,
}: {
  action: (fd: FormData) => Promise<void>
  id: string
  name: string
  value: string
  title: string
  active?: boolean
  disabled?: boolean
  children: React.ReactNode
}) {
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name={name} value={value} />
      <button
        title={title}
        aria-label={title}
        disabled={disabled}
        className={cn(
          "rounded-md p-1.5 transition hover:bg-[#F0F4F6] disabled:opacity-30",
          active ? "text-primary-dark" : "text-[#8A9AA6]"
        )}
      >
        {children}
      </button>
    </form>
  )
}

export default async function ProjectsAdminPage() {
  await requireArea("content")
  const rows = await listProjectsAdmin()
  const live = rows.filter((r) => r.published).length

  return (
    <>
      <AdminTopbar crumb="Projects" />
      <div className="space-y-5 px-6 py-8 lg:px-8">
        <PageTitle
          title="Projects"
          description={`Portfolio entries for arkanacorp.id/projects. ${live} of ${rows.length} shown on the website.`}
          actions={
            <>
              <a href="/projects" target="_blank" className={btnSecondary}>
                <ArrowUpRight className="h-4 w-4" /> View portfolio
              </a>
              <Link href="/admin/projects/new" className={btnPrimary}>
                <Plus className="h-4 w-4" /> New project
              </Link>
            </>
          }
        />

        <div className="overflow-hidden rounded-[14px] border border-[#E7ECEF] bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left">
              <thead className="border-b border-[#EEF2F4] bg-[#F8FAFB] text-[11px] font-bold uppercase tracking-[0.06em] text-[#8A9AA6]">
                <tr>
                  <th className="w-16 px-4 py-3">Order</th>
                  <th className="px-3 py-3">Project</th>
                  <th className="px-3 py-3">Category</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3">Updated</th>
                  <th className="px-3 py-3 text-right">Quick actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center">
                      <BriefcaseBusiness className="mx-auto h-8 w-8 text-[#C2CCD2]" />
                      <p className="mt-3 text-sm font-bold">No projects yet</p>
                      <p className="mt-1 text-sm text-[#8A9AA6]">Add your first portfolio entry.</p>
                    </td>
                  </tr>
                )}
                {rows.map((row, i) => (
                  <tr key={row.id} className="border-b border-[#F1F4F6] last:border-0 hover:bg-[#FAFBFC]">
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <IconButton action={moveProject} id={row.id} name="dir" value="up" title="Move up" disabled={i === 0}>
                          <ArrowUp className="h-4 w-4" />
                        </IconButton>
                        <IconButton action={moveProject} id={row.id} name="dir" value="down" title="Move down" disabled={i === rows.length - 1}>
                          <ArrowDown className="h-4 w-4" />
                        </IconButton>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <Link href={`/admin/projects/${row.id}`} className="flex items-center gap-4">
                        <span className="relative h-11 w-16 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-primary to-secondary-dark">
                          {row.imageUrl && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={row.imageUrl} alt="" className="h-full w-full object-cover object-top" loading="lazy" />
                          )}
                        </span>
                        <span className="min-w-0">
                          <span className="block max-w-[380px] truncate text-sm font-bold">{row.title}</span>
                          <span className="block max-w-[380px] truncate text-xs text-[#8A9AA6]">{row.domain ?? "No live link"}</span>
                        </span>
                      </Link>
                    </td>
                    <td className="px-3 py-3 text-[13px] text-[#4B5B66]">{row.category}</td>
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[11px] font-bold",
                            row.published ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
                          )}
                        >
                          {row.published ? "Live" : "Hidden"}
                        </span>
                        {row.featured && (
                          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-700">Featured</span>
                        )}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-[13px] text-[#8A9AA6]">{formatRelative(row.updatedAt)}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <IconButton
                          action={toggleProject}
                          id={row.id}
                          name="field"
                          value="featured"
                          title={row.featured ? "Remove from featured" : "Make featured"}
                          active={row.featured}
                        >
                          <Star className={cn("h-4 w-4", row.featured && "fill-current")} />
                        </IconButton>
                        <IconButton
                          action={toggleProject}
                          id={row.id}
                          name="field"
                          value="published"
                          title={row.published ? "Hide from website" : "Show on website"}
                          active={row.published}
                        >
                          {row.published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </IconButton>
                        <Link href={`/admin/projects/${row.id}`} className="ml-1 rounded-md px-2.5 py-1 text-[13px] font-bold text-primary-dark hover:bg-primary/10">
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p className="text-xs text-[#8A9AA6]">
          Featured projects appear as large cards at the top of the portfolio. The others appear in the grid below, in this order.
        </p>
      </div>
    </>
  )
}
