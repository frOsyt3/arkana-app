import { Navbar } from "@/components/navbar"

export interface LegalSection {
  title: string
  body: React.ReactNode
}

/** Shared layout for the privacy policy and terms pages. */
export function LegalPage({
  eyebrow,
  title,
  intro,
  updated,
  sections,
}: {
  eyebrow: string
  title: string
  intro: string
  updated: string
  sections: LegalSection[]
}) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <section className="bg-gradient-to-b from-primary/10 to-white">
        <div className="mx-auto max-w-3xl px-6 pb-12 pt-32 sm:px-8 md:pt-40">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">{eyebrow}</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-secondary md:text-5xl">{title}</h1>
          <p className="mt-4 text-lg leading-relaxed text-gray-600">{intro}</p>
          <p className="mt-4 text-sm text-gray-500">Terakhir diperbarui {updated}</p>
        </div>
      </section>
      <article className="mx-auto w-full max-w-3xl px-6 pb-24 sm:px-8">
        <ol className="space-y-10">
          {sections.map((s, i) => (
            <li key={s.title}>
              <h2 className="text-xl font-bold text-secondary">
                <span className="mr-2 text-primary">{i + 1}.</span>
                {s.title}
              </h2>
              <div className="mt-3 space-y-3 leading-relaxed text-gray-700 [&_li]:ml-5 [&_li]:list-disc [&_ul]:space-y-1.5">
                {s.body}
              </div>
            </li>
          ))}
        </ol>
      </article>
    </div>
  )
}
