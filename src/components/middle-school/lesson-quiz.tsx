'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, ArrowRight, RotateCcw, Trophy, Sparkles, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface QuizQuestion {
  id: string
  question_text: string
  question_type: string
  options: string[]
  correct_answer: string
  explanation?: string | null
  points: number
  order_index: number
}

interface MiddleSchoolQuizProps {
  questions: QuizQuestion[]
  onComplete?: (score: number, total: number, totalPoints: number) => void
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function MiddleSchoolQuiz({ questions, onComplete }: MiddleSchoolQuizProps) {
  const [shuffledQuestions, setShuffledQuestions] = useState<QuizQuestion[]>(() =>
    questions && questions.length > 0 ? shuffleArray(questions) : []
  )
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [totalPoints, setTotalPoints] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [streak, setStreak] = useState(0)
  const [showExplanation, setShowExplanation] = useState(false)

  useEffect(() => {
    console.log('[MiddleSchoolQuiz] Received questions:', questions?.length || 0)
  }, [questions])

  const currentQuestion = shuffledQuestions[currentIndex]
  const progress = ((currentIndex + (isAnswered ? 1 : 0)) / shuffledQuestions.length) * 100
  const isCorrect = selectedAnswer === currentQuestion?.correct_answer

  const handleSelectAnswer = (answer: string) => {
    if (isAnswered) return

    setSelectedAnswer(answer)
    setIsAnswered(true)

    if (answer === currentQuestion.correct_answer) {
      setCorrectCount(prev => prev + 1)
      setTotalPoints(prev => prev + currentQuestion.points)
      setStreak(prev => prev + 1)
    } else {
      setStreak(0)
    }
  }

  const handleNext = () => {
    setShowExplanation(false)
    if (currentIndex < shuffledQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1)
      setSelectedAnswer(null)
      setIsAnswered(false)
    } else {
      setIsComplete(true)
      const finalCorrect = correctCount + (isCorrect ? 1 : 0)
      const finalPoints = totalPoints + (isCorrect ? currentQuestion.points : 0)
      if (onComplete) {
        onComplete(finalCorrect, shuffledQuestions.length, finalPoints)
      }
    }
  }

