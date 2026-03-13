"use client"

import Link from "next/link"
import { Mail, Phone, MapPin, Linkedin, Instagram, Twitter, Facebook } from "lucide-react"
import { companyInfo } from "@/lib/company-data"
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
                Leading IT consulting firm specializing in digital transformation and cloud solutions.
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
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/about" className="text-sm text-gray-300 hover:text-primary hover:translate-x-1 inline-block transition-all duration-300">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/projects" className="text-sm text-gray-300 hover:text-primary hover:translate-x-1 inline-block transition-all duration-300">
                    Our Projects
                  </Link>
                </li>
                <li>
                  <Link href="/insight" className="text-sm text-gray-300 hover:text-primary hover:translate-x-1 inline-block transition-all duration-300">
                    Insights & Articles
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-sm text-gray-300 hover:text-primary hover:translate-x-1 inline-block transition-all duration-300">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-sm text-gray-300 hover:text-primary hover:translate-x-1 inline-block transition-all duration-300">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </FadeInWhenVisible>

          {/* Services */}
          <FadeInWhenVisible delay={0.2}>
            <div>
              <h3 className="text-lg font-bold mb-4">Our Services</h3>
              <ul className="space-y-3">
                <li className="text-sm text-gray-300">IT Consulting & System Integration</li>
                <li className="text-sm text-gray-300">Software & Application Development</li>
                <li className="text-sm text-gray-300">IT Infrastructure, Server & Networking</li>
                <li className="text-sm text-gray-300">Cloud & Data Services</li>
                <li className="text-sm text-gray-300">System Security & UI/UX Design</li>
                <li className="text-sm text-gray-300">Goods & Services Procurement</li>
              </ul>
            </div>
          </FadeInWhenVisible>

          {/* Contact Info */}
          <FadeInWhenVisible delay={0.3}>
            <div>
              <h3 className="text-lg font-bold mb-4">Contact Us</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-300">
                    <div className="font-medium text-white mb-1">Address</div>
                    {companyInfo.contact.address.fullAddress}
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-300">
                    <div className="font-medium text-white mb-1">Phone</div>
                    {companyInfo.contact.phone.main}
                  </div>
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
              &copy; {currentYear} {companyInfo.name}. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-300">
              <Link href="/privacy" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
