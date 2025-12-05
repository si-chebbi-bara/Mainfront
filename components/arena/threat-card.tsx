"use client"

import { motion } from "framer-motion"
import { AlertTriangle } from "lucide-react"

interface ThreatCardProps {
  threat: {
    name: string
    power: number
    description: string
  }
}

export function ThreatCard({ threat }: ThreatCardProps) {
  return (
    <motion.div
      className="absolute top-1/3 left-1/2 z-40"
      initial={{ y: -500, opacity: 0, rotateX: -30 }}
      animate={{ y: 0, opacity: 1, rotateX: 0 }}
      exit={{ y: 500, opacity: 0, scale: 0.5 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      style={{
        perspective: "1000px",
        transform: "translateX(-50%)",
      }}
    >
      <div
        className="relative w-52 h-72 rounded-lg overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #1a0000 0%, #330000 50%, #1a0000 100%)",
          border: "2px solid #ff0000",
          boxShadow: "0 0 40px rgba(255,0,0,0.5), inset 0 0 40px rgba(255,0,0,0.2)",
        }}
      >
        {/* Pulsing border effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            boxShadow: [
              "inset 0 0 20px rgba(255,0,0,0.3)",
              "inset 0 0 40px rgba(255,0,0,0.6)",
              "inset 0 0 20px rgba(255,0,0,0.3)",
            ],
          }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
        />

        {/* Header */}
        <div className="p-4 border-b border-red-900/50">
          <div className="flex items-center gap-2 text-red-500">
            <AlertTriangle className="w-5 h-5" />
            <span className="text-xs font-mono uppercase tracking-wider">THREAT</span>
          </div>
          <motion.h3
            className="text-white font-bold text-lg mt-2 tracking-wide"
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
          >
            {threat.name}
          </motion.h3>
        </div>

        {/* Power */}
        <div className="p-4 flex flex-col items-center">
          <div className="text-xs text-red-400 font-mono mb-1">THREAT LEVEL</div>
          <motion.div
            className="text-5xl font-bold font-mono text-red-500"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY }}
            style={{ textShadow: "0 0 20px rgba(255,0,0,0.8)" }}
          >
            {threat.power}
          </motion.div>
        </div>

        {/* Description */}
        <div className="p-4 pt-0">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-red-500 to-transparent mb-3" />
          <p className="text-xs text-red-300/80 font-mono leading-relaxed text-center italic">
            {'"'}
            {threat.description}
            {'"'}
          </p>
        </div>

        {/* Danger stripes */}
        <div
          className="absolute bottom-0 left-0 right-0 h-6"
          style={{
            background: `repeating-linear-gradient(
              -45deg,
              #ffcc00,
              #ffcc00 10px,
              #000000 10px,
              #000000 20px
            )`,
            opacity: 0.5,
          }}
        />

        {/* Corner accents */}
        {[
          "top-0 left-0 border-t-2 border-l-2",
          "top-0 right-0 border-t-2 border-r-2",
          "bottom-6 left-0 border-b-2 border-l-2",
          "bottom-6 right-0 border-b-2 border-r-2",
        ].map((pos, i) => (
          <div key={i} className={`absolute w-4 h-4 border-red-500 ${pos}`} />
        ))}
      </div>
    </motion.div>
  )
}
