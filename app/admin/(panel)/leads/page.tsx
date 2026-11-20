import Link from "next/link"
import { Suspense } from "react"
import { CalendarPlus, Download, Mail, MessageCircle, X } from "lucide-react"
import { LEADS_PAGE_SIZE, getLeadDetail, isLeadStatus, listLeads, listTeam } from "@/lib/admin/queries"
import { STATUS_META, avatarTone, formatDateTime, formatRelative, initials } from "@/lib/admin/format"
import { AdminTopbar, PageTitle } from "@/components/admin/page-header"
import { StatusBadge } from "@/components/admin/status-badge"
import { LeadFilters, NoteForm, OwnerSelect, StatusSelect } from "@/components/admin/lead-controls"
import { cn } from "@/lib/utils"

export const metadata = { title: "Leads" }

type Search = { status?: string; q?: string; source?: string; page?: string; id?: string }

function hrefWith(current: Search, patch: Partial<Search>) {
  const next = new URLSearchParams()
  const merged = { ...current, ...patch }
  for (const [k, v] of Object.entries(merged)) if (v) next.set(k, v)
  const qs = next.toString()
  return qs ? `/admin/leads?${qs}` : "/admin/leads"
}

function whatsappLink(phone: string | null) {
  if (!phone) return null
  let digits = phone.replace(/\D/g, "")
  if (digits.startsWith("0")) digits = `62${digits.slice(1)}`
  return digits.length >= 9 ? `https://wa.me/${digits}` : null
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 py-1.5 text-[13px]">
      <span className="shrink-0 text-[#8A9AA6]">{label}</span>
      <span className="min-w-0 break-words text-right font-medium text-[#1F3442]">{children}</span>
    </div>
  )
}

