"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ShieldAlert } from "lucide-react"

interface EmergencyAssistProps {
  onAssist: () => void
  disabled: boolean
  isActive: boolean
  currentThreat?: string // Added to show context-aware hint
}

const getHintMessage = (currentThreat?: string) => {
  if (!currentThreat) return "Check the glowing card!"

  const lowerThreat = currentThreat.toLowerCase()

  if (lowerThreat.includes("micro-soft") || lowerThreat.includes("zombie")) {
    return "Use The Resurrector (Linux Mint)! It revives old hardware without TPM!"
  }
  if (lowerThreat.includes("goggle") || lowerThreat.includes("cloud")) {
    return "Deploy The Local Fortress (Nextcloud)! Your data, your rules!"
  }
  if (lowerThreat.includes("ad-obe") || lowerThreat.includes("rent")) {
    return "Summon The Libre Studio (Blender/Gimp)! Pro tools, no fees!"
  }
  if (lowerThreat.includes("meta") || lowerThreat.includes("spy")) {
    return "Activate The Fediverse (Mastodon)! No algorithms, no tracking!"
  }
  if (lowerThreat.includes("ifruit") || lowerThreat.includes("walled") || lowerThreat.includes("apple")) {
    return "Equip The Fixer's Kit (iFixit)! If you can't open it, you don't own it!"
  }

  return "Check the glowing card for your counter!"
}

export function EmergencyAssist({ onAssist, disabled, isActive, currentThreat }: EmergencyAssistProps) {
  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-30">
      {/* The Button */}
      <motion.button
        className="relative px-4 py-6 font-mono text-xs tracking-widest uppercase"
        style={{
          background: disabled
            ? "linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)"
            : "linear-gradient(180deg, #1a1a00 0%, #0a0a00 100%)",
          border: disabled ? "2px solid #333" : "2px solid #ffcc00",
          color: disabled ? "#666" : "#ffcc00",
          boxShadow: disabled ? "none" : "0 0 30px rgba(255,204,0,0.3)",
          writingMode: "vertical-rl",
          textOrientation: "mixed",
        }}
        whileHover={!disabled ? { scale: 1.05, boxShadow: "0 0 50px rgba(255,204,0,0.5)" } : {}}
        whileTap={!disabled ? { scale: 0.95 } : {}}
        onClick={onAssist}
        disabled={disabled}
      >
        <ShieldAlert className="w-5 h-5 mb-2 mx-auto" />
        TUX ASSIST
      </motion.button>

      {/* Tux Avatar */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            className="absolute right-full mr-4 top-1/2 -translate-y-1/2"
            initial={{ x: 100, opacity: 0, scale: 0 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: 100, opacity: 0, scale: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {/* Holographic Container */}
            <div
              className="relative p-4 rounded-xl"
              style={{
                background: "linear-gradient(135deg, rgba(0,255,255,0.1) 0%, rgba(0,200,255,0.05) 100%)",
                border: "1px solid rgba(0,255,255,0.5)",
                boxShadow: "0 0 30px rgba(0,255,255,0.3), inset 0 0 20px rgba(0,255,255,0.1)",
              }}
            >
              {/* Tux Penguin */}
              <motion.div
                className="w-24 h-32 relative"
                animate={{ y: [-2, 2, -2] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                {/* Body */}
                <div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-24 rounded-full"
                  style={{
                    background: "linear-gradient(180deg, #333 0%, #1a1a1a 100%)",
                    border: "2px solid rgba(0,255,255,0.5)",
                  }}
                />
                {/* Belly */}
                <div
                  className="absolute bottom-2 left-1/2 -translate-x-1/2 w-14 h-18 rounded-full"
                  style={{ background: "linear-gradient(180deg, #fff 0%, #ddd 100%)" }}
                />
                {/* Head */}
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full"
                  style={{
                    background: "linear-gradient(180deg, #333 0%, #1a1a1a 100%)",
                    border: "2px solid rgba(0,255,255,0.5)",
                  }}
                />
                {/* Eyes */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-3">
                  <div className="w-3 h-3 rounded-full bg-white">
                    <div className="w-1.5 h-1.5 rounded-full bg-black mt-0.5 ml-0.5" />
                  </div>
                  <div className="w-3 h-3 rounded-full bg-white">
                    <div className="w-1.5 h-1.5 rounded-full bg-black mt-0.5 ml-0.5" />
                  </div>
                </div>
                {/* Beak */}
                <div
                  className="absolute top-8 left-1/2 -translate-x-1/2 w-4 h-3"
                  style={{ background: "#ffcc00", clipPath: "polygon(50% 100%, 0% 0%, 100% 0%)" }}
                />
              </motion.div>

              {/* Speech Bubble */}
              <motion.div
                className="absolute -top-20 left-1/2 -translate-x-1/2 px-4 py-3 rounded-lg w-64"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: "#0a0a0a",
                  border: "2px solid rgba(0,255,255,0.7)",
                  boxShadow: "0 0 20px rgba(0,255,255,0.3)",
                }}
              >
                <p className="text-cyan-400 font-mono text-sm leading-relaxed">{getHintMessage(currentThreat)}</p>
                <div
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45"
                  style={{
                    background: "#0a0a0a",
                    borderRight: "2px solid rgba(0,255,255,0.7)",
                    borderBottom: "2px solid rgba(0,255,255,0.7)",
                  }}
                />
              </motion.div>

              {/* Holographic scan line */}
              <motion.div
                className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl"
                style={{
                  background: "linear-gradient(180deg, transparent 0%, rgba(0,255,255,0.1) 50%, transparent 100%)",
                  backgroundSize: "100% 200%",
                }}
                animate={{ backgroundPositionY: ["0%", "200%"] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
