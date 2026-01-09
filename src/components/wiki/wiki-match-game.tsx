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
        <h3 className="text-xl font-semibold text-foreground mb-2">No match game available</h3>
        <p className="text-muted-foreground">Match game requires flashcards for this article.</p>
      </div>
    )
  }

  if (gameComplete) {
    const accuracy = attempts > 0 ? Math.round((maxCards / attempts) * 100) : 100
    return (
      <div className="max-w-xl mx-auto text-center py-12">
        <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Trophy className="h-12 w-12 text-primary" />
        </div>

        <h2 className="text-3xl font-bold text-foreground mb-2">Great Job!</h2>
        <p className="text-xl text-muted-foreground mb-6">You matched all {maxCards} pairs!</p>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-card rounded-xl p-4 border border-border shadow-sm">
            <p className="text-3xl font-bold text-primary">{formatTime(timer)}</p>
            <p className="text-muted-foreground text-sm">Time</p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border shadow-sm">
            <p className="text-3xl font-bold text-amber-500">{attempts}</p>
            <p className="text-muted-foreground text-sm">Attempts</p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border shadow-sm">
            <p className="text-3xl font-bold text-blue-500">{accuracy}%</p>
            <p className="text-muted-foreground text-sm">Accuracy</p>
          </div>
        </div>

        <Button onClick={initGame}>
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
          <span className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" /> {formatTime(timer)}
          </span>
          <span className="text-muted-foreground">
            Matches: <span className="text-primary font-medium">{matches}</span> / {maxCards}
          </span>
          <span className="text-muted-foreground">
            Attempts: <span className="text-amber-500 font-medium">{attempts}</span>
          </span>
        </div>
        <Button variant="outline" size="sm" onClick={initGame}>
          <RotateCcw className="h-4 w-4 mr-2" /> Restart
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-secondary rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-gradient-to-r from-primary to-amber-500 transition-all duration-300"
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
                ? 'bg-primary/10 border-primary text-primary cursor-default'
                : card.isSelected
                ? showError
                  ? 'bg-destructive/10 border-destructive text-foreground animate-shake'
                  : 'bg-amber-500/10 border-amber-500 text-foreground'
                : 'bg-card border-border text-foreground hover:border-primary/50 hover:bg-secondary/50 cursor-pointer'
            }`}
          >
            <span
              className={`text-xs uppercase tracking-wider mb-2 block font-medium ${
                card.isMatched
                  ? 'text-primary'
                  : card.type === 'term'
                  ? 'text-primary'
                  : 'text-amber-500'
              }`}
            >
              {card.type}
            </span>
            <span className="block leading-snug">{card.content}</span>
          </button>
        ))}
      </div>

      {/* Instructions */}
      <p className="text-center text-muted-foreground text-sm mt-6">
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
