"use client"

import * as React from "react"
import { motion, useScroll, useMotionValueEvent } from "framer-motion"
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
  const [isHidden, setIsHidden] = React.useState(false)
  const { scrollY } = useScroll()
  const [lastScrollY, setLastScrollY] = React.useState(0)

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = lastScrollY
    
    // Hide navbar when scrolling down, show when scrolling up
    if (latest > previous && latest > 100) {
      setIsHidden(true)
    } else {
      setIsHidden(false)
    }
    
    setLastScrollY(latest)
  })

  return (
    <motion.header 
      className="sticky top-0 z-50 w-full bg-transparent"
      initial={{ y: 0 }}
      animate={{ 
        y: isHidden ? -100 : 0,
        opacity: isHidden ? 0 : 1
      }}
      transition={{ 
        duration: 0.3, 
        ease: "easeInOut"
      }}
    >
      <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">
        {/* Desktop & Mobile - Centered */}
        <div className="flex items-center justify-center py-1.5 scale-90">
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
    </motion.header>
  )
}
