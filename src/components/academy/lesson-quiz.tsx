'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, ArrowRight, RotateCcw, Trophy, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Flashcard {
  id: string
  term: string
  definition: string
  order_index: number
}

interface LessonQuizProps {
  flashcards: Flashcard[]
  onComplete?: (score: number, total: number) => void
}

interface Question {
  term: string
  correctAnswer: string
  options: string[]
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function generateQuestions(flashcards: Flashcard[]): Question[] {
  return shuffleArray(flashcards).map(card => {
    const wrongAnswers = flashcards
      .filter(f => f.id !== card.id)
      .map(f => f.definition)

    const shuffledWrong = shuffleArray(wrongAnswers).slice(0, 3)
    const options = shuffleArray([card.definition, ...shuffledWrong])

    return {
      term: card.term,
      correctAnswer: card.definition,
      options
    }
  })
}

export const LessonQuiz = ({ flashcards, onComplete }: LessonQuizProps) => {
  const [questions, setQuestions] = useState<Question[]>(() =>
    flashcards && flashcards.length >= 4 ? generateQuestions(flashcards) : []
  )
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [streak, setStreak] = useState(0)

  // Debug logging
  useEffect(() => {
    console.log('[LessonQuiz] Received flashcards:', flashcards?.length || 0)
  }, [flashcards])

  const currentQuestion = questions[currentIndex]
  const progress = ((currentIndex + (isAnswered ? 1 : 0)) / questions.length) * 100
  const isCorrect = selectedAnswer === currentQuestion?.correctAnswer

  const handleSelectAnswer = (answer: string) => {
    if (isAnswered) return

    setSelectedAnswer(answer)
    setIsAnswered(true)

    if (answer === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1)
      setStreak(prev => prev + 1)
    } else {
      setStreak(0)
    }
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1)
      setSelectedAnswer(null)
      setIsAnswered(false)
    } else {
      setIsComplete(true)
      if (onComplete) {
        onComplete(score + (isCorrect ? 1 : 0), questions.length)
      }
    }
  }

  const handleRestart = () => {
    setQuestions(generateQuestions(flashcards))
    setCurrentIndex(0)
    setSelectedAnswer(null)
    setIsAnswered(false)
    setScore(0)
    setStreak(0)
    setIsComplete(false)
  }

  if (flashcards.length < 4) {
    return (
      <div className="flex items-center justify-center h-80">
        <p className="text-muted-foreground">
          Need at least 4 flashcards to generate a quiz.
        </p>
      </div>
    )
  }

  if (isComplete) {
    const finalScore = score
    const percentage = Math.round((finalScore / questions.length) * 100)
    const isPassing = percentage >= 70
    const isPerfect = percentage === 100

    return (
      <div className="flex flex-col items-center justify-center py-12 gap-6">
        {/* Trophy icon */}
        <div className={cn(
          "w-28 h-28 rounded-full flex items-center justify-center relative",
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
          <h2 className="text-3xl font-bold text-foreground mb-2">
            {isPerfect ? "Perfect Score!" : isPassing ? "Great Job!" : "Keep Practicing!"}
          </h2>
          <p className="text-xl text-muted-foreground">
            You scored {finalScore} out of {questions.length}
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
              className="text-secondary"
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
              isPassing ? "text-green-400" : "text-orange-400"
            )}>
              {percentage}%
            </span>
          </div>
        </div>

        <p className="text-muted-foreground text-center max-w-md">
          {isPerfect
            ? "Amazing! You've completely mastered this material!"
            : isPassing
            ? "You've got a solid understanding. Keep it up!"
            : "Don't worry, practice makes perfect. Try again!"}
        </p>

        <Button onClick={handleRestart} size="lg" className="mt-4">
          <RotateCcw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-6 py-8">
      {/* Header with score and streak */}
      <div className="w-full max-w-2xl flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            Question {currentIndex + 1} of {questions.length}
          </span>
          {streak >= 2 && (
            <span className="text-sm text-orange-400 font-medium animate-pulse">
              {streak} streak!
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span className="font-medium text-foreground">{score}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-2xl h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question card */}
      <div className="w-full max-w-2xl bg-card border border-border rounded-2xl p-8 shadow-2xl">
        <h3 className="text-3xl font-bold text-center text-foreground mb-8">
          {currentQuestion.term}
        </h3>

        <div className="grid gap-3">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === option
            const isCorrectOption = option === currentQuestion.correctAnswer
            const optionLetter = String.fromCharCode(65 + index)

            return (
              <button
                key={index}
                onClick={() => handleSelectAnswer(option)}
                disabled={isAnswered}
                className={cn(
                  "quiz-option w-full p-4 rounded-xl border-2 text-left transition-all duration-200",
                  "flex items-center gap-4",
                  !isAnswered && "hover:border-primary/50 hover:bg-secondary/50",
                  !isAnswered && "border-border bg-secondary/50",
                  isAnswered && isCorrectOption && "border-green-500 bg-green-500/20 correct",
                  isAnswered && isSelected && !isCorrectOption && "border-red-500 bg-red-500/20 incorrect",
                  isAnswered && !isSelected && !isCorrectOption && "border-border bg-secondary/30 opacity-50"
                )}
              >
                <span className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold",
                  !isAnswered && "bg-secondary text-muted-foreground",
                  isAnswered && isCorrectOption && "bg-green-500 text-white",
                  isAnswered && isSelected && !isCorrectOption && "bg-red-500 text-white",
                  isAnswered && !isSelected && !isCorrectOption && "bg-secondary text-muted-foreground"
                )}>
                  {optionLetter}
                </span>
                <span className={cn(
                  "flex-1 text-base",
                  !isAnswered && "text-foreground",
                  isAnswered && isCorrectOption && "text-green-600 dark:text-green-400 font-medium",
                  isAnswered && isSelected && !isCorrectOption && "text-red-600 dark:text-red-400",
                  isAnswered && !isSelected && !isCorrectOption && "text-muted-foreground"
                )}>
                  {option}
                </span>
                {isAnswered && isCorrectOption && (
                  <CheckCircle className="w-6 h-6 text-green-400" />
                )}
                {isAnswered && isSelected && !isCorrectOption && (
                  <XCircle className="w-6 h-6 text-red-400" />
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
            isCorrect ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
          )}>
            {isCorrect ? "Correct!" : "Incorrect"}
          </div>
          <Button onClick={handleNext} size="lg" className="min-w-[200px]">
            {currentIndex < questions.length - 1 ? (
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
