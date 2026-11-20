import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { adminModules } from "@/lib/admin/modules"
import { AdminTopbar } from "@/components/admin/page-header"

export default async function UpcomingModulePage({ params }: { params: Promise<{ module: string }> }) {
  const { module: slug } = await params
  const mod = adminModules.find((m) => m.slug === slug && !m.ready)
  if (!mod) notFound()
  const Icon = mod.icon

  return (
    <>
      <AdminTopbar crumb={mod.label} />
      <div className="flex justify-center px-6 py-24">
        <div className="max-w-md text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <Icon className="h-6 w-6 text-primary-dark" strokeWidth={1.75} />
          </span>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-primary-dark">Next phase</p>
          <h1 className="mt-2 text-2xl font-bold">{mod.label}</h1>
          <p className="mt-3 leading-relaxed text-[#6B7C88]">{mod.summary}</p>
          <Link
            href="/admin/leads"
            className="mt-8 inline-flex items-center gap-2 rounded-[9px] border border-[#E7ECEF] bg-white px-4 py-2.5 text-sm font-bold text-secondary-dark transition hover:border-primary/40"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to leads
          </Link>
        </div>
      </div>
    </>
  )
}
