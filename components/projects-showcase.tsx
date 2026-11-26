"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { projectCategories, type Project } from "@/lib/projects-data"

type Filter = string

function BrowserDots({ size = "sm" }: { size?: "sm" | "md" }) {
  const dot = size === "md" ? "h-2.5 w-2.5" : "h-1.5 w-1.5"
  return (
    <div className="flex items-center gap-1">
      <span className={cn("rounded-full bg-[#FF5F57]", dot)} />
      <span className={cn("rounded-full bg-[#FEBC2E]", dot)} />
      <span className={cn("rounded-full bg-[#28C840]", dot)} />
    </div>
  )
}

function DashboardPreview() {
  const bars = [40, 60, 50, 78, 66, 90, 72, 94]
  return (
    <div className="flex h-full">
      <div className="w-16 space-y-3 bg-secondary-dark px-3 py-3.5">
        <div className="h-1.5 w-10 rounded bg-primary" />
        <div className="h-1 w-8 rounded bg-white/25" />
        <div className="h-1 w-9 rounded bg-white/25" />
        <div className="h-1 w-7 rounded bg-white/25" />
      </div>
      <div className="flex-1 space-y-2.5 p-3">
        <div className="grid grid-cols-3 gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={cn(
                "space-y-1.5 rounded-md p-2",
                i === 2 ? "bg-primary/10" : "bg-[#F4F8F9]"
              )}
            >
              <div className={cn("h-1 w-8 rounded", i === 2 ? "bg-primary-dark" : "bg-gray-400")} />
              <div className={cn("h-2 w-11 rounded", i === 2 ? "bg-primary-dark" : "bg-secondary")} />
            </div>
          ))}
        </div>
        <div className="flex h-28 items-end gap-2.5 rounded-md bg-gray-50 px-3 pb-2.5">
          {bars.map((h, i) => (
            <div
              key={i}
              style={{ height: `${h}%` }}
              className={cn(
                "flex-1 rounded-sm",
                i === 5 ? "bg-secondary" : i === 3 || i === 7 ? "bg-primary" : "bg-primary/50"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function PortalPreview() {
  return (
    <div className="h-full">
      <div className="flex items-center gap-1.5 px-3.5 py-2">
        <span className="h-3 w-3 rounded-full bg-primary-dark" />
        <span className="h-1.5 w-11 rounded bg-secondary" />
        <span className="ml-auto h-1 w-6 rounded bg-gray-400" />
        <span className="h-1 w-6 rounded bg-gray-400" />
        <span className="h-3 w-12 rounded-full bg-primary" />
      </div>
      <div className="space-y-1.5 bg-gradient-to-br from-secondary to-primary-dark px-5 py-5">
        <div className="h-2.5 w-36 rounded bg-white" />
        <div className="h-2.5 w-24 rounded bg-white" />
        <div className="!mt-3 h-3.5 w-44 rounded-full bg-white/90" />
      </div>
      <div className="grid grid-cols-3 gap-2 p-3.5">
        {[0, 1, 2].map((i) => (
          <div key={i} className="space-y-2.5 rounded-md bg-[#F4F8F9] p-2.5">
            <span className="block h-4 w-4 rounded-full bg-primary/25" />
            <span className="block h-1 w-12 rounded bg-secondary" />
          </div>
        ))}
      </div>
    </div>
  )
}

function TablePreview() {
  const rows = [
    ["w-20", "w-14", "bg-primary/20"],
    ["w-16", "w-16", "bg-[#FEBC2E]/30"],
    ["w-22", "w-12", "bg-primary/20"],
    ["w-14", "w-14", "bg-primary/20"],
  ]
  return (
    <div className="h-full space-y-2 p-3.5">
      <div className="flex items-center justify-between pb-1.5">
        <span className="h-2 w-24 rounded bg-secondary" />
        <span className="h-3.5 w-24 rounded-full border border-gray-200 bg-[#F4F8F9]" />
      </div>
      <div className="grid grid-cols-[1.4fr_1.2fr_0.8fr] items-center rounded bg-[#F4F8F9] px-2.5 py-2">
        <span className="h-1 w-10 rounded bg-gray-400" />
        <span className="h-1 w-10 rounded bg-gray-400" />
        <span className="h-1 w-10 rounded bg-gray-400" />
      </div>
      {rows.map(([a, b, badge], i) => (
        <div
          key={i}
          className="grid grid-cols-[1.4fr_1.2fr_0.8fr] items-center border-b border-gray-100 px-2.5 py-2 last:border-0"
        >
          <span className={cn("h-1 rounded bg-secondary", a)} />
          <span className={cn("h-1 rounded bg-gray-400", b)} />
          <span className={cn("h-3 w-12 rounded-full", badge)} />
        </div>
      ))}
    </div>
  )
}

const previews = {
  dashboard: DashboardPreview,
  portal: PortalPreview,
  table: TablePreview,
}

function CardThumbnail({ project }: { project: Project }) {
  // Without a screenshot, fall back to a drawn preview so the frame is never empty.
  const Preview = previews[project.thumbnail ?? "portal"]
  return (
    <div className="relative h-[220px] overflow-hidden bg-[#EAF4F5]">
      <div className="absolute inset-x-7 top-7 h-[230px] overflow-hidden rounded-[10px] bg-white shadow-[0_12px_28px_rgba(61,90,108,0.15)] transition-transform duration-500 group-hover:-translate-y-1.5">
        <div className="flex h-5 items-center bg-[#EEF2F4] px-2.5">
          <BrowserDots />
        </div>
        <div className="relative h-[210px]">
          {project.image ? (
            <Image
              src={project.image}
              alt={`Tampilan ${project.title}`}
              fill
              sizes="(min-width: 1024px) 320px, 90vw"
              className="object-cover object-left-top"
            />
          ) : (
            <Preview />
          )}
        </div>
      </div>
    </div>
  )
}

function ProjectCard({ project }: { project: Project }) {
  const body = (
    <>
      <CardThumbnail project={project} />
      <div className="flex flex-1 flex-col p-7">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-primary-dark">
          {project.category}
        </p>
        <h3 className="mt-2.5 text-[21px] font-bold leading-snug text-secondary">
          {project.title}
        </h3>
        <p className="mb-6 mt-3 text-[15px] leading-relaxed text-gray-600">{project.description}</p>
        <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
          <p className="text-[13px] text-gray-500">{project.tech.join("  ·  ")}</p>
          {project.url && (
            <ArrowUpRight className="h-5 w-5 text-primary-dark transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          )}
        </div>
      </div>
    </>
  )

  const className =
    "group flex flex-col overflow-hidden rounded-[20px] border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-secondary/5"

  return project.url ? (
    <a href={project.url} target="_blank" rel="noopener noreferrer" className={className}>
      {body}
    </a>
  ) : (
    <article className={className}>{body}</article>
  )
}

function FeaturedProject({ project }: { project: Project }) {
  const meta = [
    { label: "Sektor", value: project.sector },
    { label: "Tahun", value: project.year },
    { label: "Lingkup", value: project.scope },
  ]

  return (
    <article className="grid items-center gap-10 overflow-hidden rounded-[28px] border border-gray-200 bg-gradient-to-br from-[#F4F8F9] to-white p-6 sm:p-10 lg:grid-cols-[7fr_4fr] lg:gap-11">
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_24px_48px_rgba(61,90,108,0.18)]">
        <div className="relative flex h-10 items-center bg-[#EEF2F4] px-4">
          <BrowserDots size="md" />
          {project.domain && (
            <span className="absolute left-1/2 hidden w-60 -translate-x-1/2 rounded-full bg-white py-0.5 text-center text-[11px] text-gray-500 sm:block">
              {project.domain}
            </span>
          )}
        </div>
        <div className="relative aspect-[700/440]">
          {project.image && (
            <Image
              src={project.image}
              alt={`Halaman utama ${project.title}`}
              fill
              priority
              sizes="(min-width: 1024px) 700px, 100vw"
              className="object-cover object-top"
            />
          )}
        </div>
      </div>

      <div>
        <span className="inline-flex rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-primary-dark">
          Proyek unggulan
        </span>
        <h3 className="mt-4 text-3xl font-bold leading-tight text-secondary md:text-[34px]">
          {project.title}
        </h3>
        <p className="mt-4 leading-relaxed text-gray-600">{project.description}</p>

        <dl className="mt-7 space-y-3 border-t border-gray-200 pt-5 text-sm">
          {meta.map((item) => (
            <div key={item.label} className="grid grid-cols-[116px_1fr] gap-2">
              <dt className="text-gray-500">{item.label}</dt>
              <dd className="font-semibold text-secondary">{item.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 flex flex-wrap gap-2">
          {project.tech.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[13px] text-secondary"
            >
              {tech}
            </span>
          ))}
        </div>

        {project.url ? (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-7 inline-flex items-center gap-2 font-bold text-primary-dark"
          >
            Kunjungi website
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        ) : (
          <Link
            href="/contact"
            className="group mt-7 inline-flex items-center gap-2 font-bold text-primary-dark"
          >
            Diskusikan proyek serupa
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        )}
      </div>
    </article>
  )
}

export function ProjectsShowcase({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Filter>("Semua")
  const used = Array.from(new Set(projects.map((p) => p.category)))
  const known: string[] = projectCategories.filter((c) => used.includes(c))
  const filters: Filter[] = ["Semua", ...known, ...used.filter((c) => !known.includes(c))]

  const inFilter = projects.filter((p) => filter === "Semua" || p.category === filter)
  const featured = inFilter.filter((p) => p.featured)
  const gridProjects = inFilter.filter((p) => !p.featured)

  return (
    <section className="relative overflow-hidden bg-white pb-24 pt-32 md:pb-32 md:pt-40">
      <div className="pointer-events-none absolute -right-40 -top-56 h-[640px] w-[640px] rounded-full bg-primary/[0.06]" />

      <div className="relative mx-auto max-w-[1200px] px-6 sm:px-8 xl:px-0">
        {/* Header */}
        <div className="grid gap-6 lg:grid-cols-[640px_1fr] lg:gap-20">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Portofolio</p>
            <h1 className="mt-4 text-4xl font-bold leading-[1.15] tracking-tight text-secondary md:text-[52px]">
              Proyek pilihan yang telah kami kerjakan
            </h1>
          </div>
          <p className="text-lg leading-relaxed text-gray-600 lg:pt-11">
            Website, aplikasi web, dan dashboard untuk klien pemerintah dan perusahaan. Setiap
            proyek kami tangani mulai dari riset dan desain hingga peluncuran serta dukungan
            berkelanjutan.
          </p>
        </div>

        {/* Filters */}
        <div className="mt-12 flex flex-wrap gap-2.5" role="group" aria-label="Filter proyek">
          {filters.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={filter === item}
              onClick={() => setFilter(item)}
              className={cn(
                "rounded-full border px-5 py-2.5 text-sm transition-colors",
                filter === item
                  ? "border-secondary bg-secondary font-bold text-white"
                  : "border-gray-200 bg-white text-secondary hover:border-primary hover:text-primary-dark"
              )}
            >
              {item === "Semua" ? "Semua proyek" : item}
            </button>
          ))}
        </div>

        {/* Featured */}
        {featured.length > 0 && (
          <div className="mt-10 space-y-10">
            {featured.map((project) => (
              <FeaturedProject key={project.slug} project={project} />
            ))}
          </div>
        )}

        {/* Grid */}
        {gridProjects.length > 0 && (
          <div className="mt-10 grid gap-9 md:grid-cols-2 lg:grid-cols-3">
            {gridProjects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        )}
        {inFilter.length === 0 && (
          <p className="mt-10 rounded-[20px] border border-dashed border-gray-200 p-10 text-center text-gray-500">
            Proyek di kategori ini akan segera ditampilkan.
          </p>
        )}

        {/* CTA */}
        <div className="relative mt-16 overflow-hidden rounded-3xl bg-gradient-to-br from-secondary-dark to-secondary px-8 py-9 sm:px-14">
          <div className="pointer-events-none absolute -right-20 -top-32 h-80 w-80 rounded-full bg-primary/[0.12]" />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white md:text-[28px]">Punya rencana proyek?</h2>
              <p className="mt-2 text-white/70">
                Ceritakan kebutuhan Anda, tim kami akan menyiapkan proposal yang sesuai.
              </p>
            </div>
            <Button asChild size="lg" className="h-13 shrink-0 rounded-[10px] px-7 text-base font-bold">
              <Link href="/contact">
                Jadwalkan Konsultasi
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
