"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface CaptureTheFlagProps {
  onWin: () => void
  onLoss: () => void
}

interface Player {
  id: string
  x: number
  y: number
  hasFlag: boolean
  team: "player" | "enemy"
}

interface Flag {
  x: number
  y: number
  carrier: string | null
}

export function CaptureTheFlag({ onWin, onLoss }: CaptureTheFlagProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameState, setGameState] = useState<"playing" | "won" | "lost">("playing")
  const [timeLeft, setTimeLeft] = useState(15)
  const [score, setScore] = useState(0)
  const gameStateRef = useRef({ gameActive: true })

  const CANVAS_WIDTH = 600
  const CANVAS_HEIGHT = 400
  const GRID_SIZE = 30

  // Game entities
  const playerRef = useRef<Player>({
    id: "player",
    x: 50,
    y: 200,
    hasFlag: false,
    team: "player",
  })

  const enemyRef = useRef<Player>({
    id: "enemy",
    x: 550,
    y: 200,
    hasFlag: true,
    team: "enemy",
  })

  const playerBaseRef = useRef({ x: 30, y: 180 })
  const enemyBaseRef = useRef({ x: 570, y: 180 })
  const flagRef = useRef<Flag>({ x: 570, y: 200, carrier: "enemy" })

  // Timer
  useEffect(() => {
    if (gameState !== "playing") return
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          gameStateRef.current.gameActive = false
          setGameState("lost")
          onLoss()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [gameState, onLoss])

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameStateRef.current.gameActive) return

      const player = playerRef.current
      const moveAmount = 15

      switch (e.key.toLowerCase()) {
        case "arrowup":
        case "w":
          e.preventDefault()
          player.y = Math.max(0, player.y - moveAmount)
          break
        case "arrowdown":
        case "s":
          e.preventDefault()
          player.y = Math.min(CANVAS_HEIGHT - 20, player.y + moveAmount)
          break
        case "arrowleft":
        case "a":
          e.preventDefault()
          player.x = Math.max(0, player.x - moveAmount)
          break
        case "arrowright":
        case "d":
          e.preventDefault()
          player.x = Math.min(CANVAS_WIDTH - 20, player.x + moveAmount)
          break
      }
    }

    window.addEventListener("keydown", handleKeyPress, true)
    return () => window.removeEventListener("keydown", handleKeyPress, true)
  }, [])

  // Game loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const gameLoop = setInterval(() => {
      if (!gameStateRef.current.gameActive) return

      const player = playerRef.current
      const enemy = enemyRef.current
      const flag = flagRef.current

      // Update flag position
      if (flag.carrier === "player") {
        flag.x = player.x
        flag.y = player.y

        // Check if player reached enemy base
        const distToEnemyBase = Math.hypot(player.x - enemyBaseRef.current.x, player.y - enemyBaseRef.current.y)
        if (distToEnemyBase < 30) {
          gameStateRef.current.gameActive = false
          setGameState("won")
          setScore((prev) => prev + 1)
          onWin()
          return
        }
      } else if (flag.carrier === "enemy") {
        flag.x = enemy.x
        flag.y = enemy.y
      }

      // Enemy AI - simple patrolling with aggression
      if (Math.random() > 0.8) {
        if (flag.carrier === "enemy") {
          // Move towards player if player is nearby
          if (Math.abs(enemy.x - player.x) < 150) {
            enemy.x += player.x > enemy.x ? 8 : -8
          } else {
            enemy.x += Math.random() > 0.5 ? 5 : -5
          }
        }
        enemy.y += (Math.random() - 0.5) * 10
      }

      enemy.x = Math.max(0, Math.min(CANVAS_WIDTH - 20, enemy.x))
      enemy.y = Math.max(0, Math.min(CANVAS_HEIGHT - 20, enemy.y))

      // Check collision: player catches flag
      if (flag.carrier !== "player") {
        const distToFlag = Math.hypot(player.x - flag.x, player.y - flag.y)
        if (distToFlag < 25) {
          flag.carrier = "player"
          player.hasFlag = true
        }
      }

      // Check collision: enemy catches player with flag
      if (player.hasFlag) {
        const distToEnemy = Math.hypot(player.x - enemy.x, player.y - enemy.y)
        if (distToEnemy < 30) {
          flag.carrier = "enemy"
          player.hasFlag = false
          // Reset to base
          player.x = playerBaseRef.current.x
          player.y = playerBaseRef.current.y
        }
      }

      // Draw game
      ctx.fillStyle = "#000"
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

      // Grid
      ctx.strokeStyle = "rgba(0,255,0,0.1)"
      ctx.lineWidth = 1
      for (let x = 0; x < CANVAS_WIDTH; x += GRID_SIZE) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, CANVAS_HEIGHT)
        ctx.stroke()
      }
      for (let y = 0; y < CANVAS_HEIGHT; y += GRID_SIZE) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(CANVAS_WIDTH, y)
        ctx.stroke()
      }

      // Bases
      ctx.fillStyle = "rgba(0,255,0,0.3)"
      ctx.fillRect(playerBaseRef.current.x - 20, playerBaseRef.current.y - 20, 40, 40)
      ctx.strokeStyle = "#00ff00"
      ctx.lineWidth = 2
      ctx.strokeRect(playerBaseRef.current.x - 20, playerBaseRef.current.y - 20, 40, 40)

      ctx.fillStyle = "rgba(255,0,0,0.3)"
      ctx.fillRect(enemyBaseRef.current.x - 20, enemyBaseRef.current.y - 20, 40, 40)
      ctx.strokeStyle = "#ff0000"
      ctx.lineWidth = 2
      ctx.strokeRect(enemyBaseRef.current.x - 20, enemyBaseRef.current.y - 20, 40, 40)

      // Player
      ctx.fillStyle = "#00ffff"
      ctx.beginPath()
      ctx.arc(player.x, player.y, 10, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 2
      ctx.stroke()

      // Enemy
      ctx.fillStyle = "#ff0000"
      ctx.beginPath()
      ctx.arc(enemy.x, enemy.y, 10, 0, Math.PI * 2)
      ctx.fill()

      // Flag
      ctx.fillStyle = flag.carrier === "player" ? "#ffff00" : "#ff8800"
      ctx.fillRect(flag.x - 8, flag.y - 12, 16, 24)
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 1
      ctx.strokeRect(flag.x - 8, flag.y - 12, 16, 24)

      // Player indicator
      if (player.hasFlag) {
        ctx.strokeStyle = "#ffff00"
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(player.x, player.y, 15, 0, Math.PI * 2)
        ctx.stroke()
      }
    }, 50)

    return () => clearInterval(gameLoop)
  }, [onWin, onLoss])

  return (
    <div className="relative w-full h-full bg-black flex flex-col items-center justify-center">
      {/* HUD */}
      <div className="absolute top-2 left-2 right-2 flex justify-between z-20 font-mono text-xs">
        <span className="text-cyan-400">CTF PROTOCOL</span>
        <span className={`${timeLeft <= 5 ? "text-red-400 animate-pulse" : "text-green-400"}`}>{timeLeft}s</span>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="border-2 border-cyan-500"
        style={{
          boxShadow: "0 0 20px rgba(0,255,255,0.5)",
          marginTop: "20px",
        }}
      />

      {/* Instructions */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-center font-mono text-[10px]">
        <div className="text-cyan-400">CAPTURE ENEMY FLAG AND BRING TO BASE</div>
        <div className="text-green-400/70 mt-1">WASD / ARROWS TO MOVE</div>
      </div>

      {/* Win/Loss Overlay */}
      <AnimatePresence>
        {gameState === "won" && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, backgroundColor: "rgba(0,255,0,0.3)" }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="text-3xl font-bold font-mono text-green-400 text-center"
              style={{ textShadow: "0 0 30px #00ff00" }}
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.3, 1] }}
            >
              FLAG CAPTURED!
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {gameState === "lost" && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, backgroundColor: "rgba(255,0,0,0.3)" }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="text-3xl font-bold font-mono text-red-400 text-center"
              style={{ textShadow: "0 0 30px #ff0000" }}
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.3, 1] }}
            >
              TIME EXPIRED
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
