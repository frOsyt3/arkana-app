"use client"

import { useFormStatus } from "react-dom"
import { CheckCircle2, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export const inputClass =
  "w-full rounded-[9px] border border-[#E7ECEF] bg-white px-3 py-2 text-[13px] outline-none transition placeholder:text-[#A3B1BA] focus:border-primary focus:ring-4 focus:ring-primary/15 disabled:bg-[#F5F7F8]"

export type FormState = { ok?: boolean; error?: string; message?: string }

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string
  hint?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <label className={cn("block space-y-1.5", className)}>
      <span className="text-[13px] font-bold text-[#1F3442]">{label}</span>
      {children}
      {hint && <span className="block text-xs text-[#8A9AA6]">{hint}</span>}
    </label>
  )
}

export function SubmitButton({ children, className }: { children: React.ReactNode; className?: string }) {
  const { pending } = useFormStatus()
  return (
    <button
      disabled={pending}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-[9px] bg-primary-dark px-4 py-2 text-[13px] font-bold text-white transition hover:bg-secondary disabled:opacity-60",
        className
      )}
    >
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  )
}

export function FormMessage({ state }: { state: FormState }) {
  if (state.error)
    return (
      <p role="alert" className="rounded-[9px] border border-red-200 bg-red-50 px-3 py-2 text-[13px] text-red-700">
        {state.error}
      </p>
    )
  if (state.ok && state.message)
    return (
      <p role="status" className="flex items-center gap-2 rounded-[9px] border border-green-200 bg-green-50 px-3 py-2 text-[13px] text-green-700">
        <CheckCircle2 className="h-4 w-4" />
        {state.message}
      </p>
    )
  return null
}

export const btnSecondary =
  "inline-flex items-center gap-2 rounded-[9px] border border-[#E7ECEF] bg-white px-4 py-2 text-[13px] font-bold text-secondary-dark transition hover:border-primary"
export const btnPrimary =
  "inline-flex items-center gap-2 rounded-[9px] bg-primary-dark px-4 py-2 text-[13px] font-bold text-white transition hover:bg-secondary"
