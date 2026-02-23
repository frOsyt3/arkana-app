"use client"

import * as React from "react"
import Link from "next/link"
import PillNav from "./pill-nav"

const navItems = [
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Insight", href: "/insight" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
]

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-transparent">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Desktop & Mobile - Centered */}
        <div className="flex items-center justify-center py-4">
          <PillNav
            logo="/arkana.svg"
            logoAlt="Logo Arkana"
            items={navItems}
            baseColor="#5db8ba"
            pillColor="#ffffff"
            hoveredPillTextColor="#ffffff"
            pillTextColor="#94a3b8"
          />
        </div>
      </div>
    </header>
  )
}
