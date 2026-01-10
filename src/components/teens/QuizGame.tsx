'use client'

import { useState, useEffect, useCallback } from 'react'
import { Clock, CheckCircle2, XCircle, Trophy, RotateCcw, ArrowRight, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface QuizQuestion {
  id: string
  question_text: string
  question_type: 'multiple_choice' | 'true_false' | 'fill_blank'
  options: string[] | null
  correct_answer: string
  explanation: string | null
  points: number
}

interface QuizGameProps {
  title: string
  questions: QuizQuestion[]
  timeLimit?: number // minutes
  passingScore: number // percentage
  xpReward?: number
  onComplete?: (result: { score: number; passed: boolean; xpEarned: number }) => void
}

interface Answer {
  questionId: string
  answer: string
  isCorrect: boolean
}

export function QuizGame({
  title,
  questions,
  timeLimit,
  passingScore,
  xpReward = 100,
  onComplete,
}: QuizGameProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [fillBlankAnswer, setFillBlankAnswer] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [showReview, setShowReview] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(timeLimit ? timeLimit * 60 : 0)

  const currentQuestion = questions[currentIndex]
  const totalQuestions = questions.length
  const answeredCount = answers.length

  // Timer
  useEffect(() => {
    if (!timeLimit || isComplete) return

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          handleQuizComplete()
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

  const handleSelectAnswer = (answer: string) => {
    if (showResult) return
    setSelectedAnswer(answer)
  }

  const handleSubmitAnswer = useCallback(() => {
    if (!currentQuestion) return

    const answer = currentQuestion.question_type === 'fill_blank' ? fillBlankAnswer : selectedAnswer
    if (!answer) return

    const isCorrect =
      currentQuestion.question_type === 'fill_blank'
        ? answer.toLowerCase().trim() === currentQuestion.correct_answer.toLowerCase().trim()
        : answer === currentQuestion.correct_answer

    setAnswers((prev) => [
      ...prev,
      { questionId: currentQuestion.id, answer, isCorrect },
    ])
    setShowResult(true)
  }, [currentQuestion, selectedAnswer, fillBlankAnswer])

  const handleNextQuestion = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1)
      setSelectedAnswer(null)
      setFillBlankAnswer('')
      setShowResult(false)
    } else {
      handleQuizComplete()
    }
  }

  const handleQuizComplete = () => {
    const correctCount = answers.filter((a) => a.isCorrect).length
    const score = Math.round((correctCount / totalQuestions) * 100)
    const passed = score >= passingScore
    const xpEarned = passed ? xpReward : Math.round(xpReward * 0.25)

    setIsComplete(true)
    onComplete?.({ score, passed, xpEarned })
  }

  const handleRetake = () => {
    setCurrentIndex(0)
    setAnswers([])
    setSelectedAnswer(null)
    setFillBlankAnswer('')
    setShowResult(false)
    setIsComplete(false)
    setShowReview(false)
    setTimeRemaining(timeLimit ? timeLimit * 60 : 0)
  }

  // Calculate results
  const correctCount = answers.filter((a) => a.isCorrect).length
  const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0
  const passed = score >= passingScore

  // Results screen
  if (isComplete && !showReview) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div
          className={cn(
            'w-24 h-24 rounded-full flex items-center justify-center mb-6',
            passed ? 'bg-green-100' : 'bg-amber-100'
          )}
        >
          {passed ? (
            <Trophy className="w-12 h-12 text-green-600" />
          ) : (
            <RotateCcw className="w-12 h-12 text-amber-600" />
          )}
        </div>

        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {passed ? 'Congratulations!' : 'Keep Practicing!'}
        </h2>

        <p className="text-slate-600 mb-4">
          You scored {correctCount} out of {totalQuestions} ({score}%)
        </p>

        <div className="text-lg font-semibold mb-6">
          {passed ? (
            <span className="text-green-600">You passed!</span>
          ) : (
            <span className="text-amber-600">
              You need {passingScore}% to pass. Try again!
            </span>
          )}
        </div>

        <div
          className={cn(
            'border rounded-lg px-6 py-3 mb-6',
            passed ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-200'
          )}
        >
          <p className={cn('font-semibold text-lg', passed ? 'text-amber-700' : 'text-slate-600')}>
            +{passed ? xpReward : Math.round(xpReward * 0.25)} XP earned
          </p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setShowReview(true)}>
            <Eye className="w-4 h-4 mr-2" />
            Review Answers
          </Button>
          <Button onClick={handleRetake}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Retake Quiz
          </Button>
        </div>
      </div>
    )
  }

  // Review screen
  if (showReview) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">Review Answers</h3>
          <Button variant="outline" size="sm" onClick={() => setShowReview(false)}>
            Back to Results
          </Button>
        </div>

        <div className="space-y-4">
          {questions.map((q, i) => {
            const answer = answers.find((a) => a.questionId === q.id)
            return (
              <Card key={q.id} className={cn(answer?.isCorrect ? 'border-green-200' : 'border-red-200')}>
                <CardContent className="p-4">
                  <p className="text-sm text-slate-500 mb-1">Question {i + 1}</p>
                  <p className="font-medium text-slate-900 mb-3">{q.question_text}</p>

                  <div className="space-y-2 text-sm">
                    <p className={cn(answer?.isCorrect ? 'text-green-600' : 'text-red-600')}>
                      Your answer: {answer?.answer || 'No answer'}
                    </p>
                    {!answer?.isCorrect && (
                      <p className="text-green-600">Correct answer: {q.correct_answer}</p>
                    )}
                    {q.explanation && (
                      <p className="text-slate-600 bg-slate-50 p-2 rounded mt-2">
                        {q.explanation}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="flex justify-center">
          <Button onClick={handleRetake}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Retake Quiz
          </Button>
        </div>
      </div>
    )
  }

  // Quiz interface
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-slate-900">{title}</h3>
          <p className="text-sm text-slate-500">
            Question {currentIndex + 1} of {totalQuestions}
          </p>
        </div>
        {timeLimit && (
          <div
            className={cn(
              'flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium',
              timeRemaining < 60 ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'
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
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
        />
      </div>

      {/* Question */}
      <Card>
        <CardContent className="p-6">
          <p className="text-lg font-medium text-slate-900 mb-6">
            {currentQuestion.question_text}
          </p>

          {/* Multiple choice */}
          {currentQuestion.question_type === 'multiple_choice' && currentQuestion.options && (
            <div className="space-y-3">
              {currentQuestion.options.map((option, i) => {
                const letter = String.fromCharCode(65 + i) // A, B, C, D
                const isSelected = selectedAnswer === option
                const isCorrect = option === currentQuestion.correct_answer
                const showCorrect = showResult && isCorrect
                const showWrong = showResult && isSelected && !isCorrect

                return (
                  <button
                    key={i}
                    onClick={() => handleSelectAnswer(option)}
                    disabled={showResult}
                    className={cn(
                      'w-full flex items-center gap-3 p-4 rounded-lg border-2 text-left transition-all',
                      !showResult && isSelected && 'border-blue-500 bg-blue-50',
                      !showResult && !isSelected && 'border-slate-200 hover:border-slate-300',
                      showCorrect && 'border-green-500 bg-green-50',
                      showWrong && 'border-red-500 bg-red-50'
                    )}
                  >
                    <span
                      className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm',
                        !showResult && isSelected && 'bg-blue-500 text-white',
                        !showResult && !isSelected && 'bg-slate-100 text-slate-600',
                        showCorrect && 'bg-green-500 text-white',
                        showWrong && 'bg-red-500 text-white'
                      )}
                    >
                      {showCorrect ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : showWrong ? (
                        <XCircle className="w-5 h-5" />
                      ) : (
                        letter
                      )}
                    </span>
                    <span className="flex-1 text-slate-900">{option}</span>
                  </button>
                )
              })}
            </div>
          )}

          {/* True/False */}
          {currentQuestion.question_type === 'true_false' && (
            <div className="grid grid-cols-2 gap-4">
              {['True', 'False'].map((option) => {
                const isSelected = selectedAnswer === option
                const isCorrect = option === currentQuestion.correct_answer
                const showCorrect = showResult && isCorrect
                const showWrong = showResult && isSelected && !isCorrect

                return (
                  <button
                    key={option}
                    onClick={() => handleSelectAnswer(option)}
                    disabled={showResult}
                    className={cn(
                      'p-6 rounded-lg border-2 font-semibold text-lg transition-all',
                      !showResult && isSelected && 'border-blue-500 bg-blue-50 text-blue-700',
                      !showResult && !isSelected && 'border-slate-200 hover:border-slate-300 text-slate-700',
                      showCorrect && 'border-green-500 bg-green-50 text-green-700',
                      showWrong && 'border-red-500 bg-red-50 text-red-700'
                    )}
                  >
                    {option}
                  </button>
                )
              })}
            </div>
          )}

          {/* Fill in blank */}
          {currentQuestion.question_type === 'fill_blank' && (
            <div className="space-y-3">
              <Input
                value={fillBlankAnswer}
                onChange={(e) => setFillBlankAnswer(e.target.value)}
                placeholder="Type your answer..."
                disabled={showResult}
                className={cn(
                  'text-lg p-4',
                  showResult &&
                    fillBlankAnswer.toLowerCase().trim() ===
                      currentQuestion.correct_answer.toLowerCase().trim() &&
                    'border-green-500 bg-green-50',
                  showResult &&
                    fillBlankAnswer.toLowerCase().trim() !==
                      currentQuestion.correct_answer.toLowerCase().trim() &&
                    'border-red-500 bg-red-50'
                )}
              />
              {showResult &&
                fillBlankAnswer.toLowerCase().trim() !==
                  currentQuestion.correct_answer.toLowerCase().trim() && (
                  <p className="text-green-600 text-sm">
                    Correct answer: {currentQuestion.correct_answer}
                  </p>
                )}
            </div>
          )}

          {/* Explanation */}
          {showResult && currentQuestion.explanation && (
            <div className="mt-4 p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-600">{currentQuestion.explanation}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        {!showResult ? (
          <Button
            onClick={handleSubmitAnswer}
            disabled={
              currentQuestion.question_type === 'fill_blank'
                ? !fillBlankAnswer.trim()
                : !selectedAnswer
            }
          >
            Submit Answer
          </Button>
        ) : (
          <Button onClick={handleNextQuestion}>
            {currentIndex < totalQuestions - 1 ? (
              <>
                Next Question
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            ) : (
              'See Results'
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
