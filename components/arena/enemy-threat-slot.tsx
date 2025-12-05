"use client"

import { motion } from "framer-motion"
import type { Boss } from "@/lib/game-types"

interface EnemyThreatSlotProps {
  boss: Boss
  isVisible: boolean
}

export function EnemyThreatSlot({ boss, isVisible }: EnemyThreatSlotProps) {
  if (!isVisible) return null

  return (
    <motion.div
      className="absolute top-20 left-1/2 -translate-x-1/2 z-10"
      style={{
        transformStyle: "preserve-3d",
      }}
      initial={{
        y: -200,
        opacity: 0,
        rotateX: -30,
        z: -100,
      }}
      animate={{
        y: -50, // Moved UP closer to boss tower
        opacity: 1,
        rotateX: 0,
        z: -50, // Pushed BACK in 3D space per specification
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 15,
        delay: 0.3,
      }}
    >
      <motion.div
        animate={{
          y: [0, -8, 0],
          rotateZ: [-0.5, 0.5, -0.5],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        {/* Glitched jagged border card */}
        <motion.div
          className="relative"
          animate={{
            boxShadow: [
              "0 0 20px rgba(255,0,0,0.5), 0 0 40px rgba(255,0,0,0.3)",
              "0 0 30px rgba(255,0,0,0.8), 0 0 60px rgba(255,0,0,0.5)",
              "0 0 20px rgba(255,0,0,0.5), 0 0 40px rgba(255,0,0,0.3)",
            ],
          }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
        >
          {/* Jagged border SVG clip path */}
          <svg width="0" height="0" className="absolute">
            <defs>
              <clipPath id="jaggedBorder" clipPathUnits="objectBoundingBox">
                <path
                  d="
                  M 0.02 0.05
                  L 0.1 0
                  L 0.2 0.03
                  L 0.35 0
                  L 0.5 0.02
                  L 0.65 0
                  L 0.8 0.03
                  L 0.9 0
                  L 0.98 0.05
                  L 1 0.15
                  L 0.97 0.3
                  L 1 0.5
                  L 0.97 0.7
                  L 1 0.85
                  L 0.98 0.95
                  L 0.9 1
                  L 0.8 0.97
                  L 0.65 1
                  L 0.5 0.98
                  L 0.35 1
                  L 0.2 0.97
                  L 0.1 1
                  L 0.02 0.95
                  L 0 0.85
                  L 0.03 0.7
                  L 0 0.5
                  L 0.03 0.3
                  L 0 0.15
                  Z
                "
                />
              </clipPath>
            </defs>
          </svg>

          <div
            className="relative w-56 h-72"
            style={{
              clipPath: "url(#jaggedBorder)",
              background: "linear-gradient(180deg, #1a0000 0%, #330000 50%, #1a0000 100%)",
              transform: "translateZ(-50px)", // Additional Z push back
            }}
          >
            {/* Glitch overlay */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,0,0,0.03) 2px, rgba(255,0,0,0.03) 4px)",
              }}
              animate={{
                opacity: [0.5, 0.8, 0.5],
                y: [0, -2, 0],
              }}
              transition={{ duration: 0.1, repeat: Number.POSITIVE_INFINITY }}
            />

            {/* Card content */}
            <div className="relative h-full p-4 flex flex-col items-center justify-between">
              {/* Boss icon top */}
              <div className="w-16 h-16 flex items-center justify-center">
                <BossIcon icon={boss.icon} color={boss.color} />
              </div>

              {/* Attack name */}
              <div className="text-center flex-1 flex flex-col justify-center">
                <motion.h3
                  className="font-pixel text-[10px] text-red-500 tracking-wider mb-2"
                  animate={{
                    textShadow: ["0 0 5px #ff0000", "0 0 15px #ff0000, 0 0 25px #ff0000", "0 0 5px #ff0000"],
                  }}
                  transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY }}
                >
                  INCOMING ATTACK
                </motion.h3>

                <h2
                  className="font-pixel text-[14px] text-white tracking-wide leading-tight"
                  style={{ textShadow: "2px 2px 0 #ff0000" }}
                >
                  {boss.attack}
                </h2>

                <p className="font-mono text-[9px] text-red-400/70 mt-2 italic">ref: {boss.attackRef}</p>
              </div>

              {/* Boss name */}
              <div
                className="px-3 py-1 rounded-sm"
                style={{
                  background: "rgba(0,0,0,0.8)",
                  border: `1px solid ${boss.color}`,
                }}
              >
                <span className="font-pixel text-[8px] tracking-wider" style={{ color: boss.color }}>
                  {boss.name}
                </span>
              </div>
            </div>

            {/* Corruption veins */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
              <motion.path
                d="M 0 50 Q 50 80 100 40 Q 150 60 200 30"
                fill="none"
                stroke="rgba(255,0,0,0.3)"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              />
              <motion.path
                d="M 0 150 Q 60 120 120 160 Q 180 140 220 180"
                fill="none"
                stroke="rgba(255,0,0,0.2)"
                strokeWidth="1.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2.5, delay: 0.5, repeat: Number.POSITIVE_INFINITY }}
              />
            </svg>

            {/* Red glow edges */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                boxShadow: "inset 0 0 30px rgba(255,0,0,0.4)",
              }}
            />
          </div>

          {/* Pulsing danger indicator */}
          <motion.div
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center"
            style={{ background: "#ff0000" }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [1, 0.7, 1],
            }}
            transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY }}
          >
            <span className="font-pixel text-[8px] text-white">!</span>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

