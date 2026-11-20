import type { ArticleStatus } from "@/lib/db/schema"
import { cn } from "@/lib/utils"

const META: Record<ArticleStatus, { label: string; badge: string; dot: string }> = {
  published: { label: "Published", badge: "bg-green-100 text-green-700", dot: "bg-green-600" },
  scheduled: { label: "Scheduled", badge: "bg-amber-100 text-amber-700", dot: "bg-amber-600" },
  draft: { label: "Draft", badge: "bg-slate-100 text-slate-500", dot: "bg-slate-400" },
}

export function ArticleStatusBadge({ status }: { status: ArticleStatus }) {
  const meta = META[status]
  return (
    <span className={cn("inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold", meta.badge)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", meta.dot)} />
      {meta.label}
    </span>
  )
}
