"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"

interface EndlessRunnerProps {
  onGameEnd: (won: boolean) => void
}

interface EyeTower {
  id: number
  lane: number
  x: number
}

const LANES = [0, 1, 2]
const LANE_HEIGHT = 60
const PLAYER_SIZE = 30
const TOWER_WIDTH = 40
const GAME_WIDTH = 280
const GAME_HEIGHT = 200
const SURVIVAL_TIME = 10 // seconds

export function EndlessRunner({ onGameEnd }: EndlessRunnerProps) {
  const [playerLane, setPlayerLane] = useState(1)
  const [towers, setTowers] = useState<EyeTower[]>([])
  const [timeLeft, setTimeLeft] = useState(SURVIVAL_TIME)
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)
  const nextTowerId = useRef(0)

  // Spawn towers
  useEffect(() => {
    if (gameOver) return

    const spawnInterval = setInterval(() => {
      const newTower: EyeTower = {
        id: nextTowerId.current++,
        lane: LANES[Math.floor(Math.random() * LANES.length)],
        x: GAME_WIDTH + TOWER_WIDTH,
      }
      setTowers((prev) => [...prev, newTower])
    }, 800)

    return () => clearInterval(spawnInterval)
  }, [gameOver])

  // Move towers
  useEffect(() => {
    if (gameOver) return

    const moveInterval = setInterval(() => {
      setTowers((prev) => prev.map((t) => ({ ...t, x: t.x - 6 })).filter((t) => t.x > -TOWER_WIDTH))
    }, 50)

    return () => clearInterval(moveInterval)
  }, [gameOver])

  // Collision detection
  useEffect(() => {
    if (gameOver) return

    const playerX = 40
    const playerY = 20 + playerLane * LANE_HEIGHT

    for (const tower of towers) {
      const towerY = 20 + tower.lane * LANE_HEIGHT

      if (tower.x < playerX + PLAYER_SIZE && tower.x + TOWER_WIDTH > playerX && tower.lane === playerLane) {
        setGameOver(true)
        setWon(false)
        onGameEnd(false)
        return
      }
    }
  }, [towers, playerLane, gameOver, onGameEnd])

  // Timer
  useEffect(() => {
    if (gameOver) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameOver(true)
          setWon(true)
          onGameEnd(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [gameOver, onGameEnd])

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return

      if ((e.key === "ArrowUp" || e.key === "w" || e.key === "W") && playerLane > 0) {
        setPlayerLane((prev) => prev - 1)
      }
      if ((e.key === "ArrowDown" || e.key === "s" || e.key === "S") && playerLane < 2) {
        setPlayerLane((prev) => prev + 1)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [playerLane, gameOver])

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
      {/* HUD */}
      <div className="flex justify-between w-full mb-2 px-2">
        <span className="font-mono text-xs text-cyan-400">SURVIVE: {timeLeft}s</span>
        <span className="font-mono text-xs text-purple-400">DODGE THE EYES</span>
      </div>

      {/* Game Area */}
      <div
        className="relative rounded overflow-hidden"
        style={{
          width: GAME_WIDTH,
          height: GAME_HEIGHT,
          background: "#0a0010",
          border: "2px solid #6364ff",
        }}
      >
        {/* Lane Lines */}
        {LANES.map((lane) => (
          <div
            key={lane}
            className="absolute left-0 right-0"
            style={{
              top: 20 + lane * LANE_HEIGHT + LANE_HEIGHT / 2,
              height: 1,
              background: "rgba(99,100,255,0.2)",
            }}
          />
        ))}

        {/* Player (Running Pixel Figure) */}
        <motion.div
          className="absolute"
          style={{
            left: 40,
            width: PLAYER_SIZE,
            height: PLAYER_SIZE,
          }}
          animate={{
            top: 20 + playerLane * LANE_HEIGHT + (LANE_HEIGHT - PLAYER_SIZE) / 2,
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          {/* Simple pixel person */}
          <svg viewBox="0 0 16 16" className="w-full h-full" style={{ imageRendering: "pixelated" }}>
            <rect x="6" y="0" width="4" height="4" fill="#6364ff" />
            <rect x="4" y="4" width="8" height="6" fill="#6364ff" />
            <rect x="2" y="6" width="4" height="2" fill="#6364ff" />
            <rect x="10" y="6" width="4" height="2" fill="#6364ff" />
            <rect x="5" y="10" width="2" height="6" fill="#6364ff" />
            <rect x="9" y="10" width="2" height="6" fill="#6364ff" />
          </svg>
        </motion.div>

        {/* Eye Towers */}
        {towers.map((tower) => (
          <motion.div
            key={tower.id}
            className="absolute"
            style={{
              left: tower.x,
              top: 20 + tower.lane * LANE_HEIGHT + (LANE_HEIGHT - 50) / 2,
              width: TOWER_WIDTH,
              height: 50,
            }}
          >
            {/* Tower with Eye */}
            <svg viewBox="0 0 24 32" className="w-full h-full">
              <rect x="4" y="8" width="16" height="24" fill="#1a0a30" stroke="#f00" strokeWidth="1" />
              {/* Eye */}
              <ellipse cx="12" cy="18" rx="6" ry="4" fill="#fff" />
              <motion.circle
                cx="12"
                cy="18"
                r="3"
                fill="#f00"
                animate={{ cx: [10, 14, 10] }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
              />
            </svg>
          </motion.div>
        ))}

        {/* Ground */}
        <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: "#6364ff" }} />
      </div>

      {/* Controls */}
      <div className="mt-2 font-mono text-[10px] text-gray-500">[↑/↓] or [W/S] to switch lanes</div>
    </div>
  )
}
