"use client"

import { useEffect } from "react"
import { trackEvent } from "@/lib/analytics"

/** Reports clicks on WhatsApp, phone, and email links to GA4 as contact events. */
export function ContactClickTracker() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      const link = (event.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null
      if (!link) return
      const href = link.href
      let method: string | null = null
      if (/^https:\/\/(wa\.me|api\.whatsapp\.com)\//.test(href)) method = "whatsapp"
      else if (href.startsWith("tel:")) method = "phone"
      else if (href.startsWith("mailto:")) method = "email"
      if (!method) return
      trackEvent("contact_click", { method, page_path: window.location.pathname })
    }
    document.addEventListener("click", onClick, { capture: true })
    return () => document.removeEventListener("click", onClick, { capture: true })
  }, [])

  return null
}
