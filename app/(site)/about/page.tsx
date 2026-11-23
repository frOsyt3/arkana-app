import { pageMetadata } from "@/lib/seo"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { Target, Award, TrendingUp, Globe, Heart, Shield, Zap, Calendar, MapPin } from "lucide-react"
import Link from "next/link"
import { companyInfo } from "@/lib/company-data"

export const metadata = pageMetadata({
  title: "Tentang Kami",
  description:
    "Kenali PT. Arkana Tunas Persada, perusahaan solusi IT dan pengadaan barang di Bandung yang melayani instansi pemerintah dan perusahaan di seluruh Indonesia.",
  path: "/about",
})

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-white">
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />

        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 relative py-24 md:py-32">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Award className="w-4 h-4" />
              Tentang Kami
            </div>

            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-secondary">
              Tentang Arkana
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed">
              PT. Arkana Tunas Persada adalah perusahaan konsultan dan solusi IT yang berfokus pada transformasi
              digital, cloud, infrastruktur, serta pengadaan barang IT untuk instansi pemerintah dan perusahaan.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 md:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
            <Card className="border-2 border-primary/20 shadow-xl hover:shadow-2xl transition-shadow duration-300 bg-gradient-to-br from-white to-primary/5">
              <CardHeader className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20">
                  <Target className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-3xl text-secondary">Misi Kami</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {companyInfo.mission}
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-secondary/20 shadow-xl hover:shadow-2xl transition-shadow duration-300 bg-gradient-to-br from-white to-secondary/5">
              <CardHeader className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center shadow-lg shadow-secondary/20">
                  <Globe className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-3xl text-secondary">Visi Kami</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {companyInfo.vision}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 md:py-32 bg-gradient-to-b from-muted/30 to-white">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary">
              Nilai Utama Kami
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Prinsip yang menjadi pegangan kami dalam setiap pekerjaan
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="group border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-white text-center">
              <CardHeader className="space-y-4 pb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">
                  <Award className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl text-secondary">Keunggulan Teknis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Menguasai teknologi terkini untuk menghadirkan solusi terbaik
                </p>
              </CardContent>
            </Card>

            <Card className="group border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-white text-center">
              <CardHeader className="space-y-4 pb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">
                  <Zap className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl text-secondary">Inovasi Digital</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Merintis solusi dan strategi teknologi generasi berikutnya
                </p>
              </CardContent>
            </Card>

            <Card className="group border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-white text-center">
              <CardHeader className="space-y-4 pb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">
                  <Shield className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl text-secondary">Integritas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Menjunjung transparansi dan etika dalam setiap tindakan
                </p>
              </CardContent>
            </Card>

            <Card className="group border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-white text-center">
              <CardHeader className="space-y-4 pb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">
                  <Heart className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl text-secondary">Kemitraan dengan Klien</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Merancang solusi bersama yang selaras dengan tujuan organisasi
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Stats */}
      <section className="py-24 md:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary">
              Arkana dalam Angka
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Gambaran singkat perjalanan kami sejauh ini
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-white text-center p-8 hover:shadow-xl transition-shadow">
              <div className="mb-4">
                <TrendingUp className="w-12 h-12 text-primary mx-auto" />
              </div>
              <div className="text-5xl font-bold text-secondary mb-2">5+</div>
              <div className="text-lg text-gray-600">Website Selesai</div>
            </Card>

            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-white text-center p-8 hover:shadow-xl transition-shadow">
              <div className="mb-4">
                <Shield className="w-12 h-12 text-primary mx-auto" />
              </div>
              <div className="text-5xl font-bold text-secondary mb-2">4</div>
              <div className="text-lg text-gray-600">Platform Pengadaan Resmi</div>
            </Card>

            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-white text-center p-8 hover:shadow-xl transition-shadow">
              <div className="mb-4">
                <Calendar className="w-12 h-12 text-primary mx-auto" />
              </div>
              <div className="text-5xl font-bold text-secondary mb-2">2026</div>
              <div className="text-lg text-gray-600">Tahun Berdiri</div>
            </Card>

            <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-white text-center p-8 hover:shadow-xl transition-shadow">
              <div className="mb-4">
                <MapPin className="w-12 h-12 text-primary mx-auto" />
              </div>
              <div className="text-5xl font-bold text-secondary mb-2">Bandung</div>
              <div className="text-lg text-gray-600">Kantor Pusat</div>
            </Card>
          </div>
        </div>
      </section>

      {/* Company History Timeline */}
      <section className="py-24 md:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary">
              Perjalanan Kami
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Langkah awal yang membentuk Arkana
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-primary/20 hidden lg:block" />

            <div className="space-y-12">
              {companyInfo.companyHistory.map((milestone, index) => (
                <div
                  key={index}
                  className={`flex flex-col lg:flex-row gap-8 items-center ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                    }`}
                >
                  {/* Content */}
                  <div className={`flex-1 ${index % 2 === 0 ? 'lg:text-right' : 'lg:text-left'}`}>
                    <Card className="border-2 border-primary/20 hover:shadow-xl transition-all bg-white">
                      <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                          <Calendar className="w-5 h-5 text-primary" />
                          <span className="text-sm font-medium text-primary">{milestone.year}</span>
                        </div>
                        <CardTitle className="text-2xl text-secondary">{milestone.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600">{milestone.description}</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Timeline Dot */}
                  <div className="relative flex-shrink-0 hidden lg:block">
                    <div className="w-6 h-6 rounded-full bg-primary border-4 border-white shadow-lg" />
                  </div>

                  {/* Spacer */}
                  <div className="flex-1 hidden lg:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 bg-gradient-to-b from-muted/30 to-white">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <Card className="max-w-4xl mx-auto border-2 border-primary/20 shadow-2xl bg-white">
            <CardHeader className="text-center space-y-4 pb-8">
              <CardTitle className="text-3xl md:text-4xl text-secondary">
                Tumbuh Bersama Kami
              </CardTitle>
              <CardDescription className="text-lg">
                Temukan bagaimana Arkana dapat membantu mewujudkan rencana Anda
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4 justify-center pb-8">
              <Button size="lg" asChild>
                <Link href="/contact">Hubungi Kami</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/projects">Lihat Proyek Kami</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}




