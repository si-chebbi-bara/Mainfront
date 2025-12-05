"use client"

import { motion } from "framer-motion"

interface NeonGridProps {
  liberationProgress?: number // 0 to 100
}

export function NeonGrid({ liberationProgress = 0 }: NeonGridProps) {
  const hue = (liberationProgress / 100) * 120 // 0 = red, 60 = yellow, 120 = green
  const gridColor = `hsl(${hue}, 100%, 50%)`
  const glowColor = `hsla(${hue}, 100%, 50%, 0.15)`
  const lineAlpha = 0.3 + (liberationProgress / 100) * 0.2 // Brighter as progress increases

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d",
      }}
    >
      {/* The infinite scrolling grid floor with dynamic color */}
      <motion.div
        className="absolute left-0 right-0 bottom-0 h-[150vh]"
        style={{
          transformOrigin: "center bottom",
          transform: "rotateX(75deg) translateZ(-100px)",
          background: `
            linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.9) 100%),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 98px,
              ${gridColor.replace(")", `, ${lineAlpha})`).replace("hsl", "hsla")} 98px,
              ${gridColor.replace(")", `, ${lineAlpha})`).replace("hsl", "hsla")} 100px
            ),
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 98px,
              ${gridColor.replace(")", `, ${lineAlpha})`).replace("hsl", "hsla")} 98px,
              ${gridColor.replace(")", `, ${lineAlpha})`).replace("hsl", "hsla")} 100px
            )
          `,
          backgroundSize: "100px 100px",
          transition: "all 1.5s ease-out", // Smooth transition for color changes
        }}
        animate={{
          backgroundPositionY: ["0px", "100px"],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />

      {/* Glow effect at horizon with dynamic color */}
      <div
        className="absolute left-0 right-0 top-1/3 h-32 pointer-events-none transition-all duration-1000"
        style={{
          background: `radial-gradient(ellipse at center, ${glowColor} 0%, transparent 70%)`,
        }}
      />
    </div>
  )
}
