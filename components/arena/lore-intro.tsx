"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"

interface LoreIntroProps {
  onComplete: () => void
}

export function LoreIntro({ onComplete }: LoreIntroProps) {
  const [typedText, setTypedText] = useState("")
  const [showButton, setShowButton] = useState(false)

  const loreText = `The year is 2025. Big Tech monopolies have walled off the internet. You are the last System Admin. Your Mission: Use Open Source tools to counter their proprietary bugs and reclaim our freedom.`

  useEffect(() => {
    let index = 0
    const timer = setInterval(() => {
      if (index < loreText.length) {
        setTypedText(loreText.slice(0, index + 1))
        index++
      } else {
        clearInterval(timer)
        setTimeout(() => setShowButton(true), 500)
      }
    }, 30)

    return () => clearInterval(timer)
  }, [])

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ background: "rgba(0,0,0,0.95)" }}
    >
      {/* CRT Flicker overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: [0.02, 0.05, 0.02] }}
        transition={{ duration: 0.1, repeat: Number.POSITIVE_INFINITY }}
        style={{ background: "rgba(255,255,255,0.03)" }}
      />

      {/* Terminal Window */}
      <motion.div
        className="relative w-full max-w-2xl mx-4"
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
      >
        {/* Terminal Header */}
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-t-sm"
          style={{
            background: "linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)",
            borderTop: "2px solid #00ff00",
            borderLeft: "2px solid #00ff00",
            borderRight: "2px solid #00ff00",
          }}
        >
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="font-pixel text-[8px] text-green-400 ml-4">root@freedom:~$</span>
        </div>

        {/* Terminal Body */}
        <div
          className="p-6 rounded-b-sm"
          style={{
            background: "linear-gradient(180deg, #0a0a0a 0%, #050505 100%)",
            border: "2px solid #00ff00",
            borderTop: "none",
            boxShadow: "0 0 50px rgba(0,255,0,0.2), inset 0 0 30px rgba(0,0,0,0.8)",
          }}
        >
          {/* Scanlines */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              background:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)",
            }}
          />

          {/* Warning Title */}
          <motion.div
            className="mb-6 text-center"
            animate={{ opacity: [1, 0.7, 1] }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
          >
            <h1
              className="font-pixel text-sm text-red-500 tracking-wider"
              style={{ textShadow: "0 0 10px rgba(255,0,0,0.8)" }}
            >
              WARNING: DIGITAL SOVEREIGNTY COMPROMISED
            </h1>
          </motion.div>

          {/* Divider */}
          <div className="h-px w-full bg-green-500/30 mb-6" />

          {/* Typed Text */}
          <div className="min-h-32 mb-6">
            <p className="font-mono text-sm text-green-400 leading-relaxed">
              {typedText}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
                className="inline-block w-2 h-4 bg-green-400 ml-1"
              />
            </p>
          </div>

          {/* Initialize Button */}
          {showButton && (
            <motion.div className="flex justify-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <motion.button
                className="px-8 py-3 font-pixel text-[10px] tracking-wider"
                style={{
                  background: "transparent",
                  border: "2px solid #00ff00",
                  color: "#00ff00",
                  boxShadow: "0 0 20px rgba(0,255,0,0.3)",
                }}
                animate={{ opacity: [1, 0.7, 1] }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 40px rgba(0,255,0,0.5)",
                }}
                whileTap={{ scale: 0.95 }}
                onClick={onComplete}
              >
                [ INITIALIZE SYSTEM ]
              </motion.button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
