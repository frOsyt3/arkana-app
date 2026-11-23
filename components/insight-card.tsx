import Link from "next/link"
import { ArrowUpRight, Clock } from "lucide-react"

export interface InsightCardData {
  slug: string
  title: string
  excerpt: string
  coverUrl: string | null
  category: string
  publishedAt: Date | null
  readingMinutes: number
}

export function formatArticleDate(date: Date | null) {
  if (!date) return ""
  return new Intl.DateTimeFormat("id-ID", { timeZone: "Asia/Jakarta", day: "numeric", month: "long", year: "numeric" }).format(date)
}

export function InsightCover({ src, className = "" }: { src: string | null; className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-secondary-dark ${className}`}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
      ) : (
        <>
          <div className="absolute -right-10 -top-16 h-56 w-56 rounded-full bg-white/10" />
          <div className="absolute -bottom-20 right-10 h-48 w-48 rounded-full bg-white/[0.07]" />
        </>
      )}
    </div>
  )
}

export function InsightCard({ article }: { article: InsightCardData }) {
  return (
    <Link
      href={`/insight/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-white transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-secondary/5"
    >
      <InsightCover src={article.coverUrl} className="aspect-[1200/630]" />
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between gap-3 text-xs">
          <span className="rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary-dark">{article.category}</span>
          <span className="flex items-center gap-1 text-gray-500">
            <Clock className="h-3.5 w-3.5" /> {article.readingMinutes} menit baca
          </span>
        </div>
        <h3 className="mt-4 text-xl font-bold leading-snug text-secondary transition group-hover:text-primary-dark">{article.title}</h3>
        <p className="mt-2 line-clamp-3 text-[15px] leading-relaxed text-gray-600">{article.excerpt}</p>
        <div className="mt-auto flex items-center justify-between pt-6 text-sm text-gray-500">
          <span>{formatArticleDate(article.publishedAt)}</span>
          <ArrowUpRight className="h-4 w-4 text-primary-dark transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </div>
      </div>
    </Link>
  )
}
