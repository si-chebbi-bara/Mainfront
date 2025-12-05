"use client"

import { motion } from "framer-motion"

interface VictoryScreenProps {
  isVictory: boolean
  score: number
  onRestart: () => void
}

export function VictoryScreen({ isVictory, score, onRestart }: VictoryScreenProps) {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ background: "rgba(0,0,0,0.95)" }}
    >
      {/* Particle burst effect */}
      {isVictory && (
        <>
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: i % 2 === 0 ? "#00ff00" : "#00ffff",
                boxShadow: `0 0 10px ${i % 2 === 0 ? "#00ff00" : "#00ffff"}`,
              }}
              initial={{
                x: "50vw",
                y: "50vh",
                scale: 0,
              }}
              animate={{
                x: `${Math.random() * 100}vw`,
                y: `${Math.random() * 100}vh`,
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                delay: i * 0.05,
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: 1,
              }}
            />
          ))}
        </>
      )}

      <motion.div
        className="text-center"
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
      >
        {/* Main Title */}
        <motion.h1
          className="font-pixel text-2xl md:text-4xl mb-6 tracking-wider"
          style={{
            color: isVictory ? "#00ff00" : "#ff0000",
            textShadow: `0 0 30px ${isVictory ? "rgba(0,255,0,0.8)" : "rgba(255,0,0,0.8)"}`,
          }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          {isVictory ? "SYSTEM LIBERATED" : "SYSTEM COMPROMISED"}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="font-mono text-lg mb-8"
          style={{ color: isVictory ? "#00ffff" : "#ff6666" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {isVictory ? "Big Tech has been defeated. Freedom restored." : "The monopolies have won... this time."}
        </motion.p>

        {/* Score */}
        <motion.div
          className="mb-8 p-4 rounded-sm inline-block"
          style={{
            background: "rgba(0,20,0,0.8)",
            border: "2px solid #00ff00",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <span className="font-pixel text-sm text-green-400">FINAL SCORE: </span>
          <span className="font-pixel text-xl text-cyan-400">{score.toString().padStart(4, "0")}</span>
        </motion.div>

        {/* Restart Button */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}>
          <motion.button
            className="px-8 py-4 font-pixel text-sm tracking-wider"
            style={{
              background: "transparent",
              border: "2px solid #00ffff",
              color: "#00ffff",
              boxShadow: "0 0 20px rgba(0,255,255,0.3)",
            }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 40px rgba(0,255,255,0.5)",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={onRestart}
          >
            [ REBOOT SYSTEM ]
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
