'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Shuffle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface WikiFlashcard {
  id: string
  term: string
  definition: string
  category: string
}

const SAMPLE_FLASHCARDS: WikiFlashcard[] = [
  { id: '1', term: 'Gadaa', definition: 'An indigenous democratic socio-political system of the Oromo people with 8-year terms', category: 'history' },
  { id: '2', term: 'Irreecha', definition: 'The Oromo thanksgiving festival celebrated at the end of the rainy season', category: 'culture' },
  { id: '3', term: 'Caffee', definition: 'The democratic assembly in the Gadaa system where laws are made', category: 'history' },
  { id: '4', term: 'Odaa', definition: 'Sacred sycamore tree where Gadaa assemblies are held', category: 'culture' },
  { id: '5', term: 'Waaqeffanna', definition: 'Traditional Oromo religion believing in one God (Waaqa)', category: 'culture' },
  { id: '6', term: 'Afaan Oromoo', definition: 'The Oromo language, a Cushitic language spoken by 50+ million people', category: 'language' },
  { id: '7', term: 'Qubee', definition: 'The Latin-based alphabet used to write Afaan Oromoo', category: 'language' },
  { id: '8', term: 'Abba Gadaa', definition: 'The elected leader in the Gadaa system who serves for 8 years', category: 'history' },
]

export function WikiFlashcards() {
  const [cards, setCards] = useState(SAMPLE_FLASHCARDS)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)

  const currentCard = cards[currentIndex]

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(prev => prev + 1)
      setIsFlipped(false)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
      setIsFlipped(false)
    }
  }

  const handleShuffle = () => {
    setCards([...cards].sort(() => Math.random() - 0.5))
    setCurrentIndex(0)
    setIsFlipped(false)
  }

  return (
    <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Quick Learn</h2>
          <p className="text-slate-400">Test your knowledge with flashcards</p>
        </div>
        <Button variant="outline" onClick={handleShuffle} className="border-slate-600 text-slate-300 hover:text-white">
          <Shuffle className="h-4 w-4 mr-2" /> Shuffle
        </Button>
      </div>

      {/* Flashcard */}
      <div
        className="relative w-full h-64 cursor-pointer mb-6"
        onClick={() => setIsFlipped(!isFlipped)}
        style={{ perspective: '1000px' }}
      >
        <div
          className="relative w-full h-full transition-transform duration-500"
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
          }}
        >
          {/* Front */}
          <div
            className="absolute w-full h-full flex flex-col items-center justify-center p-8 rounded-xl bg-slate-900 border border-slate-700"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <span className="text-emerald-400 text-sm mb-2 capitalize">{currentCard.category}</span>
            <p className="text-3xl font-bold text-white text-center">{currentCard.term}</p>
            <p className="text-slate-500 text-sm mt-4">Click to reveal</p>
          </div>

          {/* Back */}
          <div
            className="absolute w-full h-full flex items-center justify-center p-8 rounded-xl bg-slate-700 border border-emerald-500"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            <p className="text-xl text-slate-200 text-center">{currentCard.definition}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="text-slate-400 hover:text-white disabled:opacity-50"
        >
          <ChevronLeft className="h-5 w-5 mr-1" /> Previous
        </Button>

        <span className="text-slate-400">{currentIndex + 1} / {cards.length}</span>

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
      <div className="mt-4 h-1 bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-amber-500 transition-all"
          style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
        />
      </div>
    </div>
  )
}
