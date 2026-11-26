import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Briefcase, CheckCircle2, Clock, MapPin } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { ApplyForm } from "@/components/apply-form"
import { getOpenJob, getOpenJobs, lines } from "@/lib/careers"
import { pageMetadata } from "@/lib/seo"

export async function generateStaticParams() {
  return (await getOpenJobs()).map((j) => ({ slug: j.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const job = await getOpenJob((await params).slug)
  if (!job) return {}
  return pageMetadata({
    title: `Lowongan ${job.title}`,
    description: job.summary.slice(0, 160),
    path: `/careers/${job.slug}`,
  })
}

function List({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null
  return (
    <div>
      <h2 className="text-xl font-bold text-secondary">{title}</h2>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-gray-700">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default async function JobPage({ params }: { params: Promise<{ slug: string }> }) {
  const job = await getOpenJob((await params).slug)
  if (!job) notFound()

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <section className="bg-gradient-to-b from-primary/10 to-white">
        <div className="mx-auto max-w-5xl px-6 pb-14 pt-32 sm:px-8 md:pt-40">
          <Link href="/careers#lowongan" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" /> Semua lowongan
          </Link>
          {job.department && <p className="mt-6 text-sm font-bold uppercase tracking-[0.16em] text-primary">{job.department}</p>}
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-secondary md:text-5xl">{job.title}</h1>
          <p className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-gray-600">
            <span className="inline-flex items-center gap-2"><MapPin className="h-5 w-5 text-primary" />{job.location}</span>
            <span className="inline-flex items-center gap-2"><Briefcase className="h-5 w-5 text-primary" />{job.employmentType}</span>
            <span className="inline-flex items-center gap-2"><Clock className="h-5 w-5 text-primary" />{job.workMode}</span>
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto grid max-w-5xl gap-12 px-6 sm:px-8 lg:grid-cols-[1fr_420px]">
          <div className="space-y-10">
            <p className="whitespace-pre-line text-lg leading-relaxed text-gray-700">{job.summary}</p>
            <List title="Tanggung jawab" items={lines(job.responsibilities)} />
            <List title="Kualifikasi" items={lines(job.requirements)} />
          </div>
          <div id="lamar" className="h-fit rounded-2xl border-2 border-primary/20 bg-white p-6 shadow-xl lg:sticky lg:top-28">
            <h2 className="mb-5 text-2xl font-bold text-secondary">Lamar posisi ini</h2>
            <ApplyForm jobId={job.id} position={job.title} />
          </div>
        </div>
      </section>
    </div>
  )
}
