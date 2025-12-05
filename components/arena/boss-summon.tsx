"use client"

import { motion } from "framer-motion"
import { useEffect } from "react"

interface BossSummonProps {
  logo: "window" | "fruit" | "g"
  onComplete: () => void
}

export function BossSummon({ logo, onComplete }: BossSummonProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3500)
    return () => clearTimeout(timer)
  }, [onComplete])

  const renderLogo = () => {
    switch (logo) {
      case "window":
        return (
          <div className="grid grid-cols-2 gap-4 w-48 h-48">
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="bg-red-500/50"
                animate={{
                  opacity: [0.3, 0.8, 0.3],
                  scale: [0.95, 1, 0.95],
                }}
                transition={{
                  duration: 0.5,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.1,
                }}
                style={{
                  boxShadow: "0 0 30px rgba(255,0,0,0.5)",
                }}
              />
            ))}
          </div>
        )
      case "fruit":
        return (
          <motion.div
            className="relative w-48 h-48"
            animate={{
              filter: ["hue-rotate(0deg)", "hue-rotate(360deg)"],
            }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: "radial-gradient(circle at 30% 30%, #ff6666 0%, #cc0000 100%)",
                boxShadow: "0 0 60px rgba(255,0,0,0.6)",
              }}
            />
            {/* Bite */}
            <div className="absolute top-4 right-0 w-16 h-20 bg-black rounded-full" />
            {/* Leaf */}
            <div
              className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-12 rounded-full rotate-12"
              style={{
                background: "linear-gradient(180deg, #00ff00 0%, #006600 100%)",
              }}
            />
          </motion.div>
        )
      case "g":
        return (
          <motion.div
            className="text-[200px] font-bold leading-none"
            style={{
              background: "linear-gradient(180deg, #ff0000 25%, #00ff00 50%, #ffff00 75%, #0000ff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 30px rgba(255,0,0,0.5))",
            }}
            animate={{
              opacity: [0.5, 1, 0.5],
              scale: [0.98, 1.02, 0.98],
            }}
            transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY }}
          >
            G
          </motion.div>
        )
    }
  }

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Dark overlay */}
      <motion.div
        className="absolute inset-0 bg-black/80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Glitched Logo */}
      <motion.div
        className="relative"
        initial={{ scale: 0, opacity: 0, rotateY: -90 }}
        animate={{
          scale: [0, 1.2, 1],
          opacity: [0, 1, 1],
          rotateY: [-90, 0, 0],
        }}
        exit={{
          scale: [1, 1.2, 0],
          opacity: [1, 1, 0],
          filter: "blur(20px)",
        }}
        transition={{
          duration: 0.8,
          exit: { duration: 0.5 },
        }}
        style={{ perspective: "1000px" }}
      >
        {/* Glitch layers */}
        <motion.div
          className="absolute inset-0"
          animate={{
            x: [-5, 5, -3, 3, 0],
            opacity: [0.8, 0.5, 0.8],
          }}
          transition={{ duration: 0.1, repeat: Number.POSITIVE_INFINITY }}
          style={{ filter: "hue-rotate(90deg)" }}
        >
          {renderLogo()}
        </motion.div>
        <motion.div
          className="absolute inset-0"
          animate={{
            x: [5, -5, 3, -3, 0],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ duration: 0.15, repeat: Number.POSITIVE_INFINITY }}
          style={{ filter: "hue-rotate(-90deg)" }}
        >
          {renderLogo()}
        </motion.div>

        {renderLogo()}
      </motion.div>

      {/* Warning Text */}
      <motion.div
        className="absolute bottom-1/4 left-1/2 -translate-x-1/2 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <motion.p
          className="text-red-500 font-mono text-2xl tracking-[0.3em]"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
        >
          ⚠ THREAT INCOMING ⚠
        </motion.p>
      </motion.div>
    </motion.div>
  )
}
