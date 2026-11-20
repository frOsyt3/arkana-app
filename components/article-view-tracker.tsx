"use client"

import { useEffect } from "react"
import { trackArticleView } from "@/app/(site)/insight/actions"

/** Counts one view per article per browser session. */
export function ArticleViewTracker({ articleId }: { articleId: string }) {
  useEffect(() => {
    const key = `arkana_viewed_${articleId}`
    try {
      if (sessionStorage.getItem(key)) return
    } catch {
      // Storage can be blocked. Counting anyway is fine.
    }
    const t = setTimeout(() => {
      try {
        sessionStorage.setItem(key, "1")
      } catch {}
      void trackArticleView(articleId)
    }, 1500)
    return () => clearTimeout(t)
  }, [articleId])
  return null
}
