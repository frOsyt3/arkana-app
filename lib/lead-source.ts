export interface Attribution {
  utmSource?: string | null
  utmMedium?: string | null
  utmCampaign?: string | null
  referrer?: string | null
}

const PAID_MEDIUMS = ["cpc", "ppc", "paid", "paid_social", "paidsocial", "ads", "ad", "display"]

/** Turns UTM tags and the referrer into a readable channel name. */
export function deriveSource({ utmSource, utmMedium, referrer }: Attribution): string {
  const source = utmSource?.toLowerCase().trim() ?? ""
  const medium = utmMedium?.toLowerCase().trim() ?? ""
  const paid = PAID_MEDIUMS.includes(medium)

  if (source) {
    if (/(facebook|instagram|meta|^fb$|^ig$)/.test(source)) return paid || !medium ? "Meta Ads" : "Social"
    if (source.includes("google")) return paid ? "Google Ads" : "Google search"
    if (source.includes("linkedin")) return "LinkedIn"
    if (source.includes("whatsapp") || source === "wa") return "WhatsApp"
    if (medium === "email") return "Email"
    return source.charAt(0).toUpperCase() + source.slice(1)
  }

  if (referrer) {
    let host = ""
    try {
      host = new URL(referrer).hostname.replace(/^www\./, "")
    } catch {
      return "Direct"
    }
    if (/google\./.test(host) || host.includes("bing.") || host.includes("duckduckgo.")) return "Google search"
    if (host.includes("facebook.") || host.includes("instagram.") || host === "l.facebook.com") return "Social"
    if (host.includes("linkedin.")) return "LinkedIn"
    if (host.includes("arkanacorp.")) return "Direct"
    return "Referral"
  }

  return "Direct"
}

export function deviceFromUserAgent(ua: string | null): string | null {
  if (!ua) return null
  if (/ipad|tablet/i.test(ua)) return "Tablet"
  if (/mobi|android|iphone/i.test(ua)) return "Mobile"
  return "Desktop"
}
