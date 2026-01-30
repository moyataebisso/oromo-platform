'use client'

import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Shuffle, RotateCcw, Lightbulb } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Flashcard {
  id: string
  front_text: string
  back_text: string
  hint?: string | null
  order_index: number
}

interface FlashcardViewerProps {
  flashcards: Flashcard[]
  onComplete?: () => void
}

export function MiddleSchoolFlashcardViewer({ flashcards, onComplete }: FlashcardViewerProps) {
  const [cards, setCards] = useState<Flashcard[]>(flashcards || [])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [viewedCards, setViewedCards] = useState<Set<number>>(new Set([0]))

  useEffect(() => {
    setCards(flashcards || [])
    setCurrentIndex(0)
    setIsFlipped(false)
    setShowHint(false)
    setViewedCards(new Set([0]))
  }, [flashcards])

  const handleFlip = useCallback(() => {
    setIsFlipped(prev => !prev)
    setShowHint(false)
  }, [])

  const handleNext = useCallback(() => {
    if (currentIndex < cards.length - 1) {
      const nextIndex = currentIndex + 1
      setCurrentIndex(nextIndex)
      setIsFlipped(false)
      setShowHint(false)
      setViewedCards(prev => new Set([...prev, nextIndex]))

      // Check if all cards have been viewed
      if (viewedCards.size === cards.length - 1 && onComplete) {
        onComplete()
      }
    }
  }, [currentIndex, cards.length, viewedCards, onComplete])

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
      setIsFlipped(false)
      setShowHint(false)
    }
  }, [currentIndex])

  const handleShuffle = useCallback(() => {
    setCards([...cards].sort(() => Math.random() - 0.5))
    setCurrentIndex(0)
    setIsFlipped(false)
    setShowHint(false)
    setViewedCards(new Set([0]))
  }, [cards])

  const handleRestart = useCallback(() => {
    setCards(flashcards || [])
    setCurrentIndex(0)
    setIsFlipped(false)
    setShowHint(false)
    setViewedCards(new Set([0]))
  }, [flashcards])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') { e.preventDefault(); handleFlip() }
      else if (e.code === 'ArrowRight') handleNext()
      else if (e.code === 'ArrowLeft') handlePrev()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleFlip, handleNext, handlePrev])

  if (!cards || cards.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        No flashcards available for this lesson.
      </div>
    )
  }

  const currentCard = cards[currentIndex]
  const progress = ((currentIndex + 1) / cards.length) * 100

  return (
    <div className="flex flex-col items-center py-8">
      {/* Flashcard */}
      <div
        className="w-full max-w-2xl h-80 cursor-pointer"
        onClick={handleFlip}
        style={{ perspective: '1000px' }}
      >
        <div style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.6s',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}>
          {/* Front - Question/Term */}
          <div className="absolute w-full h-full backface-hidden flex items-center justify-center p-8 rounded-2xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-xl">
            <p className="text-3xl md:text-4xl font-bold text-center text-slate-900 dark:text-white">
              {currentCard?.front_text}
            </p>
          </div>
          {/* Back - Answer/Definition */}
          <div
            className="absolute w-full h-full backface-hidden flex items-center justify-center p-8 rounded-2xl bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-500 shadow-xl"
            style={{ transform: 'rotateY(180deg)' }}
          >
            <p className="text-xl md:text-2xl text-center text-slate-800 dark:text-blue-100">
              {currentCard?.back_text}
            </p>
          </div>
        </div>
      </div>

      {/* Hint button */}
      {currentCard?.hint && !isFlipped && (
        <div className="mt-4">
          {showHint ? (
            <div className="px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg text-yellow-800 dark:text-yellow-300 text-sm">
              <Lightbulb className="w-4 h-4 inline mr-2" />
              {currentCard.hint}
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => { e.stopPropagation(); setShowHint(true) }}
              className="text-yellow-600 dark:text-yellow-400"
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              Show Hint
            </Button>
          )}
        </div>
      )}

      <p className="text-gray-500 dark:text-gray-400 text-sm mt-4">Click card or press Space to flip</p>

      {/* Navigation */}
      <div className="flex items-center gap-8 mt-6">
        <Button
          variant="ghost"
          size="lg"
          onClick={(e) => { e.stopPropagation(); handlePrev() }}
          disabled={currentIndex === 0}
          className="h-14 w-14 rounded-full"
        >
          <ChevronLeft className="h-8 w-8" />
        </Button>
        <span className="text-xl font-medium text-slate-900 dark:text-white">{currentIndex + 1} of {cards.length}</span>
        <Button
          variant="ghost"
          size="lg"
          onClick={(e) => { e.stopPropagation(); handleNext() }}
          disabled={currentIndex === cards.length - 1}
          className="h-14 w-14 rounded-full"
        >
          <ChevronRight className="h-8 w-8" />
        </Button>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-2xl h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-6 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-4 mt-6">
        <Button variant="outline" onClick={(e) => { e.stopPropagation(); handleShuffle() }}>
          <Shuffle className="h-4 w-4 mr-2" /> Shuffle
        </Button>
        <Button variant="outline" onClick={(e) => { e.stopPropagation(); handleRestart() }}>
          <RotateCcw className="h-4 w-4 mr-2" /> Restart
        </Button>
      </div>

      <style jsx>{`
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
      `}</style>
    </div>
  )
}
