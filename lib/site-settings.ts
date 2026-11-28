import "server-only"
import { unstable_cache } from "next/cache"
import { eq } from "drizzle-orm"
import { getDb, isDatabaseConfigured, schema } from "@/lib/db"
import { companyInfo } from "@/lib/company-data"

export const SETTINGS_TAG = "site-settings"

export interface ContactSettings {
  email: string
  whatsapp: string
  phone: string
  showPhone: boolean
  address: string
  mapsUrl: string
  latitude: number
  longitude: number
  hoursWeekdays: string
  hoursSaturday: string
  hoursSunday: string
  linkedin: string
  instagram: string
}

const c = companyInfo.contact
export const DEFAULT_CONTACT: ContactSettings = {
  email: c.email.general,
  whatsapp: c.phone.whatsapp,
  phone: c.phone.main,
  showPhone: c.showPhone,
  address: c.address.fullAddress,
  mapsUrl: c.address.googleMapsUrl,
  latitude: c.address.coordinates.latitude,
  longitude: c.address.coordinates.longitude,
  hoursWeekdays: c.businessHours.weekdays,
  hoursSaturday: c.businessHours.saturday,
  hoursSunday: c.businessHours.sunday,
  linkedin: companyInfo.socialMedia.linkedin,
  instagram: companyInfo.socialMedia.instagram,
}

function merge(stored: Record<string, unknown> | undefined): ContactSettings {
  const out = { ...DEFAULT_CONTACT }
  if (!stored) return out
  for (const key of Object.keys(out) as (keyof ContactSettings)[]) {
    const v = stored[key]
    if (typeof v === typeof out[key]) (out as Record<string, unknown>)[key] = v
  }
  return out
}

const readContact = unstable_cache(
  async () => {
    const [row] = await getDb()
      .select({ value: schema.siteSettings.value })
      .from(schema.siteSettings)
      .where(eq(schema.siteSettings.key, "contact"))
      .limit(1)
    return row?.value
  },
  ["site-settings-contact-v2"],
  { tags: [SETTINGS_TAG] }
)

/** Contact details from the admin settings, falling back to lib/company-data.ts. */
export async function getContactSettings(): Promise<ContactSettings> {
  if (!isDatabaseConfigured()) return DEFAULT_CONTACT
  try {
    return merge(await readContact())
  } catch (err) {
    console.error("settings read failed", err)
    return DEFAULT_CONTACT
  }
}

export function whatsappLink(number: string) {
  return `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(
    "Halo Arkana, saya ingin bertanya tentang layanan Anda."
  )}`
}
