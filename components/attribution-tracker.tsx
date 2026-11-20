"use client"

import { useEffect } from "react"

export const ATTRIBUTION_KEY = "arkana_attribution"
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000

export interface StoredAttribution {
  utmSource: string | null
  utmMedium: string | null
  utmCampaign: string | null
  utmTerm: string | null
  utmContent: string | null
  referrer: string | null
  landingPage: string
  savedAt: number
}

export function readAttribution(): StoredAttribution | null {
  try {
    const raw = localStorage.getItem(ATTRIBUTION_KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as StoredAttribution
    if (Date.now() - data.savedAt > MAX_AGE_MS) return null
    return data
  } catch {
    return null
  }
}

/**
 * Remembers where a visitor came from (UTM tags and external referrer) so the
 * contact form can tell which channel produced the lead. A new campaign visit
 * replaces the old record; plain internal navigation never does.
 */
export function AttributionTracker() {
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      const hasUtm = ["utm_source", "utm_medium", "utm_campaign"].some((k) => params.get(k))
      const ref = document.referrer
      const externalRef = ref && !ref.startsWith(window.location.origin) ? ref : null

      if (!hasUtm && !externalRef && readAttribution()) return

      const data: StoredAttribution = {
        utmSource: params.get("utm_source"),
        utmMedium: params.get("utm_medium"),
        utmCampaign: params.get("utm_campaign"),
        utmTerm: params.get("utm_term"),
        utmContent: params.get("utm_content"),
        referrer: externalRef,
        landingPage: window.location.pathname,
        savedAt: Date.now(),
      }
      localStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(data))
    } catch {
      // Storage can be blocked; attribution is a nice to have.
    }
  }, [])

  return null
}
