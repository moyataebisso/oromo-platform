'use client'

import { useState, useEffect, useMemo } from 'react'
import { Clock, Star, RotateCcw, Trophy, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface MatchingPair {
  id: string
  left_text: string
  right_text: string
}

interface MatchingGameProps {
  title: string
  pairs: MatchingPair[]
  timeLimit?: number // seconds
  xpReward?: number
  onComplete?: (score: number, xpEarned: number) => void
}

interface Item {
  id: string
  text: string
  pairId: string
  side: 'left' | 'right'
  isMatched: boolean
}

export function MatchingGame({
  title,
  pairs,
  timeLimit,
  xpReward = 75,
  onComplete,
}: MatchingGameProps) {
  const [leftItems, setLeftItems] = useState<Item[]>([])
  const [rightItems, setRightItems] = useState<Item[]>([])
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null)
  const [selectedRight, setSelectedRight] = useState<string | null>(null)
  const [matchedPairs, setMatchedPairs] = useState<string[]>([])
  const [wrongPair, setWrongPair] = useState<{ left: string; right: string } | null>(null)
  const [timeRemaining, setTimeRemaining] = useState(timeLimit || 0)
  const [isComplete, setIsComplete] = useState(false)
  const [startTime] = useState(Date.now())
  const [mistakes, setMistakes] = useState(0)

  // Initialize shuffled items
  useEffect(() => {
    const left: Item[] = pairs.map((p) => ({
      id: `left-${p.id}`,
      text: p.left_text,
      pairId: p.id,
      side: 'left',
      isMatched: false,
    }))
    const right: Item[] = pairs.map((p) => ({
      id: `right-${p.id}`,
      text: p.right_text,
      pairId: p.id,
      side: 'right',
      isMatched: false,
    }))

    // Shuffle both arrays
    setLeftItems(left.sort(() => Math.random() - 0.5))
    setRightItems(right.sort(() => Math.random() - 0.5))
  }, [pairs])

  // Timer
  useEffect(() => {
    if (!timeLimit || isComplete) return

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          handleGameComplete()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [timeLimit, isComplete])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Check for match when both sides selected
  useEffect(() => {
    if (!selectedLeft || !selectedRight) return

    const leftItem = leftItems.find((i) => i.id === selectedLeft)
    const rightItem = rightItems.find((i) => i.id === selectedRight)

    if (!leftItem || !rightItem) return

    // Check if match
    if (leftItem.pairId === rightItem.pairId) {
      // Correct match
      setTimeout(() => {
        setMatchedPairs((prev) => [...prev, leftItem.pairId])
        setLeftItems((prev) =>
          prev.map((i) => (i.id === selectedLeft ? { ...i, isMatched: true } : i))
        )
        setRightItems((prev) =>
          prev.map((i) => (i.id === selectedRight ? { ...i, isMatched: true } : i))
        )
        setSelectedLeft(null)
        setSelectedRight(null)

        // Check if all matched
        if (matchedPairs.length + 1 === pairs.length) {
          handleGameComplete()
        }
      }, 300)
    } else {
      // Wrong match
      setWrongPair({ left: selectedLeft, right: selectedRight })
      setMistakes((prev) => prev + 1)

      setTimeout(() => {
        setWrongPair(null)
        setSelectedLeft(null)
        setSelectedRight(null)
      }, 800)
    }
  }, [selectedLeft, selectedRight])

  const handleSelectLeft = (id: string) => {
    const item = leftItems.find((i) => i.id === id)
    if (item?.isMatched || wrongPair) return
    setSelectedLeft(id)
  }

  const handleSelectRight = (id: string) => {
    const item = rightItems.find((i) => i.id === id)
    if (item?.isMatched || wrongPair) return
    setSelectedRight(id)
  }

  const handleGameComplete = () => {
    const timeTaken = Math.round((Date.now() - startTime) / 1000)
    const score = calculateScore()
    const xpEarned = Math.round(xpReward * (score / 100))
    setIsComplete(true)
    onComplete?.(score, xpEarned)
  }

  const calculateScore = () => {
    const matched = matchedPairs.length + (selectedLeft && selectedRight ? 1 : 0)
    const total = pairs.length
    const baseScore = (matched / total) * 100

    // Deduct for mistakes (max 30% penalty)
    const mistakePenalty = Math.min(mistakes * 5, 30)
    return Math.max(Math.round(baseScore - mistakePenalty), 0)
  }

  const getStars = (score: number) => {
    if (score >= 90) return 3
    if (score >= 70) return 2
    if (score >= 50) return 1
    return 0
  }

  const handlePlayAgain = () => {
    setMatchedPairs([])
    setSelectedLeft(null)
    setSelectedRight(null)
    setWrongPair(null)
    setMistakes(0)
    setIsComplete(false)
    setTimeRemaining(timeLimit || 0)

    // Re-shuffle
    setLeftItems((prev) => [...prev.map((i) => ({ ...i, isMatched: false }))].sort(() => Math.random() - 0.5))
    setRightItems((prev) => [...prev.map((i) => ({ ...i, isMatched: false }))].sort(() => Math.random() - 0.5))
  }

  // Completion screen
  if (isComplete) {
    const score = calculateScore()
    const stars = getStars(score)
    const timeTaken = Math.round((Date.now() - startTime) / 1000)
    const xpEarned = Math.round(xpReward * (score / 100))

    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        {/* Stars */}
        <div className="flex gap-2 mb-6">
          {[1, 2, 3].map((n) => (
            <Star
              key={n}
              className={cn(
                'w-12 h-12 transition-all',
                n <= stars
                  ? 'text-amber-400 fill-amber-400 scale-110'
                  : 'text-slate-300'
              )}
            />
          ))}
        </div>

        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <Trophy className="w-10 h-10 text-green-600" />
        </div>

        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {stars === 3 ? 'Perfect!' : stars === 2 ? 'Great Job!' : 'Good Try!'}
        </h2>

        <p className="text-slate-600 mb-4">
          Score: {score}% | Time: {formatTime(timeTaken)} | Mistakes: {mistakes}
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-lg px-6 py-3 mb-6">
          <p className="text-amber-700 font-semibold text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            +{xpEarned} XP earned
          </p>
        </div>

        <Button onClick={handlePlayAgain}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Play Again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-slate-900">{title}</h3>
          <p className="text-sm text-slate-500">
            Matched: {matchedPairs.length} / {pairs.length}
          </p>
        </div>
        {timeLimit && (
          <div
            className={cn(
              'flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium',
              timeRemaining < 30 ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'
            )}
          >
            <Clock className="w-4 h-4" />
            {formatTime(timeRemaining)}
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="w-full bg-slate-200 rounded-full h-2">
        <div
          className="bg-green-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(matchedPairs.length / pairs.length) * 100}%` }}
        />
      </div>

      {/* Matching area */}
      <div className="grid grid-cols-2 gap-4 md:gap-8">
        {/* Left column - Terms */}
        <div className="space-y-3">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
            Terms
          </p>
          {leftItems.map((item) => {
            const isSelected = selectedLeft === item.id
            const isWrong = wrongPair?.left === item.id

            return (
              <Card
                key={item.id}
                onClick={() => handleSelectLeft(item.id)}
                className={cn(
                  'p-4 cursor-pointer transition-all duration-200 border-2',
                  item.isMatched && 'opacity-50 bg-green-50 border-green-300 cursor-default',
                  !item.isMatched && isSelected && 'border-blue-500 bg-blue-50 ring-2 ring-blue-200',
                  !item.isMatched && !isSelected && !isWrong && 'border-blue-100 bg-blue-50/50 hover:border-blue-300',
                  isWrong && 'border-red-500 bg-red-50 animate-shake'
                )}
              >
                <p className="text-sm font-medium text-slate-900">{item.text}</p>
              </Card>
            )
          })}
        </div>

        {/* Right column - Definitions */}
        <div className="space-y-3">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
            Definitions
          </p>
          {rightItems.map((item) => {
            const isSelected = selectedRight === item.id
            const isWrong = wrongPair?.right === item.id

            return (
              <Card
                key={item.id}
                onClick={() => handleSelectRight(item.id)}
                className={cn(
                  'p-4 cursor-pointer transition-all duration-200 border-2',
                  item.isMatched && 'opacity-50 bg-green-50 border-green-300 cursor-default',
                  !item.isMatched && isSelected && 'border-purple-500 bg-purple-50 ring-2 ring-purple-200',
                  !item.isMatched && !isSelected && !isWrong && 'border-purple-100 bg-purple-50/50 hover:border-purple-300',
                  isWrong && 'border-red-500 bg-red-50 animate-shake'
                )}
              >
                <p className="text-sm text-slate-700">{item.text}</p>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Instructions */}
      <p className="text-center text-sm text-slate-500">
        Click a term on the left, then click its matching definition on the right
      </p>
    </div>
  )
}
