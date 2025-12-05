"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import type { CounterCard } from "@/lib/game-types"

interface CounterHandProps {
  cards: CounterCard[]
  onCardSelect: (card: CounterCard) => void
  disabled: boolean
  highlightedCardId: string | null
  correctCardId: string | null
}

function CardIcon({ icon, color }: { icon: string; color: string }) {
  switch (icon) {
    case "penguin":
      return (
        <svg viewBox="0 0 32 32" className="w-full h-full" style={{ imageRendering: "pixelated" }}>
          {/* Necromancer Penguin */}
          <rect x="10" y="4" width="12" height="12" fill="#333" />
          <rect x="12" y="6" width="2" height="2" fill="#fff" />
          <rect x="18" y="6" width="2" height="2" fill="#fff" />
          <rect x="14" y="8" width="4" height="2" fill={color} />
          <rect x="8" y="14" width="16" height="14" fill="#222" />
          <rect x="12" y="16" width="8" height="10" fill="#ddd" />
          <polygon points="16,0 10,8 22,8" fill="#6b21a8" />
          <rect x="12" y="7" width="8" height="2" fill="#7c3aed" />
          <rect x="24" y="10" width="2" height="16" fill="#8b4513" />
          <circle cx="25" cy="8" r="3" fill={color} />
        </svg>
      )
    case "server":
      return (
        <svg viewBox="0 0 32 32" className="w-full h-full" style={{ imageRendering: "pixelated" }}>
          <rect x="6" y="4" width="20" height="24" fill="#1a1a2e" stroke={color} strokeWidth="2" />
          <rect x="10" y="8" width="12" height="3" fill={color} />
          <rect x="10" y="14" width="12" height="3" fill={color} opacity="0.7" />
          <rect x="10" y="20" width="12" height="3" fill={color} opacity="0.4" />
          <circle cx="22" cy="9" r="1" fill="#0f0" />
          <circle cx="22" cy="15" r="1" fill="#0f0" />
        </svg>
      )
    case "paintbrush":
      return (
        <svg viewBox="0 0 32 32" className="w-full h-full" style={{ imageRendering: "pixelated" }}>
          <rect x="14" y="16" width="4" height="14" fill="#8b4513" />
          <polygon points="16,2 8,16 24,16" fill={color} />
          <rect x="4" y="20" width="8" height="2" fill="#666" />
          <rect x="20" y="20" width="8" height="2" fill="#666" />
          <line x1="10" y1="20" x2="12" y2="22" stroke="#ff0" strokeWidth="2" />
          <line x1="20" y1="20" x2="22" y2="22" stroke="#ff0" strokeWidth="2" />
        </svg>
      )
    case "islands":
      return (
        <svg viewBox="0 0 32 32" className="w-full h-full" style={{ imageRendering: "pixelated" }}>
          <circle cx="8" cy="12" r="5" fill={color} />
          <circle cx="24" cy="12" r="5" fill={color} />
          <circle cx="16" cy="24" r="5" fill={color} />
          <line x1="12" y1="14" x2="20" y2="14" stroke={color} strokeWidth="2" />
          <line x1="10" y1="16" x2="14" y2="20" stroke={color} strokeWidth="2" />
          <line x1="22" y1="16" x2="18" y2="20" stroke={color} strokeWidth="2" />
        </svg>
      )
    case "screwdriver":
      return (
        <svg viewBox="0 0 32 32" className="w-full h-full" style={{ imageRendering: "pixelated" }}>
          <rect x="14" y="14" width="4" height="16" fill="#333" />
          <rect x="12" y="14" width="8" height="4" fill="#222" />
          <polygon points="16,2 12,14 20,14" fill={color} />
          <circle cx="8" cy="6" r="1" fill="#fff" />
          <circle cx="24" cy="8" r="1" fill="#fff" />
          <circle cx="6" cy="16" r="1" fill="#fff" />
        </svg>
      )
    default:
      return <div className="w-full h-full flex items-center justify-center text-4xl">?</div>
  }
}

