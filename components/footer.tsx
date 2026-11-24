"use client"

import Link from "next/link"
import { Mail, Phone, MapPin, Linkedin, Instagram } from "lucide-react"
import { companyInfo, whatsappUrl } from "@/lib/company-data"
import { WhatsAppIcon } from "@/components/whatsapp-icon"
import { FadeInWhenVisible } from "@/components/animations"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-secondary text-white">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-16">
          {/* Company Info */}
          <FadeInWhenVisible>
            <div className="space-y-4">
              <h3 className="text-xl font-bold">{companyInfo.name}</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                {companyInfo.tagline}
              </p>
              <p className="text-sm text-gray-300 leading-relaxed">
                Mitra solusi IT dan pengadaan barang untuk instansi pemerintah dan perusahaan di seluruh Indonesia.
              </p>
              
              {/* Social Media */}
              <div className="flex gap-3 pt-4">
                <a 
                  href={companyInfo.socialMedia.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-white/10 hover:bg-primary flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-6 hover:shadow-lg"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a 
                  href={companyInfo.socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-white/10 hover:bg-primary flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-6 hover:shadow-lg"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>
          </FadeInWhenVisible>

          {/* Quick Links */}
          <FadeInWhenVisible delay={0.1}>
            <div>
              <h3 className="text-lg font-bold mb-4">Tautan Cepat</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/about" className="text-sm text-gray-300 hover:text-primary hover:translate-x-1 inline-block transition-all duration-300">
                    Tentang Kami
                  </Link>
                </li>
                <li>
                  <Link href="/projects" className="text-sm text-gray-300 hover:text-primary hover:translate-x-1 inline-block transition-all duration-300">
                    Proyek Kami
                  </Link>
                </li>
                <li>
                  <Link href="/insight" className="text-sm text-gray-300 hover:text-primary hover:translate-x-1 inline-block transition-all duration-300">
                    Insight & Artikel
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-sm text-gray-300 hover:text-primary hover:translate-x-1 inline-block transition-all duration-300">
                    Karier
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-sm text-gray-300 hover:text-primary hover:translate-x-1 inline-block transition-all duration-300">
                    Hubungi Kami
                  </Link>
                </li>
              </ul>
            </div>
          </FadeInWhenVisible>

          {/* Services */}
          <FadeInWhenVisible delay={0.2}>
            <div>
              <h3 className="text-lg font-bold mb-4">Layanan Kami</h3>
              <ul className="space-y-3">
                <li className="text-sm text-gray-300">Konsultasi IT & Integrasi Sistem</li>
                <li className="text-sm text-gray-300">Pengembangan Software & Aplikasi</li>
                <li className="text-sm text-gray-300">Infrastruktur IT, Server & Jaringan</li>
                <li className="text-sm text-gray-300">Layanan Cloud & Data</li>
                <li className="text-sm text-gray-300">Keamanan Sistem & Desain UI/UX</li>
                <li className="text-sm text-gray-300">Pengadaan Barang & Jasa</li>
              </ul>
            </div>
          </FadeInWhenVisible>

          {/* Contact Info */}
          <FadeInWhenVisible delay={0.3}>
            <div>
              <h3 className="text-lg font-bold mb-4">Kontak</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-300">
                    <div className="font-medium text-white mb-1">Alamat</div>
                    {companyInfo.contact.address.fullAddress}
                  </div>
                </li>
                {companyInfo.contact.showPhone && (
                  <li className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-gray-300">
                      <div className="font-medium text-white mb-1">Telepon</div>
                      {companyInfo.contact.phone.main}
                    </div>
                  </li>
                )}
                <li>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 group"
                  >
                    <WhatsAppIcon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-gray-300 group-hover:text-white transition-colors">
                      <div className="font-medium text-white mb-1">WhatsApp</div>
                      {companyInfo.contact.phone.whatsapp}
                    </div>
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-300">
                    <div className="font-medium text-white mb-1">Email</div>
                    {companyInfo.contact.email.general}
                  </div>
                </li>
              </ul>
            </div>
          </FadeInWhenVisible>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-300 text-center md:text-left">
              &copy; {currentYear} {companyInfo.name}. Seluruh hak cipta dilindungi.
            </p>
            <div className="flex gap-6 text-sm text-gray-300">
              <Link href="/privacy" className="hover:text-primary transition-colors">
                Kebijakan Privasi
              </Link>
              <Link href="/terms" className="hover:text-primary transition-colors">
                Syarat & Ketentuan
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
