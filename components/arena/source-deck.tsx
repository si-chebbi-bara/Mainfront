"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import type { GameCard } from "@/lib/game-types"
import { Zap, Shield, Swords, X } from "lucide-react"

interface SourceDeckProps {
  cards: GameCard[]
}

export function SourceDeck({ cards }: SourceDeckProps) {
  const [isFanned, setIsFanned] = useState(false)
  const [drawnCards, setDrawnCards] = useState<GameCard[]>([])
  const [hoveredCard, setHoveredCard] = useState<GameCard | null>(null)

  const handleDeckClick = () => {
    if (isFanned) return
    // Draw 5 random cards
    const shuffled = [...cards].sort(() => Math.random() - 0.5)
    setDrawnCards(shuffled.slice(0, 5))
    setIsFanned(true)
  }

  const handleClose = () => {
    setIsFanned(false)
    setHoveredCard(null)
    setTimeout(() => setDrawnCards([]), 400)
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "Defense":
        return <Shield className="w-5 h-5" />
      case "Counter":
        return <Zap className="w-5 h-5" />
      case "Attack":
        return <Swords className="w-5 h-5" />
      default:
        return null
    }
  }

  return (
    <>
      {/* The Deck - Bottom Left */}
      <motion.div
        className="fixed bottom-8 left-8 cursor-pointer"
        style={{ perspective: "1000px" }}
        onClick={handleDeckClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Breathing animation for the deck */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Stack of cards */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-lg"
              style={{
                width: "100px",
                height: "140px",
                background: `linear-gradient(135deg, #0a1a0a 0%, #0d2d0d 100%)`,
                border: "2px solid #00ff00",
                boxShadow: "0 0 15px rgba(0,255,0,0.3), inset 0 0 20px rgba(0,255,0,0.1)",
                transform: `translateZ(${i * -3}px) translateY(${i * -2}px)`,
                zIndex: 8 - i,
              }}
            >
              {/* Back pattern */}
              <div
                className="absolute inset-2 rounded opacity-30"
                style={{
                  background: `
                    repeating-linear-gradient(
                      45deg,
                      transparent,
                      transparent 5px,
                      rgba(0,255,0,0.1) 5px,
                      rgba(0,255,0,0.1) 10px
                    )
                  `,
                }}
              />
              {/* Circuit pattern */}
              <div
                className="absolute inset-0 flex items-center justify-center opacity-40"
                style={{ color: "#00ff00" }}
              >
                <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <rect x="4" y="4" width="16" height="16" rx="2" />
                  <line x1="12" y1="4" x2="12" y2="8" />
                  <line x1="12" y1="16" x2="12" y2="20" />
                  <line x1="4" y1="12" x2="8" y2="12" />
                  <line x1="16" y1="12" x2="20" y2="12" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
            </div>
          ))}

          {/* Top card (visible) */}
          <div
            className="relative rounded-lg"
            style={{
              width: "100px",
              height: "140px",
              background: `linear-gradient(135deg, #0a1a0a 0%, #0d2d0d 100%)`,
              border: "2px solid #00ff00",
              boxShadow: "0 0 25px rgba(0,255,0,0.4), inset 0 0 30px rgba(0,255,0,0.15)",
            }}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-green-400 font-mono text-[10px] tracking-wider mb-1">SOURCE</span>
              <span className="text-green-500 font-mono text-xs font-bold">CODE</span>
              <span className="text-green-400/60 font-mono text-[8px] mt-2">CLICK TO DRAW</span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Fanned Cards Overlay */}
      <AnimatePresence>
        {isFanned && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center"
            initial={{ backgroundColor: "rgba(0,0,0,0)" }}
            animate={{ backgroundColor: "rgba(0,0,0,0.85)" }}
            exit={{ backgroundColor: "rgba(0,0,0,0)" }}
          >
            {/* Close Button */}
            <motion.button
              className="absolute top-8 right-8 p-3 rounded-full border border-green-500/50 text-green-400 hover:bg-green-500/20 transition-colors"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1, transition: { delay: 0.5 } }}
              exit={{ opacity: 0, scale: 0 }}
              onClick={handleClose}
            >
              <X className="w-6 h-6" />
            </motion.button>

            {/* Cards in a row */}
            <div className="flex gap-6">
              {drawnCards.map((card, index) => (
                <motion.div
                  key={card.id}
                  className="relative cursor-pointer"
                  initial={{ x: -400, y: 300, rotate: -20, opacity: 0 }}
                  animate={{
                    x: 0,
                    y: 0,
                    rotate: 0,
                    opacity: 1,
                    transition: { delay: index * 0.1, type: "spring", stiffness: 100, damping: 15 },
                  }}
                  exit={{
                    x: -400,
                    y: 300,
                    rotate: -20,
                    opacity: 0,
                    transition: { delay: (4 - index) * 0.05 },
                  }}
                  whileHover={{ y: -20, scale: 1.08 }}
                  onMouseEnter={() => setHoveredCard(card)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Card Face */}
                  <div
                    className="relative w-40 h-56 rounded-xl overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, #0a1a0a 0%, #0d2d0d 100%)`,
                      border: `2px solid ${card.color}`,
                      boxShadow: `0 0 30px ${card.color}40, inset 0 0 40px ${card.color}15`,
                    }}
                  >
                    {/* Card Header */}
                    <div className="p-3 border-b" style={{ borderColor: `${card.color}40` }}>
                      <div className="flex items-center gap-2" style={{ color: card.color }}>
                        {getIcon(card.type)}
                        <span className="text-xs font-mono uppercase tracking-wider">{card.type}</span>
                      </div>
                      <h3 className="text-white font-bold text-sm mt-1 tracking-wide">{card.name}</h3>
                    </div>

                    {/* Power Display */}
                    <div className="flex items-center justify-center py-6">
                      <div
                        className="text-5xl font-bold font-mono"
                        style={{
                          color: card.color,
                          textShadow: `0 0 15px ${card.color}`,
                        }}
                      >
                        {card.power}
                      </div>
                    </div>

                    {/* Circuit line */}
                    <div
                      className="h-px w-4/5 mx-auto"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${card.color}, transparent)`,
                      }}
                    />

                    {/* Corner Accents */}
                    <div
                      className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2"
                      style={{ borderColor: card.color }}
                    />
                    <div
                      className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2"
                      style={{ borderColor: card.color }}
                    />
                    <div
                      className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2"
                      style={{ borderColor: card.color }}
                    />
                    <div
                      className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2"
                      style={{ borderColor: card.color }}
                    />
                  </div>

                  {/* Tooltip on hover */}
                  <AnimatePresence>
                    {hoveredCard?.id === card.id && (
                      <motion.div
                        className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 p-4 rounded-lg"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        style={{
                          background: "rgba(0,20,0,0.95)",
                          border: "1px solid #00ff00",
                          boxShadow: "0 0 30px rgba(0,255,0,0.3)",
                        }}
                      >
                        <p className="text-green-400 font-mono text-sm leading-relaxed">{card.description}</p>
                        {/* Pointer */}
                        <div
                          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45"
                          style={{
                            background: "rgba(0,20,0,0.95)",
                            borderRight: "1px solid #00ff00",
                            borderBottom: "1px solid #00ff00",
                          }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
