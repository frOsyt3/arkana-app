"use client"

import { AnimatePresence, motion } from "framer-motion"
import { usePathname } from "next/navigation"
import { ReactNode } from "react"

interface PageTransitionLayoutProps {
  children: ReactNode
}

export function PageTransitionLayout({ children }: PageTransitionLayoutProps) {
  const pathname = usePathname()

  return (
    <div style={{ position: "relative", minHeight: "100vh", background: "#ffffff" }}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.5,
            ease: "easeInOut"
          }}
          style={{ 
            willChange: "opacity",
            position: "relative"
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
