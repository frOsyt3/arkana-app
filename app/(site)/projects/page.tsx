import { pageMetadata } from "@/lib/seo"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { CheckCircle2 } from "lucide-react"
import { ProjectsShowcase } from "@/components/projects-showcase"

export const metadata = pageMetadata({
  title: "Portofolio Proyek",
  description:
    "Portofolio website dan aplikasi web yang dikerjakan Arkana, dari website korporat hingga platform trade in dengan dashboard admin.",
  path: "/projects",
})

export default function ProjectsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <ProjectsShowcase />

      {/* Process Section */}
      <section className="py-24 md:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary">
              Proses Kerja Kami
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Metodologi yang teruji untuk menyelesaikan setiap proyek dengan baik
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Riset Kebutuhan", description: "Memahami kebutuhan dan tujuan Anda" },
              { step: "02", title: "Perencanaan", description: "Menyusun roadmap dan alokasi sumber daya" },
              { step: "03", title: "Eksekusi", description: "Implementasi dengan penjaminan mutu" },
              { step: "04", title: "Serah Terima", description: "Penyerahan hasil dan dukungan berkelanjutan" }
            ].map((phase, index) => (
              <Card key={index} className="relative border-2 border-border hover:border-primary/50 transition-all hover:shadow-xl bg-white">
                <CardHeader className="space-y-4">
                  <div className="text-6xl font-bold text-primary/20">{phase.step}</div>
                  <CardTitle className="text-xl text-secondary">{phase.title}</CardTitle>
                  <CardDescription className="text-gray-600">{phase.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
