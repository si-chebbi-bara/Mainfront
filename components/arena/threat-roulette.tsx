"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect, useCallback } from "react"
import type { Boss } from "@/lib/game-types"
import { BOSSES } from "@/lib/game-types"

interface ThreatRouletteProps {
  onBossSelected: (boss: Boss) => void
  excludeBosses?: string[] // Exclude already defeated bosses
}

function BossIcon({ icon, color }: { icon: string; color: string }) {
  switch (icon) {
    case "window":
      return (
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <rect x="2" y="2" width="9" height="9" fill={color} />
          <rect x="13" y="2" width="9" height="9" fill={color} />
          <rect x="2" y="13" width="9" height="9" fill={color} />
          <rect x="13" y="13" width="9" height="9" fill={color} />
        </svg>
      )
    case "g":
      return (
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <text x="50%" y="75%" textAnchor="middle" fontSize="20" fontWeight="bold" fill={color}>
            G
          </text>
        </svg>
      )
    case "adobe":
      return (
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <polygon points="12,2 22,22 2,22" fill={color} />
          <text x="50%" y="70%" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#fff">
            A
          </text>
        </svg>
      )
    case "meta":
      return (
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <text x="50%" y="75%" textAnchor="middle" fontSize="16" fontWeight="bold" fill={color}>
            M
          </text>
        </svg>
      )
    case "apple":
      return (
        <svg viewBox="0 0 24 24" className="w-full h-full">
          <ellipse cx="12" cy="14" rx="8" ry="9" fill={color} />
          <rect x="11" y="2" width="2" height="5" fill="#8b4513" />
          <ellipse cx="15" cy="4" rx="3" ry="2" fill="#228b22" />
        </svg>
      )
    default:
      return null
  }
}