function BossIcon({ icon, color }: { icon: string; color: string }) {
  switch (icon) {
    case "window":
      return (
        <svg viewBox="0 0 32 32" className="w-full h-full">
          <rect x="2" y="2" width="13" height="13" fill={color} rx="1" />
          <rect x="17" y="2" width="13" height="13" fill={color} rx="1" />
          <rect x="2" y="17" width="13" height="13" fill={color} rx="1" />
          <rect x="17" y="17" width="13" height="13" fill={color} rx="1" />
        </svg>
      )
    case "g":
      return (
        <svg viewBox="0 0 32 32" className="w-full h-full">
          <path
            d="M16 4 C9 4 4 10 4 16 C4 22 9 28 16 28 C20 28 23 26 25 23 L20 20 C19 21 18 22 16 22 C12 22 10 19 10 16 C10 13 12 10 16 10 C18 10 20 11 21 12 L26 8 C23 5 20 4 16 4 Z"
            fill={color}
          />
          <rect x="16" y="14" width="12" height="5" fill={color} />
        </svg>
      )
    case "adobe":
      return (
        <svg viewBox="0 0 32 32" className="w-full h-full">
          <path d="M4 28 L4 4 L16 28 Z" fill={color} />
          <path d="M28 28 L28 4 L16 28 Z" fill={color} />
          <path d="M12 18 L20 18 L16 10 Z" fill="#1a0000" />
        </svg>
      )
    case "meta":
      return (
        <svg viewBox="0 0 32 32" className="w-full h-full">
          <path
            d="M4 16 C4 8 8 4 12 4 C14 4 16 6 16 10 L16 22 C16 26 14 28 12 28 C8 28 4 24 4 16 Z"
            fill="none"
            stroke={color}
            strokeWidth="3"
          />
          <path
            d="M28 16 C28 8 24 4 20 4 C18 4 16 6 16 10 L16 22 C16 26 18 28 20 28 C24 28 28 24 28 16 Z"
            fill="none"
            stroke={color}
            strokeWidth="3"
          />
        </svg>
      )
    case "apple":
      return (
        <svg viewBox="0 0 32 32" className="w-full h-full">
          <path d="M16 6 C16 4 18 2 20 2 C20 4 18 6 16 6 Z" fill={color} />
          <path
            d="M12 8 C8 8 4 12 4 18 C4 24 8 28 12 28 C14 28 15 27 16 27 C17 27 18 28 20 28 C24 28 28 24 28 18 C28 12 24 8 20 8 C18 8 17 9 16 9 C15 9 14 8 12 8 Z"
            fill={color}
          />
        </svg>
      )
    default:
      return (
        <div className="w-12 h-12 rounded bg-red-900 flex items-center justify-center">
          <span className="font-pixel text-red-500 text-lg">?</span>
        </div>
      )
  }
}