  const handleRestart = () => {
    setShuffledQuestions(shuffleArray(questions))
    setCurrentIndex(0)
    setSelectedAnswer(null)
    setIsAnswered(false)
    setCorrectCount(0)
    setTotalPoints(0)
    setStreak(0)
    setIsComplete(false)
    setShowExplanation(false)
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="flex items-center justify-center h-80">
        <p className="text-gray-500 dark:text-gray-400">
          No quiz questions available for this lesson.
        </p>
      </div>
    )
  }

  if (isComplete) {
    const finalCorrect = correctCount
    const percentage = Math.round((finalCorrect / shuffledQuestions.length) * 100)
    const isPassing = percentage >= 70
    const isPerfect = percentage === 100
    const maxPoints = shuffledQuestions.reduce((sum, q) => sum + q.points, 0)

    return (
      <div className="flex flex-col items-center justify-center py-12 gap-6">
        {/* Trophy icon */}
        <div className={cn(
          "w-28 h-28 rounded-full flex items-center justify-center relative shadow-lg",
          isPerfect ? "bg-gradient-to-br from-yellow-400 to-amber-500" :
          isPassing ? "bg-gradient-to-br from-green-400 to-emerald-500" :
          "bg-gradient-to-br from-orange-400 to-red-500"
        )}>
          {isPerfect && (
            <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-yellow-400 animate-pulse" />
          )}
          <Trophy className="w-14 h-14 text-white" />
        </div>

        {/* Results */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            {isPerfect ? "Perfect Score!" : isPassing ? "Great Job!" : "Keep Practicing!"}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            You got {finalCorrect} out of {shuffledQuestions.length} correct
          </p>
          <p className="text-lg text-blue-600 dark:text-blue-400 mt-2">
            +{totalPoints} / {maxPoints} points earned
          </p>
        </div>

        {/* Percentage circle */}
        <div className="relative w-32 h-32">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-gray-200 dark:text-gray-700"
            />
            <circle
              cx="64"
              cy="64"
              r="56"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${percentage * 3.51} 351`}
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={isPassing ? "#22c55e" : "#f97316"} />
                <stop offset="100%" stopColor={isPassing ? "#10b981" : "#ef4444"} />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={cn(
              "text-4xl font-bold",
              isPassing ? "text-green-600 dark:text-green-400" : "text-orange-600 dark:text-orange-400"
            )}>
              {percentage}%
            </span>
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
          {isPerfect
            ? "Amazing! You've completely mastered this material!"
            : isPassing
            ? "You've got a solid understanding. Keep it up!"
            : "Don't worry, practice makes perfect. Try again!"}
        </p>

        <Button onClick={handleRestart} size="lg" className="mt-4 bg-blue-600 hover:bg-blue-700">
          <RotateCcw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-6 py-8">
      {/* Header with progress */}
      <div className="w-full max-w-2xl flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Question {currentIndex + 1} of {shuffledQuestions.length}
          </span>
          {streak >= 2 && (
            <span className="text-sm text-orange-500 font-medium animate-pulse">
              {streak} streak!
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span className="font-medium text-slate-900 dark:text-white">{correctCount}</span>
          <span className="text-gray-400">|</span>
          <span className="text-blue-600 dark:text-blue-400 text-sm">{totalPoints} pts</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-2xl h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question card */}
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 shadow-lg">
        <div className="flex items-start gap-2 mb-2">
          <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
            {currentQuestion.points} {currentQuestion.points === 1 ? 'point' : 'points'}
          </span>
        </div>
        <h3 className="text-2xl md:text-3xl font-bold text-center text-slate-900 dark:text-white mb-8">
          {currentQuestion.question_text}
        </h3>

        <div className="grid gap-3">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === option
            const isCorrectOption = option === currentQuestion.correct_answer
            const optionLetter = String.fromCharCode(65 + index)

            return (
              <button
                key={index}
                onClick={() => handleSelectAnswer(option)}
                disabled={isAnswered}
                className={cn(
                  "w-full p-4 rounded-xl border-2 text-left transition-all duration-200",
                  "flex items-center gap-4",
                  !isAnswered && "hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20",
                  !isAnswered && "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50",
                  isAnswered && isCorrectOption && "border-green-500 bg-green-100 dark:bg-green-900/30",
                  isAnswered && isSelected && !isCorrectOption && "border-red-500 bg-red-100 dark:bg-red-900/30",
                  isAnswered && !isSelected && !isCorrectOption && "border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 opacity-50"
                )}
              >
                <span className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold",
                  !isAnswered && "bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300",
                  isAnswered && isCorrectOption && "bg-green-500 text-white",
                  isAnswered && isSelected && !isCorrectOption && "bg-red-500 text-white",
                  isAnswered && !isSelected && !isCorrectOption && "bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
                )}>
                  {optionLetter}
                </span>
                <span className={cn(
                  "flex-1 text-base",
                  !isAnswered && "text-slate-800 dark:text-gray-200",
                  isAnswered && isCorrectOption && "text-green-700 dark:text-green-400 font-medium",
                  isAnswered && isSelected && !isCorrectOption && "text-red-700 dark:text-red-400",
                  isAnswered && !isSelected && !isCorrectOption && "text-gray-500 dark:text-gray-500"
                )}>
                  {option}
                </span>
                {isAnswered && isCorrectOption && (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                )}
                {isAnswered && isSelected && !isCorrectOption && (
                  <XCircle className="w-6 h-6 text-red-500" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Feedback & Next */}
      {isAnswered && (
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div className={cn(
            "px-6 py-2 rounded-full font-medium",
            isCorrect ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
          )}>
            {isCorrect ? `Correct! +${currentQuestion.points} points` : "Incorrect"}
          </div>

          {/* Explanation */}
          {currentQuestion.explanation && (
            <div className="w-full max-w-2xl">
              {showExplanation ? (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                  <p className="text-slate-700 dark:text-blue-100">{currentQuestion.explanation}</p>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowExplanation(true)}
                  className="text-blue-600 dark:text-blue-400"
                >
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Show Explanation
                </Button>
              )}
            </div>
          )}

          <Button onClick={handleNext} size="lg" className="min-w-[200px] bg-blue-600 hover:bg-blue-700">
            {currentIndex < shuffledQuestions.length - 1 ? (
              <>
                Next Question
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                See Results
                <Trophy className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
