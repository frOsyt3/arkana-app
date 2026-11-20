"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { adminModules, moduleGroups } from "@/lib/admin/modules"
import { logout } from "@/app/admin/actions"

export function AdminSidebar({
  user,
  newLeads,
}: {
  user: { name: string; email: string }
  newLeads: number
}) {
  const pathname = usePathname()
  const initials = user.name
    .split(/\s+/)
    .map((p) => p.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-[#E7ECEF] bg-white lg:flex">
      <div className="flex items-center gap-3 px-5 pb-5 pt-5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/arkana-mark.svg" alt="" className="h-8 w-auto" />
        <div>
          <p className="text-[15px] font-bold leading-tight">Arkana</p>
          <p className="text-xs text-[#8A9AA6]">Admin console</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 pb-4">
        {moduleGroups.map((group) => (
          <div key={group} className="mt-4 first:mt-1">
            <p className="px-3 pb-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-[#A3B1BA]">{group}</p>
            {adminModules
              .filter((m) => m.group === group)
              .map((m) => {
                const active = m.href === "/admin" ? pathname === "/admin" : pathname.startsWith(m.href)
                const Icon = m.icon
                return (
                  <Link
                    key={m.href}
                    href={m.href}
                    className={cn(
                      "relative mb-0.5 flex h-[38px] items-center gap-3 rounded-[9px] px-3 text-sm transition-colors",
                      active
                        ? "bg-primary/10 font-bold text-secondary-dark"
                        : "text-[#4B5B66] hover:bg-[#F5F7F8] hover:text-[#1F3442]"
                    )}
                  >
                    {active && <span className="absolute left-0 top-2.5 h-5 w-[3px] rounded-full bg-primary-dark" />}
                    <Icon className={cn("h-[18px] w-[18px]", active ? "text-primary-dark" : "text-[#6B7C88]")} strokeWidth={1.75} />
                    <span className="flex-1">{m.label}</span>
                    {m.slug === "leads" && newLeads > 0 && (
                      <span className="rounded-full bg-primary-dark px-2 py-0.5 text-[11px] font-bold text-white">{newLeads}</span>
                    )}
                    {!m.ready && <span className="text-[10px] font-semibold uppercase tracking-wide text-[#A3B1BA]">Soon</span>}
                  </Link>
                )
              })}
          </div>
        ))}
      </nav>

      <div className="px-4 pb-3">
        <a
          href="/"
          target="_blank"
          className="block rounded-xl border border-[#E7ECEF] bg-[#F5F7F8] px-3.5 py-3 transition-colors hover:border-primary/40"
        >
          <span className="flex items-center gap-2 text-[13px] font-bold text-secondary-dark">
            <span className="h-2 w-2 rounded-full bg-green-500 ring-[3px] ring-green-500/25" />
            Website live
          </span>
          <span className="mt-1 block text-xs text-[#8A9AA6]">Open arkanacorp.id in a new tab</span>
        </a>
      </div>

      <div className="flex items-center gap-3 border-t border-[#E7ECEF] px-5 py-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-xs font-bold text-white">
          {initials}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-bold">{user.name}</p>
          <p className="truncate text-xs text-[#8A9AA6]">{user.email}</p>
        </div>
        <form action={logout}>
          <button title="Sign out" className="rounded-md p-1.5 text-[#8A9AA6] transition hover:bg-[#F5F7F8] hover:text-[#1F3442]">
            <LogOut className="h-4 w-4" />
          </button>
        </form>
      </div>
    </aside>
  )
}

export function MobileNav() {
  const pathname = usePathname()
  return (
    <nav className="flex gap-1 overflow-x-auto border-b border-[#E7ECEF] bg-white px-4 py-2 lg:hidden">
      {adminModules
        .filter((m) => m.ready)
        .map((m) => {
          const active = m.href === "/admin" ? pathname === "/admin" : pathname.startsWith(m.href)
          return (
            <Link
              key={m.href}
              href={m.href}
              className={cn(
                "flex items-center gap-1 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm",
                active ? "bg-primary/10 font-bold text-secondary-dark" : "text-[#4B5B66]"
              )}
            >
              {m.label}
            </Link>
          )
        })}
    </nav>
  )
}
