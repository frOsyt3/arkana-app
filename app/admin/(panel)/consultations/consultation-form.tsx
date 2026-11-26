"use client"

import Link from "next/link"
import { useActionState } from "react"
import { ArrowLeft, CalendarPlus, Inbox, Trash2 } from "lucide-react"
import { Field, FormMessage, SubmitButton, btnSecondary, inputClass, type FormState } from "@/components/admin/form"
import { Panel } from "@/components/admin/page-header"
import { deleteConsultation, saveConsultation } from "./actions"

export interface ConsultationValues {
  id: string
  leadId: string
  name: string
  email: string
  phone: string
  company: string
  topic: string
  scheduledAt: string
  durationMinutes: number
  mode: string
  location: string
  notes: string
  status: string
  ownerId: string
}

export function ConsultationForm({
  values: v,
  team,
  justCreated,
  calendarUrl,
}: {
  values: ConsultationValues
  team: { id: string; name: string }[]
  justCreated?: boolean
  calendarUrl: string | null
}) {
  const [state, action] = useActionState<FormState, FormData>(saveConsultation, justCreated ? { ok: true, message: "Consultation saved." } : {})

  return (
    <div className="space-y-5 px-6 py-8 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/admin/consultations" className="inline-flex items-center gap-1.5 text-[13px] text-[#6B7C88] hover:text-[#1F3442]">
            <ArrowLeft className="h-4 w-4" /> All consultations
          </Link>
          <h1 className="mt-2 text-[28px] font-bold tracking-tight text-[#1F3442]">{v.id ? v.name : "Schedule consultation"}</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          {v.leadId && (
            <Link href={`/admin/leads?id=${v.leadId}`} className={btnSecondary}>
              <Inbox className="h-4 w-4" /> Open lead
            </Link>
          )}
          {calendarUrl && (
            <a href={calendarUrl} target="_blank" rel="noreferrer" className={btnSecondary}>
              <CalendarPlus className="h-4 w-4" /> Add to Google Calendar
            </a>
          )}
          {v.id && (
            <form
              action={deleteConsultation}
              onSubmit={(e) => {
                if (!confirm("Delete this consultation? This cannot be undone.")) e.preventDefault()
              }}
            >
              <input type="hidden" name="id" value={v.id} />
              <button className="inline-flex items-center gap-2 rounded-[9px] border border-red-200 bg-white px-4 py-2 text-[13px] font-bold text-red-600 transition hover:bg-red-50">
                <Trash2 className="h-4 w-4" /> Delete
              </button>
            </form>
          )}
        </div>
      </div>

      <form action={action} className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <input type="hidden" name="id" value={v.id} />
        <input type="hidden" name="leadId" value={v.leadId} />
        <div className="space-y-5">
          <Panel title="Client">
            <div className="grid gap-4 p-6 sm:grid-cols-2">
              <Field label="Name">
                <input name="name" required defaultValue={v.name} className={inputClass} />
              </Field>
              <Field label="Company or agency">
                <input name="company" defaultValue={v.company} className={inputClass} />
              </Field>
              <Field label="Email">
                <input name="email" type="email" defaultValue={v.email} className={inputClass} />
              </Field>
              <Field label="Phone or WhatsApp">
                <input name="phone" defaultValue={v.phone} className={inputClass} />
              </Field>
            </div>
          </Panel>
          <Panel title="Meeting">
            <div className="grid gap-4 p-6 sm:grid-cols-2">
              <Field label="Topic" className="sm:col-span-2">
                <input name="topic" required defaultValue={v.topic} placeholder="Pengadaan 20 laptop untuk dinas" className={inputClass} />
              </Field>
              <Field label="How">
                <select name="mode" defaultValue={v.mode} className={inputClass}>
                  <option value="online">Online meeting</option>
                  <option value="office">At Arkana office</option>
                  <option value="onsite">At client site</option>
                  <option value="phone">Phone or WhatsApp call</option>
                </select>
              </Field>
              <Field label="Meeting link or address">
                <input name="location" defaultValue={v.location} placeholder="https://meet.google.com/..." className={inputClass} />
              </Field>
              <Field label="Notes" className="sm:col-span-2" hint="Agenda, what to prepare, or the outcome after the meeting.">
                <textarea name="notes" rows={5} defaultValue={v.notes} className={`${inputClass} resize-y`} />
              </Field>
            </div>
          </Panel>
        </div>
        <div className="space-y-5">
          <Panel title="When">
            <div className="grid gap-4 p-6">
              <Field label="Date and time (WIB)">
                <input name="scheduledAt" type="datetime-local" required defaultValue={v.scheduledAt} className={inputClass} />
              </Field>
              <Field label="Duration">
                <select name="durationMinutes" defaultValue={String(v.durationMinutes)} className={inputClass}>
                  {[30, 45, 60, 90, 120].map((m) => (
                    <option key={m} value={m}>
                      {m} minutes
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Status">
                <select name="status" defaultValue={v.status} className={inputClass}>
                  <option value="requested">Requested, needs confirming</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="done">Done</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </Field>
              <Field label="Arkana contact">
                <select name="ownerId" defaultValue={v.ownerId} className={inputClass}>
                  <option value="">Unassigned</option>
                  {team.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </Panel>
          <SubmitButton className="w-full py-2.5">{v.id ? "Save changes" : "Schedule"}</SubmitButton>
          <FormMessage state={state} />
        </div>
      </form>
    </div>
  )
}
