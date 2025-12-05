"use client"

import type React from "react"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface WhackAMoleProps {
  onWin: () => void
  onLoss: () => void
}

interface Target {
  id: number
  position: number
  isVirus: boolean
}

export function WhackAMole({ onWin, onLoss }: WhackAMoleProps) {
  const [targets, setTargets] = useState<Target[]>([])
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(15)
  const [gameActive, setGameActive] = useState(true)
  const gameActiveRef = useRef(true)
  const scoreRef = useRef(0)

  const WIN_SCORE = 5

  useEffect(() => {
    gameActiveRef.current = gameActive
  }, [gameActive])

  useEffect(() => {
    scoreRef.current = score
  }, [score])

  // Timer countdown
  useEffect(() => {
    if (!gameActive) return
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameActive(false)
          console.log("[v0] WhackAMole: Time's up! Calling onLoss")
          onLoss()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [gameActive, onLoss])

  // Spawn targets
  useEffect(() => {
    if (!gameActive) return

    const spawnTarget = () => {
      const id = Date.now() + Math.random()
      const position = Math.floor(Math.random() * 9)
      const isVirus = Math.random() > 0.3 // 70% virus

      setTargets((prev) => {
        const filtered = prev.filter((t) => t.position !== position)
        return [...filtered, { id, position, isVirus }]
      })

      setTimeout(
        () => {
          setTargets((prev) => prev.filter((t) => t.id !== id))
        },
        600 + Math.random() * 400,
      )
    }

    const interval = setInterval(spawnTarget, 500)
    spawnTarget()

    return () => clearInterval(interval)
  }, [gameActive])

  const handleClick = useCallback(
    (e: React.MouseEvent, target: Target) => {
      e.stopPropagation()
      if (!gameActiveRef.current) return

      console.log("[v0] WhackAMole: Clicked target, isVirus:", target.isVirus)

      if (target.isVirus) {
        const newScore = scoreRef.current + 1
        setScore(newScore)
        console.log("[v0] WhackAMole: Hit virus! Score:", newScore)

        if (newScore >= WIN_SCORE) {
          setGameActive(false)
          console.log("[v0] WhackAMole: WIN! Calling onWin")
          onWin()
        }
      } else {
        // Clicked system file - lose
        setGameActive(false)
        console.log("[v0] WhackAMole: Hit system file! Calling onLoss")
        onLoss()
      }

      setTargets((prev) => prev.filter((t) => t.id !== target.id))
    },
    [onWin, onLoss],
  )

  const getPosition = (index: number) => {
    const row = Math.floor(index / 3)
    const col = index % 3
    return { left: `${col * 33.33 + 16.66}%`, top: `${row * 30 + 20}%` }
  }

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      {/* HUD */}
      <div className="absolute top-1 left-1 right-1 flex justify-between z-20 font-mono text-[8px]">
        <span className="text-red-400">
          HIT: {score}/{WIN_SCORE}
        </span>
        <span className={`${timeLeft <= 5 ? "text-red-400 animate-pulse" : "text-cyan-400"}`}>{timeLeft}s</span>
      </div>

      {/* Grid background */}
      <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-0.5 p-4 pt-6">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="border border-red-900/30 rounded bg-red-950/10" />
        ))}
      </div>

      {/* Targets */}
      <AnimatePresence>
        {targets.map((target) => {
          const pos = getPosition(target.position)
          return (
            <motion.button
              key={target.id}
              className="absolute w-8 h-8 -ml-4 -mt-4 cursor-crosshair z-30"
              style={{ left: pos.left, top: pos.top }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
              onClick={(e) => handleClick(e, target)}
            >
              <div
                className={`w-full h-full rounded flex items-center justify-center text-sm font-bold ${
                  target.isVirus ? "bg-red-600 border border-red-400" : "bg-blue-600 border border-blue-400"
                }`}
                style={{ boxShadow: target.isVirus ? "0 0 10px rgba(255,0,0,0.5)" : "0 0 10px rgba(0,100,255,0.5)" }}
              >
                {target.isVirus ? "X" : "F"}
              </div>
            </motion.button>
          )
        })}
      </AnimatePresence>

      {/* Instructions */}
      <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 text-red-400/50 font-mono text-[6px]">
        CLICK X AVOID F
      </div>
    </div>
  )
}
