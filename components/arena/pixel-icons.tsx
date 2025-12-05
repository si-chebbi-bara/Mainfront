"use client"

import type React from "react"

import { motion } from "framer-motion"

interface PixelIconProps {
  type: "kernel" | "firefox" | "libre" | "onion"
  className?: string
}

export function PixelIcon({ type, className = "" }: PixelIconProps) {
  const iconSize = "w-full h-full"

  switch (type) {
    case "kernel":
      // Tux Penguin with Shield
      return (
        <svg viewBox="0 0 32 32" className={`${iconSize} ${className}`}>
          {/* Shield Background */}
          <path
            d="M16 2 L28 8 L28 18 C28 24 22 30 16 32 C10 30 4 24 4 18 L4 8 Z"
            fill="#4a5568"
            stroke="#a0aec0"
            strokeWidth="1"
          />
          <path d="M16 4 L26 9 L26 18 C26 23 21 28 16 30 C11 28 6 23 6 18 L6 9 Z" fill="#2d3748" />
          {/* Tux Body */}
          <ellipse cx="16" cy="20" rx="6" ry="7" fill="#1a1a1a" />
          {/* Tux Belly */}
          <ellipse cx="16" cy="21" rx="4" ry="5" fill="#f7fafc" />
          {/* Tux Head */}
          <circle cx="16" cy="13" r="5" fill="#1a1a1a" />
          {/* Eyes */}
          <circle cx="14" cy="12" r="1.5" fill="white" />
          <circle cx="18" cy="12" r="1.5" fill="white" />
          <circle cx="14.3" cy="12.3" r="0.7" fill="black" />
          <circle cx="18.3" cy="12.3" r="0.7" fill="black" />
          {/* Beak */}
          <path d="M16 14 L14 16 L18 16 Z" fill="#f6ad55" />
        </svg>
      )

    case "firefox":
      // Fox wrapping globe
      return (
        <svg viewBox="0 0 32 32" className={`${iconSize} ${className}`}>
          {/* Globe */}
          <circle cx="16" cy="16" r="10" fill="#4299e1" stroke="#2b6cb0" strokeWidth="1" />
          <ellipse cx="16" cy="16" rx="4" ry="10" fill="none" stroke="#2b6cb0" strokeWidth="0.5" />
          <line x1="6" y1="16" x2="26" y2="16" stroke="#2b6cb0" strokeWidth="0.5" />
          <line x1="16" y1="6" x2="16" y2="26" stroke="#2b6cb0" strokeWidth="0.5" />
          {/* Fox Body wrapping */}
          <path d="M8 8 Q4 12 6 18 Q8 24 14 26 Q10 22 12 16 Q14 10 8 8" fill="#ed8936" />
          <path d="M8 8 Q12 6 16 4 Q20 6 22 10 Q18 8 14 10 Q10 12 8 8" fill="#ed8936" />
          {/* Fox tail */}
          <path d="M6 18 Q2 20 4 24 Q6 26 10 26 Q8 24 6 18" fill="#dd6b20" />
          {/* Fox ear */}
          <path d="M10 6 L8 2 L12 6 Z" fill="#ed8936" />
          {/* Fox eye */}
          <circle cx="11" cy="9" r="1" fill="white" />
          <circle cx="11.3" cy="9" r="0.5" fill="black" />
        </svg>
      )

    case "libre":
      // Document scroll as weapon
      return (
        <svg viewBox="0 0 32 32" className={`${iconSize} ${className}`}>
          {/* Scroll body */}
          <rect x="8" y="6" width="16" height="22" rx="2" fill="#f7fafc" stroke="#48bb78" strokeWidth="1.5" />
          {/* Scroll top curl */}
          <path d="M6 8 Q6 4 10 4 L22 4 Q26 4 26 8" fill="none" stroke="#48bb78" strokeWidth="1.5" />
          <ellipse cx="6" cy="8" rx="2" ry="4" fill="#e2e8f0" stroke="#48bb78" strokeWidth="1" />
          {/* Text lines */}
          <line x1="11" y1="10" x2="21" y2="10" stroke="#48bb78" strokeWidth="1" />
          <line x1="11" y1="14" x2="21" y2="14" stroke="#48bb78" strokeWidth="1" />
          <line x1="11" y1="18" x2="18" y2="18" stroke="#48bb78" strokeWidth="1" />
          {/* Sword blade coming from scroll */}
          <path d="M24 12 L30 6 L32 8 L26 14 Z" fill="#a0aec0" stroke="#718096" strokeWidth="0.5" />
          {/* Sword hilt */}
          <rect x="22" y="14" width="4" height="2" fill="#48bb78" />
        </svg>
      )

    case "onion":
      // Layered onion
      return (
        <svg viewBox="0 0 32 32" className={`${iconSize} ${className}`}>
          {/* Outer layer */}
          <ellipse cx="16" cy="18" rx="12" ry="10" fill="#553c9a" opacity="0.6" />
          {/* Second layer */}
          <ellipse cx="16" cy="17" rx="9" ry="8" fill="#6b46c1" opacity="0.7" />
          {/* Third layer */}
          <ellipse cx="16" cy="16" rx="6" ry="6" fill="#805ad5" opacity="0.8" />
          {/* Core */}
          <ellipse cx="16" cy="15" rx="3" ry="4" fill="#9f7aea" />
          {/* Highlight */}
          <ellipse cx="14" cy="13" rx="1" ry="1.5" fill="#e9d8fd" opacity="0.6" />
          {/* Stem */}
          <path d="M16 6 Q14 8 16 10 Q18 8 16 6" fill="#48bb78" />
          <line x1="16" y1="2" x2="16" y2="6" stroke="#48bb78" strokeWidth="1.5" />
        </svg>
      )

    default:
      return null
  }
}

export function GlowingIcon({ children, isEffective }: { children: React.ReactNode; isEffective: boolean }) {
  return (
    <motion.div
      className="relative"
      animate={
        isEffective
          ? {
              filter: ["drop-shadow(0 0 8px #00ff00)", "drop-shadow(0 0 20px #00ff00)", "drop-shadow(0 0 8px #00ff00)"],
            }
          : {}
      }
      transition={{ duration: 0.5, repeat: isEffective ? Number.POSITIVE_INFINITY : 0 }}
    >
      {children}
    </motion.div>
  )
}
