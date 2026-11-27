"use server"

import { headers } from "next/headers"
import { sql } from "drizzle-orm"
import { getDb, isDatabaseConfigured, schema } from "@/lib/db"

const BOT = /bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|telegram|headless|lighthouse/i
const { pageViews } = schema

/** Records one page view. `firstToday` marks the first page this browser opened today. */
export async function trackPageView(path: string, firstToday: boolean) {
  if (!isDatabaseConfigured()) return
  if (typeof path !== "string" || !path.startsWith("/") || path.length > 200) return
  const h = await headers()
  const ua = h.get("user-agent") ?? ""
  if (!ua || BOT.test(ua)) return
  // The database is shared with local development, so local visits are not counted.
  const host = h.get("host") ?? ""
  if (/^(localhost|127\.0\.0\.1|\[::1\])(:|$)/.test(host) && process.env.TRACK_LOCAL_VISITS !== "1") return

  const clean = path.split(/[?#]/)[0].replace(/\/+$/, "") || "/"
  const visitor = firstToday ? 1 : 0
  try {
    await getDb()
      .insert(pageViews)
      .values({ day: sql`(now() at time zone 'Asia/Jakarta')::date` as unknown as string, path: clean, views: 1, visitors: visitor })
      .onConflictDoUpdate({
        target: [pageViews.day, pageViews.path],
        set: { views: sql`${pageViews.views} + 1`, visitors: sql`${pageViews.visitors} + ${visitor}` },
      })
  } catch (error) {
    console.error("Failed to record page view", error)
  }
}
