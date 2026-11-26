"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"

export function CopyButton({ text, label = "Copy link" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false)
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(text)
        setDone(true)
        setTimeout(() => setDone(false), 1800)
      }}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-[8px] border border-[#E7ECEF] bg-white px-2.5 py-1 text-xs font-bold transition hover:border-primary"
    >
      {done ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
      {done ? "Copied" : label}
    </button>
  )
}
