import { pageMetadata } from "@/lib/seo"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { Mail, MapPin, Clock, MessageSquare } from "lucide-react"
import Link from "next/link"
import { getContactSettings, whatsappLink } from "@/lib/site-settings"
import { WhatsAppIcon } from "@/components/whatsapp-icon"
import { ContactForm } from "@/components/contact-form"

export const metadata = pageMetadata({
  title: "Hubungi Kami",
  description:
    "Konsultasikan kebutuhan IT Anda bersama Arkana, dari pembuatan website dan aplikasi, perangkat dan jaringan, hingga pengadaan. Kantor di Sarijadi, Bandung. Kami membalas dalam satu hari kerja.",
  path: "/contact",
})

export default async function ContactPage() {
  const contact = await getContactSettings()
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-white">
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
        
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 relative py-24 md:py-32">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <MessageSquare className="w-4 h-4" />
              Kontak
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-secondary">
              Hubungi Kami
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              Ceritakan kebutuhan teknologi Anda, besar maupun kecil. Tim kami siap membantu, mulai dari diskusi awal
              hingga penawaran yang sesuai dengan anggaran Anda.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-24 md:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Contact Information */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-secondary mb-4">
                  Mari Terhubung
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Baik untuk pembuatan website, pengadaan perangkat IT, maupun konsultasi jaringan dan infrastruktur,
                  tim kami siap membantu.
                </p>
              </div>

              <div className="space-y-6">
                <a 
                  href={`mailto:${contact.email}`}
                  className="block group"
                >
                  <Card className="border-2 border-border group-hover:border-primary/50 group-hover:shadow-md transition-all bg-white cursor-pointer h-full">
                    <CardHeader className="flex-row items-start gap-4 space-y-0">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <Mail className="h-6 w-6 text-white" />
                      </div>
                      <div className="space-y-1">
                        <CardTitle className="text-lg text-secondary group-hover:text-primary transition-colors">Email</CardTitle>
                        <CardDescription className="text-base group-hover:text-gray-900 transition-colors">
                          {contact.email}
                        </CardDescription>
                      </div>
                    </CardHeader>
                  </Card>
                </a>

                <a
                  href={whatsappLink(contact.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                >
                  <Card className="border-2 border-border group-hover:border-primary/50 group-hover:shadow-md transition-all bg-white cursor-pointer h-full">
                    <CardHeader className="flex-row items-start gap-4 space-y-0">
                      <div className="w-12 h-12 rounded-xl bg-[#25D366] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <WhatsAppIcon className="h-6 w-6 text-white" />
                      </div>
                      <div className="space-y-1">
                        <CardTitle className="text-lg text-secondary group-hover:text-primary transition-colors">WhatsApp</CardTitle>
                        <CardDescription className="text-base group-hover:text-gray-900 transition-colors">
                          {contact.whatsapp}
                        </CardDescription>
                      </div>
                    </CardHeader>
                  </Card>
                </a>

                <a 
                  href={contact.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                >
                  <Card className="border-2 border-border group-hover:border-primary/50 group-hover:shadow-md transition-all bg-white cursor-pointer h-full">
                    <CardHeader className="flex-row items-start gap-4 space-y-0">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <MapPin className="h-6 w-6 text-white" />
                      </div>
                      <div className="space-y-1">
                        <CardTitle className="text-lg text-secondary group-hover:text-primary transition-colors">Kantor</CardTitle>
                        <CardDescription className="text-base group-hover:text-gray-900 transition-colors">
                          {contact.address}
                        </CardDescription>
                      </div>
                    </CardHeader>
                  </Card>
                </a>

                <Card className="border-2 border-border bg-white h-full">
                  <CardHeader className="flex-row items-start gap-4 space-y-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center flex-shrink-0">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                    <div className="space-y-1">
                      <CardTitle className="text-lg text-secondary">Jam Operasional</CardTitle>
                      <CardDescription className="text-base text-gray-600">
                        {contact.hoursWeekdays}<br />
                        {contact.hoursSaturday}
                      </CardDescription>
                    </div>
                  </CardHeader>
                </Card>
              </div>

            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <Card className="border-2 border-primary/20 shadow-xl bg-white">
                <CardHeader>
                  <CardTitle className="text-2xl text-secondary text-secondary">Kirim Pesan</CardTitle>
                  <CardDescription className="text-base">
                    Isi formulir di bawah ini dan tim kami akan menghubungi Anda dalam satu hari kerja.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ContactForm />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-24 md:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary">
              Kunjungi Kantor Kami
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Kantor kami berlokasi di Sarijadi, Bandung
            </p>
          </div>

          <Card className="border-2 border-border shadow-xl overflow-hidden bg-white">
            <iframe
              title="Lokasi kantor PT. Arkana Tunas Persada"
              src={`https://www.google.com/maps?q=${contact.latitude},${contact.longitude}&z=17&output=embed`}
              className="block aspect-video w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 md:py-32 bg-white">
        <div className="mx-auto max-w-4xl px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary">
              Pertanyaan yang Sering Diajukan
            </h2>
            <p className="text-lg text-gray-600">
              Jawaban singkat untuk pertanyaan yang paling sering kami terima
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                question: "Layanan apa saja yang disediakan Arkana?",
                answer: "Kami menyediakan konsultasi IT dan integrasi sistem, pengembangan software dan aplikasi, infrastruktur server dan jaringan, layanan cloud dan data, keamanan sistem, serta pengadaan barang dan jasa IT."
              },
              {
                question: "Apakah Arkana melayani UMKM dan perorangan?",
                answer: "Tentu. Selain instansi dan perusahaan, kami membantu UMKM, sekolah, dan perorangan, misalnya pembuatan website, toko online, rekomendasi dan pengadaan perangkat, hingga konsultasi IT."
              },
              {
                question: "Apakah Arkana melayani pengadaan melalui e-Katalog?",
                answer: "Ya. Kami terdaftar di e-Katalog LKPP, INAPROC, LPSE, dan Digipay Kemenkeu, sehingga instansi pemerintah dapat melakukan pengadaan secara resmi dan terdokumentasi."
              },
              {
                question: "Bagaimana cara meminta konsultasi atau penawaran harga?",
                answer: `Isi formulir di atas atau kirim email ke ${contact.email} berisi kebutuhan Anda. Tim kami akan merespons dalam satu hari kerja.`
              },
              {
                question: "Bagaimana model kerja sama proyek di Arkana?",
                answer: "Kami menyediakan model kerja sama yang fleksibel, mulai dari proyek dengan harga tetap, skema time and material, tim khusus, hingga konsultasi berbasis retainer."
              },
              {
                question: "Apakah ada dukungan setelah proyek selesai?",
                answer: "Ya. Kami menyediakan pemeliharaan, paket dukungan teknis, dan managed services agar sistem Anda tetap berjalan lancar."
              }
            ].map((faq, index) => (
              <Card key={index} className="border-2 border-border hover:border-primary/50 transition-all bg-white">
                <CardHeader>
                  <CardTitle className="text-lg text-secondary">{faq.question}</CardTitle>
                  <CardDescription className="text-base pt-2">
                    {faq.answer}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              Masih punya pertanyaan?
            </p>
            <Button variant="outline" size="lg" asChild>
              <Link href="/insight">Baca Insight Kami</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}




