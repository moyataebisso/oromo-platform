'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, Lock } from 'lucide-react'

interface ParentalGateProps {
  onSuccess: () => void
  onCancel: () => void
}

// Generate a random math problem
const generateMathProblem = () => {
  const num1 = Math.floor(Math.random() * 20) + 5 // 5-24
  const num2 = Math.floor(Math.random() * 15) + 3 // 3-17
  return {
    question: `What is ${num1} + ${num2}?`,
    answer: num1 + num2,
  }
}

export const ParentalGate = ({ onSuccess, onCancel }: ParentalGateProps) => {
  const [problem, setProblem] = useState({ question: '', answer: 0 })
  const [userAnswer, setUserAnswer] = useState('')
  const [error, setError] = useState(false)
  const [attempts, setAttempts] = useState(0)

  useEffect(() => {
    setProblem(generateMathProblem())
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const parsed = parseInt(userAnswer, 10)

    if (parsed === problem.answer) {
      onSuccess()
    } else {
      setError(true)
      setAttempts(prev => prev + 1)
      setUserAnswer('')

      // Generate a new problem after 3 wrong attempts
      if (attempts >= 2) {
        setProblem(generateMathProblem())
        setAttempts(0)
      }

      // Clear error after 2 seconds
      setTimeout(() => setError(false), 2000)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Grown-Up Check</h2>
                <p className="text-white/80 text-sm">Answer to continue</p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              aria-label="Cancel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-slate-600 text-center mb-6">
            Leaving Kids Zone? Please solve this math problem:
          </p>

          <div className="text-center mb-6">
            <p className="text-3xl font-bold text-slate-800 mb-2">
              {problem.question}
            </p>
            {error && (
              <p className="text-red-500 text-sm animate-shake">
                That&apos;s not right. Try again!
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Enter your answer"
              className="text-center text-2xl h-14"
              autoFocus
            />

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={onCancel}
              >
                Stay in Kids Zone
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                disabled={!userAnswer}
              >
                Check Answer
              </Button>
            </div>
          </form>

          <p className="text-xs text-slate-400 text-center mt-4">
            This check helps keep kids in their safe zone
          </p>
        </div>
      </div>
    </div>
  )
}
