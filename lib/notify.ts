import "server-only"
import type { Lead } from "@/lib/db/schema"

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!)
}

/**
 * Emails the team about a new lead through Resend.
 * Does nothing when RESEND_API_KEY or LEAD_NOTIFY_EMAIL is missing; the lead is still saved.
 */
export async function notifyNewLead(lead: Lead) {
  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.LEAD_NOTIFY_EMAIL
  if (!apiKey || !to) return

  const from = process.env.LEAD_NOTIFY_FROM ?? "Arkana Website <onboarding@resend.dev>"
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://arkanacorp.id"
  const name = `${lead.firstName} ${lead.lastName}`

  const rows = [
    ["Name", name],
    ["Email", lead.email],
    ["Phone", lead.phone ?? "Not provided"],
    ["Company", lead.company ?? "Not provided"],
    ["Subject", lead.subject],
    ["Source", lead.source],
  ]

  const html = `
    <h2 style="font-family:sans-serif;color:#1F3442">New lead from arkanacorp.id</h2>
    <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse">
      ${rows
        .map(
          ([k, v]) =>
            `<tr><td style="padding:4px 16px 4px 0;color:#6B7C88">${k}</td><td style="padding:4px 0;color:#1F3442">${escapeHtml(v)}</td></tr>`
        )
        .join("")}
    </table>
    <p style="font-family:sans-serif;font-size:14px;color:#1F3442;white-space:pre-wrap;background:#F5F7F8;padding:12px;border-radius:8px">${escapeHtml(lead.message)}</p>
    <p style="font-family:sans-serif;font-size:14px"><a href="${siteUrl}/admin/leads?id=${lead.id}">Open in the admin dashboard</a></p>`

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: to.split(",").map((s) => s.trim()),
        reply_to: lead.email,
        subject: `New lead: ${name}, ${lead.subject}`,
        html,
      }),
    })
    if (!res.ok) console.error("Lead email failed", res.status, await res.text())
  } catch (error) {
    console.error("Lead email failed", error)
  }
}