export default async function LeadsPage({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams
  const status = isLeadStatus(sp.status) ? sp.status : undefined
  const page = Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1)
  const q = sp.q?.trim().slice(0, 100) || undefined

  const [data, detail, team] = await Promise.all([
    listLeads({ status, q, source: sp.source || undefined, page }),
    sp.id ? getLeadDetail(sp.id) : Promise.resolve(null),
    listTeam(),
  ])

  const pages = Math.max(1, Math.ceil(data.total / LEADS_PAGE_SIZE))
  const tabs = [
    { key: undefined, label: "All", count: data.allCount },
    ...(["new", "contacted", "proposal", "won", "lost"] as const).map((s) => ({
      key: s,
      label: STATUS_META[s].label,
      count: data.statusCounts[s],
    })),
  ]
  const lead = detail?.lead
  const wa = whatsappLink(lead?.phone ?? null)
  const firstRow = data.total === 0 ? 0 : (page - 1) * LEADS_PAGE_SIZE + 1
  const lastRow = Math.min(page * LEADS_PAGE_SIZE, data.total)

  return (
    <>
      <AdminTopbar crumb="Leads" />
      <div className="space-y-5 px-6 py-8 lg:px-8">
        <PageTitle
          title="Leads"
          description="Every enquiry from the contact form, with its source and follow up history."
          actions={
            <Link
              href="/admin/leads/export"
              prefetch={false}
              download
              className="inline-flex items-center gap-2 rounded-[9px] border border-[#E7ECEF] bg-white px-4 py-2 text-[13px] font-bold text-[#1F3442] transition hover:border-primary"
            >
              <Download className="h-4 w-4" /> Export CSV
            </Link>
          }
        />

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <nav className="flex gap-1 overflow-x-auto rounded-[10px] bg-[#EAEFF2] p-[3px]">
            {tabs.map((t) => {
              const active = t.key === status
              return (
                <Link
                  key={t.label}
                  href={hrefWith({ q: sp.q, source: sp.source }, { status: t.key })}
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
                    {t.count}
                  </span>
                </Link>
              )
            })}
          </nav>
          <Suspense>
            <LeadFilters sources={data.sources} />
          </Suspense>
        </div>

        <div className={cn("grid gap-4", lead && "xl:grid-cols-[minmax(0,1fr)_404px]")}>
          <div className="overflow-hidden rounded-[14px] border border-[#E7ECEF] bg-white">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-left">
                <thead className="border-b border-[#EEF2F4] bg-[#F8FAFB] text-[11px] font-bold uppercase tracking-[0.06em] text-[#8A9AA6]">
                  <tr>
                    <th className="px-5 py-3">Lead</th>
                    <th className="px-3 py-3">Subject</th>
                    <th className="px-3 py-3">Source</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Received</th>
                  </tr>
                </thead>
                <tbody>
                  {data.rows.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-16 text-center text-sm text-[#8A9AA6]">
                        {q || sp.source || status
                          ? "No leads match these filters."
                          : "No leads yet. New enquiries from the contact form will land here."}
                      </td>
                    </tr>
                  )}
                  {data.rows.map((row) => {
                    const selected = row.id === lead?.id
                    return (
                      <tr
                        key={row.id}
                        className={cn(
                          "border-b border-[#F1F4F6] last:border-0",
                          selected ? "bg-primary/[0.06]" : "hover:bg-[#FAFBFC]"
                        )}
                      >
                        <td className={cn("px-5 py-3", selected && "shadow-[inset_3px_0_0_#4A9698]")}>
                          <Link href={hrefWith(sp, { id: row.id })} scroll={false} className="flex items-center gap-3">
                            <span
                              className={cn(
                                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                                avatarTone(row.email)
                              )}
                            >
                              {initials(row.firstName, row.lastName)}
                            </span>
                            <span className="min-w-0">
                              <span className="flex items-center gap-1.5 truncate text-sm font-bold">
                                {row.firstName} {row.lastName}
                                {row.status === "new" && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                              </span>
                              <span className="block truncate text-xs text-[#8A9AA6]">{row.company ?? row.email}</span>
                            </span>
                          </Link>
                        </td>
                        <td className="max-w-[220px] truncate px-3 py-3 text-[13px] text-[#4B5B66]">{row.subject}</td>
                        <td className="px-3 py-3 text-[13px] text-[#4B5B66]">{row.source}</td>
                        <td className="px-3 py-3">
                          <StatusBadge status={row.status} />
                        </td>
                        <td className="whitespace-nowrap px-5 py-3 text-right text-[13px] text-[#8A9AA6]">
                          {formatRelative(row.createdAt)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between border-t border-[#EEF2F4] px-5 py-3 text-[13px] text-[#6B7C88]">
              <span>
                {data.total === 0 ? "0 leads" : `Showing ${firstRow} to ${lastRow} of ${data.total}`}
              </span>
              <div className="flex gap-2">
                {page > 1 ? (
                  <Link href={hrefWith(sp, { page: String(page - 1), id: undefined })} className="rounded-[8px] border border-[#E7ECEF] px-3 py-1.5 font-bold hover:border-primary">
                    Previous
                  </Link>
                ) : (
                  <span className="rounded-[8px] border border-[#EEF2F4] px-3 py-1.5 text-[#C2CCD2]">Previous</span>
                )}
                {page < pages ? (
                  <Link href={hrefWith(sp, { page: String(page + 1), id: undefined })} className="rounded-[8px] border border-[#E7ECEF] px-3 py-1.5 font-bold hover:border-primary">
                    Next
                  </Link>
                ) : (
                  <span className="rounded-[8px] border border-[#EEF2F4] px-3 py-1.5 text-[#C2CCD2]">Next</span>
                )}
              </div>
            </div>
          </div>

          {lead && detail && (
            <aside className="h-fit overflow-hidden rounded-[14px] border border-[#E7ECEF] bg-white xl:sticky xl:top-6">
              <div className="flex items-start gap-3 border-b border-[#EEF2F4] p-5">
                <span
                  className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                    avatarTone(lead.email)
                  )}
                >
                  {initials(lead.firstName, lead.lastName)}
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-[17px] font-bold">
                    {lead.firstName} {lead.lastName}
                  </h2>
                  <p className="truncate text-[13px] text-[#6B7C88]">{lead.company ?? "No company given"}</p>
                </div>
                <Link
                  href={hrefWith(sp, { id: undefined })}
                  scroll={false}
                  aria-label="Close lead"
                  className="rounded-lg p-1.5 text-[#8A9AA6] hover:bg-[#F1F4F6] hover:text-[#1F3442]"
                >
                  <X className="h-4 w-4" />
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-3 border-b border-[#EEF2F4] p-5">
                <div>
                  <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.06em] text-[#8A9AA6]">Status</p>
                  <StatusSelect key={`s-${lead.id}-${lead.status}`} leadId={lead.id} status={lead.status} />
                </div>
                <div>
                  <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.06em] text-[#8A9AA6]">Owner</p>
                  <OwnerSelect key={`o-${lead.id}-${lead.ownerId}`} leadId={lead.id} ownerId={lead.ownerId} team={team} />
                </div>
                <div className="col-span-2 flex gap-2">
                  <a
                    href={`mailto:${lead.email}?subject=${encodeURIComponent(`Re: ${lead.subject}`)}`}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-[9px] bg-primary-dark py-2 text-[13px] font-bold text-white transition hover:bg-secondary"
                  >
                    <Mail className="h-4 w-4" /> Email
                  </a>
                  {wa && (
                    <a
                      href={wa}
                      target="_blank"
                      rel="noreferrer"
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-[9px] border border-[#E7ECEF] py-2 text-[13px] font-bold transition hover:border-primary"
                    >
                      <MessageCircle className="h-4 w-4" /> WhatsApp
                    </a>
                  )}
                  <a
                    href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
                      `Arkana x ${lead.company ?? `${lead.firstName} ${lead.lastName}`}`
                    )}&add=${encodeURIComponent(lead.email)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-[9px] border border-[#E7ECEF] py-2 text-[13px] font-bold transition hover:border-primary"
                  >
                    <CalendarPlus className="h-4 w-4" /> Schedule
                  </a>
                </div>
              </div>

              <div className="border-b border-[#EEF2F4] p-5">
                <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.06em] text-[#8A9AA6]">Contact</p>
                <Field label="Email">{lead.email}</Field>
                <Field label="Phone">{lead.phone ?? "Not given"}</Field>
                <Field label="Received">{formatDateTime(lead.createdAt)}</Field>
                <Field label="Device">{lead.device ?? "Unknown"}</Field>
              </div>

              <div className="border-b border-[#EEF2F4] p-5">
                <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.06em] text-[#8A9AA6]">Enquiry</p>
                <p className="text-sm font-bold">{lead.subject}</p>
                <p className="mt-2 whitespace-pre-line rounded-[10px] bg-[#F8FAFB] p-3 text-[13px] leading-relaxed text-[#4B5B66]">
                  {lead.message}
                </p>
              </div>

              <div className="border-b border-[#EEF2F4] p-5">
                <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.06em] text-[#8A9AA6]">Source</p>
                <Field label="Channel">{lead.source}</Field>
                {lead.utmCampaign && <Field label="Campaign">{lead.utmCampaign}</Field>}
                {(lead.utmSource || lead.utmMedium) && (
                  <Field label="UTM">{[lead.utmSource, lead.utmMedium].filter(Boolean).join(" / ")}</Field>
                )}
                {lead.utmTerm && <Field label="Keyword">{lead.utmTerm}</Field>}
                {lead.referrer && <Field label="Referrer">{lead.referrer}</Field>}
                {lead.landingPage && <Field label="Landing page">{lead.landingPage}</Field>}
              </div>

              <div className="p-5">
                <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.06em] text-[#8A9AA6]">Activity</p>
                <NoteForm leadId={lead.id} />
                <ol className="mt-4 space-y-4">
                  {detail.activities.map((a, i) => (
                    <li key={a.id} className="relative flex gap-3">
                      {i < detail.activities.length - 1 && (
                        <span className="absolute left-[5px] top-4 h-[calc(100%+4px)] w-px bg-[#E7ECEF]" />
                      )}
                      <span
                        className={cn(
                          "relative mt-1 h-[11px] w-[11px] shrink-0 rounded-full border-2 border-white ring-1",
                          a.type === "note" ? "bg-amber-400 ring-amber-200" : "bg-primary ring-primary/30"
                        )}
                      />
                      <div className="min-w-0 flex-1">
                        <p
                          className={cn(
                            "text-[13px]",
                            a.type === "note" ? "whitespace-pre-line rounded-[8px] bg-amber-50 p-2.5 text-[#4B5B66]" : "font-medium"
                          )}
                        >
                          {a.body}
                        </p>
                        <p className="mt-1 text-xs text-[#8A9AA6]">
                          {a.userName ?? "Website"} · {formatDateTime(a.createdAt)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </aside>
          )}
        </div>
      </div>
    </>
  )
}
