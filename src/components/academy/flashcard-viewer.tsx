'use client'
import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Shuffle, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Flashcard {
  id: string
  term: string
  definition: string
}

export function FlashcardViewer({ flashcards }: { flashcards: Flashcard[] }) {
  const [cards, setCards] = useState<Flashcard[]>(flashcards || [])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)

  useEffect(() => {
    setCards(flashcards || [])
    setCurrentIndex(0)
    setIsFlipped(false)
  }, [flashcards])

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

  const handleShuffle = useCallback(() => {
    setCards([...cards].sort(() => Math.random() - 0.5))
    setCurrentIndex(0)
    setIsFlipped(false)
  }, [cards])

  const handleRestart = useCallback(() => {
    setCards(flashcards || [])
    setCurrentIndex(0)
    setIsFlipped(false)
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
    return <div className="text-center py-12 text-muted-foreground">No flashcards available for this lesson.</div>
  }

  const currentCard = cards[currentIndex]
  const progress = ((currentIndex + 1) / cards.length) * 100

  return (
    <div className="flex flex-col items-center py-8">
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
          {/* Front - Term */}
          <div className="absolute w-full h-full backface-hidden flex items-center justify-center p-8 rounded-2xl bg-card border-2 border-border shadow-xl">
            <p className="text-4xl font-bold text-center text-foreground">
              {currentCard?.term}
            </p>
          </div>
          {/* Back - Definition */}
          <div
            className="absolute w-full h-full backface-hidden flex items-center justify-center p-8 rounded-2xl bg-primary/5 border-2 border-primary shadow-xl"
            style={{ transform: 'rotateY(180deg)' }}
          >
            <p className="text-xl text-center text-foreground">
              {currentCard?.definition}
            </p>
          </div>
        </div>
      </div>

      <p className="text-muted-foreground text-sm mt-4">Click card or press Space to flip</p>

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
        <span className="text-xl font-medium text-foreground">{currentIndex + 1} of {cards.length}</span>
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

      <div className="w-full max-w-2xl h-2 bg-secondary rounded-full mt-6 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

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
