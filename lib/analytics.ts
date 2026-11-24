type GtagParams = Record<string, string | number | boolean | undefined>

declare global {
  interface Window {
    gtag?: (command: "event", name: string, params?: GtagParams) => void
  }
}

/** Sends a GA4 event. Does nothing when GA is not configured or not loaded yet. */
export function trackEvent(name: string, params?: GtagParams) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return
  window.gtag("event", name, params)
}
