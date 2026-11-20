import Link from "next/link"
import { ArrowUpRight, ChevronRight } from "lucide-react"

export function AdminTopbar({ crumb }: { crumb: string }) {
  return (
    <div className="flex h-[68px] items-center justify-between border-b border-[#E7ECEF] px-6 lg:px-8">
      <p className="flex items-center gap-1.5 text-[13px]">
        <Link href="/admin" className="text-[#8A9AA6] hover:text-[#1F3442]">
          Dashboard
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-[#A3B1BA]" />
        <span className="font-bold text-secondary-dark">{crumb}</span>
      </p>
      <a
        href="/"
        target="_blank"
        className="flex items-center gap-2 rounded-[9px] border border-[#E7ECEF] bg-white px-3.5 py-2 text-[13px] font-bold text-secondary-dark transition hover:border-primary/40"
      >
        View website
        <ArrowUpRight className="h-3.5 w-3.5" />
      </a>
    </div>
  )
}

export function PageTitle({
  title,
  description,
  actions,
}: {
  title: string
  description: string
  actions?: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div>
        <h1 className="text-[28px] font-bold tracking-tight text-[#1F3442]">{title}</h1>
        <p className="mt-1 text-sm text-[#6B7C88]">{description}</p>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2.5">{actions}</div>}
    </div>
  )
}

export function Panel({
  title,
  description,
  action,
  children,
  className = "",
}: {
  title?: string
  description?: string
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={`rounded-[14px] border border-[#E7ECEF] bg-white ${className}`}>
      {title && (
        <div className="flex items-start justify-between gap-4 px-6 pt-5">
          <div>
            <h2 className="text-base font-bold text-[#1F3442]">{title}</h2>
            {description && <p className="mt-1 text-[13px] text-[#8A9AA6]">{description}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  )
}
