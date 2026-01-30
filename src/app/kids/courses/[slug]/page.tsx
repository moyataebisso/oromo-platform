'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { BookOpen, Star, ChevronLeft, Play, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
  age_range: string
}

interface Lesson {
  id: string
  title: string
  slug: string
  order_index: number
}

// Kid-friendly category colors
const categoryStyles: Record<string, { emoji: string; gradient: string; bgLight: string }> = {
  language: { emoji: '📝', gradient: 'from-purple-400 to-pink-500', bgLight: 'bg-purple-50' },
  math: { emoji: '🔢', gradient: 'from-blue-400 to-cyan-500', bgLight: 'bg-blue-50' },
  culture: { emoji: '🌍', gradient: 'from-green-400 to-emerald-500', bgLight: 'bg-green-50' },
  stories: { emoji: '📚', gradient: 'from-amber-400 to-orange-500', bgLight: 'bg-amber-50' },
  general: { emoji: '🌟', gradient: 'from-indigo-400 to-purple-500', bgLight: 'bg-indigo-50' },
}

export default function KidsCourseDetailPage() {
  const params = useParams()
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
          .from('kids_courses')
          .select('*')
          .eq('slug', slug)
          .single()

        if (courseError) {
          console.error('Course error:', courseError)
          if (courseError.code === 'PGRST116') {
            setError('Course not found')
          } else {
            setError('Failed to load course')
          }
          setIsLoading(false)
          return
        }

        setCourse(courseData as Course)

        // Fetch lessons
        const { data: lessonsData, error: lessonsError } = await sb
          .from('kids_lessons')
          .select('id, title, slug, order_index')
          .eq('course_id', courseData.id)
          .eq('is_published', true)
          .order('order_index')

        if (lessonsError) {
          console.error('Lessons error:', lessonsError)
        }
        setLessons((lessonsData || []) as Lesson[])

        // Fetch completed lessons for current user
        const { data: { session } } = await supabase.auth.getSession()

        if (session?.user) {
          const { data: progressData } = await sb
            .from('kids_progress')
            .select('lesson_id')
            .eq('user_id', session.user.id)
            .eq('course_id', courseData.id)
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

  // Get first incomplete lesson or first lesson
  const nextLesson = lessons.find((l) => !completedLessons.includes(l.id)) || lessons[0]

  // Loading state
  if (isLoading) {
    return (
      <div className="py-8 px-4">
        <div className="mx-auto max-w-3xl">
          <Skeleton className="h-8 w-32 mb-6" />
          <Skeleton className="h-48 w-full rounded-3xl mb-8" />
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-2xl" />
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
        <div className="mx-auto max-w-md bg-white rounded-3xl p-8 shadow-lg">
          <span className="text-6xl mb-4 block">😢</span>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Oops!</h1>
          <p className="text-lg text-slate-600 mb-6">{error || 'Course not found'}</p>
          <Button
            size="lg"
            className="text-lg bg-gradient-to-r from-purple-500 to-pink-500"
            asChild
          >
            <Link href="/kids/courses">See All Courses</Link>
          </Button>
        </div>
      </div>
    )
  }

  const style = categoryStyles[course.category] || categoryStyles.general

  return (
    <div className="py-8 px-4">
      <div className="mx-auto max-w-3xl">
        {/* Back link */}
        <Link
          href="/kids/courses"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 text-lg font-medium"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Courses
        </Link>

        {/* Hero section */}
        <div className={cn(
          'relative overflow-hidden rounded-3xl p-6 md:p-8 text-white mb-8',
          `bg-gradient-to-br ${style.gradient}`
        )}>
          <div className="text-center">
            {/* Emoji */}
            <span className="text-7xl md:text-8xl mb-4 block animate-bounce">
              {style.emoji}
            </span>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold mb-3 drop-shadow-md">
              {course.title}
            </h1>

            {/* Description */}
            {course.description && (
              <p className="text-lg text-white/90 mb-4 max-w-lg mx-auto">
                {course.description}
              </p>
            )}

            {/* Stats */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
              <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
                <BookOpen className="w-5 h-5" />
                <span className="font-medium">{totalLessons} lessons</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
                <span className="text-lg">👶</span>
                <span className="font-medium">Ages {course.age_range}</span>
              </div>
            </div>

            {/* Progress bar */}
            {completedCount > 0 && (
              <div className="max-w-xs mx-auto mb-6">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-300" fill="currentColor" />
                    Your Progress
                  </span>
                  <span>{completedCount} of {totalLessons} done!</span>
                </div>
                <div className="w-full bg-white/30 rounded-full h-4">
                  <div
                    className="bg-yellow-300 h-4 rounded-full transition-all flex items-center justify-end pr-1"
                    style={{ width: `${Math.max(progress, 10)}%` }}
                  >
                    {progress >= 20 && <span className="text-xs">⭐</span>}
                  </div>
                </div>
              </div>
            )}

            {/* CTA button */}
            {nextLesson && (
              <Button
                size="lg"
                className="text-xl px-8 py-6 bg-white text-slate-800 hover:bg-white/90 shadow-lg"
                asChild
              >
                <Link href={`/kids/courses/${course.slug}/lessons/${nextLesson.slug}`}>
                  <Play className="w-6 h-6 mr-2" />
                  {completedCount > 0 ? 'Keep Learning!' : 'Start Learning!'}
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Lessons list */}
        <section>
          <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="text-2xl">📖</span> Lessons
          </h2>

          {lessons.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center shadow-lg">
              <span className="text-5xl mb-4 block">🔜</span>
              <p className="text-lg text-slate-600">Lessons coming soon!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {lessons.map((lesson, index) => {
                const isCompleted = completedLessons.includes(lesson.id)
                const isNext = nextLesson?.id === lesson.id

                return (
                  <Link
                    key={lesson.id}
                    href={`/kids/courses/${course.slug}/lessons/${lesson.slug}`}
                  >
                    <div
                      className={cn(
                        'bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-all flex items-center gap-4',
                        isNext && 'ring-4 ring-yellow-400 ring-offset-2',
                        isCompleted && 'bg-green-50'
                      )}
                    >
                      {/* Number or check */}
                      <div
                        className={cn(
                          'w-12 h-12 rounded-full flex items-center justify-center shrink-0 text-xl font-bold',
                          isCompleted
                            ? 'bg-green-500 text-white'
                            : isNext
                            ? 'bg-yellow-400 text-yellow-900'
                            : 'bg-slate-100 text-slate-600'
                        )}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-6 h-6" />
                        ) : (
                          index + 1
                        )}
                      </div>

                      {/* Lesson info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-800 text-lg">
                          {lesson.title}
                        </h3>
                        {isCompleted && (
                          <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                            <Star className="w-4 h-4" fill="currentColor" />
                            Completed!
                          </span>
                        )}
                        {isNext && !isCompleted && (
                          <span className="text-sm text-yellow-600 font-medium">
                            Up next!
                          </span>
                        )}
                      </div>

                      {/* Play button */}
                      <div
                        className={cn(
                          'w-10 h-10 rounded-full flex items-center justify-center',
                          isNext ? 'bg-yellow-400' : 'bg-slate-100'
                        )}
                      >
                        <Play className={cn(
                          'w-5 h-5',
                          isNext ? 'text-yellow-900' : 'text-slate-600'
                        )} />
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </section>

        {/* Back to courses */}
        <div className="mt-10 text-center">
          <Link
            href="/kids/courses"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-md text-slate-700 font-semibold hover:shadow-lg transition-all"
          >
            <span className="text-2xl">📚</span>
            See All Courses
          </Link>
        </div>
      </div>
    </div>
  )
}
