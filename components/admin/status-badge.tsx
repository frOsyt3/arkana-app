import { STATUS_META } from "@/lib/admin/format"
import type { LeadStatus } from "@/lib/db/schema"
import { cn } from "@/lib/utils"

export function StatusBadge({ status }: { status: LeadStatus }) {
  const meta = STATUS_META[status]
  return (
    <span className={cn("inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold", meta.badge)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", meta.dot)} />
      {meta.label}
    </span>
  )
}
