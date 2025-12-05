"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface LaserBeamProps {
  fromPosition: { x: number; y: number }
  toPosition: { x: number; y: number }
  color: string
  onComplete: () => void
}

export function LaserBeam({ fromPosition, toPosition, color, onComplete }: LaserBeamProps) {
  const [showImpact, setShowImpact] = useState(false)

  useEffect(() => {
    // Show impact after beam reaches target
    const impactTimer = setTimeout(() => setShowImpact(true), 300)
    // Complete animation
    const completeTimer = setTimeout(() => onComplete(), 800)
    return () => {
      clearTimeout(impactTimer)
      clearTimeout(completeTimer)
    }
  }, [onComplete])

  return (
    <motion.div
      className="fixed inset-0 z-[200] pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <svg className="w-full h-full" style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id="laserGradient" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="1" />
            <stop offset="30%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="50%" stopColor={color} stopOpacity="1" />
            <stop offset="70%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="100%" stopColor={color} stopOpacity="1" />
          </linearGradient>
          <filter id="laserGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="glow1" />
            <feGaussianBlur stdDeviation="4" result="glow2" />
            <feMerge>
              <feMergeNode in="glow1" />
              <feMergeNode in="glow1" />
              <feMergeNode in="glow2" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="impactGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="15" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer glow beam */}
        <motion.line
          x1={fromPosition.x}
          y1={fromPosition.y}
          x2={toPosition.x}
          y2={toPosition.y}
          stroke={color}
          strokeWidth="20"
          strokeOpacity="0.3"
          filter="url(#laserGlow)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />

        {/* Main laser beam */}
        <motion.line
          x1={fromPosition.x}
          y1={fromPosition.y}
          x2={toPosition.x}
          y2={toPosition.y}
          stroke="url(#laserGradient)"
          strokeWidth="8"
          filter="url(#laserGlow)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />

        {/* Inner bright core */}
        <motion.line
          x1={fromPosition.x}
          y1={fromPosition.y}
          x2={toPosition.x}
          y2={toPosition.y}
          stroke="#ffffff"
          strokeWidth="3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />

        {showImpact && (
          <>
            {/* Central impact flash */}
            <motion.circle
              cx={toPosition.x}
              cy={toPosition.y}
              fill={color}
              filter="url(#impactGlow)"
              initial={{ r: 0, opacity: 1 }}
              animate={{ r: 80, opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
            {/* Secondary ring */}
            <motion.circle
              cx={toPosition.x}
              cy={toPosition.y}
              fill="none"
              stroke="#ffffff"
              strokeWidth="4"
              initial={{ r: 10, opacity: 1 }}
              animate={{ r: 60, opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            />
            {/* Tertiary ring */}
            <motion.circle
              cx={toPosition.x}
              cy={toPosition.y}
              fill="none"
              stroke={color}
              strokeWidth="2"
              initial={{ r: 20, opacity: 1 }}
              animate={{ r: 100, opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            />
          </>
        )}
      </svg>

      {showImpact && (
        <motion.div
          className="absolute inset-0"
          initial={{ backgroundColor: `${color}40` }}
          animate={{ backgroundColor: "transparent" }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  )
}
