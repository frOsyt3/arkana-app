import Link from "next/link"
import { ArrowUpRight, FileDown, Plus, Users } from "lucide-react"
import { requireArea } from "@/lib/admin/access"
import { APPLICATION_STATUS, APPLICATION_STATUSES, listApplications, listJobsAdmin } from "@/lib/careers"
import { formatRelative } from "@/lib/admin/format"
import { AdminTopbar, PageTitle } from "@/components/admin/page-header"
import { btnPrimary, btnSecondary } from "@/components/admin/form"
import { ApplicationStatusSelect } from "./status-select"
import { cn } from "@/lib/utils"
import type { ApplicationStatus } from "@/lib/db/schema"

export const metadata = { title: "Careers" }

const JOB_BADGE = {
  open: "bg-green-100 text-green-700",
  draft: "bg-slate-100 text-slate-500",
  closed: "bg-red-50 text-red-600",
}
const JOB_LABEL = { open: "Open", draft: "Draft", closed: "Closed" }

export default async function CareersAdminPage({ searchParams }: { searchParams: Promise<{ tab?: string; status?: string }> }) {
  await requireArea("careers")
  const sp = await searchParams
  const tab = sp.tab === "applicants" ? "applicants" : "openings"
  const status = APPLICATION_STATUSES.includes(sp.status as ApplicationStatus) ? (sp.status as ApplicationStatus) : undefined
  const [jobsData, applicants] = await Promise.all([listJobsAdmin(), listApplications({ status })])
  const totalApplicants = jobsData.rows.reduce((n, r) => n + r.applicants, jobsData.general)

  return (
    <>
      <AdminTopbar crumb="Careers" />
      <div className="space-y-5 px-6 py-8 lg:px-8">
        <PageTitle
          title="Careers"
          description="Publish openings on arkanacorp.id/careers and review the CVs people send."
          actions={
            <>
              <a href="/careers" target="_blank" className={btnSecondary}>
                <ArrowUpRight className="h-4 w-4" /> View careers page
              </a>
              <Link href="/admin/careers/new" className={btnPrimary}>
                <Plus className="h-4 w-4" /> New opening
              </Link>
            </>
          }
        />

        <nav className="flex w-fit gap-1 rounded-[10px] bg-[#EAEFF2] p-[3px]">
          {[
            { key: "openings", label: "Openings", n: jobsData.rows.length },
            { key: "applicants", label: "Applicants", n: totalApplicants },
          ].map((t) => (
            <Link
              key={t.key}
              href={t.key === "openings" ? "/admin/careers" : "/admin/careers?tab=applicants"}
              className={cn(
                "flex items-center gap-2 rounded-[8px] px-3 py-1.5 text-[13px]",
                tab === t.key ? "bg-white font-bold shadow-sm" : "text-[#6B7C88] hover:text-[#1F3442]"
              )}
            >
              {t.label}
              <span className="rounded-full bg-white/70 px-1.5 text-[11px] font-bold text-[#8A9AA6]">{t.n}</span>
            </Link>
          ))}
        </nav>

        {tab === "openings" ? (
          <div className="overflow-hidden rounded-[14px] border border-[#E7ECEF] bg-white">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left">
                <thead className="border-b border-[#EEF2F4] bg-[#F8FAFB] text-[11px] font-bold uppercase tracking-[0.06em] text-[#8A9AA6]">
                  <tr>
                    <th className="px-5 py-3">Opening</th>
                    <th className="px-3 py-3">Type</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-3 py-3">Applicants</th>
                    <th className="px-3 py-3">Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {jobsData.rows.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-16 text-center">
                        <Users className="mx-auto h-8 w-8 text-[#C2CCD2]" />
                        <p className="mt-3 text-sm font-bold">No openings yet</p>
                        <p className="mt-1 text-sm text-[#8A9AA6]">
                          While there are no open roles, the careers page invites people to send a general CV.
                        </p>
                      </td>
                    </tr>
                  )}
                  {jobsData.rows.map((job) => (
                    <tr key={job.id} className="border-b border-[#F1F4F6] last:border-0 hover:bg-[#FAFBFC]">
                      <td className="px-5 py-3">
                        <Link href={`/admin/careers/${job.id}`} className="block">
                          <span className="block text-sm font-bold">{job.title}</span>
                          <span className="block text-xs text-[#8A9AA6]">
                            {[job.department, job.location].filter(Boolean).join(", ")}
                          </span>
                        </Link>
                      </td>
                      <td className="px-3 py-3 text-[13px] text-[#4B5B66]">
                        {job.employmentType}, {job.workMode}
                      </td>
                      <td className="px-3 py-3">
                        <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-bold", JOB_BADGE[job.status])}>{JOB_LABEL[job.status]}</span>
                      </td>
                      <td className="px-3 py-3 text-[13px] font-bold">{job.applicants}</td>
                      <td className="whitespace-nowrap px-3 py-3 text-[13px] text-[#8A9AA6]">{formatRelative(job.updatedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-2">
              {[undefined, ...APPLICATION_STATUSES].map((s) => (
                <Link
                  key={s ?? "all"}
                  href={s ? `/admin/careers?tab=applicants&status=${s}` : "/admin/careers?tab=applicants"}
                  className={cn(
                    "rounded-full border px-3 py-1 text-[13px]",
                    status === s ? "border-secondary bg-secondary font-bold text-white" : "border-[#E7ECEF] bg-white hover:border-primary"
                  )}
                >
                  {s ? APPLICATION_STATUS[s].label : "All"}
                </Link>
              ))}
            </div>
            <div className="overflow-hidden rounded-[14px] border border-[#E7ECEF] bg-white">
              {applicants.length === 0 ? (
                <div className="px-6 py-16 text-center">
                  <Users className="mx-auto h-8 w-8 text-[#C2CCD2]" />
                  <p className="mt-3 text-sm font-bold">No applicants here yet</p>
                  <p className="mt-1 text-sm text-[#8A9AA6]">CVs sent from the careers page will appear in this list.</p>
                </div>
              ) : (
                <ul className="divide-y divide-[#F1F4F6]">
                  {applicants.map((a) => (
                    <li key={a.id} className="grid gap-4 px-5 py-4 lg:grid-cols-[1fr_200px_170px]">
                      <div className="min-w-0">
                        <p className="text-sm font-bold">
                          {a.name}
                          <span className="ml-2 font-normal text-[#8A9AA6]">
                            for {a.jobTitle ?? "General application"} · {formatRelative(a.createdAt)}
                          </span>
                        </p>
                        <p className="mt-0.5 text-[13px] text-[#4B5B66]">
                          <a href={`mailto:${a.email}`} className="hover:text-primary-dark">{a.email}</a>
                          {a.phone && <> · {a.phone}</>}
                          {a.portfolioUrl && (
                            <>
                              {" · "}
                              <a href={a.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-primary-dark hover:underline">
                                Portfolio
                              </a>
                            </>
                          )}
                        </p>
                        {a.coverLetter && <p className="mt-2 line-clamp-3 whitespace-pre-line text-[13px] text-[#6B7C88]">{a.coverLetter}</p>}
                      </div>
                      <a
                        href={`/admin/careers/cv/${a.id}`}
                        target="_blank"
                        className="inline-flex h-fit items-center gap-2 self-start rounded-[9px] border border-[#E7ECEF] px-3 py-2 text-[13px] font-bold transition hover:border-primary"
                      >
                        <FileDown className="h-4 w-4 shrink-0" />
                        <span className="truncate">{a.cvName}</span>
                      </a>
                      <ApplicationStatusSelect id={a.id} status={a.status} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </div>
    </>
  )
}