export function ThreatRoulette({ onBossSelected, excludeBosses = [] }: ThreatRouletteProps) {
  const availableBosses = BOSSES.filter((b) => !excludeBosses.includes(b.id))

  const [phase, setPhase] = useState<"idle" | "scanning" | "slowing" | "locked">("idle")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedBoss, setSelectedBoss] = useState<Boss | null>(null)
  const [scanSpeed, setScanSpeed] = useState(80)

  const startScan = useCallback(() => {
    setPhase("scanning")
    setScanSpeed(80)

    // Fast scan phase
    setTimeout(() => {
      setPhase("slowing")
      // Pick random boss from available
      const randomIndex = Math.floor(Math.random() * availableBosses.length)
      setSelectedBoss(availableBosses[randomIndex])
    }, 2000)
  }, [availableBosses])

  useEffect(() => {
    if (phase === "idle" || phase === "locked") return

    const speed = phase === "scanning" ? scanSpeed : scanSpeed * 1.5

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % availableBosses.length)

      if (phase === "slowing") {
        setScanSpeed((prev) => {
          const newSpeed = prev * 1.15
          if (newSpeed > 600) {
            // Lock onto selected boss
            setCurrentIndex(availableBosses.findIndex((b) => b.id === selectedBoss?.id))
            setPhase("locked")
            return prev
          }
          return newSpeed
        })
      }
    }, speed)

    return () => clearInterval(interval)
  }, [phase, scanSpeed, selectedBoss, availableBosses])

  useEffect(() => {
    if (phase === "locked" && selectedBoss) {
      // Wait then transition
      const timer = setTimeout(() => {
        onBossSelected(selectedBoss)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [phase, selectedBoss, onBossSelected])

  const displayBoss = availableBosses[currentIndex] || BOSSES[0]

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ background: "radial-gradient(ellipse at center, #0a0a1a 0%, #000 100%)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Scanlines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            rgba(0,0,0,0.1),
            rgba(0,0,0,0.1) 1px,
            transparent 1px,
            transparent 2px
          )`,
        }}
      />

      {/* Main Scanner Window */}
      <motion.div
        className="relative"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        {/* Pixelated Window Frame */}
        <div
          className="relative p-8 rounded-lg"
          style={{
            background: "#0a0a0a",
            border: "4px solid #333",
            boxShadow: "8px 8px 0 #000, inset 0 0 40px rgba(0,255,0,0.1)",
            minWidth: "500px",
          }}
        >
          {/* Title Bar */}
          <div
            className="absolute -top-8 left-0 right-0 h-8 flex items-center px-4"
            style={{
              background: "linear-gradient(180deg, #333 0%, #1a1a1a 100%)",
              border: "2px solid #444",
            }}
          >
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <span className="ml-4 font-mono text-sm text-green-400 tracking-wider">threat_scanner.exe</span>
          </div>

          {excludeBosses.length > 0 && (
            <div className="text-center mb-4">
              <span className="font-mono text-xs text-cyan-400">
                TARGETS NEUTRALIZED: {excludeBosses.length}/{BOSSES.length}
              </span>
            </div>
          )}

          {/* Header Text */}
          <motion.div
            className="text-center mb-8"
            animate={phase === "scanning" ? { opacity: [0.5, 1, 0.5] } : {}}
            transition={{ duration: 0.5, repeat: phase === "scanning" ? Number.POSITIVE_INFINITY : 0 }}
          >
            <span
              className="font-mono text-xl tracking-[0.3em] uppercase"
              style={{ color: phase === "locked" ? "#ff0000" : "#00ff00" }}
            >
              {phase === "idle" && "READY TO SCAN..."}
              {phase === "scanning" && "SCANNING FOR MONOPOLIES..."}
              {phase === "slowing" && "THREAT DETECTED..."}
              {phase === "locked" && "TARGET LOCKED"}
            </span>
          </motion.div>

          {/* Boss Display Area */}
          <div
            className="relative w-64 h-64 mx-auto mb-8 flex items-center justify-center"
            style={{
              background: "#000",
              border: phase === "locked" ? `3px solid ${displayBoss.color}` : "3px solid #333",
              boxShadow:
                phase === "locked"
                  ? `0 0 40px ${displayBoss.color}, inset 0 0 30px ${displayBoss.color}40`
                  : "inset 0 0 30px rgba(0,255,0,0.1)",
            }}
          >
            {/* Scanning effect */}
            {(phase === "scanning" || phase === "slowing") && (
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "linear-gradient(180deg, transparent 0%, rgba(0,255,0,0.2) 50%, transparent 100%)",
                }}
                animate={{ y: ["-100%", "100%"] }}
                transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              />
            )}

            {/* Boss Icon */}
            <motion.div
              className="w-32 h-32"
              animate={phase === "locked" ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.5, repeat: phase === "locked" ? Number.POSITIVE_INFINITY : 0 }}
            >
              <BossIcon icon={displayBoss.icon} color={displayBoss.color} />
            </motion.div>
          </div>

          {/* Boss Info (shown when locked) */}
          <AnimatePresence>
            {phase === "locked" && selectedBoss && (
              <motion.div className="text-center mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h2
                  className="font-mono text-3xl font-bold mb-2"
                  style={{ color: selectedBoss.color, textShadow: `0 0 20px ${selectedBoss.color}` }}
                >
                  {selectedBoss.name}
                </h2>
                <p className="font-mono text-sm text-gray-400 italic">"{selectedBoss.displayName}"</p>
                <p className="font-mono text-xs text-red-400 mt-2">Attack: {selectedBoss.attack}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Boss Indicators */}
          <div className="flex justify-center gap-3 mb-8">
            {availableBosses.map((boss, idx) => (
              <motion.div
                key={boss.id}
                className="w-3 h-3 rounded-full"
                style={{
                  background: currentIndex === idx ? boss.color : "#333",
                  boxShadow: currentIndex === idx ? `0 0 10px ${boss.color}` : "none",
                }}
                animate={currentIndex === idx ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.2 }}
              />
            ))}
          </div>

          {/* Initiate Button */}
          {phase === "idle" && (
            <motion.button
              className="w-full py-4 font-mono text-xl tracking-widest uppercase"
              style={{
                background: "linear-gradient(180deg, #300 0%, #100 100%)",
                border: "3px solid #ff0000",
                color: "#ff0000",
                boxShadow: "0 0 30px rgba(255,0,0,0.3), inset 0 0 20px rgba(255,0,0,0.2)",
              }}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 0 50px rgba(255,0,0,0.5), inset 0 0 30px rgba(255,0,0,0.3)",
              }}
              whileTap={{ scale: 0.98 }}
              onClick={startScan}
            >
              [ INITIATE SCAN ]
            </motion.button>
          )}

          {/* Loading Bar */}
          {(phase === "scanning" || phase === "slowing") && (
            <div className="w-full h-4 rounded" style={{ background: "#111", border: "1px solid #333" }}>
              <motion.div
                className="h-full rounded"
                style={{ background: "#00ff00" }}
                animate={{ width: phase === "slowing" ? "100%" : ["0%", "70%"] }}
                transition={{ duration: phase === "slowing" ? 1.5 : 2 }}
              />
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
