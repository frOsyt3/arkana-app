"use client"

import { useTransition } from "react"
import { ChevronDown, Loader2 } from "lucide-react"
import { updateApplicationStatus } from "./actions"

const OPTIONS = [
  ["new", "New"],
  ["review", "Reviewing"],
  ["interview", "Interview"],
  ["offer", "Offer"],
  ["hired", "Hired"],
  ["rejected", "Not a fit"],
]

export function ApplicationStatusSelect({ id, status }: { id: string; status: string }) {
  const [pending, start] = useTransition()
  return (
    <form action={(fd) => start(() => updateApplicationStatus(fd))} onChange={(e) => e.currentTarget.requestSubmit()} className="relative h-fit">
      <input type="hidden" name="id" value={id} />
      <select
        name="status"
        defaultValue={status}
        disabled={pending}
        aria-label="Applicant status"
        className="w-full appearance-none rounded-[9px] border border-[#E7ECEF] bg-white py-2 pl-3 pr-8 text-[13px] font-bold outline-none focus:border-primary"
      >
        {OPTIONS.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
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
