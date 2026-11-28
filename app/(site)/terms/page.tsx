import Link from "next/link"
import { LegalPage } from "@/components/legal-page"
import { pageMetadata } from "@/lib/seo"
import { getContactSettings } from "@/lib/site-settings"

export const metadata = pageMetadata({
  title: "Syarat & Ketentuan",
  description: "Syarat dan ketentuan penggunaan website arkanacorp.id milik PT. Arkana Tunas Persada.",
  path: "/terms",
})

export default async function TermsPage() {
  const { email } = await getContactSettings()
  const mail = (
    <a href={`mailto:${email}`} className="font-medium text-primary hover:underline">
      {email}
    </a>
  )

  return (
    <LegalPage
      eyebrow="Legal"
      title="Syarat & Ketentuan"
      intro="Dengan mengakses arkanacorp.id, Anda menyetujui syarat dan ketentuan berikut. Mohon baca dengan saksama sebelum menggunakan website ini."
      updated="28 November 2026"
      sections={[
        {
          title: "Tentang website ini",
          body: (
            <p>
              Website arkanacorp.id dikelola oleh PT. Arkana Tunas Persada, berkedudukan di Kota Bandung. Website ini berisi informasi umum
              tentang perusahaan, layanan, portofolio, artikel, dan lowongan kerja kami.
            </p>
          ),
        },
        {
          title: "Informasi layanan dan harga",
          body: (
            <>
              <p>
                Informasi di website ini bersifat umum dan dapat berubah tanpa pemberitahuan. Ruang lingkup pekerjaan, harga, jadwal, dan
                garansi untuk setiap proyek ditetapkan dalam penawaran tertulis, kontrak, atau surat perintah kerja yang disepakati
                bersama.
              </p>
              <p>
                Pengadaan melalui e-Katalog, LPSE, SIPLah, atau platform pengadaan lainnya tunduk pada ketentuan yang berlaku di platform
                tersebut.
              </p>
            </>
          ),
        },
        {
          title: "Penggunaan yang tidak diperbolehkan",
          body: (
            <ul>
              <li>Mengganggu, membebani, atau mencoba mengakses bagian website maupun sistem kami tanpa izin.</li>
              <li>Mengirim data palsu, spam, atau konten yang melanggar hukum melalui formulir di website ini.</li>
              <li>Menyalin atau menggunakan konten website untuk kepentingan komersial tanpa persetujuan tertulis dari kami.</li>
            </ul>
          ),
        },
        {
          title: "Hak kekayaan intelektual",
          body: (
            <p>
              Seluruh teks, desain, logo, dan materi di website ini milik PT. Arkana Tunas Persada, kecuali disebutkan lain. Logo klien,
              mitra, dan platform pengadaan yang ditampilkan adalah milik pemiliknya dan digunakan sebagai referensi.
            </p>
          ),
        },
        {
          title: "Tautan ke situs lain",
          body: (
            <p>
              Website ini dapat memuat tautan ke situs pihak ketiga, seperti portofolio klien atau platform pengadaan. Kami tidak
              bertanggung jawab atas isi maupun kebijakan privasi situs tersebut.
            </p>
          ),
        },
        {
          title: "Batasan tanggung jawab",
          body: (
            <p>
              Kami berupaya menjaga informasi di website ini tetap akurat dan terkini, namun tidak menjamin bebas dari kesalahan. Kami tidak
              bertanggung jawab atas kerugian yang timbul dari penggunaan informasi di website ini tanpa konsultasi lebih lanjut dengan tim
              kami.
            </p>
          ),
        },
        {
          title: "Privasi",
          body: (
            <p>
              Penggunaan data pribadi Anda diatur dalam{" "}
              <Link href="/privacy" className="font-medium text-primary hover:underline">
                Kebijakan Privasi
              </Link>{" "}
              kami.
            </p>
          ),
        },
        {
          title: "Hukum yang berlaku",
          body: <p>Syarat dan ketentuan ini tunduk pada hukum Republik Indonesia.</p>,
        },
        {
          title: "Perubahan dan kontak",
          body: (
            <p>
              Kami dapat memperbarui syarat dan ketentuan ini sewaktu waktu. Untuk pertanyaan, hubungi kami melalui {mail}.
            </p>
          ),
        },
      ]}
    />
  )
}
