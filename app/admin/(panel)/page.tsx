import Link from "next/link"
import { ArrowRight, Check, Inbox, Search, Target, Trophy, UserPlus } from "lucide-react"
import { getOverview } from "@/lib/admin/queries"
import { avatarTone, formatRelative, formatShortDate, initials, percentChange } from "@/lib/admin/format"
import { AdminTopbar, PageTitle, Panel } from "@/components/admin/page-header"
import { Donut, LeadsAreaChart, SOURCE_COLORS, Sparkline } from "@/components/admin/charts"
import { StatusBadge } from "@/components/admin/status-badge"
import { cn } from "@/lib/utils"

export const metadata = { title: "Overview" }

const RANGES = [
  { key: "7", label: "7D" },
  { key: "30", label: "30D" },
  { key: "90", label: "90D" },
]

function Delta({ value }: { value: number | null }) {
  if (value === null) return <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700">New</span>
  const up = value >= 0
  return (
    <span className={cn("rounded-full px-2 py-0.5 text-xs font-bold", up ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600")}>
      {up ? "↑" : "↓"} {Math.abs(value).toFixed(0)}%
    </span>
  )
}

function Kpi({
  icon: Icon,
  label,
  value,
  footer,
  chart,
}: {
  icon: typeof Inbox
  label: string
  value: string | number
  footer: React.ReactNode
  chart?: React.ReactNode
}) {
  return (
    <div className="rounded-[14px] border border-[#E7ECEF] bg-white p-5">
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-4 w-4 text-primary-dark" strokeWidth={2} />
        </span>
        <span className="text-[13px] text-[#6B7C88]">{label}</span>
      </div>
      <div className="mt-3 flex items-end justify-between gap-3">
        <span className="text-[30px] font-bold leading-none tracking-tight">{value}</span>
        {chart}
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs text-[#8A9AA6]">{footer}</div>
    </div>
  )
}

export default async function OverviewPage({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  const { range: rangeParam } = await searchParams
  const range = RANGES.some((r) => r.key === rangeParam) ? Number(rangeParam) : 30
  const data = await getOverview(range)

  const { statusCounts: s } = data
  const totalLeads = Object.values(s).reduce((a, b) => a + b, 0)
  const decided = s.won + s.lost
  const funnel = [
    { label: "All leads", value: totalLeads, color: "bg-[#93D1D2]" },
    { label: "Contacted", value: s.contacted + s.proposal + s.won, color: "bg-primary" },
    { label: "Proposal sent", value: s.proposal + s.won, color: "bg-primary-dark" },
    { label: "Won", value: s.won, color: "bg-secondary-dark" },
  ]
  const funnelMax = Math.max(totalLeads, 1)
  const sourcesTotal = data.sources.reduce((a, b) => a + b.total, 0)

  return (
    <>
      <AdminTopbar crumb="Overview" />
      <div className="space-y-4 px-6 py-8 lg:px-8">
        <PageTitle
          title="Overview"
          description={`How arkanacorp.id performed over the last ${range} days.`}
          actions={
            <div className="flex rounded-[9px] bg-[#EAEFF2] p-[3px]">
              {RANGES.map((r) => (
                <Link
                  key={r.key}
                  href={`/admin?range=${r.key}`}
                  className={cn(
                    "rounded-[7px] px-3 py-1.5 text-[13px]",
                    Number(r.key) === range ? "bg-white font-bold shadow-sm" : "text-[#6B7C88] hover:text-[#1F3442]"
                  )}
                >
                  {r.label}
                </Link>
              ))}
            </div>
          }
        />

        <div className="grid gap-4 pt-2 sm:grid-cols-2 xl:grid-cols-4">
          <Kpi
            icon={UserPlus}
            label="New leads"
            value={data.leadsInRange}
            chart={<Sparkline id="spark-leads" values={data.daily.map((d) => d.total)} />}
            footer={
              <>
                <Delta value={percentChange(data.leadsInRange, data.leadsPrevious)} />
                vs previous {range} days
              </>
            }
          />
          <Kpi
            icon={Inbox}
            label="Awaiting first reply"
            value={s.new}
            footer={s.new > 0 ? "Reply within one working day" : "Inbox is clear"}
          />
          <Kpi icon={Target} label="Open proposals" value={s.proposal} footer="Waiting for a client decision" />
          <Kpi
            icon={Trophy}
            label="Won deals"
            value={s.won}
            footer={decided > 0 ? `${Math.round((s.won / decided) * 100)}% close rate on decided leads` : "No decisions yet"}
          />
        </div>

        <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
          <Panel title="Leads per day" description="Form submissions from the website">
            <LeadsAreaChart data={data.daily.map((d) => ({ label: formatShortDate(d.date), total: d.total }))} />
          </Panel>

          <Panel title="Lead sources" description={`Where leads came from in the last ${range} days`}>
            <div className="flex items-center gap-6 px-6 pb-6 pt-6">
              <Donut segments={data.sources.map((x) => ({ label: x.source, value: x.total }))} total={sourcesTotal} />
              <ul className="min-w-0 flex-1 space-y-2.5">
                {data.sources.length === 0 && <li className="text-sm text-[#8A9AA6]">No leads in this period yet.</li>}
                {data.sources.slice(0, 6).map((x, i) => (
                  <li key={x.source} className="flex items-center gap-2.5 text-[13px]">
                    <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: SOURCE_COLORS[i % SOURCE_COLORS.length] }} />
                    <span className="flex-1 truncate text-[#4B5B66]">{x.source}</span>
                    <span className="font-bold">{x.total}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Panel>
        </div>

        <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
          <Panel
            title="Recent leads"
            action={
              <Link href="/admin/leads" className="flex items-center gap-1 text-[13px] font-bold text-primary-dark">
                View all leads <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            }
          >
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[640px] text-left">
                <thead className="border-y border-[#EEF2F4] bg-[#F8FAFB] text-[11px] font-bold uppercase tracking-[0.06em] text-[#8A9AA6]">
                  <tr>
                    <th className="px-6 py-3">Lead</th>
                    <th className="px-3 py-3">Subject</th>
                    <th className="px-3 py-3">Source</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Received</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recent.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-sm text-[#8A9AA6]">
                        No leads yet. They will appear here as soon as someone sends the contact form.
                      </td>
                    </tr>
                  )}
                  {data.recent.map((lead) => (
                    <tr key={lead.id} className="border-b border-[#F1F4F6] last:border-0 hover:bg-[#FAFBFC]">
                      <td className="px-6 py-3">
                        <Link href={`/admin/leads?id=${lead.id}`} className="flex items-center gap-3">
                          <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold", avatarTone(lead.email))}>
                            {initials(lead.firstName, lead.lastName)}
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-bold">
                              {lead.firstName} {lead.lastName}
                            </span>
                            <span className="block truncate text-xs text-[#8A9AA6]">{lead.company ?? lead.email}</span>
                          </span>
                        </Link>
                      </td>
                      <td className="max-w-[200px] truncate px-3 py-3 text-[13px] text-[#4B5B66]">{lead.subject}</td>
                      <td className="px-3 py-3 text-[13px] text-[#4B5B66]">{lead.source}</td>
                      <td className="px-3 py-3">
                        <StatusBadge status={lead.status} />
                      </td>
                      <td className="px-6 py-3 text-right text-[13px] text-[#8A9AA6]">{formatRelative(lead.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>

          <Panel title="Conversion funnel" description="From first enquiry to signed project">
            <div className="space-y-4 px-6 pb-6 pt-5">
              {funnel.map((f) => (
                <div key={f.label}>
                  <div className="flex justify-between text-[13px]">
                    <span className="text-[#4B5B66]">{f.label}</span>
                    <span className="font-bold">{f.value}</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-[#F1F4F6]">
                    <div
                      className={cn("h-2 rounded-full", f.color)}
                      style={{ width: `${f.value === 0 ? 0 : Math.max((f.value / funnelMax) * 100, 4)}%` }}
                    />
                  </div>
                </div>
              ))}
              <p
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold",
                  s.won > 0 ? "bg-green-100 text-green-700" : "bg-[#F1F4F6] text-[#6B7C88]"
                )}
              >
                {s.won > 0 ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : <Target className="h-3.5 w-3.5" />}
                {s.won > 0 ? "First customer goal reached" : "Goal: first customer"}
              </p>
            </div>
          </Panel>
        </div>

        <Panel>
          <div className="flex flex-col gap-4 p-6 md:flex-row md:items-center">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Search className="h-5 w-5 text-primary-dark" />
            </span>
            <div className="flex-1">
              <h2 className="font-bold">Visitors and Google rankings</h2>
              <p className="mt-1 text-sm text-[#6B7C88]">
                Connect Google Analytics 4 and Search Console to add visitors, conversion rate, top search queries, and top
                pages to this overview.
              </p>
            </div>
            <Link
              href="/admin/traffic"
              className="inline-flex items-center gap-2 rounded-[9px] bg-secondary-dark px-4 py-2.5 text-[13px] font-bold text-white transition hover:bg-secondary"
            >
              Set up tracking <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </Panel>
      </div>
    </>
  )
}
