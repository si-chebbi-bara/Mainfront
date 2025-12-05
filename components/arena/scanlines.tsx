"use client"

import { motion } from "framer-motion"

export function Scanlines() {
  return (
    <>
      {/* Static scanlines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,0,0,0.5) 2px,
            rgba(0,0,0,0.5) 4px
          )`,
        }}
      />

      {/* Moving scanline */}
      <motion.div
        className="absolute left-0 right-0 h-px pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(0,255,255,0.3), transparent)",
          boxShadow: "0 0 10px rgba(0,255,255,0.5)",
        }}
        animate={{
          y: ["-100vh", "100vh"],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />

      {/* CRT vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)",
        }}
      />
    </>
  )
}
