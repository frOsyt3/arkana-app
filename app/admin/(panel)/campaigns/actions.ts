"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { and, eq, ne } from "drizzle-orm"
import { z } from "zod"
import { assertArea, audit } from "@/lib/admin/access"
import { getDb, schema } from "@/lib/db"
import { slugify } from "@/lib/articles"
import type { FormState } from "@/components/admin/form"

const { campaigns } = schema
const tag = z
  .string()
  .trim()
  .min(1)
  .max(60)
  .transform((v) => v.toLowerCase().replace(/[^a-z0-9_]+/g, "_").replace(/^_+|_+$/g, ""))
const day = z.union([z.iso.date(), z.literal("")]).transform((v) => v || null)

const campaignSchema = z.object({
  id: z.union([z.uuid(), z.literal("")]),
  name: z.string().trim().min(2, "Name the campaign.").max(120),
  channel: z.string().trim().min(1).max(60),
  utmSource: tag,
  utmMedium: tag,
  utmCampaign: z.string().trim().max(80),
  landingPath: z.string().trim().regex(/^\/[^\s]*$/, "The landing page must start with /, for example /contact.").max(200),
  spend: z.coerce.number().int().min(0).max(10_000_000_000),
  startDate: day,
  endDate: day,
  notes: z.string().trim().max(2000).transform((v) => v || null),
})

export async function saveCampaign(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await assertArea("growth")
  const raw = Object.fromEntries(formData)
  const parsed = campaignSchema.safeParse({ ...raw, spend: String(raw.spend ?? "0").replace(/\D/g, "") || "0" })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Fill in source and medium, or pick a channel." }
  const d = parsed.data
  if (!d.utmSource || !d.utmMedium) return { error: "Fill in source and medium, or pick a channel." }
  const utmCampaign = slugify(d.utmCampaign || d.name).replace(/-/g, "_")
  if (!utmCampaign) return { error: "Add a campaign name with letters or numbers." }

  const db = getDb()
  const [clash] = await db
    .select({ id: campaigns.id })
    .from(campaigns)
    .where(d.id ? and(eq(campaigns.utmCampaign, utmCampaign), ne(campaigns.id, d.id)) : eq(campaigns.utmCampaign, utmCampaign))
    .limit(1)
  if (clash) return { error: `Another campaign already uses the tag ${utmCampaign}.` }

  const { id: _id, ...fields } = d
  void _id
  const values = { ...fields, utmCampaign, updatedAt: new Date() }
  let id = d.id
  if (id) {
    await db.update(campaigns).set(values).where(eq(campaigns.id, id))
    await audit(user, { action: "update", entity: "campaign", entityId: id, summary: `Updated campaign ${d.name}` })
  } else {
    const [row] = await db.insert(campaigns).values(values).returning({ id: campaigns.id })
    id = row.id
    await audit(user, { action: "create", entity: "campaign", entityId: id, summary: `Created campaign ${d.name}` })
  }
  revalidatePath("/admin/campaigns")
  if (!d.id) redirect(`/admin/campaigns/${id}?saved=1`)
  return { ok: true, message: "Saved." }
}

export async function deleteCampaign(formData: FormData) {
  const user = await assertArea("growth")
  const id = String(formData.get("id") ?? "")
  if (!/^[0-9a-f-]{36}$/i.test(id)) return
  const [row] = await getDb().delete(campaigns).where(eq(campaigns.id, id)).returning({ name: campaigns.name })
  if (row) await audit(user, { action: "delete", entity: "campaign", entityId: id, summary: `Deleted campaign ${row.name}. Its leads are kept.` })
  revalidatePath("/admin/campaigns")
  redirect("/admin/campaigns")
}
