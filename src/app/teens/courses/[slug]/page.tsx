'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  BookOpen,
  Clock,
  Trophy,
  ChevronLeft,
  Play,
  CheckCircle2,
  Circle,
  Lock,
  Star,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

interface Course {
  id: string
  title: string
  slug: string
  description: string | null
  thumbnail_url: string | null
  category: string
  difficulty: string
  estimated_hours: number | null
  xp_reward: number
  is_featured: boolean
}

interface Lesson {
  id: string
  title: string
  slug: string
  description: string | null
  duration_minutes: number | null
  xp_reward: number
  order_index: number
}

const categoryLabels: Record<string, string> = {
  'sat-prep': 'SAT Prep',
  'act-prep': 'ACT Prep',
  'college-prep': 'College Prep',
  'study-skills': 'Study Skills',
  'oromo-culture': 'Oromo Culture',
}

const difficultyLabels: Record<string, { label: string; color: string }> = {
  beginner: { label: 'Beginner', color: 'text-green-600 bg-green-50' },
  intermediate: { label: 'Intermediate', color: 'text-amber-600 bg-amber-50' },
  advanced: { label: 'Advanced', color: 'text-red-600 bg-red-50' },
}

export default function CourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [course, setCourse] = useState<Course | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sb = supabase as any

        // Fetch course by slug
        const { data: courseData, error: courseError } = await sb
          .from('teen_courses')
          .select('*')
          .eq('slug', slug)
          .single()

        if (courseError) throw courseError
        if (!courseData) {
          setError('Course not found')
          return
        }

        setCourse(courseData as Course)

        // Fetch lessons
        const { data: lessonsData, error: lessonsError } = await sb
          .from('teen_lessons')
          .select('id, title, slug, description, duration_minutes, xp_reward, order_index')
          .eq('course_id', courseData.id)
          .eq('is_published', true)
          .order('order_index')

        if (lessonsError) throw lessonsError
        setLessons((lessonsData || []) as Lesson[])

        // Fetch completed lessons for current user
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user) {
          const { data: progressData } = await sb
            .from('teen_progress')
            .select('lesson_id')
            .eq('user_id', session.user.id)
            .eq('course_id', courseData.id)
            .eq('activity_type', 'lesson')
            .eq('completed', true)

          if (progressData) {
            const lessonIds = (progressData as { lesson_id: string | null }[])
              .map((p) => p.lesson_id)
              .filter((id): id is string => id !== null)
            setCompletedLessons(lessonIds)
          }
        }
      } catch (err) {
        console.error('Error fetching course:', err)
        setError('Failed to load course')
      } finally {
        setIsLoading(false)
      }
    }

    if (slug) {
      fetchCourse()
    }
  }, [slug, supabase])

  // Calculate progress
  const totalLessons = lessons.length
  const completedCount = completedLessons.length
  const progress = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0
  const totalDuration = lessons.reduce((acc, l) => acc + (l.duration_minutes || 0), 0)
  const totalXp = lessons.reduce((acc, l) => acc + l.xp_reward, 0) + (course?.xp_reward || 0)

  // Get first incomplete lesson or first lesson
  const nextLesson = lessons.find((l) => !completedLessons.includes(l.id)) || lessons[0]

  // Loading state
  if (isLoading) {
    return (
      <div className="py-8 px-4">
        <div className="mx-auto max-w-4xl">
          <Skeleton className="h-8 w-48 mb-8" />
          <Skeleton className="h-64 w-full rounded-2xl mb-8" />
          <Skeleton className="h-8 w-32 mb-4" />
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !course) {
    return (
      <div className="py-16 px-4 text-center">
        <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Course Not Found</h1>
        <p className="text-slate-600 mb-6">{error || 'This course does not exist.'}</p>
        <Button asChild>
          <Link href="/teens/courses">Browse Courses</Link>
        </Button>
      </div>
    )
  }

  const difficultyInfo = difficultyLabels[course.difficulty] || difficultyLabels.beginner

  return (
    <div className="py-8 px-4">
      <div className="mx-auto max-w-4xl">
        {/* Back link */}
        <Link
          href="/teens/courses"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to courses
        </Link>

        {/* Hero section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-2xl p-8 text-white mb-8">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <div className="relative z-10">
            {/* Category and difficulty badges */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                {categoryLabels[course.category] || course.category}
              </span>
              <span
                className={cn(
                  'text-sm font-medium px-3 py-1 rounded-full',
                  difficultyInfo.color
                )}
              >
                {difficultyInfo.label}
              </span>
              {course.is_featured && (
                <span className="text-sm font-medium bg-amber-500 text-white px-3 py-1 rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" />
                  Featured
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.title}</h1>

            {course.description && (
              <p className="text-lg text-white/90 mb-6 max-w-2xl">{course.description}</p>
            )}

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-6 mb-6">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-white/70" />
                <span>{totalLessons} lessons</span>
              </div>
              {totalDuration > 0 && (
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-white/70" />
                  <span>{Math.round(totalDuration / 60)}h {totalDuration % 60}m</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <span>{totalXp} XP total</span>
              </div>
            </div>

            {/* Progress bar */}
            {completedCount > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>Your progress</span>
                  <span>{Math.round(progress)}% complete</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div
                    className="bg-green-400 h-2 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* CTA button */}
            {nextLesson && (
              <Button
                size="lg"
                className="bg-white text-blue-700 hover:bg-white/90"
                asChild
              >
                <Link href={`/teens/courses/${course.slug}/lessons/${nextLesson.slug}`}>
                  <Play className="w-5 h-5 mr-2" />
                  {completedCount > 0 ? 'Continue Learning' : 'Start Course'}
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Lessons list */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4">Course Content</h2>

          {lessons.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600">No lessons available yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {lessons.map((lesson, index) => {
                const isCompleted = completedLessons.includes(lesson.id)
                const isNext = nextLesson?.id === lesson.id

                return (
                  <Link
                    key={lesson.id}
                    href={`/teens/courses/${course.slug}/lessons/${lesson.slug}`}
                  >
                    <Card
                      className={cn(
                        'hover:shadow-md transition-all',
                        isNext && 'ring-2 ring-blue-500',
                        isCompleted && 'bg-green-50/50'
                      )}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          {/* Status icon */}
                          <div
                            className={cn(
                              'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
                              isCompleted
                                ? 'bg-green-100'
                                : isNext
                                ? 'bg-blue-100'
                                : 'bg-slate-100'
                            )}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="w-5 h-5 text-green-600" />
                            ) : isNext ? (
                              <Play className="w-5 h-5 text-blue-600" />
                            ) : (
                              <span className="text-sm font-medium text-slate-500">
                                {index + 1}
                              </span>
                            )}
                          </div>

                          {/* Lesson info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-slate-900">{lesson.title}</h3>
                              {isNext && (
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                  Up next
                                </span>
                              )}
                            </div>
                            {lesson.description && (
                              <p className="text-sm text-slate-600 line-clamp-1">
                                {lesson.description}
                              </p>
                            )}
                            <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                              {lesson.duration_minutes && (
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {lesson.duration_minutes} min
                                </span>
                              )}
                              <span className="flex items-center gap-1 text-amber-600">
                                <Trophy className="w-3 h-3" />
                                {lesson.xp_reward} XP
                              </span>
                            </div>
                          </div>

                          {/* Arrow */}
                          <ChevronLeft className="w-5 h-5 text-slate-400 rotate-180 shrink-0" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
