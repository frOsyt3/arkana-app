"use server"

import { headers } from "next/headers"
import { isDatabaseConfigured } from "@/lib/db"
import { recordView } from "@/lib/articles"

const BOT = /bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|telegram|headless|lighthouse/i

export async function trackArticleView(articleId: string) {
  if (!isDatabaseConfigured() || !/^[0-9a-f-]{36}$/i.test(articleId)) return
  const ua = (await headers()).get("user-agent") ?? ""
  if (!ua || BOT.test(ua)) return
  try {
    await recordView(articleId)
  } catch (error) {
    console.error("Failed to record article view", error)
  }
}
