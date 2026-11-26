import Link from "next/link"
import { Megaphone, Plus } from "lucide-react"
import { requireArea } from "@/lib/admin/access"
import { listCampaigns, rupiah } from "@/lib/campaigns"
import { formatShortDate } from "@/lib/admin/format"
import { AdminTopbar, PageTitle, Panel } from "@/components/admin/page-header"
import { btnPrimary } from "@/components/admin/form"
import { CopyButton } from "./copy-button"

export const metadata = { title: "Campaigns" }

export default async function CampaignsPage() {
  await requireArea("growth")
  const { rows, untracked } = await listCampaigns()
  const spend = rows.reduce((n, r) => n + r.spend, 0)
  const leads = rows.reduce((n, r) => n + r.leads, 0)
  const won = rows.reduce((n, r) => n + r.won, 0)

  return (
    <>
      <AdminTopbar crumb="Campaigns" />
      <div className="space-y-5 px-6 py-8 lg:px-8">
        <PageTitle
          title="Campaigns"
          description="Make a tracked link for each ad or broadcast, then see how many leads and deals it brought in."
          actions={
            <Link href="/admin/campaigns/new" className={btnPrimary}>
              <Plus className="h-4 w-4" /> New campaign
            </Link>
          }
        />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Total spend", value: rupiah(spend) },
            { label: "Leads from campaigns", value: leads },
            { label: "Deals won", value: won },
            { label: "Average cost per lead", value: leads && spend ? rupiah(Math.round(spend / leads)) : "No data yet" },
          ].map((s) => (
            <div key={s.label} className="rounded-[14px] border border-[#E7ECEF] bg-white px-5 py-4">
              <p className="text-[13px] text-[#6B7C88]">{s.label}</p>
              <p className="mt-1.5 text-[22px] font-bold leading-none">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="overflow-hidden rounded-[14px] border border-[#E7ECEF] bg-white">
          {rows.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <Megaphone className="mx-auto h-8 w-8 text-[#C2CCD2]" />
              <p className="mt-3 text-sm font-bold">No campaigns yet</p>
              <p className="mx-auto mt-1 max-w-md text-sm text-[#8A9AA6]">
                Create one before you run an ad. Use its link as the ad destination so every lead is counted here.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-[#F1F4F6]">
              {rows.map((c) => (
                <li key={c.id} className="grid gap-4 px-5 py-4 xl:grid-cols-[1fr_420px]">
                  <div className="min-w-0">
                    <Link href={`/admin/campaigns/${c.id}`} className="text-sm font-bold hover:text-primary-dark">
                      {c.name}
                    </Link>
                    <p className="text-xs text-[#8A9AA6]">
                      {c.channel}
                      {c.startDate && ` · ${formatShortDate(c.startDate)}${c.endDate ? ` to ${formatShortDate(c.endDate)}` : " onward"}`}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <code className="min-w-0 truncate rounded-md bg-[#F5F7F8] px-2 py-1 text-xs text-[#4B5B66]">{c.url}</code>
                      <CopyButton text={c.url} />
                    </div>
                  </div>
                  <dl className="grid grid-cols-4 gap-3 text-[13px]">
                    <div>
                      <dt className="text-xs text-[#8A9AA6]">Spend</dt>
                      <dd className="font-bold">{c.spend ? rupiah(c.spend) : "None"}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-[#8A9AA6]">Leads</dt>
                      <dd className="font-bold">
{c.leads}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-[#8A9AA6]">Won</dt>
                      <dd className="font-bold">{c.won}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-[#8A9AA6]">Per lead</dt>
                      <dd className="font-bold">{c.cpl ? rupiah(c.cpl) : "None"}</dd>
                    </div>
                  </dl>
                </li>
              ))}
            </ul>
          )}
        </div>

        {untracked.length > 0 && (
          <Panel title="Campaign tags without a campaign" description="Leads in the last 90 days came from these tags. Create a campaign with the same tag to track spend.">
            <ul className="flex flex-wrap gap-2 p-6">
              {untracked.map((u) => (
                <li key={u.name} className="rounded-full bg-[#F5F7F8] px-3 py-1 text-[13px]">
                  {u.name} <span className="font-bold">{u.total}</span>
                </li>
              ))}
            </ul>
          </Panel>
        )}
      </div>
    </>
  )
}
