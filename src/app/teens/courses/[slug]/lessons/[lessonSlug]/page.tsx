'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  BookOpen,
  Clock,
  Trophy,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  PlayCircle,
  Layers,
  FileQuestion,
  Gamepad2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { LessonSidebar } from '@/components/teens/LessonSidebar'
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
  description: string | null
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

interface FlashcardSet {
  id: string
  title: string
  description: string | null
  xp_reward: number
  teen_flashcards: {
    id: string
    front_text: string
    back_text: string
    hint: string | null
    order_index: number
  }[]
}

interface Quiz {
  id: string
  title: string
  description: string | null
  time_limit_minutes: number | null
  passing_score: number
  xp_reward: number
  teen_quiz_questions: {
    id: string
    question_text: string
    question_type: 'multiple_choice' | 'true_false' | 'fill_blank'
    options: string[] | null
    correct_answer: string
    explanation: string | null
    points: number
    order_index: number
  }[]
}

interface MatchingGameData {
  id: string
  title: string
  description: string | null
  time_limit_seconds: number | null
  xp_reward: number
  teen_matching_pairs: {
    id: string
    left_text: string
    right_text: string
    order_index: number
  }[]
}

export default function LessonPage() {
  const params = useParams()
  const router = useRouter()
  const courseSlug = params.slug as string
  const lessonSlug = params.lessonSlug as string

  const [course, setCourse] = useState<Course | null>(null)
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [allLessons, setAllLessons] = useState<LessonNav[]>([])
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([])
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [matchingGames, setMatchingGames] = useState<MatchingGameData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCompleted, setIsCompleted] = useState(false)
  const [activeTab, setActiveTab] = useState('content')
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

        if (courseError) throw courseError
        if (!courseData) {
          setError('Course not found')
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

        if (lessonError) throw lessonError
        if (!lessonData) {
          setError('Lesson not found')
          return
        }

        setLesson(lessonData as Lesson)

        // Fetch all lessons for sidebar navigation
        const { data: allLessonsData } = await sb
          .from('teen_lessons')
          .select('id, title, slug, order_index, duration_minutes')
          .eq('course_id', courseData.id)
          .eq('is_published', true)
          .order('order_index')

        setAllLessons((allLessonsData || []) as LessonNav[])

        // Fetch user progress
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user) {
          const { data: progressData } = await sb
            .from('teen_progress')
            .select('lesson_id, completed')
            .eq('user_id', session.user.id)
            .eq('course_id', courseData.id)
            .eq('activity_type', 'lesson')

          if (progressData) {
            const completed = (progressData as { lesson_id: string | null; completed: boolean }[])
              .filter((p) => p.completed)
              .map((p) => p.lesson_id)
            setCompletedLessons(completed.filter(Boolean) as string[])
            setIsCompleted(progressData.some((p: { lesson_id: string | null; completed: boolean }) => p.lesson_id === lessonData.id && p.completed))
          }
        }

        // Fetch flashcard sets
        const { data: flashcardsData } = await sb
          .from('teen_flashcard_sets')
          .select('*, teen_flashcards(*)')
          .eq('lesson_id', lessonData.id)

        setFlashcardSets((flashcardsData || []) as FlashcardSet[])

        // Fetch quizzes
        const { data: quizzesData } = await sb
          .from('teen_quizzes')
          .select('*, teen_quiz_questions(*)')
          .eq('lesson_id', lessonData.id)

        setQuizzes((quizzesData || []) as Quiz[])

        // Fetch matching games
        const { data: matchingData } = await sb
          .from('teen_matching_games')
          .select('*, teen_matching_pairs(*)')
          .eq('lesson_id', lessonData.id)

        setMatchingGames((matchingData || []) as MatchingGameData[])
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
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user || !course || !lesson) {
      router.push(`/login?redirect=/teens/courses/${courseSlug}/lessons/${lessonSlug}`)
      return
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sb = supabase as any

      // Upsert progress
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
      setCompletedLessons((prev) => [...prev, lesson.id])

      // Update teen profile points
      await sb.rpc('increment_teen_points', {
        p_user_id: session.user.id,
        p_points: lesson.xp_reward,
      })
    } catch (err) {
      console.error('Error marking complete:', err)
    }
  }

  // Find prev/next lessons
  const currentIndex = allLessons.findIndex((l) => l.slug === lessonSlug)
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null

  // Count activities
  const hasFlashcards = flashcardSets.some((s) => s.teen_flashcards.length > 0)
  const hasQuizzes = quizzes.some((q) => q.teen_quiz_questions.length > 0)
  const hasMatching = matchingGames.some((g) => g.teen_matching_pairs.length > 0)

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen">
        <div className="hidden lg:block w-72 border-r">
          <Skeleton className="h-full" />
        </div>
        <div className="flex-1 p-8">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-4 w-96 mb-8" />
          <Skeleton className="h-64 w-full mb-8" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    )
  }

  // Error state
  if (error || !course || !lesson) {
    return (
      <div className="py-16 px-4 text-center">
        <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Lesson Not Found</h1>
        <p className="text-slate-600 mb-6">{error || 'This lesson does not exist.'}</p>
        <Button asChild>
          <Link href="/teens/courses">Browse Courses</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <LessonSidebar
        courseTitle={course.title}
        courseSlug={course.slug}
        lessons={allLessons}
        currentLessonSlug={lessonSlug}
        completedLessons={completedLessons}
        className="hidden lg:block"
      />

      {/* Main content */}
      <main className="flex-1 lg:ml-0">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <Link href="/teens/courses" className="hover:text-slate-700">
              Courses
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href={`/teens/courses/${course.slug}`} className="hover:text-slate-700">
              {course.title}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-900">Lesson {currentIndex + 1}</span>
          </div>

          {/* Lesson header */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
              {lesson.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
              {lesson.duration_minutes && (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {lesson.duration_minutes} min
                </span>
              )}
              <span className="flex items-center gap-1 text-amber-600">
                <Trophy className="w-4 h-4" />
                {lesson.xp_reward} XP
              </span>
              {isCompleted && (
                <span className="flex items-center gap-1 text-green-600">
                  <CheckCircle2 className="w-4 h-4" />
                  Completed
                </span>
              )}
            </div>
          </div>

          {/* Video player */}
          {lesson.video_url && (
            <div className="mb-8">
              <div className="aspect-video bg-slate-900 rounded-xl overflow-hidden">
                <iframe
                  src={lesson.video_url}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* Tabs for content and activities */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="w-full justify-start border-b rounded-none bg-transparent p-0 mb-6">
              <TabsTrigger
                value="content"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Lesson
              </TabsTrigger>
              {hasFlashcards && (
                <TabsTrigger
                  value="flashcards"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
                >
                  <Layers className="w-4 h-4 mr-2" />
                  Flashcards
                </TabsTrigger>
              )}
              {hasQuizzes && (
                <TabsTrigger
                  value="quiz"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
                >
                  <FileQuestion className="w-4 h-4 mr-2" />
                  Quiz
                </TabsTrigger>
              )}
              {hasMatching && (
                <TabsTrigger
                  value="matching"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
                >
                  <Gamepad2 className="w-4 h-4 mr-2" />
                  Matching
                </TabsTrigger>
              )}
            </TabsList>

            {/* Lesson content */}
            <TabsContent value="content" className="mt-0">
              <Card>
                <CardContent className="p-6">
                  {lesson.content ? (
                    <div
                      className="prose prose-slate max-w-none"
                      dangerouslySetInnerHTML={{ __html: lesson.content }}
                    />
                  ) : (
                    <p className="text-slate-500 text-center py-8">
                      No content available for this lesson yet.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Flashcards */}
            {hasFlashcards && (
              <TabsContent value="flashcards" className="mt-0">
                <Card>
                  <CardContent className="p-6">
                    {flashcardSets.map((set) => (
                      <FlashcardGame
                        key={set.id}
                        title={set.title}
                        flashcards={set.teen_flashcards.sort((a, b) => a.order_index - b.order_index)}
                        xpReward={set.xp_reward}
                      />
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* Quiz */}
            {hasQuizzes && (
              <TabsContent value="quiz" className="mt-0">
                <Card>
                  <CardContent className="p-6">
                    {quizzes.map((quiz) => (
                      <QuizGame
                        key={quiz.id}
                        title={quiz.title}
                        questions={quiz.teen_quiz_questions.sort((a, b) => a.order_index - b.order_index)}
                        timeLimit={quiz.time_limit_minutes || undefined}
                        passingScore={quiz.passing_score}
                        xpReward={quiz.xp_reward}
                      />
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* Matching game */}
            {hasMatching && (
              <TabsContent value="matching" className="mt-0">
                <Card>
                  <CardContent className="p-6">
                    {matchingGames.map((game) => (
                      <MatchingGame
                        key={game.id}
                        title={game.title}
                        pairs={game.teen_matching_pairs.sort((a, b) => a.order_index - b.order_index)}
                        timeLimit={game.time_limit_seconds || undefined}
                        xpReward={game.xp_reward}
                      />
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>

          {/* Mark complete button */}
          {!isCompleted && (
            <div className="mb-8">
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

          {/* Navigation */}
          <div className="flex items-center justify-between gap-4">
            {prevLesson ? (
              <Button variant="outline" asChild>
                <Link href={`/teens/courses/${course.slug}/lessons/${prevLesson.slug}`}>
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Link>
              </Button>
            ) : (
              <div />
            )}

            {nextLesson ? (
              <Button asChild>
                <Link href={`/teens/courses/${course.slug}/lessons/${nextLesson.slug}`}>
                  Next Lesson
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            ) : (
              <Button asChild>
                <Link href={`/teens/courses/${course.slug}`}>
                  Back to Course
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
