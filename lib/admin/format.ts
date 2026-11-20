import type { LeadStatus } from "@/lib/db/schema"

const TZ = "Asia/Jakarta"

export function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ,
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

export function formatShortDate(date: Date | string) {
  const d = typeof date === "string" ? new Date(`${date}T00:00:00+07:00`) : date
  return new Intl.DateTimeFormat("en-US", { timeZone: TZ, month: "short", day: "numeric" }).format(d)
}

/** "Just now", "2h ago", "Yesterday", or a short date. */
export function formatRelative(date: Date, now = new Date()) {
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return "Just now"
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  if (hours < 48) return "Yesterday"
  return formatShortDate(date)
}

export function initials(first: string, last: string) {
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase()
}

export const STATUS_META: Record<LeadStatus, { label: string; badge: string; dot: string }> = {
  new: { label: "New", badge: "bg-primary/12 text-[#2F7F81]", dot: "bg-primary-dark" },
  contacted: { label: "Contacted", badge: "bg-blue-100 text-blue-700", dot: "bg-blue-600" },
  proposal: { label: "Proposal", badge: "bg-amber-100 text-amber-700", dot: "bg-amber-600" },
  won: { label: "Won", badge: "bg-green-100 text-green-700", dot: "bg-green-600" },
  lost: { label: "Lost", badge: "bg-slate-100 text-slate-500", dot: "bg-slate-400" },
}

const AVATAR_TONES = [
  "bg-primary/15 text-[#2F7F81]",
  "bg-secondary/12 text-secondary",
  "bg-amber-100 text-amber-700",
  "bg-blue-100 text-blue-700",
  "bg-green-100 text-green-700",
]

/** Stable avatar colour per person. */
export function avatarTone(seed: string) {
  let hash = 0
  for (const ch of seed) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0
  return AVATAR_TONES[hash % AVATAR_TONES.length]
}

export function percentChange(current: number, previous: number) {
  if (previous === 0) return current > 0 ? null : 0
  return ((current - previous) / previous) * 100
}
