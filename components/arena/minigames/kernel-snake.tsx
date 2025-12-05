"use client"

import { useState, useEffect } from "react"

interface KernelSnakeProps {
  onGameEnd: (won: boolean) => void
}

export function KernelSnake({ onGameEnd }: KernelSnakeProps) {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }])
  const [bugs, setBugs] = useState<{ x: number; y: number }[]>([])
  const [direction, setDirection] = useState({ x: 1, y: 0 })
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(15)
  const [gameActive, setGameActive] = useState(true)

  const GRID_SIZE = 20
  const WIN_SCORE = 5
  const cellSize = 100 / GRID_SIZE

  // Spawn initial bugs
  useEffect(() => {
    const initialBugs = Array.from({ length: 5 }, () => ({
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    }))
    setBugs(initialBugs)
  }, [])

  // Timer countdown
  useEffect(() => {
    if (!gameActive) return
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameActive(false)
          onGameEnd(false)
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
        case "arrowup":
        case "w":
          if (direction.y !== 1) setDirection({ x: 0, y: -1 })
          break
        case "arrowdown":
        case "s":
          if (direction.y !== -1) setDirection({ x: 0, y: 1 })
          break
        case "arrowleft":
        case "a":
          if (direction.x !== 1) setDirection({ x: -1, y: 0 })
          break
        case "arrowright":
        case "d":
          if (direction.x !== -1) setDirection({ x: 1, y: 0 })
          break
      }
    }
    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [direction, gameActive])

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
          onGameEnd(false)
          return prev
        }

        const newSnake = [newHead, ...prev]

        // Check for bug collision
        const bugIndex = bugs.findIndex((bug) => bug.x === newHead.x && bug.y === newHead.y)
        if (bugIndex !== -1) {
          setScore((s) => {
            const newScore = s + 1
            if (newScore >= WIN_SCORE) {
              setGameActive(false)
              onGameEnd(true)
            }
            return newScore
          })
          // Remove eaten bug and spawn new one
          setBugs((prev) => {
            const newBugs = [...prev]
            newBugs.splice(bugIndex, 1)
            newBugs.push({
              x: Math.floor(Math.random() * GRID_SIZE),
              y: Math.floor(Math.random() * GRID_SIZE),
            })
            return newBugs
          })
          return newSnake
        }

        newSnake.pop()
        return newSnake
      })
    }, 120)

    return () => clearInterval(gameLoop)
  }, [direction, bugs, gameActive, onGameEnd])

  return (
    <div className="relative w-full h-full bg-black">
      {/* HUD */}
      <div className="absolute top-2 left-2 right-2 flex justify-between z-20 font-mono text-xs">
        <span className="text-green-400">
          BUGS: {score}/{WIN_SCORE}
        </span>
        <span className={`${timeLeft <= 5 ? "text-red-400 animate-pulse" : "text-cyan-400"}`}>TIME: {timeLeft}s</span>
      </div>

      {/* Game Grid */}
      <svg className="w-full h-full" viewBox="0 0 100 100">
        {/* Grid lines */}
        {Array.from({ length: GRID_SIZE + 1 }).map((_, i) => (
          <g key={i}>
            <line x1={i * cellSize} y1={0} x2={i * cellSize} y2={100} stroke="rgba(0,255,0,0.08)" strokeWidth={0.2} />
            <line x1={0} y1={i * cellSize} x2={100} y2={i * cellSize} stroke="rgba(0,255,0,0.08)" strokeWidth={0.2} />
          </g>
        ))}

        {/* Bugs (red dots) */}
        {bugs.map((bug, i) => (
          <circle
            key={i}
            cx={bug.x * cellSize + cellSize / 2}
            cy={bug.y * cellSize + cellSize / 2}
            r={cellSize / 2.5}
            fill="#ff0000"
            style={{ filter: "drop-shadow(0 0 4px #ff0000)" }}
          />
        ))}

        {/* Snake (green line) */}
        {snake.map((segment, i) => (
          <rect
            key={i}
            x={segment.x * cellSize + 0.5}
            y={segment.y * cellSize + 0.5}
            width={cellSize - 1}
            height={cellSize - 1}
            rx={1}
            fill={i === 0 ? "#00ff00" : "#00cc00"}
            style={{ filter: i === 0 ? "drop-shadow(0 0 6px #00ff00)" : undefined }}
          />
        ))}
      </svg>

      {/* Controls hint */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-green-500/40 font-mono text-[9px]">
        WASD / ARROWS TO MOVE
      </div>
    </div>
  )
}
