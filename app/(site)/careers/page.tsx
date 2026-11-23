import { pageMetadata } from "@/lib/seo"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { Briefcase, MapPin, Clock, DollarSign, Users, Heart, TrendingUp, Zap, GraduationCap, Coffee, Trophy, Rocket } from "lucide-react"
import Link from "next/link"
import { companyInfo } from "@/lib/company-data"

export const metadata = pageMetadata({
  title: "Karier",
  description:
    "Bangun karier di bidang konsultasi IT, infrastruktur, dan pengembangan software bersama PT. Arkana Tunas Persada di Bandung.",
  path: "/careers",
})

const careerEmail = companyInfo.contact.email.general
const applyHref = (position: string) =>
  `mailto:${careerEmail}?subject=${encodeURIComponent(`Lamaran ${position}`)}`

export default function CareersPage() {
  const jobs = [
    {
      title: "Senior Cloud Architect",
      department: "Solusi Cloud",
      location: "Bandung, Indonesia",
      type: "Penuh waktu",
      experience: "Minimal 7 tahun"
    },
    {
      title: "Full Stack Developer",
      department: "Pengembangan Software",
      location: "Bandung, Indonesia",
      type: "Penuh waktu",
      experience: "Minimal 3 tahun"
    },
    {
      title: "DevOps Engineer",
      department: "Infrastruktur",
      location: "Bandung, Indonesia",
      type: "Penuh waktu",
      experience: "Minimal 4 tahun"
    },
    {
      title: "IT Consultant",
      department: "Konsultasi",
      location: "Bandung, Indonesia",
      type: "Penuh waktu",
      experience: "Minimal 5 tahun"
    },
    {
      title: "Data Engineer",
      department: "Data & Analitik",
      location: "Bandung, Indonesia",
      type: "Penuh waktu",
      experience: "Minimal 3 tahun"
    },
    {
      title: "Cybersecurity Specialist",
      department: "Keamanan Siber",
      location: "Bandung, Indonesia",
      type: "Penuh waktu",
      experience: "Minimal 4 tahun"
    }
  ]

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
              <a href="#lowongan">Lihat Lowongan</a>
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
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary">
              Lowongan Tersedia
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Temukan peluang berikutnya bersama kami
            </p>
          </div>

          <div className="space-y-4 max-w-4xl mx-auto">
            {jobs.map((job, index) => (
              <Card 
                key={index}
                className="border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl bg-white group"
              >
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <CardTitle className="text-2xl group-hover:text-primary transition-colors text-secondary">
                        {job.title}
                      </CardTitle>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4" />
                          {job.department}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {job.type}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                          {job.experience}
                        </span>
                      </div>
                    </div>
                    <Button className="w-full md:w-auto" asChild>
                      <a href={applyHref(job.title)}>Lamar Sekarang</a>
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              Belum menemukan posisi yang sesuai? Kami selalu terbuka untuk talenta terbaik.
            </p>
            <Button size="lg" variant="outline" asChild>
              <a href={applyHref("Umum")}>Kirim CV Anda</a>
            </Button>
          </div>
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
                <a href="#lowongan">Lihat Semua Lowongan</a>
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



