"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { X } from "lucide-react"

interface TutorialStep {
  id: string
  target: "enemy" | "hand" | "tux" | "deck" | "start"
  title: string
  description: string
  position: { top?: string; bottom?: string; left?: string; right?: string }
  highlightArea: { top: string; left: string; width: string; height: string }
  icon: "server-skull" | "tux-firefox" | "tux-penguin" | "none"
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: "enemy",
    target: "enemy",
    title: "TARGET LOCKED",
    description: "This is the Big Tech Server. It will attack your privacy with proprietary threats.",
    position: { top: "40%", left: "50%" },
    highlightArea: { top: "5%", left: "35%", width: "30%", height: "35%" },
    icon: "server-skull",
  },
  {
    id: "hand",
    target: "hand",
    title: "YOUR ARSENAL",
    description: "These are Open Source tools. Linux, Firefox, Mastodon - each counters a specific corporate threat.",
    position: { bottom: "35%", left: "50%" },
    highlightArea: { top: "65%", left: "20%", width: "60%", height: "30%" },
    icon: "tux-firefox",
  },
  {
    id: "tux",
    target: "tux",
    title: "AI ASSIST",
    description: "Stuck? Click Tux for a hint on which card counters the current attack.",
    position: { top: "45%", right: "15%" },
    highlightArea: { top: "40%", left: "85%", width: "12%", height: "20%" },
    icon: "tux-penguin",
  },
  {
    id: "deck",
    target: "deck",
    title: "SOURCE CODE",
    description: "Click here to compile new tools from the open source repository.",
    position: { bottom: "25%", left: "15%" },
    highlightArea: { top: "70%", left: "2%", width: "15%", height: "25%" },
    icon: "none",
  },
  {
    id: "start",
    target: "start",
    title: "BATTLE START!",
    description: "The first corporate threat is approaching. Good luck, SysAdmin!",
    position: { top: "50%", left: "50%" },
    highlightArea: { top: "0%", left: "0%", width: "100%", height: "100%" },
    icon: "none",
  },
]

interface TutorialOverlayProps {
  onComplete: () => void
  onSkip?: () => void
}

