import { pageMetadata } from "@/lib/seo"
import Link from "next/link"
import { ArrowRight, BookOpen, Clock } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { InsightCard, InsightCover, formatArticleDate } from "@/components/insight-card"
import { listPublishedArticles } from "@/lib/articles"

export const metadata = pageMetadata({
  title: "Insight & Artikel",
  description:
    "Artikel praktis seputar pengadaan IT, e-Katalog, cloud, keamanan, dan infrastruktur untuk instansi, perusahaan, UMKM, dan sekolah di Indonesia.",
  path: "/insight",
})

export default async function InsightPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams
  const { articles, categories } = await listPublishedArticles(category || undefined)
  const total = categories.reduce((a, c) => a + c.total, 0)
  const [featured, ...rest] = category ? [undefined, ...articles] : articles

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-white">
        <div className="absolute right-0 top-20 h-96 w-96 animate-float rounded-full bg-primary/5 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:px-8 md:py-28 lg:px-12">
          <div className="mx-auto max-w-3xl space-y-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <BookOpen className="h-4 w-4" />
              Pusat Pengetahuan
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-secondary md:text-6xl">Insight & Artikel</h1>
            <p className="text-xl leading-relaxed text-gray-600">
              Catatan praktis dari tim kami seputar website, perangkat IT, cloud, keamanan, dan pengadaan.
            </p>
          </div>
        </div>
      </section>

      {total === 0 ? (
        <section className="py-20">
          <div className="mx-auto max-w-xl px-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <BookOpen className="h-6 w-6 text-primary-dark" />
            </div>
            <h2 className="mt-5 text-2xl font-bold text-secondary">Artikel pertama kami segera hadir</h2>
            <p className="mt-3 leading-relaxed text-gray-600">
              Kami sedang menyiapkan panduan seputar pengadaan melalui e-Katalog, migrasi cloud, dan IT perkantoran. Sementara
              itu, tim kami siap menjawab pertanyaan Anda secara langsung.
            </p>
            <Button asChild className="mt-7">
              <Link href="/contact">
                Hubungi Tim Kami <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      ) : (
        <>
          {featured && (
            <section className="bg-white pb-6 pt-14">
              <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
                <Link
                  href={`/insight/${featured.slug}`}
                  className="group grid overflow-hidden rounded-3xl border border-border bg-white transition hover:border-primary/40 hover:shadow-2xl hover:shadow-secondary/5 lg:grid-cols-2"
                >
                  <InsightCover src={featured.coverUrl} className="aspect-[1200/630] lg:aspect-auto lg:min-h-[360px]" />
                  <div className="flex flex-col justify-center gap-5 p-8 lg:p-12">
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <span className="rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary-dark">Terbaru</span>
                      <span>{featured.category}</span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" /> {featured.readingMinutes} menit baca
                      </span>
                    </div>
                    <h2 className="text-3xl font-bold leading-tight text-secondary transition group-hover:text-primary-dark md:text-4xl">
                      {featured.title}
                    </h2>
                    <p className="text-lg leading-relaxed text-gray-600">{featured.excerpt}</p>
                    <span className="flex items-center gap-2 font-semibold text-primary-dark">
                      Baca artikel
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    </span>
                    <span className="text-sm text-gray-500">{formatArticleDate(featured.publishedAt)}</span>
                  </div>
                </Link>
              </div>
            </section>
          )}

          {categories.length > 1 && (
            <section className="py-8">
              <div className="mx-auto flex max-w-7xl flex-wrap justify-center gap-2.5 px-6 sm:px-8 lg:px-12">
                <Link
                  href="/insight"
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                    !category ? "border-secondary bg-secondary text-white" : "border-border text-gray-600 hover:border-primary"
                  }`}
                >
                  Semua <span className="ml-1 opacity-70">{total}</span>
                </Link>
                {categories.map((c) => (
                  <Link
                    key={c.name}
                    href={`/insight?category=${encodeURIComponent(c.name)}`}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                      category === c.name ? "border-secondary bg-secondary text-white" : "border-border text-gray-600 hover:border-primary"
                    }`}
                  >
                    {c.name} <span className="ml-1 opacity-70">{c.total}</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section className={rest.length > 0 || category ? "bg-gradient-to-b from-white to-muted/30 pb-24 pt-6" : "pb-16"}>
            <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
              {rest.length > 0 ? (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {rest.map((a) => a && <InsightCard key={a.id} article={a} />)}
                </div>
              ) : (
                category && <p className="py-12 text-center text-gray-600">Belum ada artikel di kategori ini.</p>
              )}
            </div>
          </section>
        </>
      )}

      <section className="bg-secondary py-20">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 text-center">
          <h2 className="text-3xl font-bold text-white md:text-4xl">Punya kebutuhan teknologi?</h2>
          <p className="max-w-2xl text-lg text-white/75">
            Ceritakan kebutuhan Anda. Kami akan membalas dalam satu hari kerja dengan pilihan yang sesuai dengan anggaran Anda.
          </p>
          <Button asChild size="lg" className="bg-primary hover:bg-primary-dark">
            <Link href="/contact">
              Hubungi Tim Kami <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
