'use client'

import { useState, useEffect } from 'react'
import { RotateCcw, Trophy, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Flashcard {
  id: string
  term: string
  definition: string
}

interface Card {
  id: string
  content: string
  type: 'term' | 'definition'
  matchId: string
  isMatched: boolean
  isSelected: boolean
}

interface WikiMatchGameProps {
  flashcards: Flashcard[]
}

export function WikiMatchGame({ flashcards }: WikiMatchGameProps) {
  const [cards, setCards] = useState<Card[]>([])
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)
  const [matches, setMatches] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [gameComplete, setGameComplete] = useState(false)
  const [timer, setTimer] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showError, setShowError] = useState(false)

  const maxCards = Math.min(flashcards.length, 8)

  // Initialize game
  const initGame = () => {
    const gameCards: Card[] = []

    flashcards.slice(0, 8).forEach((fc) => {
      gameCards.push({
        id: `term-${fc.id}`,
        content: fc.term,
        type: 'term',
        matchId: fc.id,
        isMatched: false,
        isSelected: false,
      })
      gameCards.push({
        id: `def-${fc.id}`,
        content:
          fc.definition.length > 60
            ? fc.definition.substring(0, 60) + '...'
            : fc.definition,
        type: 'definition',
        matchId: fc.id,
        isMatched: false,
        isSelected: false,
      })
    })

    setCards(gameCards.sort(() => Math.random() - 0.5))
    setSelectedCard(null)
    setMatches(0)
    setAttempts(0)
    setGameComplete(false)
    setTimer(0)
    setIsPlaying(true)
    setShowError(false)
  }

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying && !gameComplete) {
      interval = setInterval(() => setTimer((t) => t + 1), 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, gameComplete])

  // Start game on mount
  useEffect(() => {
    if (flashcards.length > 0) initGame()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCardClick = (card: Card) => {
    if (card.isMatched || card.isSelected || showError) return

    if (!selectedCard) {
      // First card selection
      setSelectedCard(card)
      setCards(cards.map((c) => (c.id === card.id ? { ...c, isSelected: true } : c)))
    } else {
      // Second card selection
      setAttempts((a) => a + 1)

      if (selectedCard.matchId === card.matchId && selectedCard.type !== card.type) {
        // Match found!
        const newMatches = matches + 1
        setMatches(newMatches)
        setCards(
          cards.map((c) =>
            c.matchId === card.matchId ? { ...c, isMatched: true, isSelected: false } : c
          )
        )

        if (newMatches === maxCards) {
          setGameComplete(true)
          setIsPlaying(false)
        }

        setSelectedCard(null)
      } else {
        // No match - show error briefly
        setCards(cards.map((c) => (c.id === card.id ? { ...c, isSelected: true } : c)))
        setShowError(true)

        setTimeout(() => {
          setCards(cards.map((c) => ({ ...c, isSelected: false })))
          setSelectedCard(null)
          setShowError(false)
        }, 800)
      }
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!flashcards || flashcards.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🎯</div>
        <h3 className="text-xl font-semibold text-white mb-2">No match game available</h3>
        <p className="text-slate-400">Match game requires flashcards for this article.</p>
      </div>
    )
  }

  if (gameComplete) {
    const accuracy = attempts > 0 ? Math.round((maxCards / attempts) * 100) : 100
    return (
      <div className="max-w-xl mx-auto text-center py-12">
        <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Trophy className="h-12 w-12 text-emerald-400" />
        </div>

        <h2 className="text-3xl font-bold text-white mb-2">Great Job!</h2>
        <p className="text-xl text-slate-300 mb-6">You matched all {maxCards} pairs!</p>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <p className="text-3xl font-bold text-emerald-400">{formatTime(timer)}</p>
            <p className="text-slate-400 text-sm">Time</p>
          </div>
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <p className="text-3xl font-bold text-amber-400">{attempts}</p>
            <p className="text-slate-400 text-sm">Attempts</p>
          </div>
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <p className="text-3xl font-bold text-blue-400">{accuracy}%</p>
            <p className="text-slate-400 text-sm">Accuracy</p>
          </div>
        </div>

        <Button onClick={initGame} className="bg-emerald-500 hover:bg-emerald-600">
          <RotateCcw className="h-4 w-4 mr-2" /> Play Again
        </Button>
      </div>
    )
  }

  return (
    <div>
      {/* Stats */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2 text-slate-400">
            <Clock className="h-4 w-4" /> {formatTime(timer)}
          </span>
          <span className="text-slate-400">
            Matches: <span className="text-emerald-400 font-medium">{matches}</span> / {maxCards}
          </span>
          <span className="text-slate-400">
            Attempts: <span className="text-amber-400 font-medium">{attempts}</span>
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={initGame}
          className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700"
        >
          <RotateCcw className="h-4 w-4 mr-2" /> Restart
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-amber-500 transition-all duration-300"
          style={{ width: `${(matches / maxCards) * 100}%` }}
        />
      </div>

      {/* Game Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card)}
            disabled={card.isMatched || showError}
            className={`p-4 rounded-xl text-sm text-left transition-all min-h-[120px] border-2 ${
              card.isMatched
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 cursor-default'
                : card.isSelected
                ? showError
                  ? 'bg-red-500/20 border-red-500 text-white animate-shake'
                  : 'bg-amber-500/20 border-amber-500 text-white'
                : 'bg-slate-700 border-slate-600 text-slate-300 hover:border-slate-500 hover:bg-slate-600 cursor-pointer'
            }`}
          >
            <span
              className={`text-xs uppercase tracking-wider mb-2 block font-medium ${
                card.isMatched
                  ? 'text-emerald-400'
                  : card.type === 'term'
                  ? 'text-emerald-400'
                  : 'text-amber-400'
              }`}
            >
              {card.type}
            </span>
            <span className="block leading-snug">{card.content}</span>
          </button>
        ))}
      </div>

      {/* Instructions */}
      <p className="text-center text-slate-500 text-sm mt-6">
        Click on cards to match terms with their definitions
      </p>

      {/* Add shake animation */}
      <style jsx>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          20%,
          60% {
            transform: translateX(-5px);
          }
          40%,
          80% {
            transform: translateX(5px);
          }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  )
}
