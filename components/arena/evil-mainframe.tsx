"use client"

import { motion } from "framer-motion"

interface EvilMainframeProps {
  mousePosition: { x: number; y: number }
  isAttacking: boolean
}

export function EvilMainframe({ mousePosition, isAttacking }: EvilMainframeProps) {
  const eyeOffsetX = (mousePosition.x - 0.5) * 20
  const eyeOffsetY = (mousePosition.y - 0.5) * 10

  return (
    <div className="absolute top-8 left-1/2 -translate-x-1/2">
      {/* The Mainframe Tower */}
      <motion.div
        className="relative w-40 h-64"
        animate={
          isAttacking
            ? {
                filter: ["brightness(1)", "brightness(2)", "brightness(1)"],
              }
            : {}
        }
        transition={{ duration: 0.3, repeat: isAttacking ? 3 : 0 }}
      >
        {/* Tower Body */}
        <div
          className="absolute inset-0 rounded-sm"
          style={{
            background: `
              linear-gradient(180deg, 
                #1a1a2e 0%, 
                #0f0f1a 50%,
                #0a0a12 100%
              )
            `,
            boxShadow: `
              0 0 60px rgba(255,0,0,0.3),
              inset 0 0 30px rgba(0,0,0,0.8)
            `,
            border: "1px solid rgba(255,0,0,0.3)",
          }}
        >
          {/* Server rack lines */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="absolute left-2 right-2 h-px bg-red-900/50" style={{ top: `${(i + 1) * 28}px` }} />
          ))}

          {/* Blinking lights */}
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-red-500"
              style={{
                left: `${10 + (i % 3) * 15}px`,
                top: `${30 + Math.floor(i / 3) * 40}px`,
              }}
              animate={{
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 0.5 + Math.random() * 0.5,
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 0.5,
              }}
            />
          ))}
        </div>

        {/* The Evil Eye */}
        <motion.div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20"
          animate={
            isAttacking
              ? {
                  scale: [1, 1.3, 1],
                  boxShadow: ["0 0 40px rgba(255,0,0,0.5)", "0 0 80px rgba(255,0,0,0.9)", "0 0 40px rgba(255,0,0,0.5)"],
                }
              : {}
          }
          transition={{ duration: 0.2, repeat: isAttacking ? 5 : 0 }}
          style={{
            background: "radial-gradient(circle, #ff0000 0%, #660000 50%, #1a0000 100%)",
            borderRadius: "50%",
            boxShadow: "0 0 40px rgba(255,0,0,0.5), inset 0 0 20px rgba(0,0,0,0.5)",
          }}
        >
          {/* Pupil that tracks mouse */}
          <motion.div
            className="absolute w-6 h-6 rounded-full bg-black"
            style={{
              top: "50%",
              left: "50%",
              boxShadow: "0 0 10px rgba(255,0,0,0.8)",
            }}
            animate={{
              x: eyeOffsetX - 12,
              y: eyeOffsetY - 12,
            }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            {/* Inner glow */}
            <div className="absolute inset-1 rounded-full bg-red-900/50" />
          </motion.div>
        </motion.div>

        {/* Attack beam */}
        {isAttacking && (
          <motion.div
            className="absolute top-full left-1/2 w-2 origin-top"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 400, opacity: [0, 1, 1, 0] }}
            transition={{ duration: 0.5, delay: 1 }}
            style={{
              background: "linear-gradient(180deg, #ff0000 0%, transparent 100%)",
              boxShadow: "0 0 20px rgba(255,0,0,0.8)",
              transform: "translateX(-50%)",
            }}
          />
        )}
      </motion.div>
    </div>
  )
}
