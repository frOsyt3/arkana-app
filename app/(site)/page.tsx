"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { Building2, Users, Lightbulb, ArrowRight, CheckCircle2, Code, BadgeCheck, Download, MapPin } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { companyInfo } from "@/lib/company-data"
import { motion } from "framer-motion"
import { FadeInWhenVisible } from "@/components/animations"
import { serviceIcons } from "@/components/service-icons"
import { InfiniteSlider } from "@/components/ui/infinite-slider"

const companyProfilePdf = "/files/company-profile-pt-arkana-tunas-persada.pdf"

// Procurement platforms Arkana is registered on (logos live in public/images/platforms).
// logoClass/miniClass set each logo's height (card / hero row) so wide, square, and tall marks look the same size.
const procurementPlatforms = [
  {
    name: "e-Katalog",
    detail: "Katalog elektronik LKPP",
    logo: "/images/platforms/e-katalog.png",
    width: 512,
    height: 151,
    logoClass: "h-11 sm:h-12",
    miniClass: "h-6",
  },
  {
    name: "INAPROC",
    detail: "Portal pengadaan nasional",
    logo: "/images/platforms/inaproc.png",
    width: 252,
    height: 252,
    logoClass: "h-16 sm:h-20",
    miniClass: "h-8",
  },
  {
    name: "LPSE",
    detail: "Layanan pengadaan secara elektronik",
    logo: "/images/platforms/lpse.png",
    width: 287,
    height: 117,
    logoClass: "h-14 sm:h-16",
    miniClass: "h-7",
  },
  {
    name: "Digipay",
    detail: "Marketplace pemerintah Kemenkeu",
    logo: "/images/platforms/digipay.png",
    width: 312,
    height: 453,
    logoClass: "h-20 sm:h-24",
    miniClass: "h-10",
  },
]

const procurementCommitments = [
  "Proses transparan dan terdokumentasi",
  "Barang sesuai spesifikasi yang Anda minta",
  "Pengiriman tepat waktu dan layanan purna jual",
]

// Real client logos. Add new entries here (logos live in public/images/clients).
const trustedClients = [
  {
    name: "Kementerian Keuangan, Direktorat Jenderal Pajak (DJP)",
    logo: "/images/clients/kemenkeu-djp.png",
    width: 569,
    height: 209,
  },
]

// The slider needs enough items to fill its width; repeat the list until it does.
const sliderClients = Array.from(
  { length: Math.max(1, Math.ceil(6 / trustedClients.length)) },
  () => trustedClients
).flat()

