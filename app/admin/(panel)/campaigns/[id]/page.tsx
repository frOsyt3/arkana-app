import { notFound } from "next/navigation"
import { requireArea } from "@/lib/admin/access"
import { CHANNELS, getCampaign } from "@/lib/campaigns"
import { SITE_URL } from "@/lib/seo"
import { AdminTopbar } from "@/components/admin/page-header"
import { CampaignForm } from "../campaign-form"

export const metadata = { title: "Campaign" }

export default async function CampaignPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ saved?: string }>
}) {
  await requireArea("growth")
  const [{ id }, sp] = await Promise.all([params, searchParams])
  const row = id === "new" ? null : await getCampaign(id)
  if (id !== "new" && !row) notFound()

  return (
    <>
      <AdminTopbar crumb="Campaigns" />
      <CampaignForm
        siteUrl={SITE_URL}
        channels={CHANNELS}
        justCreated={sp.saved === "1"}
        values={{
          id: row?.id ?? "",
          name: row?.name ?? "",
          channel: row?.channel ?? "Meta Ads",
          utmSource: row?.utmSource ?? "facebook",
          utmMedium: row?.utmMedium ?? "paid_social",
          utmCampaign: row?.utmCampaign ?? "",
          landingPath: row?.landingPath ?? "/contact",
          spend: row?.spend ?? 0,
          startDate: row?.startDate ?? "",
          endDate: row?.endDate ?? "",
          notes: row?.notes ?? "",
        }}
      />
    </>
  )
}
