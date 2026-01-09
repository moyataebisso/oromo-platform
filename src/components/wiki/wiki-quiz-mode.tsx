'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, ArrowRight, RotateCcw, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface QuizQuestion {
  id: string
  question: string
  correct_answer: string
  wrong_answers: string[]
  explanation?: string
}

interface WikiQuizModeProps {
  questions: QuizQuestion[]
}

export function WikiQuizMode({ questions }: WikiQuizModeProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([])

  const currentQuestion = questions[currentIndex]

  // Shuffle options when component mounts or question changes
  useEffect(() => {
    if (currentQuestion) {
      const options = [currentQuestion.correct_answer, ...currentQuestion.wrong_answers]
      setShuffledOptions(options.sort(() => Math.random() - 0.5))
    }
  }, [currentQuestion])

  const handleSelectAnswer = (answer: string) => {
    if (showResult) return
    setSelectedAnswer(answer)
    setShowResult(true)

    if (answer === currentQuestion.correct_answer) {
      setScore(prev => prev + 1)
    }
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    } else {
      setCompleted(true)
    }
  }

  const handleRestart = () => {
    setCurrentIndex(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
    setCompleted(false)
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-xl font-semibold text-white mb-2">No quiz questions yet</h3>
        <p className="text-slate-400">Quiz questions will be added soon for this article.</p>
      </div>
    )
  }

  if (completed) {
    const percentage = Math.round((score / questions.length) * 100)
    return (
      <div className="max-w-xl mx-auto text-center py-12">
        <div className="mb-6">
          {percentage >= 80 ? (
            <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
              <Trophy className="h-12 w-12 text-emerald-400" />
            </div>
          ) : percentage >= 50 ? (
            <div className="w-24 h-24 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-12 w-12 text-amber-400" />
            </div>
          ) : (
            <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
              <XCircle className="h-12 w-12 text-red-400" />
            </div>
          )}
        </div>

        <h2 className="text-3xl font-bold text-white mb-2">Quiz Complete!</h2>
        <p className="text-xl text-slate-300 mb-6">
          You scored <span className="text-emerald-400 font-bold">{score}</span> out of{' '}
          <span className="font-bold">{questions.length}</span>
        </p>

        <div className="text-6xl font-bold mb-8">
          <span
            className={
              percentage >= 80
                ? 'text-emerald-400'
                : percentage >= 50
                ? 'text-amber-400'
                : 'text-red-400'
            }
          >
            {percentage}%
          </span>
        </div>

        <Button onClick={handleRestart} className="bg-emerald-500 hover:bg-emerald-600">
          <RotateCcw className="h-4 w-4 mr-2" /> Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-slate-400">
          Question {currentIndex + 1} of {questions.length}
        </span>
        <span className="text-emerald-400 font-medium">Score: {score}</span>
      </div>

      <div className="h-2 bg-slate-700 rounded-full overflow-hidden mb-8">
        <div
          className="h-full bg-emerald-500 transition-all"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="bg-slate-800 rounded-xl p-8 mb-6 border border-slate-700">
        <h3 className="text-xl font-semibold text-white mb-6">{currentQuestion.question}</h3>

        <div className="space-y-3">
          {shuffledOptions.map((option, index) => {
            const isSelected = selectedAnswer === option
            const isCorrect = option === currentQuestion.correct_answer

            let buttonClass = 'w-full p-4 rounded-lg text-left transition-all border-2 '

            if (showResult) {
              if (isCorrect) {
                buttonClass += 'bg-emerald-500/20 border-emerald-500 text-white'
              } else if (isSelected) {
                buttonClass += 'bg-red-500/20 border-red-500 text-white'
              } else {
                buttonClass += 'bg-slate-700/50 border-slate-600 text-slate-400'
              }
            } else {
              buttonClass += isSelected
                ? 'bg-slate-700 border-emerald-500 text-white'
                : 'bg-slate-700 border-slate-600 text-slate-300 hover:border-slate-500 hover:bg-slate-600'
            }

            return (
              <button
                key={index}
                onClick={() => handleSelectAnswer(option)}
                disabled={showResult}
                className={buttonClass}
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-sm font-medium flex-shrink-0">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="flex-1">{option}</span>
                  {showResult && isCorrect && (
                    <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                  )}
                  {showResult && isSelected && !isCorrect && (
                    <XCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Explanation */}
      {showResult && currentQuestion.explanation && (
        <div className="bg-slate-800/50 rounded-xl p-6 mb-6 border border-slate-700">
          <h4 className="font-semibold text-white mb-2">Explanation</h4>
          <p className="text-slate-300">{currentQuestion.explanation}</p>
        </div>
      )}

      {/* Next Button */}
      {showResult && (
        <div className="flex justify-end">
          <Button onClick={handleNext} className="bg-emerald-500 hover:bg-emerald-600">
            {currentIndex < questions.length - 1 ? (
              <>
                Next Question <ArrowRight className="h-4 w-4 ml-2" />
              </>
            ) : (
              <>
                See Results <Trophy className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
