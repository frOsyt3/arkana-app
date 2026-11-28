import { LegalPage } from "@/components/legal-page"
import { pageMetadata } from "@/lib/seo"
import { getContactSettings } from "@/lib/site-settings"

export const metadata = pageMetadata({
  title: "Kebijakan Privasi",
  description: "Cara PT. Arkana Tunas Persada mengumpulkan, menggunakan, dan melindungi data pribadi Anda saat menggunakan website arkanacorp.id.",
  path: "/privacy",
})

export default async function PrivacyPage() {
  const { email } = await getContactSettings()
  const mail = (
    <a href={`mailto:${email}`} className="font-medium text-primary hover:underline">
      {email}
    </a>
  )

  return (
    <LegalPage
      eyebrow="Legal"
      title="Kebijakan Privasi"
      intro="Kebijakan ini menjelaskan data apa saja yang kami kumpulkan saat Anda menggunakan arkanacorp.id, untuk apa data tersebut digunakan, dan bagaimana kami menjaganya."
      updated="28 November 2026"
      sections={[
        {
          title: "Data yang kami kumpulkan",
          body: (
            <>
              <p>Kami hanya mengumpulkan data yang Anda berikan secara sukarela dan data kunjungan yang dibutuhkan untuk menjalankan website:</p>
              <ul>
                <li>
                  <strong>Formulir kontak dan konsultasi:</strong> nama, email, nomor telepon, nama instansi atau perusahaan, isi pesan, serta
                  jadwal konsultasi yang Anda pilih.
                </li>
                <li>
                  <strong>Lamaran kerja:</strong> nama, email, nomor telepon, CV, tautan portofolio, dan surat lamaran.
                </li>
                <li>
                  <strong>Data kunjungan:</strong> halaman yang dibuka, jenis perangkat, dan sumber kunjungan, misalnya tautan kampanye atau
                  situs yang mengarahkan Anda ke website kami.
                </li>
              </ul>
            </>
          ),
        },
        {
          title: "Cara kami menggunakan data",
          body: (
            <ul>
              <li>Menjawab pertanyaan, menyusun penawaran, dan menjadwalkan konsultasi yang Anda minta.</li>
              <li>Memproses lamaran kerja dan menghubungi kandidat yang sesuai.</li>
              <li>Memahami halaman mana yang berguna agar website dan layanan kami terus membaik.</li>
            </ul>
          ),
        },
        {
          title: "Cookie dan penyimpanan di browser",
          body: (
            <>
              <p>
                Kami menggunakan Google Analytics untuk statistik kunjungan. Layanan ini memakai cookie untuk membedakan pengunjung tanpa
                mengetahui nama Anda.
              </p>
              <p>
                Website kami juga menyimpan sedikit data di browser Anda, yaitu sumber kunjungan selama 30 hari dan tanggal kunjungan terakhir,
                agar kami dapat menghitung pengunjung harian dan mengetahui kanal yang membawa Anda. Data ini tidak berisi identitas pribadi
                dan dapat Anda hapus kapan saja melalui pengaturan browser.
              </p>
            </>
          ),
        },
        {
          title: "Berbagi data dengan pihak lain",
          body: (
            <p>
              Kami tidak menjual atau menyewakan data pribadi Anda. Data hanya dapat diakses oleh penyedia layanan yang membantu kami
              mengoperasikan website, seperti layanan hosting, database, dan Google Analytics, atau bila diwajibkan oleh peraturan yang
              berlaku.
            </p>
          ),
        },
        {
          title: "Penyimpanan dan keamanan",
          body: (
            <p>
              Data disimpan di server dengan akses terbatas hanya untuk tim yang membutuhkannya. Kami menyimpan data selama masih diperlukan
              untuk tujuan di atas, lalu menghapusnya. Tidak ada sistem yang sepenuhnya bebas risiko, namun kami berupaya menjaga data Anda
              dengan langkah keamanan yang wajar.
            </p>
          ),
        },
        {
          title: "Hak Anda",
          body: (
            <p>
              Sesuai Undang Undang Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi, Anda berhak meminta salinan, perbaikan, atau
              penghapusan data pribadi Anda, serta menarik persetujuan yang pernah diberikan. Kirim permintaan Anda ke {mail} dan kami akan
              menanggapinya secepatnya.
            </p>
          ),
        },
        {
          title: "Perubahan kebijakan",
          body: (
            <p>
              Kebijakan ini dapat kami perbarui sewaktu waktu. Tanggal pembaruan terakhir selalu tercantum di bagian atas halaman ini.
            </p>
          ),
        },
        {
          title: "Hubungi kami",
          body: <p>Untuk pertanyaan seputar privasi, hubungi PT. Arkana Tunas Persada melalui {mail}.</p>,
        },
      ]}
    />
  )
}
