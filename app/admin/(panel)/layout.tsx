import { isDatabaseConfigured } from "@/lib/db"
import { requireUser } from "@/lib/auth"
import { countNewLeads } from "@/lib/admin/queries"
import { AdminSidebar, MobileNav } from "@/components/admin/sidebar"
import { SetupNotice } from "@/components/admin/setup-notice"

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  if (!isDatabaseConfigured()) return <SetupNotice />

  const user = await requireUser()
  const newLeads = await countNewLeads()

  return (
    <div className="flex min-h-screen">
      <AdminSidebar user={user} newLeads={newLeads} />
      <div className="min-w-0 flex-1">
        <MobileNav />
        {children}
      </div>
    </div>
  )
}
