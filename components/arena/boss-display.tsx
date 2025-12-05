"use client"

import { motion } from "framer-motion"
import type { Boss } from "@/lib/game-types"

interface BossDisplayProps {
  boss: Boss
  isAttacking: boolean
}

function BossLogo({ icon, color, size = 120 }: { icon: string; color: string; size?: number }) {
  switch (icon) {
    case "window":
      return (
        <svg viewBox="0 0 24 24" width={size} height={size}>
          <rect x="2" y="2" width="9" height="9" fill={color} rx="1" />
          <rect x="13" y="2" width="9" height="9" fill={color} rx="1" />
          <rect x="2" y="13" width="9" height="9" fill={color} rx="1" />
          <rect x="13" y="13" width="9" height="9" fill={color} rx="1" />
        </svg>
      )
    case "g":
      return (
        <svg viewBox="0 0 24 24" width={size} height={size}>
          <circle cx="12" cy="12" r="10" fill="none" stroke={color} strokeWidth="3" />
          <path d="M12 12 H22" stroke={color} strokeWidth="3" />
          <text x="8" y="16" fontSize="10" fontWeight="bold" fill={color}>
            G
          </text>
        </svg>
      )
    case "adobe":
      return (
        <svg viewBox="0 0 24 24" width={size} height={size}>
          <polygon points="12,1 23,23 1,23" fill={color} />
          <text x="12" y="18" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#fff">
            A
          </text>
        </svg>
      )
    case "meta":
      return (
        <svg viewBox="0 0 24 24" width={size} height={size}>
          <path d="M2 12 Q7 4, 12 12 Q17 20, 22 12" fill="none" stroke={color} strokeWidth="3" />
          <circle cx="6" cy="12" r="2" fill={color} />
          <circle cx="18" cy="12" r="2" fill={color} />
        </svg>
      )
    case "apple":
      return (
        <svg viewBox="0 0 24 24" width={size} height={size}>
          <ellipse cx="12" cy="15" rx="8" ry="8" fill={color} />
          <path d="M12 7 Q12 3, 15 3" stroke="#666" strokeWidth="2" fill="none" />
          <ellipse cx="16" cy="4" rx="2" ry="1.5" fill="#4a4" />
        </svg>
      )
    default:
      return null
  }
}

export function BossDisplay({ boss, isAttacking }: BossDisplayProps) {
  return (
    <motion.div
      className="absolute top-10 left-1/2 -translate-x-1/2 z-20"
      initial={{ y: -200, opacity: 0, scale: 0.5 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.5 }}
    >
      {/* Boss Container */}
      <motion.div
        className="relative flex flex-col items-center"
        animate={isAttacking ? { scale: [1, 1.1, 1], y: [0, -10, 0] } : {}}
        transition={{ duration: 0.5, repeat: isAttacking ? Number.POSITIVE_INFINITY : 0 }}
      >
        {/* Evil Aura */}
        <motion.div
          className="absolute inset-0 rounded-full blur-3xl"
          style={{ background: boss.color, opacity: 0.3 }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        />

        {/* Logo */}
        <div
          className="relative p-6 rounded-2xl"
          style={{
            background: "rgba(0,0,0,0.8)",
            border: `3px solid ${boss.color}`,
            boxShadow: `0 0 40px ${boss.color}60, inset 0 0 20px ${boss.color}30`,
          }}
        >
          <BossLogo icon={boss.icon} color={boss.color} size={100} />
        </div>

        {/* Name Plate */}
        <motion.div
          className="mt-4 px-6 py-2 rounded"
          style={{
            background: "rgba(0,0,0,0.9)",
            border: `2px solid ${boss.color}`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <h2
            className="font-mono text-2xl font-bold tracking-wider"
            style={{ color: boss.color, textShadow: `0 0 20px ${boss.color}` }}
          >
            {boss.name}
          </h2>
          <p className="text-center text-xs font-mono text-gray-500 italic">{boss.displayName}</p>
        </motion.div>

        {/* Attack Name (shown when attacking) */}
        {isAttacking && (
          <motion.div
            className="absolute -bottom-16 left-1/2 -translate-x-1/2 whitespace-nowrap"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <span
              className="px-4 py-2 font-mono text-sm font-bold tracking-wider rounded"
              style={{
                background: "rgba(255,0,0,0.2)",
                border: "1px solid #ff0000",
                color: "#ff4444",
              }}
            >
              ⚡ {boss.attack.toUpperCase()} ⚡
            </span>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}
