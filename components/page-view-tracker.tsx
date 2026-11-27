"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { trackPageView } from "@/app/(site)/track-actions"

const DAY_KEY = "arkana_visit_day"

/** Counts a view for every page opened, and a visitor once per browser per day. */
export function PageViewTracker() {
  const pathname = usePathname()
  const last = useRef<string | null>(null)

  useEffect(() => {
    if (!pathname || last.current === pathname) return
    last.current = pathname

    const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" })
    let firstToday = true
    try {
      firstToday = localStorage.getItem(DAY_KEY) !== today
      localStorage.setItem(DAY_KEY, today)
    } catch {
      // Storage can be blocked. Counting as a new visitor is fine.
    }
    void trackPageView(pathname, firstToday)
  }, [pathname])

  return null
}
