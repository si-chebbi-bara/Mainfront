"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface EndlessRunnerProps {
  onWin: () => void
  onLoss: () => void
}

interface Obstacle {
  id: number
  lane: number
  x: number
}

export function EndlessRunner({ onWin, onLoss }: EndlessRunnerProps) {
  const [playerLane, setPlayerLane] = useState(1) // 0, 1, 2
  const [isJumping, setIsJumping] = useState(false)
  const [obstacles, setObstacles] = useState<Obstacle[]>([])
  const [timeLeft, setTimeLeft] = useState(10)
  const [gameActive, setGameActive] = useState(true)
  const gameActiveRef = useRef(true)
  const playerLaneRef = useRef(1)
  const isJumpingRef = useRef(false)

  const LANES = 3
  const LANE_HEIGHT = 100 / LANES

  useEffect(() => {
    gameActiveRef.current = gameActive
  }, [gameActive])

  useEffect(() => {
    playerLaneRef.current = playerLane
  }, [playerLane])

  useEffect(() => {
    isJumpingRef.current = isJumping
  }, [isJumping])

  // Timer - survive 10 seconds to win
  useEffect(() => {
    if (!gameActive) return
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameActive(false)
          console.log("[v0] EndlessRunner: Survived! Calling onWin")
          onWin() // Survived!
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [gameActive, onWin])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameActiveRef.current) return
      e.preventDefault()
      e.stopPropagation()

      switch (e.key.toLowerCase()) {
        case "arrowup":
        case "w":
          setPlayerLane((prev) => Math.max(0, prev - 1))
          break
        case "arrowdown":
        case "s":
          setPlayerLane((prev) => Math.min(2, prev + 1))
          break
        case " ":
          if (!isJumpingRef.current) {
            setIsJumping(true)
            setTimeout(() => setIsJumping(false), 400)
          }
          break
      }
    }

    console.log("[v0] EndlessRunner: Adding keyboard listener")
    window.addEventListener("keydown", handleKeyPress, true)
    return () => {
      console.log("[v0] EndlessRunner: Removing keyboard listener")
      window.removeEventListener("keydown", handleKeyPress, true)
    }
  }, [])

  // Spawn obstacles
  useEffect(() => {
    if (!gameActive) return

    const spawnObstacle = () => {
      const id = Date.now() + Math.random()
      const lane = Math.floor(Math.random() * LANES)
      setObstacles((prev) => [...prev, { id, lane, x: 100 }])
    }

    const interval = setInterval(spawnObstacle, 800 + Math.random() * 500)
    return () => clearInterval(interval)
  }, [gameActive])

  // Move obstacles and check collisions
  useEffect(() => {
    if (!gameActive) return

    const gameLoop = setInterval(() => {
      setObstacles((prev) => {
        const updated = prev.map((obs) => ({ ...obs, x: obs.x - 4 })).filter((obs) => obs.x > -15)

        // Check collision (player is at x ~15)
        for (const obs of updated) {
          if (obs.x < 25 && obs.x > 5 && obs.lane === playerLaneRef.current && !isJumpingRef.current) {
            setGameActive(false)
            console.log("[v0] EndlessRunner: Hit obstacle! Calling onLoss")
            onLoss()
            break
          }
        }

        return updated
      })
    }, 50)

    return () => clearInterval(gameLoop)
  }, [gameActive, onLoss])

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      {/* HUD */}
      <div className="absolute top-1 left-1 right-1 flex justify-between z-20 font-mono text-[8px]">
        <span className="text-purple-400">SURVIVE</span>
        <span className={`${timeLeft <= 3 ? "text-green-400 animate-pulse" : "text-cyan-400"}`}>{timeLeft}s</span>
      </div>

      {/* Lanes */}
      <div className="absolute inset-x-0 top-6 bottom-4">
        {Array.from({ length: LANES }).map((_, i) => (
          <div
            key={i}
            className="border-b border-purple-900/50"
            style={{ height: `${LANE_HEIGHT}%`, background: i === playerLane ? "rgba(100,100,255,0.1)" : undefined }}
          />
        ))}
      </div>

      {/* Player (Packet) */}
      <motion.div
        className="absolute left-3 w-5 h-5 rounded bg-cyan-400"
        style={{
          top: `${6 + playerLane * LANE_HEIGHT + LANE_HEIGHT / 2 - 10}%`,
          boxShadow: "0 0 10px #00ffff",
        }}
        animate={{ y: isJumping ? -15 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 20 }}
      />

      {/* Obstacles (Firewalls) */}
      <AnimatePresence>
        {obstacles.map((obs) => (
          <motion.div
            key={obs.id}
            className="absolute w-3 h-5 bg-red-500"
            style={{
              left: `${obs.x}%`,
              top: `${6 + obs.lane * LANE_HEIGHT + LANE_HEIGHT / 2 - 10}%`,
              clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
              boxShadow: "0 0 8px #ff0000",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        ))}
      </AnimatePresence>

      {/* Scrolling lines effect */}
      <div className="absolute inset-x-0 top-6 bottom-4 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(100,100,255,0.1) 10px, rgba(100,100,255,0.1) 20px)",
          }}
          animate={{ x: [0, -20] }}
          transition={{ duration: 0.3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />
      </div>

      {/* Instructions */}
      <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 text-purple-400/50 font-mono text-[6px]">
        W/S TO MOVE | SPACE TO JUMP
      </div>
    </div>
  )
}
