"use client"

import type React from "react"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect, useRef, useCallback } from "react"
import type { GameCard } from "@/lib/game-types"
import { PixelIcon } from "./pixel-icons"
import { SnakeGame } from "./minigames/snake-game"
import { WhackAMole } from "./minigames/whack-a-mole"
import { EndlessRunner } from "./minigames/endless-runner-v2"
import { CaptureTheFlag } from "./minigames/capture-the-flag"
import { CyberModal, CyberButton } from "@/components/ui/cyber-modal"

interface FlippableGameCardProps {
  card: GameCard
  isSelected: boolean
  onSelect: () => void
  onWin: () => void
  onLoss: () => void
  disabled: boolean
  isHighlighted: boolean
  isEffective: boolean
}

type CardPhase = "front" | "flipping" | "waiting" | "playing" | "success" | "failure"

export function FlippableGameCard({
  card,
  isSelected,
  onSelect,
  onWin,
  onLoss,
  disabled,
  isHighlighted,
  isEffective,
}: FlippableGameCardProps) {
  const [phase, setPhase] = useState<CardPhase>("front")
  const [isFlipped, setIsFlipped] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [clickFeedback, setClickFeedback] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (disabled || phase !== "front") return

    setClickFeedback(true)
    setTimeout(() => setClickFeedback(false), 200)

    setIsModalOpen(true)
    onSelect()
  }

  const handleStartGameInModal = useCallback(() => {
    setGameStarted(true)
    setPhase("playing")
  }, [])

  const handleGameWin = useCallback(() => {
    setPhase("success")
    setTimeout(() => {
      setIsModalOpen(false)
      setGameStarted(false)
      onWin()
      setPhase("front")
    }, 1500)
  }, [onWin])

  const handleGameLoss = useCallback(() => {
    setPhase("failure")
    setTimeout(() => {
      setIsModalOpen(false)
      setGameStarted(false)
      onLoss()
      setPhase("front")
    }, 1500)
  }, [onLoss])

  const handleModalClose = useCallback(() => {
    if (phase === "playing") return
    setIsModalOpen(false)
    setGameStarted(false)
    setPhase("front")
  }, [phase])

  useEffect(() => {
    if (!isSelected && phase !== "front") {
      setPhase("front")
      setIsFlipped(false)
      setIsModalOpen(false)
      setGameStarted(false)
    }
  }, [isSelected, phase])

  const getMinigameName = () => {
    switch (card.minigameType) {
      case "snake":
        return "KERNEL SNAKE"
      case "whack":
        return "BINARY SMASHER"
      case "runner":
        return "PACKET RUNNER"
      case "ctf":
        return "CAPTURE THE FLAG"
      default:
        return "MINIGAME"
    }
  }

  const getMinigameInstructions = () => {
    switch (card.minigameType) {
      case "snake":
        return "Use arrow keys to collect 5 data packages. Avoid walls and yourself!"
      case "whack":
        return "Click on 5 virus icons before time runs out!"
      case "runner":
        return "Press SPACE or click to jump. Survive for 10 seconds!"
      case "ctf":
        return "Use WASD to move. Capture the red flag and return to your green base!"
      default:
        return "Complete the challenge to attack the boss!"
    }
  }

  const renderMinigame = () => {
    switch (card.minigameType) {
      case "snake":
        return <SnakeGame onWin={handleGameWin} onLoss={handleGameLoss} />
      case "whack":
        return <WhackAMole onWin={handleGameWin} onLoss={handleGameLoss} />
      case "runner":
        return <EndlessRunner onWin={handleGameWin} onLoss={handleGameLoss} />
      case "ctf":
        return <CaptureTheFlag onWin={handleGameWin} onLoss={handleGameLoss} />
      default:
        return <SnakeGame onWin={handleGameWin} onLoss={handleGameLoss} />
    }
  }

  const getModalVariant = (): "default" | "success" | "danger" | "warning" => {
    if (card.color === "#00ff00" || card.color === "#39ff14") return "success"
    if (card.color === "#ff0000" || card.color === "#ff4444") return "danger"
    if (card.color === "#ffcc00" || card.color === "#ffd700") return "warning"
    return "default"
  }

  return (
    <>
      <div
        ref={containerRef}
        tabIndex={0}
        className="outline-none"
        style={{
          perspective: "1500px",
          transformStyle: "preserve-3d",
        }}
      >
        <motion.div
          className="relative w-40 h-56 cursor-pointer"
          style={{ transformStyle: "preserve-3d" }}
          animate={{
            rotateY: isFlipped ? 180 : 0,
            scale: clickFeedback ? 0.95 : 1,
          }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          onClick={handleCardClick}
        >
          <div
            className="absolute inset-0 rounded-lg overflow-hidden"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              background: `linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)`,
              border: `3px solid ${card.color}`,
              boxShadow: isHighlighted
                ? `0 0 30px ${card.color}, 0 0 60px gold, 0 0 90px gold, inset 0 0 20px ${card.color}40`
                : isEffective
                  ? `0 0 25px #00ff00, 0 0 50px #00ff00, inset 0 0 20px rgba(0,255,0,0.3)`
                  : `0 0 20px ${card.color}40, inset 0 0 30px ${card.color}20`,
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `
                  linear-gradient(90deg, ${card.color}40 1px, transparent 1px),
                  linear-gradient(${card.color}40 1px, transparent 1px)
                `,
                backgroundSize: "4px 4px",
                opacity: 0.3,
              }}
            />

            {isHighlighted && (
              <motion.div
                className="absolute inset-0 pointer-events-none"
                animate={{
                  boxShadow: [
                    "inset 0 0 20px rgba(255,215,0,0.5)",
                    "inset 0 0 40px rgba(255,215,0,0.8)",
                    "inset 0 0 20px rgba(255,215,0,0.5)",
                  ],
                }}
                transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
              />
            )}

            {isEffective && (
              <motion.div
                className="absolute top-2 right-2 px-2 py-1 rounded text-xs font-mono font-bold z-20"
                style={{ background: "rgba(0,255,0,0.9)", color: "#000" }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
              >
                SUPER EFFECTIVE
              </motion.div>
            )}

            <div
              className="p-2 border-b"
              style={{
                borderColor: `${card.color}50`,
                background: `linear-gradient(180deg, ${card.color}20 0%, transparent 100%)`,
              }}
            >
              <h3
                className="font-bold text-sm tracking-wide text-center"
                style={{ color: card.color, textShadow: `0 0 10px ${card.color}` }}
              >
                {card.name}
              </h3>
              {card.secondaryColor && (
                <div
                  className="h-0.5 mt-1 mx-auto w-3/4"
                  style={{ background: `linear-gradient(90deg, ${card.color}, ${card.secondaryColor})` }}
                />
              )}
            </div>

            <div className="flex items-center justify-center py-4 px-4">
              <div className="w-20 h-20">{card.icon && <PixelIcon type={card.icon} />}</div>
            </div>

            <div className="flex items-center justify-center">
              <div
                className="text-3xl font-bold font-mono px-4 py-1 rounded"
                style={{
                  color: card.color,
                  textShadow: `0 0 10px ${card.color}`,
                  background: "rgba(0,0,0,0.5)",
                }}
              >
                {card.power}
              </div>
            </div>

            <div
              className="absolute top-0 left-0 w-5 h-5"
              style={{ borderLeft: `3px solid ${card.color}`, borderTop: `3px solid ${card.color}` }}
            />
            <div
              className="absolute top-0 right-0 w-5 h-5"
              style={{ borderRight: `3px solid ${card.color}`, borderTop: `3px solid ${card.color}` }}
            />
            <div
              className="absolute bottom-0 left-0 w-5 h-5"
              style={{ borderLeft: `3px solid ${card.color}`, borderBottom: `3px solid ${card.color}` }}
            />
            <div
              className="absolute bottom-0 right-0 w-5 h-5"
              style={{ borderRight: `3px solid ${card.color}`, borderBottom: `3px solid ${card.color}` }}
            />
          </div>

          <div
            className="absolute inset-0 rounded-lg overflow-hidden"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              background: "#0a0a0a",
              border: `3px solid ${card.color}`,
              boxShadow: `0 0 40px ${card.color}60`,
            }}
          />
        </motion.div>
      </div>

      <CyberModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={`${card.name} // ${getMinigameName()}`}
        variant={getModalVariant()}
        size="lg"
        showCloseButton={!gameStarted}
        closeOnEscape={!gameStarted}
        closeOnOverlay={!gameStarted}
        footer={
          !gameStarted && phase !== "success" && phase !== "failure" ? (
            <>
              <CyberButton onClick={handleModalClose} variant="danger">
                Cancel
              </CyberButton>
              <CyberButton onClick={handleStartGameInModal} variant="success">
                Start Game
              </CyberButton>
            </>
          ) : undefined
        }
      >
        <div className="flex flex-col items-center gap-4">
          {!gameStarted && phase !== "success" && phase !== "failure" && (
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div
                  className="w-24 h-24 rounded-lg flex items-center justify-center"
                  style={{
                    background: `${card.color}20`,
                    border: `2px solid ${card.color}`,
                    boxShadow: `0 0 20px ${card.color}40`,
                  }}
                >
                  {card.icon && <PixelIcon type={card.icon} />}
                </div>
              </div>
              <p className="font-mono text-sm text-gray-300 mb-2">{getMinigameInstructions()}</p>
              <div className="flex items-center justify-center gap-2 font-mono text-xs">
                <span className="text-gray-500">TIME LIMIT:</span>
                <span style={{ color: card.color }}>15 SECONDS</span>
              </div>
              <div className="flex items-center justify-center gap-2 font-mono text-xs mt-1">
                <span className="text-gray-500">POWER:</span>
                <span style={{ color: card.color }}>{card.power}</span>
              </div>
            </div>
          )}

          {gameStarted && phase === "playing" && (
            <div
              className="w-full aspect-video max-w-md rounded overflow-hidden"
              style={{
                border: `2px solid ${card.color}`,
                boxShadow: `0 0 30px ${card.color}40`,
              }}
            >
              {renderMinigame()}
            </div>
          )}

          <AnimatePresence>
            {phase === "success" && (
              <motion.div
                className="text-center py-8"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="text-4xl font-bold font-mono mb-4"
                  style={{ color: "#00ff00", textShadow: "0 0 30px #00ff00" }}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5, repeat: 2 }}
                >
                  ACCESS GRANTED
                </motion.div>
                <p className="font-mono text-green-400/80 text-sm">
                  Attack successful! Boss takes {card.power} damage.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {phase === "failure" && (
              <motion.div
                className="text-center py-8"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="text-4xl font-bold font-mono mb-4"
                  style={{ color: "#ff0000", textShadow: "0 0 30px #ff0000" }}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5, repeat: 2 }}
                >
                  ACCESS DENIED
                </motion.div>
                <p className="font-mono text-red-400/80 text-sm">Attack failed! The boss counterattacks.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CyberModal>
    </>
  )
}
