'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  BookOpen,
  Clock,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  ArrowLeft,
  Star,
  GraduationCap,
  Brain,
  Gamepad2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { MiddleSchoolFlashcardViewer } from '@/components/middle-school/flashcard-viewer'
import { MiddleSchoolQuiz } from '@/components/middle-school/lesson-quiz'
import { MiddleSchoolMatchGame } from '@/components/middle-school/match-game'

interface Course {
  id: string
  title: string
  slug: string
}

interface Lesson {
  id: string
  title: string
  slug: string
  content: string | null
  video_url: string | null
  duration_minutes: number | null
  xp_reward: number
  order_index: number
}

interface LessonNav {
  id: string
  title: string
  slug: string
  order_index: number
  duration_minutes: number | null
}

interface Flashcard {
  id: string
  front_text: string
  back_text: string
  hint: string | null
  order_index: number
}

interface QuizQuestion {
  id: string
  question_text: string
  question_type: string
  options: string[]
  correct_answer: string
  explanation: string | null
  points: number
  order_index: number
}

interface MatchingPair {
  id: string
  left_text: string
  right_text: string
  order_index: number
}

type Tab = 'learn' | 'flashcards' | 'quiz' | 'match'

export default function MiddleSchoolLessonPage() {
  const params = useParams()
  const router = useRouter()
  const courseSlug = params.slug as string
  const lessonSlug = params.lessonSlug as string

  const [course, setCourse] = useState<Course | null>(null)
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [allLessons, setAllLessons] = useState<LessonNav[]>([])
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([])
  const [matchingPairs, setMatchingPairs] = useState<MatchingPair[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCompleted, setIsCompleted] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>('learn')
  const supabase = createClient()

  useEffect(() => {
    // Debug: Log the params we receive
    console.log('=== LESSON PAGE DEBUG ===')
    console.log('Full params:', params)
    console.log('courseSlug:', courseSlug)
    console.log('lessonSlug:', lessonSlug)

    const fetchLesson = async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sb = supabase as any

        // Fetch course
        const { data: courseData, error: courseError } = await sb
          .from('middle_school_courses')
          .select('id, title, slug')
          .eq('slug', courseSlug)
          .single()

        if (courseError) {
          console.error('Course error:', courseError)
          setError('Course not found')
          setIsLoading(false)
          return
        }

        setCourse(courseData as Course)

        // Fetch lesson - try by slug first, then by ID as fallback
        let lessonData = null
        let lessonError = null

        // First try to find by slug
        const { data: bySlug, error: slugError } = await sb
          .from('middle_school_lessons')
          .select('*')
          .eq('course_id', courseData.id)
          .eq('slug', lessonSlug)
          .single()

        if (bySlug) {
          lessonData = bySlug
          console.log('Found lesson by slug:', lessonSlug)
        } else {
          // If not found by slug, try by ID
          console.log('Lesson not found by slug, trying by ID...')
          const { data: byId, error: idError } = await sb
            .from('middle_school_lessons')
            .select('*')
            .eq('course_id', courseData.id)
            .eq('id', lessonSlug)
            .single()

          if (byId) {
            lessonData = byId
            console.log('Found lesson by ID:', lessonSlug)
          } else {
            lessonError = idError || slugError
          }
        }

        if (!lessonData) {
          console.error('Lesson error:', lessonError)
          setError('Lesson not found')
          setIsLoading(false)
          return
        }

        setLesson(lessonData as Lesson)

        // Fetch all lessons for sidebar navigation
        const { data: allLessonsData } = await sb
          .from('middle_school_lessons')
          .select('id, title, slug, order_index, duration_minutes')
          .eq('course_id', courseData.id)
          .order('order_index')

        setAllLessons((allLessonsData || []) as LessonNav[])

        // Fetch flashcards through flashcard_sets (flashcards are linked via flashcard_set_id, not lesson_id)
        const { data: flashcardSetData } = await sb
          .from('middle_school_flashcard_sets')
          .select(`
            id,
            title,
            description,
            flashcards:middle_school_flashcards(
              id,
              front_text,
              back_text,
              hint,
              order_index
            )
          `)
          .eq('lesson_id', lessonData.id)
          .single()

        const flashcardsFromSet = flashcardSetData?.flashcards || []
        // Sort by order_index
        flashcardsFromSet.sort((a: Flashcard, b: Flashcard) => a.order_index - b.order_index)
        setFlashcards(flashcardsFromSet as Flashcard[])

        // Fetch quiz questions through quizzes table (questions are linked via quiz_id, not lesson_id)
        const { data: quizTableData } = await sb
          .from('middle_school_quizzes')
          .select(`
            id,
            title,
            passing_score,
            questions:middle_school_quiz_questions(
              id,
              question_text,
              question_type,
              options,
              correct_answer,
              explanation,
              points,
              order_index
            )
          `)
          .eq('lesson_id', lessonData.id)
          .single()

        const questionsFromQuiz = quizTableData?.questions || []
        // Sort by order_index
        questionsFromQuiz.sort((a: QuizQuestion, b: QuizQuestion) => a.order_index - b.order_index)
        setQuizQuestions(questionsFromQuiz as QuizQuestion[])

        // Fetch matching pairs through matching_games table (pairs are linked via game_id, not lesson_id)
        const { data: matchingGameData } = await sb
          .from('middle_school_matching_games')
          .select(`
            id,
            title,
            description,
            pairs:middle_school_matching_pairs(
              id,
              left_text,
              right_text,
              order_index
            )
          `)
          .eq('lesson_id', lessonData.id)
          .single()

        const pairsFromGame = matchingGameData?.pairs || []
        // Sort by order_index
        pairsFromGame.sort((a: MatchingPair, b: MatchingPair) => a.order_index - b.order_index)
        setMatchingPairs(pairsFromGame as MatchingPair[])

        // Check user progress
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          const { data: progressData } = await sb
            .from('middle_school_progress')
            .select('completed')
            .eq('user_id', session.user.id)
            .eq('lesson_id', lessonData.id)
            .eq('activity_type', 'lesson')
            .single()

          if (progressData?.completed) {
            setIsCompleted(true)
          }
        }
      } catch (err) {
        console.error('Error fetching lesson:', err)
        setError('Failed to load lesson')
      } finally {
        setIsLoading(false)
      }
    }

    if (courseSlug && lessonSlug) {
      fetchLesson()
    }
  }, [courseSlug, lessonSlug, supabase])

  const handleMarkComplete = async () => {
    const { data: { session } } = await supabase.auth.getSession()

    if (!session?.user || !course || !lesson) {
      router.push(`/login?redirect=/middle-school/courses/${courseSlug}/lessons/${lessonSlug}`)
      return
    }

    setIsSaving(true)

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sb = supabase as any

      console.log('=== SAVING MIDDLE SCHOOL PROGRESS ===')
      console.log('User ID:', session.user.id)
      console.log('Lesson ID:', lesson.id)
      console.log('Course ID:', course.id)

      const progressData = {
        user_id: session.user.id,
        course_id: course.id,
        lesson_id: lesson.id,
        activity_type: 'lesson',
        completed: true,
        completed_at: new Date().toISOString(),
        last_accessed_at: new Date().toISOString(),
        xp_earned: lesson.xp_reward,
      }
      console.log('Data being sent:', progressData)

      const { data, error: upsertError } = await sb.from('middle_school_progress').upsert(
        progressData,
        { onConflict: 'user_id,lesson_id,activity_type' }
      )

      console.log('Upsert response:', { data, error: upsertError })

      if (upsertError) {
        console.error('Error saving progress:', JSON.stringify(upsertError, null, 2))
        console.error('Error code:', upsertError?.code)
        console.error('Error message:', upsertError?.message)
        console.error('Error details:', upsertError?.details)
        toast.error('Failed to save progress. Please try again.')
        setIsSaving(false)
        return
      }

      setIsCompleted(true)
      toast.success(`Lesson complete! +${lesson.xp_reward} XP`)
    } catch (err) {
      console.error('Error marking complete:', err)
      toast.error('Failed to save progress. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleFlashcardsComplete = async () => {
    if (!isCompleted) {
      await handleMarkComplete()
    }
  }

  const handleQuizComplete = async (score: number, total: number, totalPoints: number) => {
    if (!isCompleted) {
      await handleMarkComplete()
    }
    toast.success(`Quiz complete! ${score}/${total} correct (+${totalPoints} points)`)
  }

  const handleMatchComplete = async () => {
    if (!isCompleted) {
      await handleMarkComplete()
    }
  }

  // Find prev/next lessons
  const currentIndex = allLessons.findIndex((l) => l.slug === lessonSlug)
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null

  // Tab configuration
  const hasFlashcards = flashcards.length > 0
  const hasQuiz = quizQuestions.length > 0
  const hasMatch = matchingPairs.length >= 2

  const tabs = [
    { id: 'learn' as Tab, label: 'Learn', icon: BookOpen, enabled: true },
    { id: 'flashcards' as Tab, label: 'Flashcards', icon: GraduationCap, enabled: hasFlashcards },
    { id: 'quiz' as Tab, label: 'Quiz', icon: Brain, enabled: hasQuiz },
    { id: 'match' as Tab, label: 'Match', icon: Gamepad2, enabled: hasMatch },
  ]

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading lesson...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !course || !lesson) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Lesson Not Found</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">{error || 'This lesson does not exist.'}</p>
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/middle-school/courses">Browse Courses</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            href={`/middle-school/courses/${course.slug}`}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {course.title}
          </Link>
          <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm font-medium">+{lesson.xp_reward} XP</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto flex">
        {/* Sidebar - Lesson List */}
        <div className="hidden lg:block w-64 border-r border-gray-200 dark:border-gray-700 min-h-screen p-4 bg-white dark:bg-gray-800">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4">Course Content</h3>
          <div className="space-y-1">
            {allLessons.map((l, index) => (
              <Link
                key={l.id}
                href={`/middle-school/courses/${course.slug}/lessons/${l.slug || l.id}`}
                className={cn(
                  'flex items-center gap-3 p-2 rounded-lg transition-colors',
                  l.id === lesson.id
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                )}
              >
                <span className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium',
                  l.id === lesson.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                )}>
                  {index + 1}
                </span>
                <span className="text-sm truncate">{l.title}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Lesson Header */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">{lesson.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              {lesson.duration_minutes && (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {lesson.duration_minutes} min
                </span>
              )}
              {isCompleted && (
                <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                  <CheckCircle2 className="w-4 h-4" />
                  Completed
                </span>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <div className="flex overflow-x-auto">
                {tabs.filter(tab => tab.enabled).map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors",
                      "border-b-2 -mb-px whitespace-nowrap",
                      "hover:text-slate-900 dark:hover:text-white",
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600 dark:text-blue-400"
                        : "border-transparent text-gray-500 dark:text-gray-400"
                    )}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'learn' && (
                <div>
                  {/* Video player */}
                  {lesson.video_url && (
                    <div className="mb-8">
                      <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden">
                        <iframe
                          src={lesson.video_url}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  )}

                  {/* Lesson content */}
                  {lesson.content ? (
                    <article className="max-w-none">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          table: ({ children, ...props }) => (
                            <div className="overflow-x-auto my-6">
                              <table className="min-w-full border-collapse rounded-lg overflow-hidden shadow-sm" {...props}>{children}</table>
                            </div>
                          ),
                          thead: ({ children, ...props }) => (
                            <thead className="bg-blue-600 dark:bg-blue-700 text-white" {...props}>{children}</thead>
                          ),
                          tbody: ({ children, ...props }) => (
                            <tbody className="bg-white dark:bg-gray-800" {...props}>{children}</tbody>
                          ),
                          tr: ({ children, ...props }) => (
                            <tr className="border-b border-gray-200 dark:border-gray-700 even:bg-gray-50 dark:even:bg-gray-700/50" {...props}>{children}</tr>
                          ),
                          th: ({ children, ...props }) => (
                            <th className="text-left px-4 py-3 font-semibold text-lg" {...props}>{children}</th>
                          ),
                          td: ({ children, ...props }) => (
                            <td className="px-4 py-3 text-slate-700 dark:text-gray-300 text-lg" {...props}>{children}</td>
                          ),
                          h1: ({ children, ...props }) => (
                            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mt-8 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700" {...props}>{children}</h1>
                          ),
                          h2: ({ children, ...props }) => (
                            <h2 className="text-xl md:text-2xl font-semibold text-slate-800 dark:text-blue-400 mt-8 mb-4" {...props}>{children}</h2>
                          ),
                          h3: ({ children, ...props }) => (
                            <h3 className="text-lg md:text-xl font-medium text-slate-800 dark:text-white mt-6 mb-3" {...props}>{children}</h3>
                          ),
                          p: ({ children, ...props }) => (
                            <p className="text-slate-700 dark:text-gray-300 mb-4 leading-relaxed" {...props}>{children}</p>
                          ),
                          ul: ({ children, ...props }) => (
                            <ul className="list-disc list-outside ml-6 text-slate-700 dark:text-gray-300 mb-4 space-y-2" {...props}>{children}</ul>
                          ),
                          ol: ({ children, ...props }) => (
                            <ol className="list-decimal list-outside ml-6 text-slate-700 dark:text-gray-300 mb-4 space-y-2" {...props}>{children}</ol>
                          ),
                          li: ({ children, ...props }) => (
                            <li className="text-slate-700 dark:text-gray-300" {...props}>{children}</li>
                          ),
                          strong: ({ children, ...props }) => (
                            <strong className="text-slate-900 dark:text-white font-semibold" {...props}>{children}</strong>
                          ),
                          blockquote: ({ children, ...props }) => (
                            <blockquote className="border-l-4 border-blue-500 pl-4 py-1 my-4 bg-blue-50 dark:bg-gray-700/50 rounded-r-lg italic text-slate-600 dark:text-gray-300" {...props}>{children}</blockquote>
                          ),
                          code: ({ children, className, ...props }) => {
                            const isInline = !className
                            if (isInline) {
                              return (
                                <code className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-sm text-slate-800 dark:text-blue-400 font-mono" {...props}>{children}</code>
                              )
                            }
                            return (
                              <code className={className} {...props}>{children}</code>
                            )
                          },
                          pre: ({ children, ...props }) => (
                            <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto mb-4 text-sm" {...props}>{children}</pre>
                          ),
                          a: ({ children, href, ...props }) => (
                            <a href={href} className="text-blue-600 dark:text-blue-400 underline hover:text-blue-700 dark:hover:text-blue-300" {...props}>{children}</a>
                          ),
                        }}
                      >
                        {lesson.content}
                      </ReactMarkdown>
                    </article>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                      No content available for this lesson yet.
                    </p>
                  )}

                  {/* Mark complete button */}
                  {!isCompleted && (
                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <Button
                        size="lg"
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={handleMarkComplete}
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <>
                            <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-5 h-5 mr-2" />
                            Mark as Complete (+{lesson.xp_reward} XP)
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'flashcards' && hasFlashcards && (
                <MiddleSchoolFlashcardViewer
                  flashcards={flashcards}
                  onComplete={handleFlashcardsComplete}
                />
              )}

              {activeTab === 'quiz' && hasQuiz && (
                <MiddleSchoolQuiz
                  questions={quizQuestions}
                  onComplete={handleQuizComplete}
                />
              )}

              {activeTab === 'match' && hasMatch && (
                <MiddleSchoolMatchGame
                  pairs={matchingPairs}
                  onComplete={handleMatchComplete}
                />
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            {prevLesson ? (
              <Link
                href={`/middle-school/courses/${course.slug}/lessons/${prevLesson.slug || prevLesson.id}`}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="hidden sm:inline">{prevLesson.title}</span>
                <span className="sm:hidden">Previous</span>
              </Link>
            ) : (
              <div />
            )}

            {nextLesson ? (
              <Link
                href={`/middle-school/courses/${course.slug}/lessons/${nextLesson.slug || nextLesson.id}`}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <span className="hidden sm:inline">Next: {nextLesson.title}</span>
                <span className="sm:hidden">Next</span>
                <ChevronRight className="w-5 h-5" />
              </Link>
            ) : (
              <Link
                href={`/middle-school/courses/${course.slug}`}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <CheckCircle2 className="w-5 h-5" />
                Complete Course
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
