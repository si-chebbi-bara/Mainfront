"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface PacketDodgeProps {
  onGameEnd: (won: boolean) => void
}

interface Tracker {
  id: number
  lanes: boolean[] // Which lanes have walls
  y: number
}

export function PacketDodge({ onGameEnd }: PacketDodgeProps) {
  const [playerLane, setPlayerLane] = useState(1) // 0, 1, or 2
  const [trackers, setTrackers] = useState<Tracker[]>([])
  const [timeLeft, setTimeLeft] = useState(10)
  const [gameActive, setGameActive] = useState(true)
  const [survived, setSurvived] = useState(0)

  const SURVIVE_TIME = 10
  const LANE_WIDTH = 33.33

  // Timer countdown
  useEffect(() => {
    if (!gameActive) return
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        setSurvived((s) => s + 1)
        if (prev <= 1) {
          setGameActive(false)
          onGameEnd(true) // Survived!
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [gameActive, onGameEnd])

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameActive) return
      switch (e.key.toLowerCase()) {
        case "arrowleft":
        case "a":
          setPlayerLane((prev) => Math.max(0, prev - 1))
          break
        case "arrowright":
        case "d":
          setPlayerLane((prev) => Math.min(2, prev + 1))
          break
      }
    }
    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [gameActive])

  // Spawn trackers
  useEffect(() => {
    if (!gameActive) return

    const spawnTracker = () => {
      const id = Date.now()
      // Random pattern - at least one lane must be open
      const pattern = Math.floor(Math.random() * 6)
      const lanes = [
        [true, true, false],
        [true, false, true],
        [false, true, true],
        [true, false, false],
        [false, true, false],
        [false, false, true],
      ][pattern]

      setTrackers((prev) => [...prev, { id, lanes, y: -15 }])
    }

    const interval = setInterval(spawnTracker, 800)
    return () => clearInterval(interval)
  }, [gameActive])

  // Move trackers and check collision
  useEffect(() => {
    if (!gameActive) return

    const gameLoop = setInterval(() => {
      setTrackers((prev) => {
        const updated = prev.map((t) => ({ ...t, y: t.y + 4 })).filter((t) => t.y < 110)

        // Check collision with player (player is at y ~85%)
        for (const tracker of updated) {
          if (tracker.y > 75 && tracker.y < 95) {
            if (tracker.lanes[playerLane]) {
              setGameActive(false)
              onGameEnd(false)
              return prev
            }
          }
        }

        return updated
      })
    }, 50)

    return () => clearInterval(gameLoop)
  }, [gameActive, playerLane, onGameEnd])

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      {/* HUD */}
      <div className="absolute top-2 left-2 right-2 flex justify-between z-20 font-mono text-xs">
        <span className="text-purple-400">SURVIVE: {survived}s</span>
        <span className={`${timeLeft <= 3 ? "text-green-400 animate-pulse" : "text-cyan-400"}`}>{timeLeft}s LEFT</span>
      </div>

      {/* Lane dividers */}
      <div className="absolute inset-0">
        <div className="absolute left-1/3 top-0 bottom-0 w-px bg-purple-500/20" />
        <div className="absolute left-2/3 top-0 bottom-0 w-px bg-purple-500/20" />
      </div>

      {/* Road lines animation */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 40px,
            rgba(128,0,255,0.1) 40px,
            rgba(128,0,255,0.1) 50px
          )`,
        }}
        animate={{ backgroundPositionY: ["0px", "50px"] }}
        transition={{ duration: 0.3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />

      {/* Trackers (walls of text) */}
      <AnimatePresence>
        {trackers.map((tracker) => (
          <div key={tracker.id} className="absolute left-0 right-0 h-10 flex" style={{ top: `${tracker.y}%` }}>
            {tracker.lanes.map((hasWall, lane) => (
              <div key={lane} className="flex-1 flex items-center justify-center">
                {hasWall && (
                  <div
                    className="w-[90%] h-8 bg-red-600/80 border border-red-400 rounded flex items-center justify-center font-mono text-[8px] text-red-200 overflow-hidden"
                    style={{ boxShadow: "0 0 15px rgba(255,0,0,0.4)" }}
                  >
                    {"<TRACKER>".repeat(3)}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </AnimatePresence>

      {/* Player (Data Packet) */}
      <motion.div
        className="absolute bottom-[12%] w-8 h-8"
        animate={{
          left: `${playerLane * LANE_WIDTH + LANE_WIDTH / 2}%`,
          x: "-50%",
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        <div
          className="w-full h-full bg-purple-500 rounded-sm border-2 border-purple-300 flex items-center justify-center font-mono text-[10px] text-white font-bold"
          style={{ boxShadow: "0 0 20px rgba(168,85,247,0.6)" }}
        >
          📦
        </div>
      </motion.div>

      {/* Instructions */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-purple-400/50 font-mono text-[9px]">
        ← → / A D TO DODGE
      </div>
    </div>
  )
}
