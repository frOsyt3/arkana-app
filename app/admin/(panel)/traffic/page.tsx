import Link from "next/link"
import { ArrowUpRight, CheckCircle2, CircleAlert } from "lucide-react"
import { requireArea } from "@/lib/admin/access"
import { getTrafficReport } from "@/lib/traffic"
import { SITE_URL } from "@/lib/seo"
import { formatRelative } from "@/lib/admin/format"
import { AdminTopbar, PageTitle, Panel } from "@/components/admin/page-header"
import { btnSecondary } from "@/components/admin/form"
import { cn } from "@/lib/utils"

export const metadata = { title: "Traffic & SEO" }

const RANGES = [7, 30, 90]

function Bars({ rows, empty }: { rows: { label: string; total: number; extra?: string }[]; empty: string }) {
  const max = Math.max(1, ...rows.map((r) => r.total))
  if (rows.length === 0) return <p className="px-6 pb-6 pt-4 text-sm text-[#8A9AA6]">{empty}</p>
  return (
    <ul className="space-y-3 px-6 pb-6 pt-4">
      {rows.map((r) => (
        <li key={r.label} className="text-[13px]">
          <div className="flex justify-between gap-3">
            <span className="truncate">{r.label}</span>
            <span className="shrink-0 font-bold">
              {r.total}
              {r.extra && <span className="ml-1.5 font-normal text-[#8A9AA6]">{r.extra}</span>}
            </span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#EEF2F4]">
            <div className="h-full rounded-full bg-primary" style={{ width: `${(r.total / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  )
}

function Check({ ok, title, detail, href }: { ok: boolean; title: string; detail: string; href?: string }) {
  const body = (
    <>
      {ok ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" /> : <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />}
      <span>
        <span className="block font-bold">{title}</span>
        <span className="block text-[#6B7C88]">{detail}</span>
      </span>
    </>
  )
  return (
    <li>
      {href ? (
        <Link href={href} className="flex gap-3 rounded-[10px] p-2 text-[13px] transition hover:bg-[#F5F7F8]">
          {body}
        </Link>
      ) : (
        <div className="flex gap-3 p-2 text-[13px]">{body}</div>
      )}
    </li>
  )
}

export default async function TrafficPage({ searchParams }: { searchParams: Promise<{ days?: string }> }) {
  await requireArea("growth")
  const sp = await searchParams
  const days = RANGES.includes(Number(sp.days)) ? Number(sp.days) : 30
  const r = await getTrafficReport(days)
  const c = r.counts
  const gaId = process.env.NEXT_PUBLIC_GA_ID

  const checks = [
    { ok: Boolean(gaId), title: "Google Analytics", detail: gaId ? `Tracking with ${gaId}.` : "NEXT_PUBLIC_GA_ID is not set in Vercel." },
    {
      ok: Boolean(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION),
      title: "Search Console",
      detail: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
        ? "Verification tag is on the site."
        : "No verification tag. Fine if you verified the domain by DNS, otherwise add NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION.",
    },
    {
      ok: c.daysSincePost <= 14,
      title: "Fresh articles",
      detail: c.lastPublished
        ? `${c.published} published, latest ${formatRelative(c.lastPublished).toLowerCase()}. Aim for one every two weeks.`
        : "No articles published yet. Articles are the main way to rank for new keywords.",
      href: "/admin/insights",
    },
    {
      ok: c.missingMeta === 0,
      title: "Article descriptions for Google",
      detail: c.missingMeta === 0 ? "Every published article has an SEO description." : `${c.missingMeta} published articles have no SEO description.`,
      href: "/admin/insights",
    },
    {
      ok: c.noCover === 0,
      title: "Article cover images",
      detail: c.noCover === 0 ? "Every published article has a cover." : `${c.noCover} published articles have no cover image for sharing.`,
      href: "/admin/insights",
    },
    {
      ok: c.projects >= 3 && c.projectsNoImage === 0,
      title: "Portfolio",
      detail: `${c.projects} projects live${c.projectsNoImage ? `, ${c.projectsNoImage} without a screenshot` : ""}.`,
      href: "/admin/projects",
    },
    {
      ok: c.leads === 0 || c.tagged / c.leads >= 0.3,
      title: "Tracked campaign links",
      detail: c.leads
        ? `${c.tagged} of ${c.leads} leads came from a tagged link. Use Campaigns for every ad and broadcast.`
        : "No leads in this period yet.",
      href: "/admin/campaigns",
    },
  ]

  return (
    <>
      <AdminTopbar crumb="Traffic & SEO" />
      <div className="space-y-5 px-6 py-8 lg:px-8">
        <PageTitle
          title="Traffic & SEO"
          description="Where your leads come from, which pages bring them in, and what to fix for Google."
          actions={
            <>
              <nav className="flex gap-1 rounded-[10px] bg-[#EAEFF2] p-[3px]">
                {RANGES.map((d) => (
                  <Link
                    key={d}
                    href={d === 30 ? "/admin/traffic" : `/admin/traffic?days=${d}`}
                    className={cn("rounded-[8px] px-3 py-1.5 text-[13px]", d === days ? "bg-white font-bold shadow-sm" : "text-[#6B7C88]")}
                  >
                    {d} days
                  </Link>
                ))}
              </nav>
              <a href="https://analytics.google.com/analytics/web/" target="_blank" rel="noreferrer" className={btnSecondary}>
                <ArrowUpRight className="h-4 w-4" /> Google Analytics
              </a>
              <a
                href={`https://search.google.com/search-console?resource_id=${encodeURIComponent(SITE_URL.replace(/\/$/, "") + "/")}`}
                target="_blank"
                rel="noreferrer"
                className={btnSecondary}
              >
                <ArrowUpRight className="h-4 w-4" /> Search Console
              </a>
            </>
          }
        />

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: `Leads, last ${days} days`, value: c.leads },
            { label: "Leads from tagged links", value: c.tagged },
            { label: `Article views, last ${days} days`, value: r.articleViews.toLocaleString("en-US") },
          ].map((s) => (
            <div key={s.label} className="rounded-[14px] border border-[#E7ECEF] bg-white px-5 py-4">
              <p className="text-[13px] text-[#6B7C88]">{s.label}</p>
              <p className="mt-1.5 text-[26px] font-bold leading-none">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-5 xl:grid-cols-3">
          <Panel title="Leads by channel" description="Number won shown in grey.">
            <Bars rows={r.bySource.map((s) => ({ label: s.label, total: s.total, extra: s.won ? `${s.won} won` : undefined }))} empty="No leads in this period." />
          </Panel>
          <Panel title="Pages that brought leads" description="The first page each lead landed on.">
            <Bars rows={r.byLanding} empty="No leads in this period." />
          </Panel>
          <Panel title="Device">
            <Bars rows={r.byDevice} empty="No leads in this period." />
          </Panel>
        </div>

        <div className="grid gap-5 xl:grid-cols-[1fr_420px]">
          <Panel title="Most read articles" description="Counted once per visitor session.">
            {r.topArticles.length === 0 ? (
              <p className="px-6 pb-6 pt-4 text-sm text-[#8A9AA6]">No article views in this period.</p>
            ) : (
              <ol className="divide-y divide-[#F1F4F6] px-6 pb-3 pt-2">
                {r.topArticles.map((a, i) => (
                  <li key={a.slug} className="flex items-center gap-3 py-2.5 text-[13px]">
                    <span className="w-5 text-[#A3B1BA]">{i + 1}</span>
                    <a href={`/insight/${a.slug}`} target="_blank" className="min-w-0 flex-1 truncate hover:text-primary-dark">
                      {a.title}
                    </a>
                    <span className="font-bold">{a.views.toLocaleString("en-US")}</span>
                  </li>
                ))}
              </ol>
            )}
          </Panel>
          <Panel title="SEO checklist">
            <ul className="space-y-1 px-4 pb-4 pt-3">
              {checks.map((ch) => (
                <Check key={ch.title} {...ch} />
              ))}
            </ul>
          </Panel>
        </div>
        <p className="text-xs text-[#8A9AA6]">
          Visitor counts, cities, and Google keywords are in Google Analytics and Search Console. This page uses data the website records itself.
        </p>
      </div>
    </>
  )
}