export function CounterHand({ cards, onCardSelect, disabled, highlightedCardId, correctCardId }: CounterHandProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; color: string } | null>(null)

  const getCardRotation = (index: number, total: number) => {
    const spread = 12
    const offset = ((index - (total - 1) / 2) / total) * spread
    return offset
  }

  const getCardX = (index: number, total: number) => {
    const spacing = 180
    return (index - (total - 1) / 2) * spacing
  }

  const handleCardClick = (card: CounterCard) => {
    if (disabled) return
    console.log("[v0] Card clicked:", card.name, "URL:", card.url)
    setToast({ message: `Clicked: ${card.name} → ${card.url}`, color: card.color })

    // Auto-hide toast after 2 seconds
    setTimeout(() => setToast(null), 2000)
  }

  return (
    <>
      <AnimatePresence>
        {toast && (
          <motion.div
            className="fixed top-8 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div
              className="px-6 py-3 rounded font-mono text-sm font-bold"
              style={{
                background: "#0a0a0a",
                border: `2px solid ${toast.color}`,
                color: toast.color,
                boxShadow: `0 0 20px ${toast.color}50`,
              }}
            >
              {toast.message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10"
        style={{
          perspective: "1500px",
          transformStyle: "preserve-3d",
        }}
      >
        {cards.map((card, index) => {
          const isHovered = hoveredId === card.id
          const isHighlighted = highlightedCardId === card.id
          const isCorrect = correctCardId === card.id

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
              }}
              animate={{
                x: getCardX(index, cards.length),
                rotateZ: isHovered ? 0 : getCardRotation(index, cards.length),
                rotateX: isHovered ? 0 : 60,
                y: isHovered ? -180 : 0,
                scale: isHovered ? 1.4 : 1,
                z: isHovered ? 200 : 0,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              onMouseEnter={() => !disabled && setHoveredId(card.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => handleCardClick(card)}
            >
              {/* Card */}
              <div
                className="relative w-36 h-52 rounded-lg overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)`,
                  border: `3px solid ${card.color}`,
                  boxShadow: isHighlighted
                    ? `0 0 40px gold, 0 0 80px gold, inset 0 0 30px rgba(255,215,0,0.5)`
                    : `0 0 20px ${card.color}50, inset 0 0 30px ${card.color}20`,
                }}
              >
                {/* Highlight Animation */}
                {isHighlighted && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none rounded-lg"
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

                {/* Card Header */}
                <div
                  className="px-2 py-1.5 border-b"
                  style={{
                    borderColor: `${card.color}50`,
                    background: `linear-gradient(180deg, ${card.color}30 0%, transparent 100%)`,
                  }}
                >
                  <h3
                    className="font-bold text-xs tracking-wide text-center uppercase"
                    style={{ color: card.color, textShadow: `0 0 8px ${card.color}` }}
                  >
                    {card.name}
                  </h3>
                  <p className="text-[10px] text-center text-gray-400 font-mono">{card.visual}</p>
                </div>

                {/* Icon Area */}
                <div className="flex items-center justify-center py-3 px-3">
                  <div className="w-20 h-20">
                    <CardIcon icon={card.icon} color={card.color} />
                  </div>
                </div>

                {/* Minigame Type Badge */}
                <div className="flex justify-center">
                  <span
                    className="text-[10px] font-mono px-2 py-0.5 rounded uppercase"
                    style={{
                      background: `${card.color}30`,
                      color: card.color,
                    }}
                  >
                    {card.minigameType === "snake" && "Snake"}
                    {card.minigameType === "whack" && "Whack-a-Mole"}
                    {card.minigameType === "runner" && "Endless Runner"}
                    {card.minigameType === "ctf" && "Capture Flag"}
                  </span>
                </div>

                {/* Corner Accents */}
                {[
                  { top: 0, left: 0, borderLeft: true, borderTop: true },
                  { top: 0, right: 0, borderRight: true, borderTop: true },
                  { bottom: 0, left: 0, borderLeft: true, borderBottom: true },
                  { bottom: 0, right: 0, borderRight: true, borderBottom: true },
                ].map((pos, i) => (
                  <div
                    key={i}
                    className="absolute w-4 h-4"
                    style={{
                      top: pos.top,
                      left: pos.left,
                      right: pos.right,
                      bottom: pos.bottom,
                      borderLeft: pos.borderLeft ? `2px solid ${card.color}` : undefined,
                      borderRight: pos.borderRight ? `2px solid ${card.color}` : undefined,
                      borderTop: pos.borderTop ? `2px solid ${card.color}` : undefined,
                      borderBottom: pos.borderBottom ? `2px solid ${card.color}` : undefined,
                    }}
                  />
                ))}
              </div>

              {/* Tooltip */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    className="absolute left-full ml-4 top-1/2 -translate-y-1/2 w-56 z-50"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                  >
                    <div
                      className="p-4 rounded"
                      style={{
                        background: "#0a0a0a",
                        border: "3px solid #333",
                        boxShadow: "4px 4px 0 #000",
                      }}
                    >
                      <div
                        className="text-xs font-mono mb-2 px-2 py-1 inline-block rounded font-bold"
                        style={{ background: card.color, color: "#000" }}
                      >
                        OPEN SOURCE POWER
                      </div>

                      <p className="font-mono text-sm text-white leading-relaxed mb-2">"{card.lore}"</p>

                      {isCorrect && (
                        <div className="border-t border-gray-700 pt-2 mt-2">
                          <span
                            className="text-xs font-mono font-bold px-2 py-1 rounded animate-pulse"
                            style={{ background: "#00ff00", color: "#000" }}
                          >
                            SUPER EFFECTIVE!
                          </span>
                        </div>
                      )}

                      <div
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 w-0 h-0"
                        style={{
                          borderTop: "8px solid transparent",
                          borderBottom: "8px solid transparent",
                          borderRight: "8px solid #333",
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
    </>
  )
}
