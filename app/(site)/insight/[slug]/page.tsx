import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight, Clock, Eye } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { ArticleViewTracker } from "@/components/article-view-tracker"
import { InsightCard, formatArticleDate } from "@/components/insight-card"
import { getArticleBySlug, relatedArticles, sanitizeArticleHtml } from "@/lib/articles"
import { getCurrentUser } from "@/lib/auth"

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ preview?: string }> }

async function load({ params, searchParams }: Props) {
  const [{ slug }, { preview }] = await Promise.all([params, searchParams])
  const isPreview = preview === "1" && !!(await getCurrentUser())
  const row = await getArticleBySlug(slug, { includeDrafts: isPreview })
  return { row, isPreview }
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { row, isPreview } = await load(props)
  if (!row) return { title: "Article not found" }
  const a = row.article
  const title = a.metaTitle || a.title
  const description = a.metaDescription || a.excerpt
  return {
    title: a.metaTitle ? { absolute: a.metaTitle } : a.title,
    description,
    alternates: { canonical: `/insight/${a.slug}` },
    robots: isPreview ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "article",
      title,
      description,
      url: `/insight/${a.slug}`,
      siteName: "PT. Arkana Tunas Persada",
      locale: "en_US",
      publishedTime: a.publishedAt?.toISOString(),
      modifiedTime: a.updatedAt.toISOString(),
      section: a.category,
      tags: a.tags,
      images: a.coverUrl ? [{ url: a.coverUrl, width: 1200, height: 630 }] : undefined,
    },
    twitter: { card: a.coverUrl ? "summary_large_image" : "summary", title, description },
  }
}

export default async function ArticlePage(props: Props) {
  const { row, isPreview } = await load(props)
  if (!row) notFound()
  const { article: a, authorName } = row
  const related = await relatedArticles(a)
  const html = sanitizeArticleHtml(a.content)
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "https://arkanacorp.id"

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.metaDescription || a.excerpt,
    image: a.coverUrl ? [`${site}${a.coverUrl}`] : undefined,
    datePublished: a.publishedAt?.toISOString(),
    dateModified: a.updatedAt.toISOString(),
    author: { "@type": authorName ? "Person" : "Organization", name: authorName ?? "PT. Arkana Tunas Persada" },
    publisher: {
      "@type": "Organization",
      name: "PT. Arkana Tunas Persada",
      logo: { "@type": "ImageObject", url: `${site}/images/arkana-mark.svg` },
    },
    mainEntityOfPage: `${site}/insight/${a.slug}`,
    keywords: a.tags.join(", ") || undefined,
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      {!isPreview && <ArticleViewTracker articleId={a.id} />}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      {isPreview && a.status !== "published" && (
        <div className="border-b border-amber-200 bg-amber-50 px-6 py-2.5 text-center text-sm font-medium text-amber-800">
          <Eye className="mr-2 inline h-4 w-4" />
          Preview only. Visitors cannot see this article until it is published.
        </div>
      )}

      <article>
        <header className="bg-gradient-to-b from-primary/10 to-white">
          <div className="mx-auto max-w-3xl px-6 pb-10 pt-16 md:pt-20">
            <Link href="/insight" className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-primary-dark">
              <ArrowLeft className="h-4 w-4" /> All insights
            </Link>
            <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-gray-600">
              <Link
                href={`/insight?category=${encodeURIComponent(a.category)}`}
                className="rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary-dark hover:bg-primary/15"
              >
                {a.category}
              </Link>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" /> {a.readingMinutes} min read
              </span>
            </div>
            <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-secondary md:text-5xl">{a.title}</h1>
            {a.excerpt && <p className="mt-5 text-xl leading-relaxed text-gray-600">{a.excerpt}</p>}
            <div className="mt-8 flex items-center gap-3 text-sm">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-sm font-bold text-white">
                {(authorName ?? "Arkana").charAt(0)}
              </span>
              <div>
                <p className="font-semibold text-secondary">{authorName ?? "Arkana team"}</p>
                <p className="text-gray-500">{a.publishedAt ? formatArticleDate(a.publishedAt) : "Not published yet"}</p>
              </div>
            </div>
          </div>
        </header>

        {a.coverUrl && (
          <div className="mx-auto max-w-5xl px-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={a.coverUrl} alt={a.title} className="aspect-[1200/630] w-full rounded-3xl object-cover shadow-xl shadow-secondary/10" />
          </div>
        )}

        <div className="mx-auto max-w-3xl px-6 py-14">
          <div className="article-body" dangerouslySetInnerHTML={{ __html: html }} />

          {a.tags.length > 0 && (
            <div className="mt-12 flex flex-wrap gap-2 border-t border-[#E7ECEF] pt-8">
              {a.tags.map((t) => (
                <span key={t} className="rounded-full bg-[#F1F4F6] px-3 py-1 text-sm text-gray-600">
                  {t}
                </span>
              ))}
            </div>
          )}

          <div className="mt-12 rounded-2xl bg-secondary p-8 text-white md:p-10">
            <h2 className="text-2xl font-bold">Need help with this in your organisation?</h2>
            <p className="mt-3 text-white/75">
              Our team handles IT procurement, infrastructure, and software projects for companies and government agencies.
            </p>
            <Button asChild className="mt-6 bg-primary hover:bg-primary-dark">
              <Link href="/contact">
                Talk to our team <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="bg-[#F8FAFB] py-20">
          <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
            <h2 className="text-2xl font-bold text-secondary md:text-3xl">Keep reading</h2>
            <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <InsightCard key={r.id} article={r} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
