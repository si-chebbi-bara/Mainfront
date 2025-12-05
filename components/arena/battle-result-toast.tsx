"use client"

import { motion } from "framer-motion"

interface BattleResultToastProps {
  type: "success" | "failure"
  message: string
}

export function BattleResultToast({ type, message }: BattleResultToastProps) {
  const isSuccess = type === "success"

  return (
    <motion.div
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[200] pointer-events-none"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.5, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div
        className={`px-12 py-6 rounded-lg font-mono text-2xl font-bold tracking-wider ${
          isSuccess
            ? "bg-green-900/90 text-green-300 border-2 border-green-500"
            : "bg-red-900/90 text-red-300 border-2 border-red-500"
        }`}
        style={{
          boxShadow: isSuccess
            ? "0 0 60px rgba(0,255,0,0.4), inset 0 0 30px rgba(0,255,0,0.1)"
            : "0 0 60px rgba(255,0,0,0.4), inset 0 0 30px rgba(255,0,0,0.1)",
          textShadow: isSuccess ? "0 0 20px #00ff00" : "0 0 20px #ff0000",
        }}
      >
        <motion.div animate={{ opacity: [1, 0.7, 1] }} transition={{ duration: 0.5, repeat: 2 }}>
          {message}
        </motion.div>
      </div>
    </motion.div>
  )
}
