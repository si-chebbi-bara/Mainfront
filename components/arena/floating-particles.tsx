"use client"

import { motion } from "framer-motion"
import { useMemo } from "react"

export function FloatingParticles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 50 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 1 + Math.random() * 3,
        duration: 10 + Math.random() * 20,
        delay: Math.random() * 10,
      })),
    [],
  )

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            width: particle.size,
            height: particle.size,
            background: `rgba(0, 255, 255, ${0.2 + Math.random() * 0.3})`,
            boxShadow: `0 0 ${particle.size * 2}px rgba(0, 255, 255, 0.5)`,
          }}
          animate={{
            y: [particle.y + "%", particle.y - 120 + "%"],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Number.POSITIVE_INFINITY,
            delay: particle.delay,
            ease: "linear",
          }}
        />
      ))}
    </div>
  )
}
