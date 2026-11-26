"use server"

import { revalidatePath, updateTag } from "next/cache"
import { z } from "zod"
import { assertArea, audit } from "@/lib/admin/access"
import { getDb, schema } from "@/lib/db"
import { SETTINGS_TAG } from "@/lib/site-settings"
import type { FormState } from "@/components/admin/form"

const contactSchema = z.object({
  email: z.email(),
  whatsapp: z.string().trim().min(8).max(30),
  phone: z.string().trim().max(30),
  showPhone: z.boolean(),
  address: z.string().trim().min(5).max(300),
  mapsUrl: z.url().max(500),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  hoursWeekdays: z.string().trim().max(120),
  hoursSaturday: z.string().trim().max(120),
  hoursSunday: z.string().trim().max(120),
  linkedin: z.union([z.url().max(300), z.literal("")]),
  instagram: z.union([z.url().max(300), z.literal("")]),
})

export async function saveContactSettings(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await assertArea("settings")
  const raw = Object.fromEntries(formData)
  const parsed = contactSchema.safeParse({ ...raw, showPhone: raw.showPhone === "on" })
  if (!parsed.success) {
    const field = parsed.error.issues[0]?.path[0]
    return { error: `Check the ${String(field ?? "form")} field and try again.` }
  }

  await getDb()
    .insert(schema.siteSettings)
    .values({ key: "contact", value: parsed.data, updatedBy: user.id })
    .onConflictDoUpdate({
      target: schema.siteSettings.key,
      set: { value: parsed.data, updatedBy: user.id, updatedAt: new Date() },
    })

  updateTag(SETTINGS_TAG)
  revalidatePath("/", "layout")
  await audit(user, { action: "update", entity: "settings", entityId: "contact", summary: "Updated contact details" })
  return { ok: true, message: "Saved. The website now shows these details." }
}
