'use client'

import { useState, useCallback } from 'react'
import { Shuffle, Lightbulb, RotateCcw, ChevronLeft, ChevronRight, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface Flashcard {
  id: string
  front_text: string
  back_text: string
  hint?: string | null
}

interface FlashcardGameProps {
  flashcards: Flashcard[]
  title: string
  xpReward?: number
  onComplete?: (xpEarned: number) => void
}

export function FlashcardGame({ flashcards, title, xpReward = 50, onComplete }: FlashcardGameProps) {
  const [deck, setDeck] = useState<Flashcard[]>([...flashcards])
  const [masteredCards, setMasteredCards] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const currentCard = deck[currentIndex]
  const totalCards = flashcards.length
  const masteredCount = masteredCards.length

  const shuffleDeck = useCallback(() => {
    const shuffled = [...deck].sort(() => Math.random() - 0.5)
    setDeck(shuffled)
    setCurrentIndex(0)
    setIsFlipped(false)
    setShowHint(false)
  }, [deck])

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
    setShowHint(false)
  }

  const handleGotIt = () => {
    if (!currentCard) return

    // Add to mastered
    setMasteredCards((prev) => [...prev, currentCard.id])

    // Remove from deck
    const newDeck = deck.filter((card) => card.id !== currentCard.id)
    setDeck(newDeck)

    // Check if complete
    if (newDeck.length === 0) {
      setIsComplete(true)
      onComplete?.(xpReward)
    } else {
      // Move to next card or wrap around
      setCurrentIndex(Math.min(currentIndex, newDeck.length - 1))
      setIsFlipped(false)
      setShowHint(false)
    }
  }

  const handleReviewAgain = () => {
    if (!currentCard || deck.length <= 1) return

    // Move current card to end
    const newDeck = [...deck]
    const [card] = newDeck.splice(currentIndex, 1)
    newDeck.push(card)
    setDeck(newDeck)

    // Stay at current index to show next card
    setIsFlipped(false)
    setShowHint(false)
  }

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : deck.length - 1))
    setIsFlipped(false)
    setShowHint(false)
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < deck.length - 1 ? prev + 1 : 0))
    setIsFlipped(false)
    setShowHint(false)
  }

  const handleReset = () => {
    setDeck([...flashcards])
    setMasteredCards([])
    setCurrentIndex(0)
    setIsFlipped(false)
    setShowHint(false)
    setIsComplete(false)
  }

  // Completion screen
  if (isComplete) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <Trophy className="w-12 h-12 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Great Job!</h2>
        <p className="text-slate-600 dark:text-gray-400 mb-4">
          You mastered all {totalCards} flashcards!
        </p>
        <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-lg px-6 py-3 mb-6">
          <p className="text-amber-700 dark:text-amber-400 font-semibold text-lg">
            +{xpReward} XP earned!
          </p>
        </div>
        <Button onClick={handleReset} variant="outline" className="dark:border-gray-600 dark:text-gray-300">
          <RotateCcw className="w-4 h-4 mr-2" />
          Practice Again
        </Button>
      </div>
    )
  }

  if (!currentCard) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600 dark:text-gray-400">No flashcards available</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white">{title}</h3>
          <p className="text-sm text-slate-500 dark:text-gray-400">
            Card {currentIndex + 1} of {deck.length} remaining
            {masteredCount > 0 && ` (${masteredCount} mastered)`}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={shuffleDeck} className="dark:border-gray-600 dark:text-gray-300">
          <Shuffle className="w-4 h-4 mr-1" />
          Shuffle
        </Button>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-slate-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className="bg-green-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(masteredCount / totalCards) * 100}%` }}
        />
      </div>

      {/* Flashcard */}
      <div className="perspective-1000">
        <div
          onClick={handleFlip}
          className={cn(
            'relative w-full min-h-[280px] cursor-pointer transition-transform duration-500 transform-style-3d',
            isFlipped && 'rotate-y-180'
          )}
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* Front */}
          <Card
            className={cn(
              'absolute inset-0 backface-hidden flex flex-col items-center justify-center p-8 bg-gradient-to-br from-green-600 to-emerald-700 text-white',
              isFlipped && 'invisible'
            )}
            style={{ backfaceVisibility: 'hidden' }}
          >
            <p className="text-xs uppercase tracking-wider text-white/60 mb-4">Term</p>
            <p className="text-xl md:text-2xl font-semibold text-center leading-relaxed">
              {currentCard.front_text}
            </p>
            <p className="text-sm text-white/60 mt-6">Click to flip</p>
          </Card>

          {/* Back */}
          <Card
            className={cn(
              'absolute inset-0 backface-hidden flex flex-col items-center justify-center p-8 bg-gradient-to-br from-amber-500 to-yellow-600 text-white',
              !isFlipped && 'invisible'
            )}
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <p className="text-xs uppercase tracking-wider text-white/60 mb-4">Definition</p>
            <p className="text-xl md:text-2xl font-semibold text-center leading-relaxed">
              {currentCard.back_text}
            </p>
            <p className="text-sm text-white/60 mt-6">Click to flip back</p>
          </Card>
        </div>
      </div>

      {/* Hint */}
      {currentCard.hint && (
        <div className="text-center">
          {showHint ? (
            <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-lg p-3">
              <p className="text-amber-700 dark:text-amber-400 text-sm">
                <Lightbulb className="w-4 h-4 inline mr-1" />
                {currentCard.hint}
              </p>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHint(true)}
              className="text-amber-600 dark:text-amber-400"
            >
              <Lightbulb className="w-4 h-4 mr-1" />
              Show Hint
            </Button>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-center gap-3">
        <Button variant="outline" size="icon" onClick={handlePrevious} className="dark:border-gray-600 dark:text-gray-300">
          <ChevronLeft className="w-5 h-5" />
        </Button>

        <Button
          variant="outline"
          className="text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-700 hover:bg-orange-50 dark:hover:bg-orange-900/30"
          onClick={handleReviewAgain}
          disabled={deck.length <= 1}
        >
          Review Again
        </Button>

        <Button
          className="bg-green-600 hover:bg-green-700 text-white"
          onClick={handleGotIt}
        >
          Got it!
        </Button>

        <Button variant="outline" size="icon" onClick={handleNext} className="dark:border-gray-600 dark:text-gray-300">
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  )
}
