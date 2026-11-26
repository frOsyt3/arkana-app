import { pageMetadata } from "@/lib/seo"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { ArrowRight, Briefcase, Clock, DollarSign, MapPin, Users, Heart, TrendingUp, Zap, GraduationCap, Coffee, Trophy, Rocket } from "lucide-react"
import Link from "next/link"
import { getOpenJobs } from "@/lib/careers"

export const metadata = pageMetadata({
  title: "Karier",
  description:
    "Bangun karier di bidang konsultasi IT, infrastruktur, dan pengembangan software bersama PT. Arkana Tunas Persada di Bandung.",
  path: "/careers",
})

export default async function CareersPage() {
  const jobs = await getOpenJobs()

  const benefits = [
    {
      icon: Heart,
      title: "Kesehatan & Kesejahteraan",
      description: "Asuransi kesehatan yang menyeluruh untuk Anda dan keluarga"
    },
    {
      icon: TrendingUp,
      title: "Pengembangan Karier",
      description: "Jenjang karier yang jelas dengan pelatihan dan pengembangan rutin"
    },
    {
      icon: Coffee,
      title: "Keseimbangan Kerja",
      description: "Jam kerja fleksibel dan opsi kerja jarak jauh"
    },
    {
      icon: DollarSign,
      title: "Gaji Kompetitif",
      description: "Kompensasi yang bersaing serta bonus berbasis kinerja"
    },
    {
      icon: GraduationCap,
      title: "Pelatihan & Sertifikasi",
      description: "Anggaran tahunan untuk sertifikasi dan kursus AWS, Azure, dan Google Cloud"
    },
    {
      icon: Trophy,
      title: "Apresiasi",
      description: "Program penghargaan dan apresiasi bagi karyawan"
    }
  ]

  const values = [
    {
      icon: Users,
      title: "Budaya Teknologi",
      description: "Bekerja dengan teknologi terkini dan praktik pengembangan modern"
    },
    {
      icon: Zap,
      title: "Berorientasi Inovasi",
      description: "Didorong untuk bereksperimen dengan teknologi dan metodologi baru"
    },
    {
      icon: Rocket,
      title: "Belajar Tanpa Henti",
      description: "Akses ke konferensi, sertifikasi, dan program pelatihan"
    }
  ]

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-white">
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" style={{ animationDelay: '3s' }} />
        
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 relative py-24 md:py-32">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Briefcase className="w-4 h-4" />
              Bergabung Bersama Kami
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-secondary">
              Bangun Karier Anda
              <span className="block text-primary mt-2">Bersama Arkana</span>
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              Bergabunglah dengan tim ahli teknologi, inovator, dan pemecah masalah yang turut
              membentuk masa depan konsultasi IT di Indonesia.
            </p>

            <Button size="lg" className="mt-4" asChild>
              <a href="#lowongan">Info Lowongan</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-24 md:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary">
              Mengapa Berkarier di Arkana?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Kami membangun lingkungan kerja tempat setiap talenta dapat berkembang
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <Card 
                  key={index}
                  className="border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-white text-center"
                >
                  <CardHeader className="space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mx-auto shadow-lg shadow-primary/20">
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <CardTitle className="text-2xl text-secondary">{value.title}</CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      {value.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 md:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary">
              Benefit & Fasilitas
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Kami memperhatikan kesejahteraan tim melalui benefit yang lengkap
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <Card key={index} className="border-2 border-border hover:border-primary/50 transition-all hover:shadow-lg bg-white">
                  <CardHeader className="space-y-4">
                    <Icon className="w-10 h-10 text-primary" />
                    <CardTitle className="text-xl text-secondary">{benefit.title}</CardTitle>
                    <CardDescription className="text-base">
                      {benefit.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section id="lowongan" className="scroll-mt-24 py-24 md:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          {jobs.length > 0 ? (
            <>
              <div className="mb-12 space-y-4 text-center">
                <h2 className="text-4xl font-bold text-secondary md:text-5xl">Posisi yang Sedang Dibuka</h2>
                <p className="mx-auto max-w-2xl text-lg text-gray-600">Pilih posisi yang sesuai lalu kirim lamaran Anda langsung dari halaman ini</p>
              </div>
              <div className="mx-auto grid max-w-5xl gap-5">
                {jobs.map((job) => (
                  <Link
                    key={job.id}
                    href={`/careers/${job.slug}`}
                    className="group flex flex-col gap-4 rounded-2xl border-2 border-border bg-white p-6 transition-all hover:border-primary/50 hover:shadow-lg md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      {job.department && <p className="text-xs font-bold uppercase tracking-[0.12em] text-primary">{job.department}</p>}
                      <h3 className="mt-1 text-xl font-bold text-secondary">{job.title}</h3>
                      <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600">
                        <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" />{job.location}</span>
                        <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" />{job.employmentType}, {job.workMode}</span>
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-2 font-bold text-primary">
                      Lihat dan lamar <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                ))}
              </div>
              <p className="mt-8 text-center text-gray-600">
                Tidak menemukan posisi yang cocok?{" "}
                <Link href="/careers/kirim-cv" className="font-bold text-primary hover:underline">Kirim CV Anda</Link>
              </p>
            </>
          ) : (
        <Card className="mx-auto max-w-3xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-white text-center shadow-xl">
              <CardHeader className="items-center space-y-5 px-8 pb-4 pt-12">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/20">
                  <Briefcase className="h-8 w-8 text-white" />
                </div>
                <span className="mx-auto inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
                  <Clock className="h-4 w-4" />
                  Segera Dibuka
                </span>
                <CardTitle className="text-3xl text-secondary md:text-4xl">Lowongan akan segera kami buka</CardTitle>
                <CardDescription className="mx-auto max-w-xl text-lg leading-relaxed">
                  Saat ini kami belum membuka posisi baru. Anda tetap dapat mengirimkan CV sekarang, dan kami
                  akan menghubungi Anda ketika ada posisi yang sesuai.
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-12">
                <Button size="lg" asChild>
                  <Link href="/careers/kirim-cv">Kirim CV Anda</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <Card className="max-w-4xl mx-auto border-2 border-primary/20 shadow-2xl bg-white">
            <CardHeader className="text-center space-y-4 pb-8">
              <CardTitle className="text-3xl md:text-4xl text-secondary text-secondary">
                Siap Bergabung dengan Tim Kami?
              </CardTitle>
              <CardDescription className="text-lg">
                Ambil langkah pertama menuju karier yang menantang bersama Arkana
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4 justify-center pb-8">
              <Button size="lg" asChild>
                <Link href="/careers/kirim-cv">Kirim CV Anda</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/about">Kenali Arkana Lebih Dekat</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}



