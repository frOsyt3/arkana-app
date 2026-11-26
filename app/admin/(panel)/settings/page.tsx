import { requireArea } from "@/lib/admin/access"
import { getContactSettings } from "@/lib/site-settings"
import { AdminTopbar, PageTitle } from "@/components/admin/page-header"
import { SettingsForm } from "./settings-form"

export const metadata = { title: "Company settings" }

export default async function SettingsPage() {
  await requireArea("settings")
  const contact = await getContactSettings()

  return (
    <>
      <AdminTopbar crumb="Company settings" />
      <div className="space-y-5 px-6 py-8 lg:px-8">
        <PageTitle
          title="Company settings"
          description="Contact details shown in the footer, contact page, WhatsApp button, and Google structured data."
        />
        <SettingsForm contact={contact} />
      </div>
    </>
  )
}
