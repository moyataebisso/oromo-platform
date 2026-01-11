'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  BookOpen,
  Clock,
  Trophy,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  ArrowLeft,
  Star,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { FlashcardGame } from '@/components/teens/FlashcardGame'
import { QuizGame } from '@/components/teens/QuizGame'
import { MatchingGame } from '@/components/teens/MatchingGame'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

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

interface FlashcardSet {
  id: string
  title: string
  description: string | null
  xp_reward: number
  cards: Flashcard[]
}

interface QuizQuestion {
  id: string
  question_text: string
  question_type: string
  options: string | null
  correct_answer: string
  explanation: string | null
  points: number
  order_index: number
}

interface Quiz {
  id: string
  title: string
  description: string | null
  time_limit_minutes: number | null
  passing_score: number
  xp_reward: number
  questions: QuizQuestion[]
}

interface MatchingPair {
  id: string
  left_text: string
  right_text: string
  order_index: number
}

interface MatchingGameData {
  id: string
  title: string
  description: string | null
  time_limit_seconds: number | null
  xp_reward: number
  pairs: MatchingPair[]
}

export default function LessonPage() {
  const params = useParams()
  const router = useRouter()
  const courseSlug = params.slug as string
  const lessonSlug = params.lessonSlug as string

  const [course, setCourse] = useState<Course | null>(null)
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [allLessons, setAllLessons] = useState<LessonNav[]>([])
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([])
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [matchingGames, setMatchingGames] = useState<MatchingGameData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCompleted, setIsCompleted] = useState(false)
  const [activeTab, setActiveTab] = useState<'learn' | 'flashcards' | 'quiz' | 'match'>('learn')
  const supabase = createClient()

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sb = supabase as any

        // Fetch course
        const { data: courseData, error: courseError } = await sb
          .from('teen_courses')
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

        // Fetch lesson
        const { data: lessonData, error: lessonError } = await sb
          .from('teen_lessons')
          .select('*')
          .eq('course_id', courseData.id)
          .eq('slug', lessonSlug)
          .single()

        if (lessonError) {
          console.error('Lesson error:', lessonError)
          setError('Lesson not found')
          setIsLoading(false)
          return
        }

        setLesson(lessonData as Lesson)

        // Fetch all lessons for sidebar navigation
        const { data: allLessonsData } = await sb
          .from('teen_lessons')
          .select('id, title, slug, order_index, duration_minutes')
          .eq('course_id', courseData.id)
          .order('order_index')

        setAllLessons((allLessonsData || []) as LessonNav[])

        // Fetch flashcard sets for this lesson
        const { data: flashcardSetsData } = await sb
          .from('teen_flashcard_sets')
          .select('id, title, description, xp_reward')
          .eq('lesson_id', lessonData.id)

        if (flashcardSetsData && flashcardSetsData.length > 0) {
          const setsWithCards = await Promise.all(
            flashcardSetsData.map(async (set: any) => {
              const { data: cardsData } = await sb
                .from('teen_flashcards')
                .select('id, front_text, back_text, hint, order_index')
                .eq('flashcard_set_id', set.id)
                .order('order_index')
              return { ...set, cards: cardsData || [] }
            })
          )
          setFlashcardSets(setsWithCards as FlashcardSet[])
        }

        // Fetch quizzes for this lesson
        const { data: quizzesData } = await sb
          .from('teen_quizzes')
          .select('id, title, description, time_limit_minutes, passing_score, xp_reward')
          .eq('lesson_id', lessonData.id)

        if (quizzesData && quizzesData.length > 0) {
          const quizzesWithQuestions = await Promise.all(
            quizzesData.map(async (quiz: any) => {
              const { data: questionsData } = await sb
                .from('teen_quiz_questions')
                .select('id, question_text, question_type, options, correct_answer, explanation, points, order_index')
                .eq('quiz_id', quiz.id)
                .order('order_index')
              return { ...quiz, questions: questionsData || [] }
            })
          )
          setQuizzes(quizzesWithQuestions as Quiz[])
        }

        // Fetch matching games for this lesson
        const { data: matchingData } = await sb
          .from('teen_matching_games')
          .select('id, title, description, time_limit_seconds, xp_reward')
          .eq('lesson_id', lessonData.id)

        if (matchingData && matchingData.length > 0) {
          const gamesWithPairs = await Promise.all(
            matchingData.map(async (game: any) => {
              const { data: pairsData } = await sb
                .from('teen_matching_pairs')
                .select('id, left_text, right_text, order_index')
                .eq('game_id', game.id)
                .order('order_index')
              return { ...game, pairs: pairsData || [] }
            })
          )
          setMatchingGames(gamesWithPairs as MatchingGameData[])
        }

        // Check user progress
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          const { data: progressData } = await sb
            .from('teen_progress')
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
      router.push(`/login?redirect=/teens/courses/${courseSlug}/lessons/${lessonSlug}`)
      return
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sb = supabase as any

      await sb.from('teen_progress').upsert(
        {
          user_id: session.user.id,
          course_id: course.id,
          lesson_id: lesson.id,
          activity_type: 'lesson',
          completed: true,
          completed_at: new Date().toISOString(),
          xp_earned: lesson.xp_reward,
        },
        { onConflict: 'user_id,lesson_id,activity_type' }
      )

      setIsCompleted(true)

      // Try to increment XP
      try {
        await sb.rpc('increment_teen_points', {
          p_user_id: session.user.id,
          p_points: lesson.xp_reward,
        })
      } catch (xpError) {
        console.log('XP increment not available:', xpError)
      }
    } catch (err) {
      console.error('Error marking complete:', err)
    }
  }

  // Find prev/next lessons
  const currentIndex = allLessons.findIndex((l) => l.slug === lessonSlug)
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null

  // Count activities
  const hasFlashcards = flashcardSets.some((s) => s.cards.length > 0)
  const hasQuizzes = quizzes.some((q) => q.questions.length > 0)
  const hasMatching = matchingGames.some((g) => g.pairs.length > 0)

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
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
          <Button asChild className="bg-green-600 hover:bg-green-700">
            <Link href="/teens/courses">Browse Courses</Link>
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
            href={`/teens/courses/${course.slug}`}
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
                href={`/teens/courses/${course.slug}/lessons/${l.slug}`}
                className={cn(
                  'flex items-center gap-3 p-2 rounded-lg transition-colors',
                  l.id === lesson.id
                    ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                )}
              >
                <span className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium',
                  l.id === lesson.id
                    ? 'bg-green-600 text-white'
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
          {/* Activity Tabs */}
          <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab('learn')}
              className={cn(
                'px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap',
                activeTab === 'learn'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
              )}
            >
              Learn
            </button>
            {hasFlashcards && (
              <button
                onClick={() => setActiveTab('flashcards')}
                className={cn(
                  'px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap',
                  activeTab === 'flashcards'
                    ? 'bg-green-600 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                )}
              >
                Flashcards ({flashcardSets.reduce((acc, s) => acc + s.cards.length, 0)})
              </button>
            )}
            {hasQuizzes && (
              <button
                onClick={() => setActiveTab('quiz')}
                className={cn(
                  'px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap',
                  activeTab === 'quiz'
                    ? 'bg-green-600 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                )}
              >
                Quiz ({quizzes.reduce((acc, q) => acc + q.questions.length, 0)})
              </button>
            )}
            {hasMatching && (
              <button
                onClick={() => setActiveTab('match')}
                className={cn(
                  'px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap',
                  activeTab === 'match'
                    ? 'bg-green-600 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                )}
              >
                Match ({matchingGames.reduce((acc, g) => acc + g.pairs.length, 0)})
              </button>
            )}
          </div>

          {/* Content based on active tab */}
          {activeTab === 'learn' && (
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">{lesson.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
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
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                {lesson.content ? (
                  <article className="max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        table: ({ children, ...props }) => (
                          <div className="overflow-x-auto my-6">
                            <table className="min-w-full border-collapse" {...props}>{children}</table>
                          </div>
                        ),
                        thead: ({ children, ...props }) => (
                          <thead className="bg-gray-100 dark:bg-gray-700" {...props}>{children}</thead>
                        ),
                        th: ({ children, ...props }) => (
                          <th className="text-left p-3 border border-gray-200 dark:border-gray-600 font-semibold text-slate-900 dark:text-white" {...props}>{children}</th>
                        ),
                        td: ({ children, ...props }) => (
                          <td className="p-3 border border-gray-200 dark:border-gray-600 text-slate-700 dark:text-gray-300" {...props}>{children}</td>
                        ),
                        tr: ({ children, ...props }) => (
                          <tr className="border-b border-gray-200 dark:border-gray-600" {...props}>{children}</tr>
                        ),
                        h1: ({ children, ...props }) => (
                          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mt-8 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700" {...props}>{children}</h1>
                        ),
                        h2: ({ children, ...props }) => (
                          <h2 className="text-xl md:text-2xl font-semibold text-slate-800 dark:text-green-400 mt-8 mb-4" {...props}>{children}</h2>
                        ),
                        h3: ({ children, ...props }) => (
                          <h3 className="text-lg md:text-xl font-medium text-slate-800 dark:text-white mt-6 mb-3" {...props}>{children}</h3>
                        ),
                        h4: ({ children, ...props }) => (
                          <h4 className="text-base md:text-lg font-medium text-slate-700 dark:text-gray-200 mt-4 mb-2" {...props}>{children}</h4>
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
                        em: ({ children, ...props }) => (
                          <em className="text-slate-700 dark:text-gray-200 italic" {...props}>{children}</em>
                        ),
                        blockquote: ({ children, ...props }) => (
                          <blockquote className="border-l-4 border-green-500 pl-4 py-1 my-4 bg-green-50 dark:bg-gray-700/50 rounded-r-lg italic text-slate-600 dark:text-gray-300" {...props}>{children}</blockquote>
                        ),
                        code: ({ children, className, ...props }) => {
                          const isInline = !className
                          if (isInline) {
                            return (
                              <code className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-sm text-slate-800 dark:text-green-400 font-mono" {...props}>{children}</code>
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
                          <a href={href} className="text-green-600 dark:text-green-400 underline hover:text-green-700 dark:hover:text-green-300" {...props}>{children}</a>
                        ),
                        hr: ({ ...props }) => (
                          <hr className="border-gray-200 dark:border-gray-700 my-8" {...props} />
                        ),
                        img: ({ src, alt, ...props }) => (
                          <img src={src} alt={alt} className="rounded-lg my-4 max-w-full" {...props} />
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
              </div>

              {/* Mark complete button */}
              {!isCompleted && (
                <div className="mt-6">
                  <Button
                    size="lg"
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={handleMarkComplete}
                  >
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Mark as Complete (+{lesson.xp_reward} XP)
                  </Button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'flashcards' && hasFlashcards && (
            <div className="space-y-8">
              {flashcardSets.map((set) => (
                <FlashcardGame
                  key={set.id}
                  title={set.title}
                  flashcards={set.cards.sort((a, b) => a.order_index - b.order_index)}
                  xpReward={set.xp_reward}
                />
              ))}
            </div>
          )}

          {activeTab === 'quiz' && hasQuizzes && (
            <div className="space-y-8">
              {quizzes.map((quiz) => (
                <QuizGame
                  key={quiz.id}
                  title={quiz.title}
                  questions={quiz.questions.sort((a, b) => a.order_index - b.order_index).map(q => ({
                    ...q,
                    question_type: q.question_type as 'multiple_choice' | 'true_false' | 'fill_blank',
                    options: q.options ? (typeof q.options === 'string' ? JSON.parse(q.options) : q.options) : null
                  }))}
                  timeLimit={quiz.time_limit_minutes || undefined}
                  passingScore={quiz.passing_score}
                  xpReward={quiz.xp_reward}
                />
              ))}
            </div>
          )}

          {activeTab === 'match' && hasMatching && (
            <div className="space-y-8">
              {matchingGames.map((game) => (
                <MatchingGame
                  key={game.id}
                  title={game.title}
                  pairs={game.pairs.sort((a, b) => a.order_index - b.order_index)}
                  timeLimit={game.time_limit_seconds || undefined}
                  xpReward={game.xp_reward}
                />
              ))}
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            {prevLesson ? (
              <Link
                href={`/teens/courses/${course.slug}/lessons/${prevLesson.slug}`}
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
                href={`/teens/courses/${course.slug}/lessons/${nextLesson.slug}`}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <span className="hidden sm:inline">Next: {nextLesson.title}</span>
                <span className="sm:hidden">Next</span>
                <ChevronRight className="w-5 h-5" />
              </Link>
            ) : (
              <Link
                href={`/teens/courses/${course.slug}`}
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
