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
        <h3 className="text-xl font-semibold text-foreground mb-2">No quiz questions yet</h3>
        <p className="text-muted-foreground">Quiz questions will be added soon for this article.</p>
      </div>
    )
  }

  if (completed) {
    const percentage = Math.round((score / questions.length) * 100)
    return (
      <div className="max-w-xl mx-auto text-center py-12">
        <div className="mb-6">
          {percentage >= 80 ? (
            <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
              <Trophy className="h-12 w-12 text-primary" />
            </div>
          ) : percentage >= 50 ? (
            <div className="w-24 h-24 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-12 w-12 text-amber-500" />
            </div>
          ) : (
            <div className="w-24 h-24 bg-destructive/20 rounded-full flex items-center justify-center mx-auto">
              <XCircle className="h-12 w-12 text-destructive" />
            </div>
          )}
        </div>

        <h2 className="text-3xl font-bold text-foreground mb-2">Quiz Complete!</h2>
        <p className="text-xl text-muted-foreground mb-6">
          You scored <span className="text-primary font-bold">{score}</span> out of{' '}
          <span className="font-bold">{questions.length}</span>
        </p>

        <div className="text-6xl font-bold mb-8">
          <span
            className={
              percentage >= 80
                ? 'text-primary'
                : percentage >= 50
                ? 'text-amber-500'
                : 'text-destructive'
            }
          >
            {percentage}%
          </span>
        </div>

        <Button onClick={handleRestart}>
          <RotateCcw className="h-4 w-4 mr-2" /> Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-muted-foreground">
          Question {currentIndex + 1} of {questions.length}
        </span>
        <span className="text-primary font-medium">Score: {score}</span>
      </div>

      <div className="h-2 bg-secondary rounded-full overflow-hidden mb-8">
        <div
          className="h-full bg-primary transition-all"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="bg-card rounded-xl p-8 mb-6 border border-border shadow-sm">
        <h3 className="text-xl font-semibold text-foreground mb-6">{currentQuestion.question}</h3>

        <div className="space-y-3">
          {shuffledOptions.map((option, index) => {
            const isSelected = selectedAnswer === option
            const isCorrect = option === currentQuestion.correct_answer

            let buttonClass = 'w-full p-4 rounded-lg text-left transition-all border-2 '

            if (showResult) {
              if (isCorrect) {
                buttonClass += 'bg-primary/10 border-primary text-foreground'
              } else if (isSelected) {
                buttonClass += 'bg-destructive/10 border-destructive text-foreground'
              } else {
                buttonClass += 'bg-secondary/50 border-border text-muted-foreground'
              }
            } else {
              buttonClass += isSelected
                ? 'bg-secondary border-primary text-foreground'
                : 'bg-secondary border-border text-foreground hover:border-primary/50 hover:bg-secondary/80'
            }

            return (
              <button
                key={index}
                onClick={() => handleSelectAnswer(option)}
                disabled={showResult}
                className={buttonClass}
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium text-muted-foreground flex-shrink-0">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="flex-1">{option}</span>
                  {showResult && isCorrect && (
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  )}
                  {showResult && isSelected && !isCorrect && (
                    <XCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Explanation */}
      {showResult && currentQuestion.explanation && (
        <div className="bg-secondary/50 rounded-xl p-6 mb-6 border border-border">
          <h4 className="font-semibold text-foreground mb-2">Explanation</h4>
          <p className="text-muted-foreground">{currentQuestion.explanation}</p>
        </div>
      )}

      {/* Next Button */}
      {showResult && (
        <div className="flex justify-end">
          <Button onClick={handleNext}>
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
