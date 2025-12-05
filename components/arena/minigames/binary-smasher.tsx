"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface BinarySmasherProps {
  onGameEnd: (won: boolean) => void
}

interface Target {
  id: number
  position: number
  isVirus: boolean
  visible: boolean
}

export function BinarySmasher({ onGameEnd }: BinarySmasherProps) {
  const [targets, setTargets] = useState<Target[]>([])
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(15)
  const [gameActive, setGameActive] = useState(true)
  const [hitEffects, setHitEffects] = useState<{ id: number; position: number; success: boolean }[]>([])

  const WIN_SCORE = 10
  const GRID_POSITIONS = 9

  // Timer countdown
  useEffect(() => {
    if (!gameActive) return
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameActive(false)
          onGameEnd(score >= WIN_SCORE)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [gameActive, score, onGameEnd])

  // Spawn targets
  useEffect(() => {
    if (!gameActive) return

    const spawnTarget = () => {
      const id = Date.now()
      const position = Math.floor(Math.random() * GRID_POSITIONS)
      const isVirus = Math.random() > 0.25 // 75% chance of virus

      setTargets((prev) => {
        // Remove any target at this position
        const filtered = prev.filter((t) => t.position !== position)
        return [...filtered, { id, position, isVirus, visible: true }]
      })

      // Auto-hide after random time
      setTimeout(
        () => {
          setTargets((prev) => prev.filter((t) => t.id !== id))
        },
        800 + Math.random() * 600,
      )
    }

    const interval = setInterval(spawnTarget, 400 + Math.random() * 300)
    spawnTarget() // Initial spawn

    return () => clearInterval(interval)
  }, [gameActive])

  const handleClick = useCallback(
    (target: Target) => {
      if (!gameActive) return

      setHitEffects((prev) => [...prev, { id: target.id, position: target.position, success: target.isVirus }])
      setTimeout(() => {
        setHitEffects((prev) => prev.filter((e) => e.id !== target.id))
      }, 300)

      if (target.isVirus) {
        setScore((prev) => {
          const newScore = prev + 1
          if (newScore >= WIN_SCORE) {
            setGameActive(false)
            onGameEnd(true)
          }
          return newScore
        })
      } else {
        // Clicked a system file - lose!
        setGameActive(false)
        onGameEnd(false)
      }

      setTargets((prev) => prev.filter((t) => t.id !== target.id))
    },
    [gameActive, onGameEnd],
  )

  const getGridPosition = (index: number) => {
    const row = Math.floor(index / 3)
    const col = index % 3
    return {
      left: `${col * 33.33 + 16.66}%`,
      top: `${row * 28 + 22}%`,
    }
  }

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      {/* HUD */}
      <div className="absolute top-2 left-2 right-2 flex justify-between z-20 font-mono text-xs">
        <span className="text-red-400">
          DELETED: {score}/{WIN_SCORE}
        </span>
        <span className={`${timeLeft <= 5 ? "text-red-400 animate-pulse" : "text-cyan-400"}`}>TIME: {timeLeft}s</span>
      </div>

      {/* Grid background */}
      <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-1 p-8 pt-10">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="border border-red-900/30 rounded-lg bg-red-950/10" />
        ))}
      </div>

      {/* Targets */}
      <AnimatePresence>
        {targets.map((target) => {
          const pos = getGridPosition(target.position)
          return (
            <motion.button
              key={target.id}
              className="absolute w-16 h-16 -ml-8 -mt-8 cursor-crosshair"
              style={{ left: pos.left, top: pos.top }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
              onClick={() => handleClick(target)}
            >
              <div
                className={`w-full h-full rounded-lg flex items-center justify-center text-2xl font-bold font-mono ${
                  target.isVirus
                    ? "bg-red-600 text-white border-2 border-red-400"
                    : "bg-blue-600 text-white border-2 border-blue-400"
                }`}
                style={{
                  boxShadow: target.isVirus ? "0 0 20px rgba(255,0,0,0.5)" : "0 0 20px rgba(0,100,255,0.5)",
                }}
              >
                {target.isVirus ? "🦠" : "📁"}
              </div>
            </motion.button>
          )
        })}
      </AnimatePresence>

      {/* Hit effects */}
      <AnimatePresence>
        {hitEffects.map((effect) => {
          const pos = getGridPosition(effect.position)
          return (
            <motion.div
              key={effect.id}
              className="absolute w-20 h-20 -ml-10 -mt-10 pointer-events-none"
              style={{ left: pos.left, top: pos.top }}
              initial={{ scale: 0.5, opacity: 1 }}
              animate={{ scale: 2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className={`w-full h-full rounded-full ${effect.success ? "bg-green-500/30" : "bg-red-500/50"}`} />
            </motion.div>
          )
        })}
      </AnimatePresence>

      {/* Instructions */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-red-400/50 font-mono text-[9px] text-center">
        CLICK VIRUSES 🦠 - AVOID FILES 📁
      </div>
    </div>
  )
}