const advantages = [
  {
    title: "Solusi Sesuai Kebutuhan",
    description: "Setiap klien memiliki kebutuhan yang berbeda. Kami merancang solusi IT khusus untuk Anda agar tepat sasaran, efektif, dan memberi nilai nyata bagi organisasi.",
  },
  {
    title: "Inovasi Berkelanjutan",
    description: "Kami terus mengikuti perkembangan teknologi serta menerapkan metode dan perangkat terkini agar setiap solusi tetap relevan, efisien, dan kompetitif.",
  },
  {
    title: "Kualitas Produk & Layanan",
    description: "Perencanaan, implementasi, dan pengujian yang terstruktur memastikan setiap produk dan layanan memenuhi standar kualitas dan keandalan yang tinggi.",
  },
  {
    title: "Layanan Pelanggan Profesional",
    description: "Dukungan yang responsif dan komunikatif, sejak konsultasi pertama hingga layanan purna jual.",
  },
]

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white">
        {/* Decorative elements */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" style={{ animationDelay: '3s' }} />

        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 relative pt-32 pb-16 lg:pb-12">
          <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_1fr] xl:gap-20">
            {/* Left content */}
            <motion.div
              className="space-y-8 max-w-xl"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.p
                className="text-sm font-semibold uppercase tracking-[0.2em] text-primary"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                PT. Arkana Tunas Persada
              </motion.p>

              <motion.h1
                className="text-4xl font-bold leading-[1.1] tracking-tight text-secondary md:text-5xl xl:text-[3.5rem]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                Mitra Solusi IT &amp; <span className="text-primary">Pengadaan Barang</span> untuk Pemerintah dan Perusahaan
              </motion.h1>

              <motion.p
                className="text-lg text-gray-600 max-w-xl leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                Konsultasi, pengembangan software, infrastruktur IT, dan pengadaan barang melalui platform resmi. Kami
                mendampingi Anda sejak perencanaan dan implementasi hingga layanan purna jual, untuk sektor pemerintah maupun swasta di seluruh Indonesia.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <Button size="lg" className="group" asChild>
                  <Link href="/contact">
                    Jadwalkan Konsultasi
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="border-2 border-secondary bg-transparent text-secondary shadow-none hover:border-secondary hover:bg-secondary hover:text-white"
                >
                  <a href={companyProfilePdf} download>
                    <Download className="mr-2 h-5 w-5" />
                    Unduh Company Profile
                  </a>
                </Button>
              </motion.div>

              {/* Registered platforms */}
              <motion.div
                className="border-t border-slate-200 pt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                  Terdaftar di
                </p>
                <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                  {procurementPlatforms.map((platform) => (
                    <Image
                      key={platform.name}
                      src={platform.logo}
                      alt={platform.name}
                      width={platform.width}
                      height={platform.height}
                      className={`${platform.miniClass} w-auto opacity-60 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0`}
                    />
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Right visual element */}
            <motion.div
              className="relative hidden lg:block"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
            >
              <div className="relative">
                {/* Accent block behind the photo */}
                <div className="absolute -top-6 -right-6 w-2/3 h-2/3 rounded-3xl bg-gradient-to-br from-primary/25 to-secondary/10" />

                <div className="relative aspect-square overflow-hidden rounded-3xl shadow-2xl shadow-secondary/20 ring-1 ring-black/5">
                  <Image
                    src="/images/hero-team.jpg"
                    alt="Tim Arkana mengerjakan proyek infrastruktur IT dan software"
                    fill
                    priority
                    sizes="(min-width: 1024px) 45vw, 100vw"
                    className="object-cover object-[60%_center]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary/40 via-transparent to-transparent" />
                </div>

                {/* Floating location card */}
                <div className="absolute -bottom-8 -left-8 rounded-2xl bg-white p-5 shadow-xl shadow-secondary/10 ring-1 ring-black/5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-secondary">Berbasis di Bandung, Indonesia</p>
                      <p className="text-xs text-gray-500">Melayani klien di seluruh Indonesia</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trusted Clients Strip */}
      <section aria-label="Dipercaya oleh" className="border-y border-slate-100 bg-white py-10">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="flex flex-col items-center gap-6 md:flex-row md:gap-10">
            <p className="shrink-0 text-center text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 md:w-48 md:text-left">
              Dipercaya oleh
            </p>
            <InfiniteSlider
              gap={72}
              duration={30}
              durationOnHover={60}
              className="w-full [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
            >
              {sliderClients.map((client, index) => (
                <Image
                  key={`${client.name}-${index}`}
                  src={client.logo}
                  alt={client.name}
                  width={client.width}
                  height={client.height}
                  className="h-12 w-auto opacity-70 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0"
                />
              ))}
            </InfiniteSlider>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 md:py-32 bg-gradient-to-b from-white to-muted/30">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <FadeInWhenVisible>
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-secondary">
                Mengapa Memilih Arkana?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Kami memadukan keahlian, inovasi, dan dedikasi untuk menghadirkan hasil terbaik.
              </p>
            </div>
          </FadeInWhenVisible>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
            <FadeInWhenVisible delay={0.1}>
              <Card className="group border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-2 bg-white h-full">
                <CardHeader className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">
                    <Building2 className="h-7 w-7 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-secondary">Keahlian Teknologi</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    Pemahaman teknis yang mendalam di platform cloud, sistem enterprise,
                    dan framework pengembangan modern.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Tim berpengalaman di cloud dan sistem enterprise</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Metodologi pengembangan agile</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </FadeInWhenVisible>

            <FadeInWhenVisible delay={0.2}>
              <Card className="group border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-2 bg-white h-full">
                <CardHeader className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">
                    <Lightbulb className="h-7 w-7 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-secondary">Inovasi Digital</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    Membantu organisasi bertransformasi melalui AI, cloud computing,
                    dan solusi digital terkini.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Integrasi AI & Machine Learning</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Perancangan arsitektur cloud native</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </FadeInWhenVisible>

            <FadeInWhenVisible delay={0.3}>
              <Card className="group border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-2 bg-white h-full">
                <CardHeader className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">
                    <Users className="h-7 w-7 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-secondary">Kemitraan Strategis</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    Bekerja berdampingan dengan tim Anda untuk memahami tujuan organisasi
                    dan menghadirkan hasil teknologi yang terukur.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Strategi IT yang selaras dengan tujuan bisnis</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>Pendampingan teknis berkelanjutan</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </FadeInWhenVisible>
          </div>
        </div>
      </section>

      {/* Services Detail Section */}
      <section id="services" className="scroll-mt-24 py-24 md:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <FadeInWhenVisible>
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-secondary">
                Layanan Kami
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Solusi IT menyeluruh, dari konsultasi hingga implementasi, sesuai kebutuhan organisasi Anda.
              </p>
            </div>
          </FadeInWhenVisible>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {companyInfo.services.map((service, index) => {
              const IconComponent = serviceIcons[service.icon] || Code;

              return (
                <Card
                  key={index}
                  className="group border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-white"
                >
                  <CardHeader className="space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl text-secondary text-secondary">{service.title}</CardTitle>
                    <CardDescription className="text-base">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                          <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Procurement Credentials Section */}
      <section id="procurement" className="relative overflow-hidden bg-white py-24 md:py-32">
        {/* Soft background accent */}
        <div className="pointer-events-none absolute -right-40 top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="grid items-center gap-14 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
            {/* Copy */}
            <FadeInWhenVisible>
              <div className="space-y-7">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                  Kredensial Pengadaan
                </p>
                <h2 className="text-4xl font-bold leading-tight text-secondary md:text-5xl">
                  Terdaftar di platform pengadaan resmi Indonesia
                </h2>
                <p className="text-lg leading-relaxed text-gray-600">
                  Kami menyediakan software, lisensi, perangkat IT, elektronik, dan barang penunjang melalui kanal
                  pengadaan pemerintah dan komersial yang resmi, dengan proses yang transparan, sesuai spesifikasi,
                  dan tepat waktu.
                </p>
                <ul className="space-y-3 pt-1">
                  {procurementCommitments.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-secondary">
                      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      </span>
                      <span className="font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-2">
                  <Button size="lg" asChild className="group">
                    <Link href="/contact">
                      Minta Penawaran Harga
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            </FadeInWhenVisible>

            {/* Logo grid */}
            <div className="rounded-[2rem] border border-slate-200/80 bg-gradient-to-br from-slate-50 to-white p-4 shadow-[0_30px_80px_-40px_rgba(61,90,108,0.35)] sm:p-6">
              <div className="grid grid-cols-2 gap-4 sm:gap-5">
                {procurementPlatforms.map((platform, index) => (
                  <FadeInWhenVisible key={platform.name} delay={0.1 + index * 0.1} className="h-full">
                    <div className="group relative flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 sm:p-6">
                      <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
                        <BadgeCheck className="h-3.5 w-3.5" />
                        Terdaftar
                      </span>

                      <div className="flex h-32 items-center justify-center pt-6 sm:pt-4">
                        <Image
                          src={platform.logo}
                          alt={`Logo ${platform.name}`}
                          width={platform.width}
                          height={platform.height}
                          className={`${platform.logoClass} w-auto max-w-[85%] object-contain transition-transform duration-300 group-hover:scale-105`}
                        />
                      </div>

                      <div className="mt-auto border-t border-slate-100 pt-4">
                        <p className="font-semibold text-secondary">{platform.name}</p>
                        <p className="mt-0.5 text-xs leading-relaxed text-gray-500">{platform.detail}</p>
                      </div>
                    </div>
                  </FadeInWhenVisible>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Advantages Section (from the company profile) */}
      <section className="py-24 md:py-32 bg-secondary text-white">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="grid gap-16 lg:grid-cols-[1fr_1.4fr] lg:gap-24">
            <FadeInWhenVisible>
              <div className="space-y-6 lg:sticky lg:top-32">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Keunggulan Kami</p>
                <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                  Alasan klien memilih Arkana
                </h2>
                <p className="text-lg leading-relaxed text-white/70">
                  Sejak konsultasi pertama hingga layanan purna jual, kami fokus pada solusi yang tepat guna, tahan lama, dan memberi nilai yang terukur.
                </p>
              </div>
            </FadeInWhenVisible>

            <div className="divide-y divide-white/10 border-y border-white/10">
              {advantages.map((item, index) => (
                <FadeInWhenVisible key={item.title} delay={index * 0.08}>
                  <div className="grid grid-cols-[auto_1fr] gap-6 py-8 md:gap-10">
                    <span className="text-4xl font-bold text-primary/80 tabular-nums md:text-5xl">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold md:text-2xl">{item.title}</h3>
                      <p className="leading-relaxed text-white/70">{item.description}</p>
                    </div>
                  </div>
                </FadeInWhenVisible>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 bg-gradient-to-b from-muted/30 to-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5" />

        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 relative">
          <Card className="max-w-4xl mx-auto border-2 border-primary/20 shadow-2xl shadow-primary/10 bg-white">
            <CardHeader className="text-center pb-8 space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 mx-auto mb-4 shadow-lg shadow-primary/20">
                <ArrowRight className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-3xl md:text-4xl text-secondary text-secondary">
                Siap Bekerja Sama?
              </CardTitle>
              <CardDescription className="text-lg max-w-2xl mx-auto">
                Mari diskusikan bagaimana kami dapat membantu mewujudkan rencana Anda.
                Tim kami siap mendukung proyek Anda berikutnya.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4 justify-center pb-8">
              <Button size="lg" className="text-base" asChild>
                <Link href="/contact">
                  Mulai Diskusi
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-base">
                <Link href="/projects">Lihat Portofolio</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}




