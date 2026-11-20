"use client"

import { useTransition } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ChevronDown, Search } from "lucide-react"
import { cn } from "@/lib/utils"

export function ArticleFilters({ categories }: { categories: string[] }) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const [pending, startTransition] = useTransition()

  function update(key: string, value: string) {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    next.delete("page")
    startTransition(() => router.replace(`${pathname}?${next.toString()}`))
  }

  return (
    <div className={cn("flex flex-wrap gap-2.5", pending && "opacity-70")}>
      <form
        className="relative min-w-[240px] flex-1 sm:max-w-[280px]"
        onSubmit={(e) => {
          e.preventDefault()
          update("q", String(new FormData(e.currentTarget).get("q") ?? "").trim())
        }}
      >
        <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-[#8A9AA6]" />
        <input
          name="q"
          defaultValue={params.get("q") ?? ""}
          placeholder="Search title or keyword"
          className="w-full rounded-[9px] border border-[#E7ECEF] bg-white py-2 pl-9 pr-3 text-[13px] outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15"
        />
      </form>
      <div className="relative">
        <select
          aria-label="Filter by category"
          value={params.get("category") ?? ""}
          onChange={(e) => update("category", e.target.value)}
          className="appearance-none rounded-[9px] border border-[#E7ECEF] bg-white py-2 pl-3 pr-8 text-[13px] outline-none focus:border-primary"
        >
          <option value="">Category: All</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 h-4 w-4 text-[#8A9AA6]" />
      </div>
    </div>
  )
}
