'use client'

import { useState, useEffect, useCallback } from 'react'
import { Clock, RotateCcw, Trophy, Sparkles, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface MatchingPair {
  id: string
  left_text: string
  right_text: string
  order_index: number
}

interface MatchGameProps {
  pairs: MatchingPair[]
  onComplete?: () => void
}

interface GameCard {
  id: string
  content: string
  type: 'left' | 'right'
  pairId: string
  isFlipped: boolean
  isMatched: boolean
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function createGameCards(pairs: MatchingPair[]): GameCard[] {
  const selectedPairs = pairs.slice(0, 8)

  const cards: GameCard[] = []

  selectedPairs.forEach(pair => {
    cards.push({
      id: `left-${pair.id}`,
      content: pair.left_text,
      type: 'left',
      pairId: pair.id,
      isFlipped: false,
      isMatched: false
    })
    cards.push({
      id: `right-${pair.id}`,
      content: pair.right_text,
      type: 'right',
      pairId: pair.id,
      isFlipped: false,
      isMatched: false
    })
  })

  return shuffleArray(cards)
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// Confetti component
const Confetti = () => {
  const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#22c55e', '#f59e0b', '#06b6d4']
  const pieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    color: colors[Math.floor(Math.random() * colors.length)],
    left: Math.random() * 100,
    delay: Math.random() * 2,
    size: Math.random() * 10 + 5
  }))

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map(piece => (
        <div
          key={piece.id}
          className="confetti absolute rounded-sm"
          style={{
            left: `${piece.left}%`,
            top: '-20px',
            width: piece.size,
            height: piece.size,
            backgroundColor: piece.color,
            animationDelay: `${piece.delay}s`
          }}
        />
      ))}
    </div>
  )
}

