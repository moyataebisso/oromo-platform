'use client'

import { useState, useCallback, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Shuffle, RotateCcw, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Flashcard {
  id: string
  term: string
  definition: string
}

interface WikiFlashcardViewerProps {
  flashcards: Flashcard[]
}

export function WikiFlashcardViewer({ flashcards }: WikiFlashcardViewerProps) {
  const [cards, setCards] = useState(flashcards)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [knownCards, setKnownCards] = useState<Set<string>>(new Set())

  const currentCard = cards[currentIndex]
  const progress = cards.length > 0 ? ((currentIndex + 1) / cards.length) * 100 : 0

  const handleFlip = useCallback(() => setIsFlipped(prev => !prev), [])

  const handleNext = useCallback(() => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(prev => prev + 1)
      setIsFlipped(false)
    }
  }, [currentIndex, cards.length])

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
      setIsFlipped(false)
    }
  }, [currentIndex])

  const handleShuffle = () => {
    setCards([...cards].sort(() => Math.random() - 0.5))
    setCurrentIndex(0)
    setIsFlipped(false)
  }

  const handleRestart = () => {
    setCards(flashcards)
    setCurrentIndex(0)
    setIsFlipped(false)
    setKnownCards(new Set())
  }

  const markAsKnown = () => {
    if (currentCard) {
      setKnownCards(prev => new Set([...prev, currentCard.id]))
      handleNext()
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault()
        handleFlip()
      } else if (e.code === 'ArrowRight') {
        handleNext()
      } else if (e.code === 'ArrowLeft') {
        handlePrev()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleFlip, handleNext, handlePrev])

  if (!cards || cards.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">📚</div>
        <h3 className="text-xl font-semibold text-foreground mb-2">No flashcards yet</h3>
        <p className="text-muted-foreground">Flashcards will be added soon for this article.</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Stats */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-muted-foreground">
          <span className="text-foreground font-medium">{knownCards.size}</span> of {cards.length} mastered
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleShuffle}>
            <Shuffle className="h-4 w-4 mr-2" /> Shuffle
          </Button>
          <Button variant="outline" size="sm" onClick={handleRestart}>
            <RotateCcw className="h-4 w-4 mr-2" /> Restart
          </Button>
        </div>
      </div>

      {/* Flashcard */}
      <div
        className="relative w-full h-72 cursor-pointer mb-6"
        onClick={handleFlip}
        style={{ perspective: '1000px' }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.6s',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* Front */}
          <div className="absolute w-full h-full backface-hidden flex flex-col items-center justify-center p-8 rounded-2xl bg-card border-2 border-border shadow-lg dark:bg-slate-900 dark:border-slate-700">
            <span className="text-primary text-sm mb-4 uppercase tracking-wider font-medium">Term</span>
            <p className="text-3xl font-bold text-foreground text-center">{currentCard?.term}</p>
            <p className="text-muted-foreground text-sm mt-6">Click to reveal definition</p>
          </div>

          {/* Back */}
          <div
            className="absolute w-full h-full backface-hidden flex flex-col items-center justify-center p-8 rounded-2xl bg-primary/5 border-2 border-primary shadow-lg dark:bg-slate-800"
            style={{ transform: 'rotateY(180deg)' }}
          >
            <span className="text-amber-600 dark:text-amber-400 text-sm mb-4 uppercase tracking-wider font-medium">Definition</span>
            <p className="text-xl text-foreground text-center leading-relaxed">{currentCard?.definition}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="h-5 w-5 mr-1" /> Previous
        </Button>

        <span className="text-foreground font-medium">{currentIndex + 1} / {cards.length}</span>

        <Button
          variant="ghost"
          onClick={handleNext}
          disabled={currentIndex === cards.length - 1}
        >
          Next <ChevronRight className="h-5 w-5 ml-1" />
        </Button>
      </div>

      {/* Progress */}
      <div className="h-2 bg-secondary rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-gradient-to-r from-primary to-amber-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Mark as Known */}
      {isFlipped && (
        <div className="flex justify-center">
          <Button
            onClick={(e) => {
              e.stopPropagation()
              markAsKnown()
            }}
            className="bg-primary hover:bg-primary/90"
          >
            <Check className="h-4 w-4 mr-2" /> I know this
          </Button>
        </div>
      )}

      {/* Keyboard hints */}
      <div className="mt-8 text-center text-muted-foreground text-sm">
        <p>
          Press <kbd className="px-2 py-1 bg-secondary rounded text-foreground">Space</kbd> to flip •{' '}
          <kbd className="px-2 py-1 bg-secondary rounded text-foreground">←</kbd>{' '}
          <kbd className="px-2 py-1 bg-secondary rounded text-foreground">→</kbd> to navigate
        </p>
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
