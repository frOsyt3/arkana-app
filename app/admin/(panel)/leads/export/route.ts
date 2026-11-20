import { requireUser } from "@/lib/auth"
import { exportLeads } from "@/lib/admin/queries"

export const dynamic = "force-dynamic"

function cell(value: unknown) {
  if (value === null || value === undefined) return ""
  let text = value instanceof Date ? value.toISOString() : String(value)
  // Stop spreadsheet apps from running cell content as a formula.
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

export async function GET() {
  await requireUser()
  const rows = await exportLeads()
  const headers = [
    "Received",
    "First name",
    "Last name",
    "Email",
    "Phone",
    "Company",
    "Subject",
    "Message",
    "Status",
    "Owner",
    "Source",
    "UTM source",
    "UTM medium",
    "UTM campaign",
    "Landing page",
    "Device",
  ]
  const lines = [
    headers.join(","),
    ...rows.map((r) =>
      [
        r.createdAt,
        r.firstName,
        r.lastName,
        r.email,
        r.phone,
        r.company,
        r.subject,
        r.message,
        r.status,
        r.owner,
        r.source,
        r.utmSource,
        r.utmMedium,
        r.utmCampaign,
        r.landingPage,
        r.device,
      ]
        .map(cell)
        .join(",")
    ),
  ]
  const date = new Date().toISOString().slice(0, 10)
  return new Response(`﻿${lines.join("\r\n")}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="arkana-leads-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  })
}
