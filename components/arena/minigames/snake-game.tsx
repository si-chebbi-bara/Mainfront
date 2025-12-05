"use client"

import { useState, useEffect, useRef } from "react"

interface SnakeGameProps {
  onWin: () => void
  onLoss: () => void
}

export function SnakeGame({ onWin, onLoss }: SnakeGameProps) {
  const [snake, setSnake] = useState([{ x: 5, y: 5 }])
  const [packages, setPackages] = useState<{ x: number; y: number }[]>([])
  const [direction, setDirection] = useState({ x: 1, y: 0 })
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(15)
  const [gameActive, setGameActive] = useState(true)
  const gameActiveRef = useRef(true)
  const scoreRef = useRef(0)

  const GRID_SIZE = 12
  const WIN_SCORE = 5
  const cellSize = 100 / GRID_SIZE

  // Spawn initial packages
  useEffect(() => {
    const initialPackages = Array.from({ length: 3 }, () => ({
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    }))
    setPackages(initialPackages)
  }, [])

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
          console.log("[v0] Snake: Time's up! Calling onLoss")
          onLoss()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [gameActive, onLoss])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameActiveRef.current) return
      e.preventDefault()
      e.stopPropagation()

      setDirection((prev) => {
        switch (e.key.toLowerCase()) {
          case "arrowup":
          case "w":
            if (prev.y !== 1) return { x: 0, y: -1 }
            break
          case "arrowdown":
          case "s":
            if (prev.y !== -1) return { x: 0, y: 1 }
            break
          case "arrowleft":
          case "a":
            if (prev.x !== 1) return { x: -1, y: 0 }
            break
          case "arrowright":
          case "d":
            if (prev.x !== -1) return { x: 1, y: 0 }
            break
        }
        return prev
      })
    }

    console.log("[v0] Snake: Adding keyboard listener")
    window.addEventListener("keydown", handleKeyPress, true)
    return () => {
      console.log("[v0] Snake: Removing keyboard listener")
      window.removeEventListener("keydown", handleKeyPress, true)
    }
  }, [])

  // Game loop
  useEffect(() => {
    if (!gameActive) return

    const gameLoop = setInterval(() => {
      setSnake((prev) => {
        const newHead = {
          x: (prev[0].x + direction.x + GRID_SIZE) % GRID_SIZE,
          y: (prev[0].y + direction.y + GRID_SIZE) % GRID_SIZE,
        }

        // Self collision
        if (prev.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameActive(false)
          console.log("[v0] Snake: Self collision! Calling onLoss")
          onLoss()
          return prev
        }

        const newSnake = [newHead, ...prev]

        // Check for package collision
        const pkgIndex = packages.findIndex((pkg) => pkg.x === newHead.x && pkg.y === newHead.y)
        if (pkgIndex !== -1) {
          const newScore = scoreRef.current + 1
          setScore(newScore)
          console.log("[v0] Snake: Package eaten! Score:", newScore)

          if (newScore >= WIN_SCORE) {
            setGameActive(false)
            console.log("[v0] Snake: WIN! Calling onWin")
            onWin()
          }
          // Remove eaten package and spawn new one
          setPackages((prev) => {
            const newPkgs = [...prev]
            newPkgs.splice(pkgIndex, 1)
            newPkgs.push({
              x: Math.floor(Math.random() * GRID_SIZE),
              y: Math.floor(Math.random() * GRID_SIZE),
            })
            return newPkgs
          })
          return newSnake
        }

        newSnake.pop()
        return newSnake
      })
    }, 150)

    return () => clearInterval(gameLoop)
  }, [direction, packages, gameActive, onWin, onLoss])

  return (
    <div className="relative w-full h-full bg-black">
      {/* HUD */}
      <div className="absolute top-1 left-1 right-1 flex justify-between z-20 font-mono text-[8px]">
        <span className="text-green-400">
          PKG: {score}/{WIN_SCORE}
        </span>
        <span className={`${timeLeft <= 5 ? "text-red-400 animate-pulse" : "text-cyan-400"}`}>{timeLeft}s</span>
      </div>

      {/* Game Grid */}
      <svg className="w-full h-full" viewBox="0 0 100 100">
        {/* Grid lines */}
        {Array.from({ length: GRID_SIZE + 1 }).map((_, i) => (
          <g key={i}>
            <line x1={i * cellSize} y1={0} x2={i * cellSize} y2={100} stroke="rgba(0,255,0,0.1)" strokeWidth={0.3} />
            <line x1={0} y1={i * cellSize} x2={100} y2={i * cellSize} stroke="rgba(0,255,0,0.1)" strokeWidth={0.3} />
          </g>
        ))}

        {/* Packages (cyan boxes) */}
        {packages.map((pkg, i) => (
          <rect
            key={i}
            x={pkg.x * cellSize + 1}
            y={pkg.y * cellSize + 1}
            width={cellSize - 2}
            height={cellSize - 2}
            fill="#00ffff"
            rx={1}
            style={{ filter: "drop-shadow(0 0 3px #00ffff)" }}
          />
        ))}

        {/* Snake */}
        {snake.map((segment, i) => (
          <rect
            key={i}
            x={segment.x * cellSize + 0.5}
            y={segment.y * cellSize + 0.5}
            width={cellSize - 1}
            height={cellSize - 1}
            rx={1}
            fill={i === 0 ? "#00ff00" : "#00cc00"}
            style={{ filter: i === 0 ? "drop-shadow(0 0 4px #00ff00)" : undefined }}
          />
        ))}
      </svg>

      {/* Controls hint */}
      <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 text-green-500/50 font-mono text-[6px]">
        WASD / ARROWS
      </div>
    </div>
  )
}
