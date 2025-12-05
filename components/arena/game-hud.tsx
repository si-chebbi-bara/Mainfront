"use client"

import { motion } from "framer-motion"

interface GameHUDProps {
  playerHP: number
  maxPlayerHP: number
  enemyHP: number
  maxEnemyHP: number
  currentRound: number
  totalRounds: number
  score: number
  enemyName: string
  isHighlighted?: boolean
}

export function GameHUD({
  playerHP,
  maxPlayerHP,
  enemyHP,
  maxEnemyHP,
  currentRound,
  totalRounds,
  score,
  enemyName,
  isHighlighted = false,
}: GameHUDProps) {
  const playerBars = Math.round((playerHP / maxPlayerHP) * 10)
  const enemyBars = Math.round((enemyHP / maxEnemyHP) * 10)

  const renderBatteryMeter = (filled: number, color: string) => {
    const bars = []
    for (let i = 0; i < 10; i++) {
      bars.push(i < filled ? "|" : " ")
    }
    return `[${bars.join("")}]`
  }

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-50 pointer-events-none"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
    >
      <div
        className="relative px-4 py-3 mx-4 mt-4 rounded-sm"
        style={{
          background: "linear-gradient(180deg, rgba(0,20,0,0.95) 0%, rgba(0,10,0,0.9) 100%)",
          border: isHighlighted ? "2px solid #ffcc00" : "2px solid #00ff00",
          boxShadow: isHighlighted
            ? "0 0 30px rgba(255,204,0,0.5), inset 0 0 20px rgba(0,255,0,0.1)"
            : "0 0 20px rgba(0,255,0,0.3), inset 0 0 20px rgba(0,255,0,0.1)",
        }}
      >
        {/* Scanline effect */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            background:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.1) 2px, rgba(0,255,0,0.1) 4px)",
          }}
        />

        <div className="flex items-center justify-between relative">
          {/* Player Stats - Left */}
          <div className="flex flex-col gap-1">
            <span className="font-pixel text-[10px] text-green-400 tracking-wider">ROOT_USER</span>
            <div className="flex items-center gap-2">
              <span className="font-pixel text-[8px] text-green-300">HP</span>
              <motion.span
                className="font-mono text-sm tracking-tighter"
                style={{ color: playerHP > 3 ? "#00ff00" : "#ff0000" }}
                animate={playerHP <= 3 ? { opacity: [1, 0.5, 1] } : {}}
                transition={{ duration: 0.5, repeat: playerHP <= 3 ? Number.POSITIVE_INFINITY : 0 }}
              >
                {renderBatteryMeter(playerBars, "#00ff00")}
              </motion.span>
            </div>
          </div>

          {/* Center Stats */}
          <div className="flex flex-col items-center gap-1">
            <span className="font-pixel text-[10px] text-cyan-400 tracking-wider">
              ROUND {currentRound}/{totalRounds}
            </span>
            <span className="font-pixel text-[8px] text-cyan-300">SCORE: {score.toString().padStart(4, "0")}</span>
          </div>

          {/* Enemy Stats - Right */}
          <div className="flex flex-col gap-1 items-end">
            <span className="font-pixel text-[10px] text-red-400 tracking-wider">{enemyName}</span>
            <div className="flex items-center gap-2">
              <motion.span
                className="font-mono text-sm tracking-tighter"
                style={{ color: "#ff0000" }}
                animate={enemyHP <= 3 ? { opacity: [1, 0.5, 1] } : {}}
                transition={{ duration: 0.5, repeat: enemyHP <= 3 ? Number.POSITIVE_INFINITY : 0 }}
              >
                {renderBatteryMeter(enemyBars, "#ff0000")}
              </motion.span>
              <span className="font-pixel text-[8px] text-red-300">HP</span>
            </div>
          </div>
        </div>

        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-green-500" />
        <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-green-500" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-green-500" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-green-500" />
      </div>
    </motion.div>
  )
}
