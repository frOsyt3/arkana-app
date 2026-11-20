import Link from "next/link"
import { Suspense } from "react"
import { ArrowUpRight, FileText, Plus } from "lucide-react"
import { ARTICLES_PAGE_SIZE, articleStats, effectiveStatus, listArticlesAdmin, type ArticleTab } from "@/lib/articles"
import { avatarTone, formatDateTime, formatRelative, percentChange } from "@/lib/admin/format"
import { AdminTopbar, PageTitle } from "@/components/admin/page-header"
import { ArticleFilters } from "@/components/admin/article-filters"
import { ArticleRowMenu } from "@/components/admin/article-row-menu"
import { ArticleStatusBadge } from "@/components/admin/article-status-badge"
import { createArticle } from "./actions"
import { cn } from "@/lib/utils"

export const metadata = { title: "Insights" }

type Search = { tab?: string; q?: string; category?: string; page?: string }

const TABS: { key: ArticleTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "published", label: "Published" },
  { key: "draft", label: "Drafts" },
  { key: "scheduled", label: "Scheduled" },
]

function hrefWith(current: Search, patch: Partial<Search>) {
  const next = new URLSearchParams()
  for (const [k, v] of Object.entries({ ...current, ...patch })) if (v && !(k === "tab" && v === "all")) next.set(k, v)
  const qs = next.toString()
  return qs ? `/admin/insights?${qs}` : "/admin/insights"
}

function initialsOf(name: string | null) {
  if (!name) return "?"
  const parts = name.trim().split(/\s+/)
  return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase()
}

function Stat({ label, value, note }: { label: string; value: string | number; note: React.ReactNode }) {
  return (
    <div className="rounded-[14px] border border-[#E7ECEF] bg-white px-5 py-4">
      <p className="text-[13px] text-[#6B7C88]">{label}</p>
      <p className="mt-1.5 text-[26px] font-bold leading-none tracking-tight">{value}</p>
      <div className="mt-3 flex items-center gap-2 text-xs text-[#8A9AA6]">{note}</div>
    </div>
  )
}

