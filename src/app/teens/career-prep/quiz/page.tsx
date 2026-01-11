'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  RefreshCw,
  CheckCircle,
  Brain
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

interface QuizOption {
  value: string
  label: string
  icon: string
}

interface QuizQuestion {
  id: string
  question_text: string
  question_type: string
  options: QuizOption[]
  allow_multiple: boolean
  order_index: number
}

interface Career {
  id: string
  title: string
  slug: string
  description: string
  icon: string
  category: string
  salary_range: string
}

export default function CareerQuizPage() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string[]>>({})
  const [results, setResults] = useState<Career[]>([])
  const [loading, setLoading] = useState(true)
  const [showResults, setShowResults] = useState(false)
  const [calculating, setCalculating] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    async function fetchQuestions() {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sb = supabase as any

      const { data } = await sb
        .from('career_quiz_questions')
        .select('*')
        .eq('is_published', true)
        .order('order_index')

      if (data) {
        // Parse options from JSONB if needed
        const parsed = data.map((q: QuizQuestion) => ({
          ...q,
          options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options
        }))
        setQuestions(parsed)
      }
      setLoading(false)
    }

    fetchQuestions()
  }, [supabase])

  const currentQuestion = questions[currentStep]
  const progress = questions.length > 0 ? ((currentStep + 1) / questions.length) * 100 : 0

  const handleSelect = (value: string) => {
    const questionType = currentQuestion.question_type
    const current = answers[questionType] || []

    if (currentQuestion.allow_multiple) {
      // Toggle selection
      if (current.includes(value)) {
        setAnswers({
          ...answers,
          [questionType]: current.filter(v => v !== value)
        })
      } else {
        setAnswers({
          ...answers,
          [questionType]: [...current, value]
        })
      }
    } else {
      // Single selection
      setAnswers({
        ...answers,
        [questionType]: [value]
      })
    }
  }

  const isSelected = (value: string) => {
    const questionType = currentQuestion?.question_type
    return answers[questionType]?.includes(value) || false
  }

  const canProceed = () => {
    const questionType = currentQuestion?.question_type
    return answers[questionType]?.length > 0
  }

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      calculateResults()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const calculateResults = async () => {
    setCalculating(true)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = supabase as any

    // Collect all selected values
    const allSelections: string[] = Object.values(answers).flat()

    // Fetch career tags and match
    const { data: tags } = await sb
      .from('career_tags')
      .select('career_slug, tag_value, weight')
      .in('tag_value', allSelections)

    if (tags && tags.length > 0) {
      // Calculate scores for each career
      const scores: Record<string, number> = {}
      tags.forEach((tag: { career_slug: string; weight: number }) => {
        scores[tag.career_slug] = (scores[tag.career_slug] || 0) + tag.weight
      })

      // Get top careers
      const topSlugs = Object.entries(scores)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([slug]) => slug)

      // Fetch career details
      const { data: careers } = await sb
        .from('teen_careers')
        .select('id, title, slug, description, icon, category, salary_range')
        .in('slug', topSlugs)

      if (careers) {
        // Sort by score
        const sorted = careers.sort((a: Career, b: Career) => {
          return (scores[b.slug] || 0) - (scores[a.slug] || 0)
        })
        setResults(sorted)
      }
    } else {
      // Fallback: just get some featured careers
      const { data: careers } = await sb
        .from('teen_careers')
        .select('id, title, slug, description, icon, category, salary_range')
        .eq('is_featured', true)
        .limit(6)

      setResults(careers || [])
    }

    setCalculating(false)
    setShowResults(true)
  }

  const restartQuiz = () => {
    setCurrentStep(0)
    setAnswers({})
    setResults([])
    setShowResults(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading quiz...</p>
        </div>
      </div>
    )
  }

  // No questions available
  if (questions.length === 0 && !loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-gray-900">
        <Header />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Quiz Coming Soon!</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              We&apos;re still building this quiz. Check back soon!
            </p>
            <Link
              href="/teens/career-prep"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Careers
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // Results Screen
  if (showResults) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-gray-900">
        <Header />
        <main className="flex-1 py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Your Career Matches!</h1>
              <p className="text-gray-600 dark:text-gray-400">Based on your interests and preferences, here are careers you might love:</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {results.map((career, index) => (
                <Link
                  key={career.id}
                  href={`/teens/career-prep/careers/${career.slug}`}
                  className={`bg-white dark:bg-gray-800 rounded-xl p-6 border-2 transition-all hover:scale-[1.02] shadow-sm ${
                    index === 0 ? 'border-green-500 md:col-span-2' : 'border-gray-200 dark:border-gray-700 hover:border-green-500'
                  }`}
                >
                  {index === 0 && (
                    <span className="inline-block px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-full mb-3">
                      #1 Best Match
                    </span>
                  )}
                  <div className="flex items-start gap-4">
                    <span className="text-4xl">{career.icon}</span>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">{career.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 line-clamp-2">{career.description}</p>
                      <div className="flex items-center gap-4 mt-3 text-sm">
                        <span className="text-green-600 dark:text-green-400">{career.salary_range?.split(' - ')[0]}</span>
                        <span className="text-gray-500 dark:text-gray-500 capitalize">{career.category}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {results.length === 0 && (
              <div className="text-center py-8 mb-8">
                <p className="text-gray-500 dark:text-gray-400">
                  We couldn&apos;t find specific matches, but explore our career catalog to find what interests you!
                </p>
              </div>
            )}

            <div className="flex justify-center gap-4">
              <button
                onClick={restartQuiz}
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Take Quiz Again
              </button>
              <Link
                href="/teens/career-prep"
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Explore All Careers
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Calculating Screen
  if (calculating) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-slate-900 dark:text-white text-xl">Finding your perfect careers...</p>
        </div>
      </div>
    )
  }

  // Quiz Screen
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-gray-900">
      <Header />

      <main className="flex-1 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/teens/career-prep"
              className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Careers
            </Link>

            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Career Quiz</h1>
            <p className="text-gray-600 dark:text-gray-400">Answer a few questions to discover careers that match your interests!</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
              <span>Question {currentStep + 1} of {questions.length}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
              <div
                className="h-full bg-green-500 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question */}
          {currentQuestion && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 mb-6 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{currentQuestion.question_text}</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                {currentQuestion.allow_multiple ? 'Select all that apply' : 'Select one'}
              </p>

              <div className="grid grid-cols-2 gap-3">
                {currentQuestion.options?.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    className={`p-4 rounded-xl text-left transition-all border-2 relative ${
                      isSelected(option.value)
                        ? 'bg-green-500/10 dark:bg-green-600/20 border-green-500 text-slate-900 dark:text-white'
                        : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <span className="text-2xl mb-2 block">{option.icon}</span>
                    <span className="font-medium">{option.label}</span>
                    {isSelected(option.value) && (
                      <CheckCircle className="w-5 h-5 text-green-500 absolute top-3 right-3" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>

            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {currentStep === questions.length - 1 ? 'See Results' : 'Next'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
