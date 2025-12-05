"use client"

import { motion } from "framer-motion"
import { useState, useEffect, useCallback } from "react"
import type { CounterCard } from "@/lib/game-types"
import { Play } from "lucide-react"
import { KernelSnake } from "./minigames/kernel-snake"
import { BinarySmasher } from "./minigames/binary-smasher"
import { EndlessRunner } from "./minigames/endless-runner"

interface CardRevealProps {
  card: CounterCard
  onComplete: (won: boolean) => void
}

function getMinigameName(type: "snake" | "whack" | "runner"): string {
  switch (type) {
    case "snake":
      return "KERNEL SNAKE"
    case "whack":
      return "BINARY SMASHER"
    case "runner":
      return "ENDLESS RUNNER"
  }
}

function getMinigameHint(type: "snake" | "whack" | "runner"): string {
  switch (type) {
    case "snake":
      return "Eat 5 Bugs to Win!"
    case "whack":
      return "Smash 10 Pop-ups!"
    case "runner":
      return "Survive 10 Seconds!"
  }
}

export function CardReveal({ card, onComplete }: CardRevealProps) {
  const [phase, setPhase] = useState<"launch" | "flip" | "waiting" | "game" | "result">("launch")
  const [isFlipped, setIsFlipped] = useState(false)
  const [gameWon, setGameWon] = useState<boolean | null>(null)

  useEffect(() => {
    const launchTimer = setTimeout(() => {
      setPhase("flip")
      setTimeout(() => {
        setIsFlipped(true)
        setTimeout(() => {
          setPhase("waiting")
        }, 600)
      }, 500)
    }, 500)

    return () => clearTimeout(launchTimer)
  }, [])

  const handleStartGame = () => {
    setPhase("game")
  }

  const handleGameEnd = useCallback(
    (won: boolean) => {
      setGameWon(won)
      setPhase("result")
      setTimeout(() => onComplete(won), 1500)
    },
    [onComplete],
  )

  const renderMinigame = () => {
    switch (card.minigameType) {
      case "snake":
        return <KernelSnake onGameEnd={handleGameEnd} />
      case "whack":
        return <BinarySmasher onGameEnd={handleGameEnd} />
      case "runner":
        return <EndlessRunner onGameEnd={handleGameEnd} />
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      initial={{ backgroundColor: "rgba(0,0,0,0)" }}
      animate={{ backgroundColor: "rgba(0,0,0,0.85)" }}
    >
      <motion.div
        className="relative"
        initial={{ y: 300, scale: 0.3, rotateX: 60 }}
        animate={{ y: 0, scale: 1.5, rotateX: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        style={{ perspective: "1500px" }}
      >
        <motion.div
          className="relative w-[320px] h-[450px]"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front of card */}
          <div
            className="absolute inset-0 rounded-2xl overflow-hidden"
            style={{
              backfaceVisibility: "hidden",
              background: `linear-gradient(135deg, #0a1a0a 0%, #0d2d0d 100%)`,
              border: `3px solid ${card.color}`,
              boxShadow: `0 0 60px ${card.color}60`,
            }}
          >
            <div className="p-6 h-full flex flex-col">
              <div className="text-center mb-4">
                <span className="text-sm font-mono uppercase tracking-[0.3em]" style={{ color: card.color }}>
                  {card.visual}
                </span>
                <h2 className="text-2xl font-bold text-white mt-2 tracking-wide">{card.name}</h2>
              </div>

              <div className="flex-1 flex items-center justify-center">
                <motion.div
                  className="text-6xl"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  {card.icon === "penguin" && "🐧"}
                  {card.icon === "server" && "🖥️"}
                  {card.icon === "paintbrush" && "🎨"}
                  {card.icon === "islands" && "🏝️"}
                  {card.icon === "screwdriver" && "🔧"}
                </motion.div>
              </div>

              <p className="text-gray-400 font-mono text-center text-sm leading-relaxed italic">"{card.lore}"</p>
            </div>
          </div>

          {/* Back of card - CRT Game Screen */}
          <div
            className="absolute inset-0 rounded-2xl overflow-hidden"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              background: "#0a0a0a",
              border: `3px solid ${card.color}`,
              boxShadow: `0 0 60px ${card.color}60`,
            }}
          >
            <div className="absolute inset-3 rounded-lg overflow-hidden bg-black">
              {/* CRT Screen Effect */}
              <div
                className="absolute inset-0 pointer-events-none z-10"
                style={{
                  background: `repeating-linear-gradient(0deg, rgba(0,0,0,0.15), rgba(0,0,0,0.15) 1px, transparent 1px, transparent 2px)`,
                  boxShadow: "inset 0 0 80px rgba(0,0,0,0.5)",
                }}
              />

              {phase === "waiting" && (
                <motion.div
                  className="absolute inset-0 flex flex-col items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="font-mono text-lg mb-2 tracking-wider" style={{ color: card.color }}>
                    {getMinigameName(card.minigameType)}
                  </div>
                  <div className="text-green-400/70 font-mono text-xs mb-6 tracking-wider">
                    {getMinigameHint(card.minigameType)}
                  </div>
                  <motion.button
                    className="flex items-center gap-3 px-8 py-4 rounded-lg font-mono text-lg tracking-wider"
                    style={{
                      background: `${card.color}20`,
                      border: `2px solid ${card.color}`,
                      color: card.color,
                      boxShadow: `0 0 30px ${card.color}50`,
                    }}
                    whileHover={{ scale: 1.05, boxShadow: `0 0 50px ${card.color}80` }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleStartGame}
                  >
                    <Play className="w-6 h-6" />
                    PLAY
                  </motion.button>
                  <div className="text-gray-500 font-mono text-xs mt-4">15 Second Time Limit</div>
                </motion.div>
              )}

              {phase === "game" && renderMinigame()}

              {phase === "result" && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center p-4"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div
                    className={`text-3xl font-bold font-mono text-center ${gameWon ? "text-green-500" : "text-red-500"}`}
                    style={{ textShadow: `0 0 30px ${gameWon ? "#00ff00" : "#ff0000"}` }}
                  >
                    {gameWon ? "COUNTERMEASURE SUCCESS!" : "BREACH DETECTED!"}
                  </div>
                </motion.div>
              )}
            </div>

            <div className="absolute inset-0 pointer-events-none">
              <div
                className="absolute top-1.5 left-1/2 -translate-x-1/2 text-[10px] font-mono"
                style={{ color: card.color }}
              >
                CYBER-DEFENSE PROTOCOL
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