export default async function InsightsAdminPage({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams
  const tab = (TABS.some((t) => t.key === sp.tab) ? sp.tab : "all") as ArticleTab
  const page = Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1)
  const q = sp.q?.trim().slice(0, 100) || undefined

  const [data, stats] = await Promise.all([
    listArticlesAdmin({ tab, q, category: sp.category || undefined, page }),
    articleStats(),
  ])
  const pages = Math.max(1, Math.ceil(data.total / ARTICLES_PAGE_SIZE))
  const viewsDelta = percentChange(stats.views30, stats.viewsPrev)
  const firstRow = data.total === 0 ? 0 : (page - 1) * ARTICLES_PAGE_SIZE + 1
  const lastRow = Math.min(page * ARTICLES_PAGE_SIZE, data.total)

  return (
    <>
      <AdminTopbar crumb="Insights" />
      <div className="space-y-5 px-6 py-8 lg:px-8">
        <PageTitle
          title="Insights"
          description="Write, schedule, and publish articles for arkanacorp.id/insight."
          actions={
            <>
              <a
                href="/insight"
                target="_blank"
                className="inline-flex items-center gap-2 rounded-[9px] border border-[#E7ECEF] bg-white px-4 py-2 text-[13px] font-bold transition hover:border-primary"
              >
                <ArrowUpRight className="h-4 w-4" /> View blog
              </a>
              <form action={createArticle}>
                <button className="inline-flex items-center gap-2 rounded-[9px] bg-primary-dark px-4 py-2 text-[13px] font-bold text-white transition hover:bg-secondary">
                  <Plus className="h-4 w-4" /> New article
                </button>
              </form>
            </>
          }
        />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Stat
            label="Published"
            value={stats.published}
            note={stats.publishedThisMonth > 0 ? `${stats.publishedThisMonth} new this month` : "None yet this month"}
          />
          <Stat
            label="Drafts"
            value={stats.draft}
            note={stats.oldestDraftAt ? `Oldest draft started ${formatRelative(stats.oldestDraftAt).toLowerCase()}` : "No drafts waiting"}
          />
          <Stat
            label="Scheduled"
            value={stats.scheduled}
            note={stats.nextScheduledAt ? `Next goes live ${formatDateTime(stats.nextScheduledAt)}` : "Nothing scheduled"}
          />
          <Stat
            label="Article views, last 30 days"
            value={stats.views30.toLocaleString("en-US")}
            note={
              stats.views30 === 0 && stats.viewsPrev === 0 ? (
                "Counted once per visitor session"
              ) : viewsDelta === null ? (
                <span className="rounded-full bg-green-100 px-2 py-0.5 font-bold text-green-700">New</span>
              ) : (
                <>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 font-bold",
                      viewsDelta >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                    )}
                  >
                    {viewsDelta >= 0 ? "↑" : "↓"} {Math.abs(viewsDelta).toFixed(0)}%
                  </span>
                  vs previous 30 days
                </>
              )
            }
          />
        </div>

        <div className="flex flex-col gap-3 pt-1 lg:flex-row lg:items-center lg:justify-between">
          <nav className="flex gap-1 overflow-x-auto rounded-[10px] bg-[#EAEFF2] p-[3px]">
            {TABS.map((t) => {
              const active = t.key === tab
              return (
                <Link
                  key={t.key}
                  href={hrefWith({ q: sp.q, category: sp.category }, { tab: t.key })}
                  className={cn(
                    "flex items-center gap-2 whitespace-nowrap rounded-[8px] px-3 py-1.5 text-[13px]",
                    active ? "bg-white font-bold shadow-sm" : "text-[#6B7C88] hover:text-[#1F3442]"
                  )}
                >
                  {t.label}
                  <span
                    className={cn(
                      "rounded-full px-1.5 text-[11px] font-bold",
                      active ? "bg-primary/15 text-[#2F7F81]" : "bg-white/70 text-[#8A9AA6]"
                    )}
                  >
                    {data.counts[t.key]}
                  </span>
                </Link>
              )
            })}
          </nav>
          <Suspense>
            <ArticleFilters categories={data.categories} />
          </Suspense>
        </div>

        <div className="overflow-hidden rounded-[14px] border border-[#E7ECEF] bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-left">
              <thead className="border-b border-[#EEF2F4] bg-[#F8FAFB] text-[11px] font-bold uppercase tracking-[0.06em] text-[#8A9AA6]">
                <tr>
                  <th className="px-5 py-3">Article</th>
                  <th className="px-3 py-3">Category</th>
                  <th className="px-3 py-3">Author</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3">Views</th>
                  <th className="px-3 py-3">Updated</th>
                  <th className="w-12 px-3 py-3" />
                </tr>
              </thead>
              <tbody>
                {data.rows.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center">
                      <FileText className="mx-auto h-8 w-8 text-[#C2CCD2]" />
                      <p className="mt-3 text-sm font-bold">
                        {q || sp.category || tab !== "all" ? "No articles match these filters" : "No articles yet"}
                      </p>
                      <p className="mt-1 text-sm text-[#8A9AA6]">
                        {q || sp.category || tab !== "all"
                          ? "Try another tab or clear the search."
                          : "Write the first one. It will appear on arkanacorp.id/insight once you publish."}
                      </p>
                    </td>
                  </tr>
                )}
                {data.rows.map((row) => {
                  const status = effectiveStatus(row)
                  return (
                    <tr key={row.id} className="border-b border-[#F1F4F6] last:border-0 hover:bg-[#FAFBFC]">
                      <td className="px-5 py-3">
                        <Link href={`/admin/insights/${row.id}`} className="flex items-center gap-4">
                          <span className="relative h-11 w-16 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-primary to-secondary-dark">
                            {row.coverUrl && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={row.coverUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
                            )}
                          </span>
                          <span className="min-w-0">
                            <span className="block max-w-[420px] truncate text-sm font-bold">
                              {row.title || <span className="text-[#A3B1BA]">Untitled article</span>}
                            </span>
                            <span className="block max-w-[420px] truncate text-xs text-[#8A9AA6]">/insight/{row.slug}</span>
                          </span>
                        </Link>
                      </td>
                      <td className="px-3 py-3 text-[13px] text-[#4B5B66]">{row.category}</td>
                      <td className="px-3 py-3">
                        <span className="flex items-center gap-2 text-[13px]">
                          <span
                            className={cn(
                              "flex h-6 w-6 items-center justify-center rounded-full text-[9px] font-bold",
                              avatarTone(row.authorEmail ?? "x")
                            )}
                          >
                            {initialsOf(row.authorName)}
                          </span>
                          {row.authorName ?? "Former member"}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <ArticleStatusBadge status={status} />
                      </td>
                      <td className={cn("px-3 py-3 text-[13px]", row.views ? "font-bold" : "text-[#A3B1BA]")}>
                        {row.views.toLocaleString("en-US")}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-[13px] text-[#8A9AA6]">
                        {status === "scheduled" && row.publishedAt ? formatDateTime(row.publishedAt) : formatRelative(row.updatedAt)}
                      </td>
                      <td className="px-3 py-3">
                        <ArticleRowMenu id={row.id} slug={row.slug} live={status === "published"} title={row.title} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-[#EEF2F4] px-5 py-3 text-[13px] text-[#6B7C88]">
            <span>{data.total === 0 ? "0 articles" : `Showing ${firstRow} to ${lastRow} of ${data.total} articles`}</span>
            <div className="flex gap-2">
              {page > 1 ? (
                <Link href={hrefWith(sp, { page: String(page - 1) })} className="rounded-[8px] border border-[#E7ECEF] px-3 py-1.5 font-bold hover:border-primary">
                  Previous
                </Link>
              ) : (
                <span className="rounded-[8px] border border-[#EEF2F4] px-3 py-1.5 text-[#C2CCD2]">Previous</span>
              )}
              {page < pages ? (
                <Link href={hrefWith(sp, { page: String(page + 1) })} className="rounded-[8px] border border-[#E7ECEF] px-3 py-1.5 font-bold hover:border-primary">
                  Next
                </Link>
              ) : (
                <span className="rounded-[8px] border border-[#EEF2F4] px-3 py-1.5 text-[#C2CCD2]">Next</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
