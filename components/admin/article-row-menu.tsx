"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { Copy, ExternalLink, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { deleteArticle, duplicateArticle } from "@/app/admin/(panel)/insights/actions"

export function ArticleRowMenu({ id, slug, live, title }: { id: string; slug: string; live: boolean; title: string }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    document.addEventListener("mousedown", close)
    document.addEventListener("keydown", esc)
    return () => {
      document.removeEventListener("mousedown", close)
      document.removeEventListener("keydown", esc)
    }
  }, [open])

  const item = "flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-[13px] hover:bg-[#F1F4F6]"

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="Article actions"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="rounded-lg p-1.5 text-[#8A9AA6] transition hover:bg-[#F1F4F6] hover:text-[#1F3442]"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-9 z-20 w-48 rounded-[10px] border border-[#E7ECEF] bg-white p-1.5 shadow-lg shadow-[#1F3442]/10">
          <Link href={`/admin/insights/${id}`} className={item}>
            <Pencil className="h-4 w-4 text-[#8A9AA6]" /> Edit
          </Link>
          {live && (
            <a href={`/insight/${slug}`} target="_blank" rel="noreferrer" className={item}>
              <ExternalLink className="h-4 w-4 text-[#8A9AA6]" /> View live
            </a>
          )}
          <form action={duplicateArticle}>
            <input type="hidden" name="id" value={id} />
            <button className={item}>
              <Copy className="h-4 w-4 text-[#8A9AA6]" /> Duplicate
            </button>
          </form>
          <form
            action={deleteArticle}
            onSubmit={(e) => {
              if (!confirm(`Delete "${title || "Untitled"}"? This cannot be undone.`)) e.preventDefault()
            }}
          >
            <input type="hidden" name="id" value={id} />
            <button className={`${item} text-red-600 hover:bg-red-50`}>
              <Trash2 className="h-4 w-4" /> Delete
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