export function TutorialOverlay({ onComplete, onSkip }: TutorialOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const step = TUTORIAL_STEPS[currentStep]

  const handleNext = () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const handleSkip = () => {
    if (onSkip) {
      onSkip()
    } else {
      onComplete()
    }
  }

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        handleNext()
      }
      if (e.key === "Escape") {
        handleSkip()
      }
    }
    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [currentStep])

  return (
    <motion.div
      className="fixed inset-0 z-[90]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0">
        <div className="absolute left-0 right-0 top-0 bg-black/70" style={{ height: step.highlightArea.top }} />
        <div
          className="absolute left-0 right-0 bottom-0 bg-black/70"
          style={{
            top: `calc(${step.highlightArea.top} + ${step.highlightArea.height})`,
          }}
        />
        <div
          className="absolute left-0 bg-black/70"
          style={{
            top: step.highlightArea.top,
            height: step.highlightArea.height,
            width: step.highlightArea.left,
          }}
        />
        <div
          className="absolute right-0 bg-black/70"
          style={{
            top: step.highlightArea.top,
            height: step.highlightArea.height,
            left: `calc(${step.highlightArea.left} + ${step.highlightArea.width})`,
          }}
        />
      </div>

      <motion.div
        className="absolute pointer-events-none"
        style={{
          top: step.highlightArea.top,
          left: step.highlightArea.left,
          width: step.highlightArea.width,
          height: step.highlightArea.height,
          border: "3px solid #00ff00",
          boxShadow: "0 0 30px rgba(0,255,0,0.5), inset 0 0 30px rgba(0,255,0,0.1)",
        }}
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
        layoutId="highlight"
      />

      <motion.div
        className="fixed top-4 right-4 z-[100] pointer-events-auto"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <motion.button
          className="flex items-center gap-2 px-4 py-2 font-mono text-sm tracking-wider rounded-lg"
          style={{
            background: "rgba(255,50,50,0.9)",
            border: "2px solid #ff3232",
            color: "#fff",
            boxShadow: "0 0 25px rgba(255,50,50,0.6)",
          }}
          whileHover={{
            scale: 1.08,
            boxShadow: "0 0 40px rgba(255,50,50,0.9), inset 0 0 15px rgba(255,255,255,0.2)",
          }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSkip}
          title="Skip tutorial (ESC)"
          aria-label="Skip tutorial - Press ESC"
        >
          <X className="w-4 h-4" />
          <span>SKIP</span>
        </motion.button>
        <motion.div
          className="text-center text-xs text-gray-400 mt-1 font-mono"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
        >
          (or press ESC)
        </motion.div>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step.id}
          className="absolute pointer-events-auto"
          style={{
            ...step.position,
            transform: step.position.left === "50%" ? "translateX(-50%)" : undefined,
          }}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -20 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <div
            className="rounded-sm max-w-md overflow-hidden"
            style={{
              background: "#000000",
              border: "2px solid #00ff00",
              boxShadow: "0 0 40px rgba(0,255,0,0.3), inset 0 0 20px rgba(0,255,0,0.05)",
            }}
          >
            <div
              className="flex items-center gap-2 px-3 py-1.5 justify-between"
              style={{ background: "rgba(0,255,0,0.1)", borderBottom: "1px solid #00ff00" }}
            >
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
              </div>
              <span className="font-mono text-[10px] text-green-500 ml-2">data_file_{step.id}.sys</span>
            </div>

            <div className="p-4 flex gap-4">
              {step.icon !== "none" && (
                <motion.div
                  className="flex-shrink-0 w-16 h-16"
                  animate={{
                    filter: [
                      "drop-shadow(0 0 5px #00ff00)",
                      "drop-shadow(0 0 15px #00ff00)",
                      "drop-shadow(0 0 5px #00ff00)",
                    ],
                  }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                >
                  <TutorialIcon type={step.icon} />
                </motion.div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-2">
                  {TUTORIAL_STEPS.map((_, i) => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full"
                      style={{
                        background: i === currentStep ? "#00ff00" : "#333",
                        boxShadow: i === currentStep ? "0 0 10px rgba(0,255,0,0.8)" : "none",
                      }}
                    />
                  ))}
                </div>

                <h3
                  className="font-pixel text-[11px] text-green-400 mb-2 tracking-wider"
                  style={{ textShadow: "0 0 10px rgba(0,255,0,0.5)" }}
                >
                  {`> ${step.title}`}
                </h3>

                <p className="font-mono text-sm text-green-300 leading-relaxed">{step.description}</p>
              </div>
            </div>

            <div className="px-4 pb-4 flex gap-2">
              <motion.button
                className="w-full py-2 font-pixel text-[9px] tracking-wider"
                style={{
                  background: "transparent",
                  border: "1px solid #00ff00",
                  color: "#00ff00",
                }}
                whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(0,255,0,0.4)" }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNext}
              >
                {currentStep < TUTORIAL_STEPS.length - 1 ? "[ NEXT >> ]" : "[ BEGIN BATTLE ]"}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}

function TutorialIcon({ type }: { type: "server-skull" | "tux-firefox" | "tux-penguin" }) {
  switch (type) {
    case "server-skull":
      return (
        <svg viewBox="0 0 64 64" className="w-full h-full">
          <rect x="12" y="8" width="40" height="48" rx="3" fill="#1a1a1a" stroke="#ff0000" strokeWidth="2" />
          <rect x="16" y="12" width="32" height="6" fill="#330000" stroke="#ff0000" strokeWidth="1" />
          <rect x="16" y="22" width="32" height="6" fill="#330000" stroke="#ff0000" strokeWidth="1" />
          <circle cx="32" cy="42" r="10" fill="#1a1a1a" stroke="#ff0000" strokeWidth="1.5" />
          <circle cx="28" cy="40" r="3" fill="#ff0000" />
          <circle cx="36" cy="40" r="3" fill="#ff0000" />
          <path d="M32 44 L30 47 L34 47 Z" fill="#ff0000" />
          <circle cx="44" cy="15" r="2" fill="#ff0000">
            <animate attributeName="opacity" values="1;0.3;1" dur="0.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="44" cy="25" r="2" fill="#ff3333">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="0.7s" repeatCount="indefinite" />
          </circle>
        </svg>
      )

    case "tux-firefox":
      return (
        <svg viewBox="0 0 64 64" className="w-full h-full">
          <ellipse cx="24" cy="40" rx="14" ry="18" fill="#1a1a1a" />
          <ellipse cx="24" cy="42" rx="10" ry="14" fill="#f7fafc" />
          <circle cx="24" cy="18" r="12" fill="#1a1a1a" />
          <circle cx="20" cy="16" r="3" fill="white" />
          <circle cx="28" cy="16" r="3" fill="white" />
          <circle cx="20.5" cy="16.5" r="1.5" fill="black" />
          <circle cx="28.5" cy="16.5" r="1.5" fill="black" />
          <path d="M24 20 L20 25 L28 25 Z" fill="#f6ad55" />
          <path
            d="M8 30 L8 42 C8 50 16 56 16 56 C16 56 8 50 8 42 Z"
            fill="#4a5568"
            stroke="#00ff00"
            strokeWidth="1.5"
          />
          <circle cx="50" cy="32" r="12" fill="#4299e1" />
          <ellipse cx="50" cy="32" rx="5" ry="12" fill="none" stroke="#2b6cb0" strokeWidth="0.8" />
          <line x1="38" y1="32" x2="62" y2="32" stroke="#2b6cb0" strokeWidth="0.8" />
          <path d="M42 26 Q38 30 40 38 Q42 44 48 46 Q44 42 46 34 Q48 28 42 26" fill="#ed8936" />
          <path d="M42 26 Q46 24 50 22 Q54 24 56 28 Q52 26 48 28 Q44 30 42 26" fill="#ed8936" />
          <circle cx="44" cy="28" r="1.5" fill="white" />
          <circle cx="44.3" cy="28" r="0.7" fill="black" />
        </svg>
      )

    case "tux-penguin":
      return (
        <svg viewBox="0 0 64 64" className="w-full h-full">
          <ellipse cx="32" cy="42" rx="18" ry="20" fill="#1a1a1a" />
          <ellipse cx="32" cy="44" rx="12" ry="16" fill="#f7fafc" />
          <circle cx="32" cy="18" r="14" fill="#1a1a1a" />
          <circle cx="26" cy="16" r="4" fill="white" />
          <circle cx="38" cy="16" r="4" fill="white" />
          <circle cx="27" cy="17" r="2" fill="black" />
          <circle cx="39" cy="17" r="2" fill="black" />
          <path d="M22 12 Q26 10 30 12" fill="none" stroke="white" strokeWidth="1" />
          <path d="M34 12 Q38 10 42 12" fill="none" stroke="white" strokeWidth="1" />
          <path d="M32 20 L26 28 L38 28 Z" fill="#f6ad55" />
          <ellipse cx="12" cy="40" rx="6" ry="12" fill="#1a1a1a" transform="rotate(-20 12 40)" />
          <ellipse cx="52" cy="40" rx="6" ry="12" fill="#1a1a1a" transform="rotate(20 52 40)" />
          <ellipse cx="24" cy="60" rx="6" ry="3" fill="#f6ad55" />
          <ellipse cx="40" cy="60" rx="6" ry="3" fill="#f6ad55" />
          <path d="M52 8 Q60 4 58 12 Q60 16 54 14 L50 18 L52 12 Q48 10 52 8" fill="#00ff00" opacity="0.8" />
          <text x="54" y="11" fill="black" fontSize="6" fontWeight="bold">
            ?
          </text>
        </svg>
      )

    default:
      return null
  }
}
