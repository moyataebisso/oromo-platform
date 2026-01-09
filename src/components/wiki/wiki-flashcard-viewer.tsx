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
        <h3 className="text-xl font-semibold text-white mb-2">No flashcards yet</h3>
        <p className="text-slate-400">Flashcards will be added soon for this article.</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Stats */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-slate-400">
          <span className="text-white font-medium">{knownCards.size}</span> of {cards.length} mastered
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleShuffle} className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700">
            <Shuffle className="h-4 w-4 mr-2" /> Shuffle
          </Button>
          <Button variant="outline" size="sm" onClick={handleRestart} className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700">
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
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem',
              borderRadius: '1rem',
              backgroundColor: '#0f172a',
              border: '2px solid #334155',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            }}
          >
            <span className="text-emerald-400 text-sm mb-4 uppercase tracking-wider">Term</span>
            <p className="text-3xl font-bold text-white text-center">{currentCard?.term}</p>
            <p className="text-slate-500 text-sm mt-6">Click to reveal definition</p>
          </div>

          {/* Back */}
          <div
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem',
              borderRadius: '1rem',
              backgroundColor: '#1e293b',
              border: '2px solid #10B981',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            }}
          >
            <span className="text-amber-400 text-sm mb-4 uppercase tracking-wider">Definition</span>
            <p className="text-xl text-slate-200 text-center leading-relaxed">{currentCard?.definition}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="text-slate-400 hover:text-white disabled:opacity-50"
        >
          <ChevronLeft className="h-5 w-5 mr-1" /> Previous
        </Button>

        <span className="text-white font-medium">{currentIndex + 1} / {cards.length}</span>

        <Button
          variant="ghost"
          onClick={handleNext}
          disabled={currentIndex === cards.length - 1}
          className="text-slate-400 hover:text-white disabled:opacity-50"
        >
          Next <ChevronRight className="h-5 w-5 ml-1" />
        </Button>
      </div>

      {/* Progress */}
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-amber-500 transition-all duration-300"
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
            className="bg-emerald-500 hover:bg-emerald-600 text-white"
          >
            <Check className="h-4 w-4 mr-2" /> I know this
          </Button>
        </div>
      )}

      {/* Keyboard hints */}
      <div className="mt-8 text-center text-slate-500 text-sm">
        <p>
          Press <kbd className="px-2 py-1 bg-slate-700 rounded text-slate-300">Space</kbd> to flip •{' '}
          <kbd className="px-2 py-1 bg-slate-700 rounded text-slate-300">←</kbd>{' '}
          <kbd className="px-2 py-1 bg-slate-700 rounded text-slate-300">→</kbd> to navigate
        </p>
      </div>
    </div>
  )
}
