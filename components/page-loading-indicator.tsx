"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

export function PageLoadingIndicator() {
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => setIsLoading(false), 400)
    return () => clearTimeout(timer)
  }, [pathname])

  if (!isLoading) return null

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[9999] h-1 bg-gradient-to-r from-primary via-secondary to-primary"
      initial={{ scaleX: 0, transformOrigin: "left" }}
      animate={{ scaleX: 1 }}
      exit={{ scaleX: 0, transformOrigin: "right" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      style={{ willChange: "transform" }}
    />
  )
}
