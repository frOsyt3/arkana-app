import Link from "next/link"
import { CalendarDays, Clock, MapPin, Plus, Video } from "lucide-react"
import { requireArea } from "@/lib/admin/access"
import {
  CONSULTATION_STATUS,
  MODES,
  dayKey,
  formatDay,
  formatTime,
  listConsultations,
  type ConsultationView,
} from "@/lib/consultations"
import { AdminTopbar, PageTitle } from "@/components/admin/page-header"
import { btnPrimary } from "@/components/admin/form"
import { cn } from "@/lib/utils"
import { setConsultationStatus } from "./actions"

export const metadata = { title: "Consultations" }

const VIEWS: { key: ConsultationView; label: string }[] = [
  { key: "upcoming", label: "Upcoming" },
  { key: "requested", label: "Needs confirming" },
  { key: "past", label: "Past" },
]

function QuickStatus({ id, status, label }: { id: string; status: string; label: string }) {
  return (
    <form action={setConsultationStatus}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={status} />
      <button className="rounded-[8px] border border-[#E7ECEF] px-2.5 py-1 text-xs font-bold transition hover:border-primary">{label}</button>
    </form>
  )
}

export default async function ConsultationsPage({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  await requireArea("consultations")
  const sp = await searchParams
  const view = (VIEWS.some((v) => v.key === sp.view) ? sp.view : "upcoming") as ConsultationView
  const data = await listConsultations(view)

  const groups = new Map<string, typeof data.rows>()
  for (const row of data.rows) {
    const key = dayKey(row.scheduledAt)
    groups.set(key, [...(groups.get(key) ?? []), row])
  }
  const today = dayKey(new Date())

  return (
    <>
      <AdminTopbar crumb="Consultations" />
      <div className="space-y-5 px-6 py-8 lg:px-8">
        <PageTitle
          title="Consultations"
          description="Meetings with prospects, from website requests or scheduled from a lead. Times are in WIB."
          actions={
            <Link href="/admin/consultations/new" className={btnPrimary}>
              <Plus className="h-4 w-4" /> Schedule consultation
            </Link>
          }
        />

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "Confirmed and upcoming", value: data.upcomingConfirmed },
            { label: "Waiting for confirmation", value: data.byStatus.requested },
            { label: "Completed", value: data.byStatus.done },
          ].map((s) => (
            <div key={s.label} className="rounded-[14px] border border-[#E7ECEF] bg-white px-5 py-4">
              <p className="text-[13px] text-[#6B7C88]">{s.label}</p>
              <p className="mt-1.5 text-[26px] font-bold leading-none">{s.value}</p>
            </div>
          ))}
        </div>

        <nav className="flex w-fit gap-1 rounded-[10px] bg-[#EAEFF2] p-[3px]">
          {VIEWS.map((v) => (
            <Link
              key={v.key}
              href={v.key === "upcoming" ? "/admin/consultations" : `/admin/consultations?view=${v.key}`}
              className={cn("rounded-[8px] px-3 py-1.5 text-[13px]", view === v.key ? "bg-white font-bold shadow-sm" : "text-[#6B7C88] hover:text-[#1F3442]")}
            >
              {v.label}
              {v.key === "requested" && data.byStatus.requested > 0 && (
                <span className="ml-2 rounded-full bg-amber-500 px-1.5 text-[11px] font-bold text-white">{data.byStatus.requested}</span>
              )}
            </Link>
          ))}
        </nav>

        {data.rows.length === 0 ? (
          <div className="rounded-[14px] border border-[#E7ECEF] bg-white px-6 py-16 text-center">
            <CalendarDays className="mx-auto h-8 w-8 text-[#C2CCD2]" />
            <p className="mt-3 text-sm font-bold">Nothing here</p>
            <p className="mt-1 text-sm text-[#8A9AA6]">
              Visitors can request a time from the contact form, or you can schedule one from a lead.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {[...groups.entries()].map(([key, rows]) => (
              <section key={key} className="overflow-hidden rounded-[14px] border border-[#E7ECEF] bg-white">
                <h2 className="border-b border-[#EEF2F4] bg-[#F8FAFB] px-5 py-2.5 text-[13px] font-bold">
                  {formatDay(rows[0].scheduledAt)}
                  {key === today && <span className="ml-2 rounded-full bg-primary-dark px-2 py-0.5 text-[11px] text-white">Today</span>}
                </h2>
                <ul className="divide-y divide-[#F1F4F6]">
                  {rows.map((c) => (
                    <li key={c.id} className="grid gap-3 px-5 py-4 md:grid-cols-[90px_1fr_auto] md:items-center">
                      <p className="flex items-center gap-1.5 text-sm font-bold">
                        <Clock className="h-4 w-4 text-[#8A9AA6]" />
                        {formatTime(c.scheduledAt)}
                      </p>
                      <Link href={`/admin/consultations/${c.id}`} className="min-w-0">
                        <p className="truncate text-sm font-bold">
                          {c.name}
                          {c.company && <span className="font-normal text-[#6B7C88]">, {c.company}</span>}
                        </p>
                        <p className="truncate text-[13px] text-[#4B5B66]">{c.topic}</p>
                        <p className="mt-1 flex flex-wrap items-center gap-x-3 text-xs text-[#8A9AA6]">
                          <span className="inline-flex items-center gap-1">
                            {c.mode === "online" ? <Video className="h-3.5 w-3.5" /> : <MapPin className="h-3.5 w-3.5" />}
                            {MODES[c.mode] ?? c.mode}
                          </span>
                          <span>{c.durationMinutes} min</span>
                          {c.ownerName && <span>with {c.ownerName}</span>}
                        </p>
                      </Link>
                      <div className="flex flex-wrap items-center gap-2 md:justify-end">
                        <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-bold", CONSULTATION_STATUS[c.status].badge)}>
                          {CONSULTATION_STATUS[c.status].label}
                        </span>
                        {c.status === "requested" && <QuickStatus id={c.id} status="confirmed" label="Confirm" />}
                        {c.status === "confirmed" && <QuickStatus id={c.id} status="done" label="Mark done" />}
                        <Link href={`/admin/consultations/${c.id}`} className="rounded-[8px] px-2.5 py-1 text-xs font-bold text-primary-dark hover:bg-primary/10">
                          Open
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
