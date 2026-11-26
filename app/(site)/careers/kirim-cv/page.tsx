import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { ApplyForm } from "@/components/apply-form"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "Kirim CV",
  description: "Kirim CV Anda ke PT. Arkana Tunas Persada. Kami akan menghubungi Anda ketika ada posisi yang sesuai.",
  path: "/careers/kirim-cv",
})

export default function GeneralApplicationPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <section className="bg-gradient-to-b from-primary/10 to-white pb-24">
        <div className="mx-auto max-w-2xl px-6 pt-32 sm:px-8 md:pt-40">
          <Link href="/careers" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" /> Kembali ke Karier
          </Link>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-secondary md:text-5xl">Kirim CV Anda</h1>
          <p className="mt-4 text-lg text-gray-600">
            Belum ada posisi yang cocok? Simpan CV Anda di tim kami. Kami akan menghubungi Anda ketika ada posisi yang sesuai.
          </p>
          <div className="mt-10 rounded-2xl border-2 border-primary/20 bg-white p-6 shadow-xl sm:p-8">
            <ApplyForm position="kandidat umum" />
          </div>
        </div>
      </section>
    </div>
  )
}
