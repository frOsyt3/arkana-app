"use client"

import { useRef, useTransition } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ChevronDown, Loader2, Search } from "lucide-react"
import { addLeadNote, updateLeadOwner, updateLeadStatus } from "@/app/admin/actions"
import { LEAD_STATUS_OPTIONS } from "@/lib/admin/status-options"
import { cn } from "@/lib/utils"

const selectClass =
  "w-full appearance-none rounded-[9px] border border-[#E7ECEF] bg-white py-2 pl-3 pr-8 text-[13px] font-bold outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"

function AutoSubmitSelect({
  action,
  leadId,
  name,
  value,
  options,
  label,
}: {
  action: (formData: FormData) => Promise<void>
  leadId: string
  name: string
  value: string
  options: { value: string; label: string }[]
  label: string
}) {
  const [pending, startTransition] = useTransition()
  return (
    <form
      action={(fd) => startTransition(() => action(fd))}
      className="relative"
      onChange={(e) => e.currentTarget.requestSubmit()}
    >
      <input type="hidden" name="leadId" value={leadId} />
      <select name={name} defaultValue={value} aria-label={label} className={selectClass} disabled={pending}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {pending ? (
        <Loader2 className="pointer-events-none absolute right-2.5 top-2.5 h-4 w-4 animate-spin text-[#8A9AA6]" />
      ) : (
        <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 h-4 w-4 text-[#8A9AA6]" />
      )}
    </form>
  )
}

export function StatusSelect({ leadId, status }: { leadId: string; status: string }) {
  return (
    <AutoSubmitSelect
      action={updateLeadStatus}
      leadId={leadId}
      name="status"
      value={status}
      options={LEAD_STATUS_OPTIONS}
      label="Lead status"
    />
  )
}

export function OwnerSelect({
  leadId,
  ownerId,
  team,
}: {
  leadId: string
  ownerId: string | null
  team: { id: string; name: string }[]
}) {
  return (
    <AutoSubmitSelect
      action={updateLeadOwner}
      leadId={leadId}
      name="ownerId"
      value={ownerId ?? ""}
      options={[{ value: "", label: "Unassigned" }, ...team.map((t) => ({ value: t.id, label: t.name }))]}
      label="Lead owner"
    />
  )
}

export function NoteForm({ leadId }: { leadId: string }) {
  const ref = useRef<HTMLFormElement>(null)
  const [pending, startTransition] = useTransition()
  return (
    <form
      ref={ref}
      action={(fd) =>
        startTransition(async () => {
          await addLeadNote(fd)
          ref.current?.reset()
        })
      }
      className="flex gap-2"
    >
      <input type="hidden" name="leadId" value={leadId} />
      <input
        name="note"
        required
        maxLength={2000}
        placeholder="Add a note for the team"
        className="min-w-0 flex-1 rounded-[9px] border border-[#E7ECEF] px-3 py-2 text-[13px] outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
      />
      <button
        disabled={pending}
        className="flex items-center gap-1.5 rounded-[9px] bg-primary-dark px-4 text-[13px] font-bold text-white transition hover:bg-secondary disabled:opacity-60"
      >
        {pending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
        Save
      </button>
    </form>
  )
}

export function LeadFilters({ sources }: { sources: string[] }) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const [pending, startTransition] = useTransition()

  function update(key: string, value: string) {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    next.delete("page")
    next.delete("id")
    startTransition(() => router.replace(`${pathname}?${next.toString()}`))
  }

  return (
    <div className={cn("flex flex-wrap gap-2.5", pending && "opacity-70")}>
      <form
        className="relative min-w-[240px] flex-1 sm:max-w-[300px]"
        onSubmit={(e) => {
          e.preventDefault()
          update("q", String(new FormData(e.currentTarget).get("q") ?? "").trim())
        }}
      >
        <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-[#8A9AA6]" />
        <input
          name="q"
          defaultValue={params.get("q") ?? ""}
          placeholder="Search name, company, or email"
          className="w-full rounded-[9px] border border-[#E7ECEF] bg-white py-2 pl-9 pr-3 text-[13px] outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
        />
      </form>
      <div className="relative">
        <select
          aria-label="Filter by source"
          value={params.get("source") ?? ""}
          onChange={(e) => update("source", e.target.value)}
          className="appearance-none rounded-[9px] border border-[#E7ECEF] bg-white py-2 pl-3 pr-8 text-[13px] outline-none focus:border-primary"
        >
          <option value="">Source: All</option>
          {sources.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 h-4 w-4 text-[#8A9AA6]" />
      </div>
    </div>
  )
}
