"use client"

import { createContext, useContext } from "react"
import type { ContactSettings } from "@/lib/site-settings"

const ContactContext = createContext<ContactSettings | null>(null)

export function SiteSettingsProvider({ contact, children }: { contact: ContactSettings; children: React.ReactNode }) {
  return <ContactContext.Provider value={contact}>{children}</ContactContext.Provider>
}

/** Contact details edited in Admin, Company settings. */
export function useContact() {
  const value = useContext(ContactContext)
  if (!value) throw new Error("useContact must be used inside SiteSettingsProvider")
  return value
}

export function waLink(number: string) {
  return `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(
    "Halo Arkana, saya ingin bertanya tentang layanan Anda."
  )}`
}
