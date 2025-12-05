"use client"

import type React from "react"
import { useState, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { NeonGrid } from "./arena/neon-grid"
import { FloatingParticles } from "./arena/floating-particles"
import { Scanlines } from "./arena/scanlines"
import { EvilMainframe } from "./arena/evil-mainframe"
import { LoreIntro } from "./arena/lore-intro"
import { TutorialOverlay } from "./arena/tutorial-overlay"
import { ThreatRoulette } from "./arena/threat-roulette"
import { BossSummon } from "./arena/boss-summon"
import { GameHUD } from "./arena/game-hud"
import { PlayerHand } from "./arena/player-hand"
import { SourceDeck } from "./arena/source-deck"
import { EmergencyAssist } from "./arena/emergency-assist"
import { VictoryScreen } from "./arena/victory-screen"
import { BattleResultToast } from "./arena/battle-result-toast"
import { LaserBeam } from "./arena/laser-beam"
import { EnemyThreatSlot } from "./arena/enemy-threat-slot"
import type { Boss, GameCard } from "@/lib/game-types"
import { BOSSES, COUNTER_CARDS } from "@/lib/game-types"

const PLAYER_CARDS: GameCard[] = COUNTER_CARDS.map((card) => ({
  id: card.id,
  name: card.name,
  type: "Counter" as const,
  power: 10,
  description: card.lore,
  color: card.color,
  secondaryColor: card.secondaryColor,
  hoverData: `${card.visual}: ${card.lore}`,
  counters: [card.counters],
  icon: card.icon,
  minigameType: card.minigameType,
}))

type GamePhase = "lore" | "tutorial" | "roulette" | "summon" | "playing" | "victory" | "defeat"

export function CardBattleArena() {
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 })
  const bossRef = useRef<HTMLDivElement>(null)

  const [gamePhase, setGamePhase] = useState<GamePhase>("lore")
  const [currentBoss, setCurrentBoss] = useState<Boss | null>(null)
  const [showAssist, setShowAssist] = useState(false)
  const [isAttacking, setIsAttacking] = useState(false)
  const [battleResult, setBattleResult] = useState<{ type: "success" | "failure"; message: string } | null>(null)
  const [showLaser, setShowLaser] = useState<{ card: GameCard } | null>(null)
  const [showThreatCard, setShowThreatCard] = useState(false)
  const [bossShaking, setBossShaking] = useState(false)

  const [playerHP, setPlayerHP] = useState(10)
  const [enemyHP, setEnemyHP] = useState(10)
  const [currentRound, setCurrentRound] = useState(1)
  const [totalRounds] = useState(5)
  const [score, setScore] = useState(0)
  const [liberationProgress, setLiberationProgress] = useState(0)
  const [bossesDefeated, setBossesDefeated] = useState<string[]>([])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMousePosition({
      x: e.clientX / window.innerWidth,
      y: e.clientY / window.innerHeight,
    })
  }, [])

  const getCorrectCardId = useCallback(() => {
    if (!currentBoss) return null
    const correctCard = COUNTER_CARDS.find((c) => c.counters === currentBoss.id)
    return correctCard?.id || null
  }, [currentBoss])

  const handleLoreComplete = useCallback(() => {
    setGamePhase("tutorial")
  }, [])

  const handleTutorialComplete = useCallback(() => {
    setGamePhase("roulette")
  }, [])

  const handleTutorialSkip = useCallback(() => {
    setGamePhase("roulette")
  }, [])

  const handleBossSelected = useCallback((boss: Boss) => {
    setCurrentBoss(boss)
    setGamePhase("summon")
  }, [])

  const handleSummonComplete = useCallback(() => {
    setGamePhase("playing")
    setTimeout(() => {
      setShowThreatCard(true)
    }, 500)
    setTimeout(() => setIsAttacking(true), 2000)
    setTimeout(() => setIsAttacking(false), 3500)
  }, [])

  const handleLaserComplete = useCallback(() => {
    console.log("[v0] Laser complete! Damaging boss...")
    setShowLaser(null)
    setBossShaking(true)

    setTimeout(() => setBossShaking(false), 500)

    const newEnemyHP = Math.max(0, enemyHP - 3)
    setEnemyHP(newEnemyHP)
    setScore((prev) => prev + 100)
    setLiberationProgress((prev) => Math.min(100, prev + 20))
    setBattleResult({ type: "success", message: "SECTOR DE-CORRUPTED!" })

    if (newEnemyHP <= 0) {
      console.log("[v0] Boss defeated!")
      setBossesDefeated((prev) => [...prev, currentBoss?.id || ""])
      setShowThreatCard(false)
      setBattleResult({ type: "success", message: "TARGET NEUTRALIZED" })
      setTimeout(() => {
        setBattleResult(null)
        if (currentRound >= totalRounds || bossesDefeated.length + 1 >= BOSSES.length) {
          setGamePhase("victory")
        } else {
          setCurrentRound((prev) => prev + 1)
          setEnemyHP(10)
          setGamePhase("roulette")
        }
      }, 2000)
    } else {
      setTimeout(() => {
        setBattleResult(null)
        setIsAttacking(true)
        setTimeout(() => setIsAttacking(false), 2000)
      }, 1500)
    }
  }, [enemyHP, currentBoss, currentRound, totalRounds, bossesDefeated.length])

  const handleCardWin = useCallback(
    (card: GameCard) => {
      console.log("[v0] Minigame Won! Card:", card.name)
      const isCorrectCard = card.counters?.includes(currentBoss?.id || "")

      if (isCorrectCard) {
        console.log("[v0] Correct card! Firing laser...")
        setShowLaser({ card })
      } else {
        console.log("[v0] Wrong card selected")
        const newPlayerHP = Math.max(0, playerHP - 1)
        setPlayerHP(newPlayerHP)
        setBattleResult({ type: "failure", message: "WRONG COUNTERMEASURE!" })

        if (newPlayerHP <= 0) {
          setTimeout(() => {
            setBattleResult(null)
            setGamePhase("defeat")
          }, 2000)
        } else {
          setTimeout(() => {
            setBattleResult(null)
            setIsAttacking(true)
            setTimeout(() => setIsAttacking(false), 2000)
          }, 1500)
        }
      }
    },
    [currentBoss, playerHP],
  )

  const handleCardLoss = useCallback(
    (card: GameCard) => {
      console.log("[v0] Minigame Lost!")
      const newPlayerHP = Math.max(0, playerHP - 2)
      setPlayerHP(newPlayerHP)
      setBattleResult({ type: "failure", message: "COUNTERMEASURE FAILED!" })

      if (newPlayerHP <= 0) {
        setTimeout(() => {
          setBattleResult(null)
          setGamePhase("defeat")
        }, 2000)
      } else {
        setTimeout(() => {
          setBattleResult(null)
          setIsAttacking(true)
          setTimeout(() => setIsAttacking(false), 2000)
        }, 1500)
      }
    },
    [playerHP],
  )

  const handleAssist = useCallback(() => {
    setShowAssist(true)
    setTimeout(() => setShowAssist(false), 4000)
  }, [])

  const handleRestart = useCallback(() => {
    setCurrentBoss(null)
    setShowAssist(false)
    setIsAttacking(false)
    setBattleResult(null)
    setShowLaser(null)
    setShowThreatCard(false)
    setBossShaking(false)
    setPlayerHP(10)
    setEnemyHP(10)
    setCurrentRound(1)
    setScore(0)
    setLiberationProgress(0)
    setBossesDefeated([])
    setGamePhase("lore")
  }, [])

  const getBossIconType = (boss: Boss | null): "window" | "fruit" | "g" => {
    if (!boss) return "window"
    if (boss.icon === "apple") return "fruit"
    if (boss.icon === "g") return "g"
    return "window"
  }

  return (
    <div
      className="relative w-full h-screen overflow-hidden bg-black"
      onMouseMove={handleMouseMove}
      style={{ perspective: "2000px" }}
    >
      <div className="absolute inset-0 z-0 pointer-events-none" style={{ transformStyle: "preserve-3d" }}>
        <AnimatePresence>
          {(gamePhase === "summon" || gamePhase === "playing") && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              <NeonGrid liberationProgress={liberationProgress} />
            </motion.div>
          )}
        </AnimatePresence>

        <FloatingParticles />
        <Scanlines />

        <AnimatePresence>
          {gamePhase === "playing" && currentBoss && (
            <motion.div
              ref={bossRef}
              initial={{ opacity: 0, y: -100 }}
              animate={{
                opacity: 1,
                y: 0,
                x: bossShaking ? [0, -10, 10, -10, 10, 0] : 0,
                filter: bossShaking ? "brightness(2) saturate(2)" : "brightness(1)",
              }}
              exit={{ opacity: 0, y: -100 }}
              transition={bossShaking ? { duration: 0.5 } : { type: "spring" }}
            >
              <EvilMainframe mousePosition={mousePosition} isAttacking={isAttacking} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {gamePhase === "playing" && currentBoss && (
          <div className="absolute inset-0 z-10 pointer-events-none flex justify-center">
            <EnemyThreatSlot boss={currentBoss} isVisible={showThreatCard} />
          </div>
        )}
      </AnimatePresence>

      {gamePhase === "playing" && (
        <div className="absolute bottom-0 left-0 w-full z-50 pointer-events-auto">
          <PlayerHand
            cards={PLAYER_CARDS}
            onCardWin={handleCardWin}
            onCardLoss={handleCardLoss}
            disabled={!!showLaser}
            highlightedCardId={showAssist ? getCorrectCardId() : null}
            currentThreatName={currentBoss?.id}
          />
        </div>
      )}

      {gamePhase === "playing" && (
        <div className="pointer-events-auto">
          <SourceDeck cards={PLAYER_CARDS} />
        </div>
      )}

      <AnimatePresence>{gamePhase === "lore" && <LoreIntro onComplete={handleLoreComplete} />}</AnimatePresence>

      <AnimatePresence>
        {gamePhase === "tutorial" && (
          <TutorialOverlay onComplete={handleTutorialComplete} onSkip={handleTutorialSkip} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {gamePhase === "roulette" && (
          <ThreatRoulette onBossSelected={handleBossSelected} excludeBosses={bossesDefeated} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {gamePhase === "summon" && currentBoss && (
          <BossSummon logo={getBossIconType(currentBoss)} onComplete={handleSummonComplete} />
        )}
      </AnimatePresence>

      {/* HUD Layer - pointer-events-none with specific auto for buttons */}
      {gamePhase === "playing" && currentBoss && (
        <div className="fixed inset-0 z-[60] pointer-events-none">
          <GameHUD
            playerHP={playerHP}
            maxPlayerHP={10}
            enemyHP={enemyHP}
            maxEnemyHP={10}
            currentRound={currentRound}
            totalRounds={totalRounds}
            score={score}
            enemyName={currentBoss.name}
          />

          <div className="pointer-events-auto">
            <EmergencyAssist
              onAssist={handleAssist}
              disabled={!!showLaser}
              isActive={showAssist}
              currentThreat={currentBoss.name}
            />
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-64">
            <div className="text-center mb-1">
              <span className="font-mono text-xs text-green-400">LIBERATION: {liberationProgress}%</span>
            </div>
            <div
              className="h-2 rounded-full overflow-hidden"
              style={{ background: "rgba(0,0,0,0.8)", border: "1px solid #333" }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, #ff0000, #ffff00, #00ff00)` }}
                animate={{ width: `${liberationProgress}%` }}
                transition={{ type: "spring", stiffness: 100 }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Laser beam - high z-index */}
      <AnimatePresence>
        {showLaser && (
          <div className="z-[100]">
            <LaserBeam
              fromPosition={{ x: window.innerWidth / 2, y: window.innerHeight - 150 }}
              toPosition={{ x: window.innerWidth / 2, y: 180 }}
              color={showLaser.card.color}
              onComplete={handleLaserComplete}
            />
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {battleResult && <BattleResultToast type={battleResult.type} message={battleResult.message} />}
      </AnimatePresence>

      <AnimatePresence>
        {(gamePhase === "victory" || gamePhase === "defeat") && (
          <VictoryScreen isVictory={gamePhase === "victory"} score={score} onRestart={handleRestart} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {gamePhase === "defeat" && (
          <motion.div
            className="fixed inset-0 z-[150] pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <motion.path
                d="M50 0 L48 30 L30 35 L45 50 L20 60 L50 70 L40 100"
                fill="none"
                stroke="rgba(255,255,255,0.8)"
                strokeWidth="0.3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5 }}
              />
              <motion.path
                d="M50 0 L55 25 L70 30 L60 50 L80 65 L55 75 L60 100"
                fill="none"
                stroke="rgba(255,255,255,0.6)"
                strokeWidth="0.2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
