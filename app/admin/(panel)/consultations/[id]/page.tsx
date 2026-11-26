import { notFound } from "next/navigation"
import { eq } from "drizzle-orm"
import { requireArea } from "@/lib/admin/access"
import { getConsultation, googleCalendarLink, toLocalInput } from "@/lib/consultations"
import { listTeam } from "@/lib/admin/queries"
import { getDb, schema } from "@/lib/db"
import { AdminTopbar } from "@/components/admin/page-header"
import { ConsultationForm, type ConsultationValues } from "../consultation-form"

export const metadata = { title: "Consultation" }

function nextWorkingSlot() {
  const d = new Date(Date.now() + 24 * 60 * 60 * 1000)
  const local = toLocalInput(d).slice(0, 10)
  return `${local}T10:00`
}

export default async function ConsultationPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ saved?: string; lead?: string }>
}) {
  const user = await requireArea("consultations")
  const [{ id }, sp] = await Promise.all([params, searchParams])
  const [row, team] = await Promise.all([id === "new" ? null : getConsultation(id), listTeam()])
  if (id !== "new" && !row) notFound()

  let values: ConsultationValues
  if (row) {
    values = {
      id: row.id,
      leadId: row.leadId ?? "",
      name: row.name,
      email: row.email ?? "",
      phone: row.phone ?? "",
      company: row.company ?? "",
      topic: row.topic,
      scheduledAt: toLocalInput(row.scheduledAt),
      durationMinutes: row.durationMinutes,
      mode: row.mode,
      location: row.location ?? "",
      notes: row.notes ?? "",
      status: row.status,
      ownerId: row.ownerId ?? "",
    }
  } else {
    const lead =
      sp.lead && /^[0-9a-f-]{36}$/i.test(sp.lead)
        ? (await getDb().select().from(schema.leads).where(eq(schema.leads.id, sp.lead)).limit(1))[0]
        : undefined
    values = {
      id: "",
      leadId: lead?.id ?? "",
      name: lead ? `${lead.firstName} ${lead.lastName}` : "",
      email: lead?.email ?? "",
      phone: lead?.phone ?? "",
      company: lead?.company ?? "",
      topic: lead?.subject ?? "",
      scheduledAt: nextWorkingSlot(),
      durationMinutes: 60,
      mode: "online",
      location: "",
      notes: "",
      status: "confirmed",
      ownerId: user.id,
    }
  }

  return (
    <>
      <AdminTopbar crumb="Consultations" />
      <ConsultationForm
        values={values}
        team={team}
        justCreated={sp.saved === "1"}
        calendarUrl={row ? googleCalendarLink(row) : null}
      />
    </>
  )
}
