"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useCallback, useRef, useEffect } from "react"
import type { GameCard } from "@/lib/game-types"
import { FlippableGameCard } from "./flippable-game-card"

interface PlayerHandProps {
  cards: GameCard[]
  onCardWin: (card: GameCard) => void
  onCardLoss: (card: GameCard) => void
  disabled: boolean
  highlightedCardId: string | null
  currentThreatName?: string
}

export function PlayerHand({
  cards,
  onCardWin,
  onCardLoss,
  disabled,
  highlightedCardId,
  currentThreatName,
}: PlayerHandProps) {
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [scanningCardId, setScanningCardId] = useState<string | null>(null)
  const [scanProgress, setScanProgress] = useState(0)
  const [showInfoModal, setShowInfoModal] = useState<string | null>(null)
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const scanTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const getCardRotation = (index: number, total: number) => {
    const spread = 15
    const offset = ((index - (total - 1) / 2) / total) * spread
    return offset
  }

  const getCardX = (index: number, total: number) => {
    const spacing = 200
    return (index - (total - 1) / 2) * spacing
  }

  const isCardEffective = (card: GameCard) => {
    if (!currentThreatName || !card.counters) return false
    return card.counters.some((counter) => currentThreatName.toLowerCase().includes(counter.toLowerCase()))
  }

  const startScanning = useCallback((cardId: string) => {
    setScanningCardId(cardId)
    setScanProgress(0)
    setShowInfoModal(null)

    // Progress bar updates every 30ms for smooth animation
    let progress = 0
    scanIntervalRef.current = setInterval(() => {
      progress += 1
      setScanProgress(progress)
      if (progress >= 100) {
        if (scanIntervalRef.current) clearInterval(scanIntervalRef.current)
      }
    }, 30) // 3000ms / 100 = 30ms per step

    // After 3 seconds, show info modal
    scanTimeoutRef.current = setTimeout(() => {
      setShowInfoModal(cardId)
    }, 3000)
  }, [])

  const stopScanning = useCallback(() => {
    if (scanIntervalRef.current) clearInterval(scanIntervalRef.current)
    if (scanTimeoutRef.current) clearTimeout(scanTimeoutRef.current)
    setScanningCardId(null)
    setScanProgress(0)
    setShowInfoModal(null)
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scanIntervalRef.current) clearInterval(scanIntervalRef.current)
      if (scanTimeoutRef.current) clearTimeout(scanTimeoutRef.current)
    }
  }, [])

  const handleCardSelect = useCallback(
    (card: GameCard) => {
      console.log("[v0] Card clicked:", card.name, "disabled:", disabled, "selectedCardId:", selectedCardId)
      if (disabled || selectedCardId) return
      stopScanning()
      setSelectedCardId(card.id)
    },
    [disabled, selectedCardId, stopScanning],
  )

  const handleCardWin = useCallback(
    (card: GameCard) => {
      console.log("[v0] PlayerHand: Card win callback triggered for:", card.name)
      setSelectedCardId(null)
      onCardWin(card)
    },
    [onCardWin],
  )

  const handleCardLoss = useCallback(
    (card: GameCard) => {
      console.log("[v0] PlayerHand: Card loss callback triggered for:", card.name)
      setSelectedCardId(null)
      onCardLoss(card)
    },
    [onCardLoss],
  )

  const handleMouseEnter = useCallback(
    (cardId: string) => {
      if (disabled || selectedCardId) return
      setHoveredId(cardId)
      startScanning(cardId)
    },
    [disabled, selectedCardId, startScanning],
  )

  const handleMouseLeave = useCallback(() => {
    setHoveredId(null)
    stopScanning()
  }, [stopScanning])

  return (
    <div
      className="absolute bottom-12 left-1/2 -translate-x-1/2 z-50 pointer-events-auto"
      style={{
        perspective: "1500px",
        transformStyle: "preserve-3d",
        transform: "translateZ(20px)",
      }}
    >
      {cards.map((card, index) => {
        const isHovered = hoveredId === card.id
        const isHighlighted = highlightedCardId === card.id
        const isEffective = isCardEffective(card)
        const isSelected = selectedCardId === card.id
        const isScanning = scanningCardId === card.id
        const shouldShowModal = showInfoModal === card.id

        return (
          <motion.div
            key={card.id}
            className="absolute cursor-pointer"
            style={{
              transformStyle: "preserve-3d",
              transformOrigin: "center bottom",
            }}
            initial={{
              x: getCardX(index, cards.length),
              rotateZ: getCardRotation(index, cards.length),
              rotateX: 60,
              y: 0,
              scale: 1,
              z: 50,
            }}
            animate={{
              x: isSelected ? 0 : getCardX(index, cards.length),
              rotateZ: isHovered || isSelected ? 0 : getCardRotation(index, cards.length),
              rotateX: isHovered || isSelected ? 0 : 60,
              y: isSelected ? -250 : isHovered ? -180 : 0,
              scale: isSelected ? 1.8 : isHovered ? 1.5 : 1,
              z: isSelected ? 600 : isHovered ? 300 : 50,
              zIndex: isSelected ? 100 : isHovered ? 50 : index,
            }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onMouseEnter={() => handleMouseEnter(card.id)}
            onMouseLeave={handleMouseLeave}
          >
            <FlippableGameCard
              card={card}
              isSelected={isSelected}
              onSelect={() => handleCardSelect(card)}
              onWin={() => handleCardWin(card)}
              onLoss={() => handleCardLoss(card)}
              disabled={disabled || (!!selectedCardId && selectedCardId !== card.id)}
              isHighlighted={isHighlighted}
              isEffective={isEffective}
            />

            <AnimatePresence>
              {isScanning && !shouldShowModal && !isSelected && (
                <motion.div
                  className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none z-30"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(180deg, 
                        rgba(0,255,255,0.1) 0%, 
                        rgba(0,255,255,0.2) 50%, 
                        rgba(0,255,255,0.1) 100%)`,
                    }}
                  />
                  <motion.div
                    className="absolute left-0 right-0 h-1"
                    style={{
                      background: "linear-gradient(90deg, transparent, #00ffff, transparent)",
                      boxShadow: "0 0 20px #00ffff",
                    }}
                    animate={{ top: ["0%", "100%", "0%"] }}
                    transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                    <motion.div
                      className="font-mono text-xs text-cyan-400 tracking-widest"
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
                    >
                      SCANNING...
                    </motion.div>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 h-2 bg-black/50 rounded overflow-hidden border border-cyan-500/50">
                    <motion.div
                      className="h-full bg-gradient-to-r from-cyan-500 to-green-500"
                      style={{ width: `${scanProgress}%` }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {shouldShowModal && !isSelected && (
                <motion.div
                  className="absolute left-full ml-4 top-1/2 -translate-y-1/2 w-72 z-[200] pointer-events-none"
                  initial={{ opacity: 0, x: -20, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -20, scale: 0.9 }}
                  style={{ transform: "translateZ(100px)" }}
                >
                  <div
                    className="p-4 rounded-lg relative"
                    style={{
                      background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)",
                      border: `2px solid ${card.color}`,
                      boxShadow: `0 0 30px ${card.color}50, inset 0 0 20px rgba(0,0,0,0.5)`,
                    }}
                  >
                    <div
                      className="absolute -top-3 left-4 px-3 py-1 text-xs font-mono tracking-wider rounded"
                      style={{ background: card.color, color: "#000", boxShadow: `0 0 10px ${card.color}` }}
                    >
                      SCAN COMPLETE
                    </div>
                    <h4
                      className="font-bold text-lg mt-2 mb-3"
                      style={{ color: card.color, textShadow: `0 0 10px ${card.color}` }}
                    >
                      {card.name}
                    </h4>
                    <div className="mb-3">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-4 h-4 rounded bg-green-500 flex items-center justify-center text-black text-xs font-bold">
                          +
                        </div>
                        <span className="text-green-400 font-mono text-xs tracking-wider">ADVANTAGES</span>
                      </div>
                      <p className="text-white/90 font-mono text-sm leading-relaxed pl-6">{card.hoverData}</p>
                    </div>
                    {card.counters && card.counters.length > 0 && (
                      <div className="mb-3">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-4 h-4 rounded bg-yellow-500 flex items-center justify-center text-black text-xs font-bold">
                            !
                          </div>
                          <span className="text-yellow-400 font-mono text-xs tracking-wider">BEST AGAINST</span>
                        </div>
                        <div className="pl-6 flex flex-wrap gap-1">
                          {card.counters.map((counter, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded text-xs font-mono"
                              style={{
                                background: isEffective ? "rgba(0,255,0,0.3)" : "rgba(255,255,255,0.1)",
                                border: isEffective ? "1px solid #00ff00" : "1px solid #333",
                                color: isEffective ? "#00ff00" : "#fff",
                              }}
                            >
                              {counter}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {isEffective && (
                      <motion.div
                        className="mt-3 p-2 rounded text-center font-mono text-sm font-bold"
                        style={{
                          background: "rgba(0,255,0,0.2)",
                          border: "2px solid #00ff00",
                          color: "#00ff00",
                          textShadow: "0 0 10px #00ff00",
                        }}
                        animate={{
                          boxShadow: [
                            "0 0 10px rgba(0,255,0,0.5)",
                            "0 0 30px rgba(0,255,0,0.8)",
                            "0 0 10px rgba(0,255,0,0.5)",
                          ],
                        }}
                        transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY }}
                      >
                        SUPER EFFECTIVE vs CURRENT THREAT!
                      </motion.div>
                    )}
                    <div className="mt-3 text-center">
                      <span className="text-gray-500 font-mono text-xs">CLICK TO ACTIVATE</span>
                    </div>
                    <div
                      className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 w-0 h-0"
                      style={{
                        borderTop: "10px solid transparent",
                        borderBottom: "10px solid transparent",
                        borderRight: `10px solid ${card.color}`,
                      }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )
      })}
    </div>
  )
}
