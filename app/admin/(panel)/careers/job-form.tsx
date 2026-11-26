"use client"

import Link from "next/link"
import { useActionState } from "react"
import { ArrowLeft, Trash2 } from "lucide-react"
import { Field, FormMessage, SubmitButton, inputClass, type FormState } from "@/components/admin/form"
import { Panel } from "@/components/admin/page-header"
import type { Job } from "@/lib/db/schema"
import { deleteJob, saveJob } from "./actions"

export function JobForm({ job, justCreated }: { job: Job | null; justCreated?: boolean }) {
  const [state, action] = useActionState<FormState, FormData>(saveJob, justCreated ? { ok: true, message: "Opening created." } : {})

  return (
    <div className="space-y-5 px-6 py-8 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/admin/careers" className="inline-flex items-center gap-1.5 text-[13px] text-[#6B7C88] hover:text-[#1F3442]">
            <ArrowLeft className="h-4 w-4" /> All openings
          </Link>
          <h1 className="mt-2 text-[28px] font-bold tracking-tight text-[#1F3442]">{job ? job.title : "New opening"}</h1>
        </div>
        {job && (
          <form
            action={deleteJob}
            onSubmit={(e) => {
              if (!confirm(`Delete ${job.title}? Applicants stay in the list as general applications.`)) e.preventDefault()
            }}
          >
            <input type="hidden" name="id" value={job.id} />
            <button className="inline-flex items-center gap-2 rounded-[9px] border border-red-200 bg-white px-4 py-2 text-[13px] font-bold text-red-600 transition hover:bg-red-50">
              <Trash2 className="h-4 w-4" /> Delete
            </button>
          </form>
        )}
      </div>

      <form action={action} className="grid gap-5 xl:grid-cols-[1fr_340px]">
        <input type="hidden" name="id" value={job?.id ?? ""} />
        <Panel title="Job description" description="Write in Indonesian. This is what candidates read on the website.">
          <div className="grid gap-4 p-6">
            <Field label="Job title">
              <input name="title" required defaultValue={job?.title} placeholder="Frontend Developer" className={inputClass} />
            </Field>
            <Field label="Summary" hint="Two or three sentences about the role.">
              <textarea name="summary" required rows={3} defaultValue={job?.summary} className={`${inputClass} resize-y`} />
            </Field>
            <Field label="Responsibilities" hint="One point per line.">
              <textarea name="responsibilities" rows={6} defaultValue={job?.responsibilities} className={`${inputClass} resize-y`} />
            </Field>
            <Field label="Requirements" hint="One point per line.">
              <textarea name="requirements" rows={6} defaultValue={job?.requirements} className={`${inputClass} resize-y`} />
            </Field>
          </div>
        </Panel>

        <div className="space-y-5">
          <Panel title="Details">
            <div className="grid gap-4 p-6">
              <Field label="Status">
                <select name="status" defaultValue={job?.status ?? "open"} className={inputClass}>
                  <option value="open">Open, shown on the website</option>
                  <option value="draft">Draft, hidden</option>
                  <option value="closed">Closed, hidden</option>
                </select>
              </Field>
              <Field label="Department">
                <input name="department" defaultValue={job?.department} placeholder="Engineering" className={inputClass} />
              </Field>
              <Field label="Location">
                <input name="location" required defaultValue={job?.location ?? "Bandung"} className={inputClass} />
              </Field>
              <Field label="Employment type">
                <input name="employmentType" list="employment-types" defaultValue={job?.employmentType ?? "Penuh waktu"} className={inputClass} />
                <datalist id="employment-types">
                  {["Penuh waktu", "Paruh waktu", "Kontrak", "Magang", "Freelance"].map((v) => (
                    <option key={v} value={v} />
                  ))}
                </datalist>
              </Field>
              <Field label="Work arrangement">
                <input name="workMode" list="work-modes" defaultValue={job?.workMode ?? "Di kantor"} className={inputClass} />
                <datalist id="work-modes">
                  {["Di kantor", "Hybrid", "Remote"].map((v) => (
                    <option key={v} value={v} />
                  ))}
                </datalist>
              </Field>
            </div>
          </Panel>
          <SubmitButton className="w-full py-2.5">{job ? "Save changes" : "Create opening"}</SubmitButton>
          <FormMessage state={state} />
        </div>
      </form>
    </div>
  )
}