export function MiddleSchoolMatchGame({ pairs, onComplete }: MatchGameProps) {
  const [cards, setCards] = useState<GameCard[]>(() =>
    pairs && pairs.length >= 2 ? createGameCards(pairs) : []
  )
  const [selectedCards, setSelectedCards] = useState<string[]>([])
  const [isChecking, setIsChecking] = useState(false)
  const [timer, setTimer] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [matches, setMatches] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [streak, setStreak] = useState(0)
  const [lastMatchWasCorrect, setLastMatchWasCorrect] = useState<boolean | null>(null)

  useEffect(() => {
    console.log('[MiddleSchoolMatchGame] Received pairs:', pairs?.length || 0)
  }, [pairs])

  const totalPairs = Math.min(pairs?.length || 0, 8)

  // Timer
  useEffect(() => {
    if (isComplete) return

    const interval = setInterval(() => {
      setTimer(prev => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [isComplete])

  // Check for match
  useEffect(() => {
    if (selectedCards.length !== 2) return

    setIsChecking(true)
    setAttempts(prev => prev + 1)

    const [firstId, secondId] = selectedCards
    const firstCard = cards.find(c => c.id === firstId)
    const secondCard = cards.find(c => c.id === secondId)

    if (!firstCard || !secondCard) return

    const isMatch = firstCard.pairId === secondCard.pairId && firstCard.type !== secondCard.type
    setLastMatchWasCorrect(isMatch)

    if (isMatch) {
      setStreak(prev => prev + 1)
    } else {
      setStreak(0)
    }

    setTimeout(() => {
      setCards(prev => prev.map(card => {
        if (card.id === firstId || card.id === secondId) {
          return {
            ...card,
            isFlipped: isMatch,
            isMatched: isMatch
          }
        }
        return card
      }))

      if (isMatch) {
        setMatches(prev => {
          const newMatches = prev + 1
          if (newMatches === totalPairs) {
            setIsComplete(true)
            setShowConfetti(true)
            if (onComplete) {
              onComplete()
            }
          }
          return newMatches
        })
      }

      setSelectedCards([])
      setIsChecking(false)
      setTimeout(() => setLastMatchWasCorrect(null), 300)
    }, isMatch ? 500 : 1000)
  }, [selectedCards, cards, totalPairs, onComplete])

  const handleCardClick = useCallback((cardId: string) => {
    if (isChecking) return
    if (selectedCards.includes(cardId)) return

    const card = cards.find(c => c.id === cardId)
    if (!card || card.isMatched) return

    setCards(prev => prev.map(c =>
      c.id === cardId ? { ...c, isFlipped: true } : c
    ))

    setSelectedCards(prev => {
      if (prev.length < 2) {
        return [...prev, cardId]
      }
      return prev
    })
  }, [isChecking, selectedCards, cards])

  const handleRestart = () => {
    setCards(createGameCards(pairs))
    setSelectedCards([])
    setIsChecking(false)
    setTimer(0)
    setIsComplete(false)
    setMatches(0)
    setAttempts(0)
    setShowConfetti(false)
    setStreak(0)
    setLastMatchWasCorrect(null)
  }

  if (!pairs || pairs.length < 2) {
    return (
      <div className="flex items-center justify-center h-80">
        <p className="text-gray-500 dark:text-gray-400">
          Need at least 2 matching pairs to play.
        </p>
      </div>
    )
  }

  if (isComplete) {
    const accuracy = Math.round((totalPairs / attempts) * 100)
    const rating = accuracy >= 90 ? 'Perfect!' : accuracy >= 70 ? 'Great!' : accuracy >= 50 ? 'Good!' : 'Keep practicing!'

    return (
      <>
        {showConfetti && <Confetti />}
        <div className="flex flex-col items-center justify-center py-12 gap-6">
          <div className="relative">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/25">
              <Trophy className="w-14 h-14 text-white" />
            </div>
            <Sparkles className="absolute -top-2 -right-2 w-10 h-10 text-yellow-400 animate-pulse" />
          </div>

          <div className="text-center">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
              {rating}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              You matched all {totalPairs} pairs!
            </p>
          </div>

          <div className="grid grid-cols-3 gap-8 text-center bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <div>
              <p className="text-4xl font-bold text-slate-900 dark:text-white">{formatTime(timer)}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Time</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-slate-900 dark:text-white">{attempts}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Moves</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-green-600 dark:text-green-400">{accuracy}%</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Accuracy</p>
            </div>
          </div>

          <Button onClick={handleRestart} size="lg" className="min-w-[200px] bg-blue-600 hover:bg-blue-700">
            <RotateCcw className="w-4 h-4 mr-2" />
            Play Again
          </Button>
        </div>

        <style jsx global>{`
          @keyframes confetti-fall {
            0% {
              transform: translateY(0) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(100vh) rotate(720deg);
              opacity: 0;
            }
          }
          .confetti {
            animation: confetti-fall 3s ease-in-out forwards;
          }
        `}</style>
      </>
    )
  }

  return (
    <div className="flex flex-col items-center gap-6 py-8">
      {/* Stats bar */}
      <div className="flex items-center justify-between w-full max-w-3xl bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white">
            <Clock className="w-5 h-5 text-blue-500" />
            <span className="font-mono text-lg">{formatTime(timer)}</span>
          </div>
          {streak >= 2 && (
            <div className="flex items-center gap-1 text-orange-500 animate-pulse">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">{streak} streak!</span>
            </div>
          )}
        </div>
        <div className="text-lg font-medium text-slate-900 dark:text-white">
          {matches} / {totalPairs}
        </div>
        <Button variant="ghost" size="sm" onClick={handleRestart} className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
          <RotateCcw className="w-4 h-4 mr-1" />
          Restart
        </Button>
      </div>

      {/* Feedback indicator */}
      {lastMatchWasCorrect !== null && (
        <div className={cn(
          "px-4 py-2 rounded-full text-sm font-medium transition-all",
          lastMatchWasCorrect ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
        )}>
          {lastMatchWasCorrect ? "Match!" : "Try again"}
        </div>
      )}

      {/* Game grid */}
      <div className="grid grid-cols-4 gap-3 w-full max-w-3xl">
        {cards.map(card => (
          <div
            key={card.id}
            className={cn(
              "aspect-[3/4] cursor-pointer transition-transform",
              card.isMatched && "pointer-events-none"
            )}
            onClick={() => handleCardClick(card.id)}
            style={{ perspective: '1000px' }}
          >
            <div
              className="relative w-full h-full transition-transform duration-500"
              style={{
                transformStyle: 'preserve-3d',
                transform: card.isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
              }}
            >
              {/* Card back (hidden side) */}
              <div className={cn(
                "absolute inset-0 flex items-center justify-center rounded-xl",
                "bg-gradient-to-br from-blue-600 to-purple-600 border-2 border-blue-500",
                "hover:from-blue-500 hover:to-purple-500 hover:scale-105 transition-all",
                selectedCards.includes(card.id) && "ring-2 ring-yellow-400 ring-offset-2 ring-offset-white dark:ring-offset-gray-900"
              )}
              style={{ backfaceVisibility: 'hidden' }}
              >
                <span className="text-4xl text-white/50 font-bold">?</span>
              </div>

              {/* Card front (content) */}
              <div
                className={cn(
                  "absolute inset-0 flex items-center justify-center p-3 rounded-xl",
                  "border-2 transition-all",
                  card.isMatched
                    ? "bg-green-100 dark:bg-green-900/30 border-green-500"
                    : card.type === 'left'
                      ? "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                      : "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                )}
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)'
                }}
              >
                <span className={cn(
                  "text-sm font-medium leading-tight text-center",
                  card.isMatched
                    ? "text-green-700 dark:text-green-400"
                    : "text-slate-800 dark:text-white"
                )}>
                  {card.content}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-3xl">
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
            style={{ width: `${(matches / totalPairs) * 100}%` }}
          />
        </div>
      </div>

      {/* Instructions */}
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-md">
        Click two cards to find matching pairs
      </p>
    </div>
  )
}
