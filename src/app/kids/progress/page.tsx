'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Star, Trophy, Medal, CheckCircle2, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

interface CourseProgress {
  id: string
  title: string
  slug: string
  emoji: string
  color: string
  completedLessons: number
  totalLessons: number
}

interface ProgressData {
  isLoggedIn: boolean
  isLoading: boolean
  totalStars: number
  completedLessons: number
  totalLessons: number
  courseProgress: CourseProgress[]
}

// Course emoji and color mapping
const courseStyles: Record<string, { emoji: string; color: string }> = {
  'oromo-abcs': { emoji: '📝', color: 'bg-purple-400' },
  'numbers-1-20': { emoji: '🔢', color: 'bg-blue-400' },
  'colors-shapes': { emoji: '🌈', color: 'bg-red-400' },
  'animal-friends': { emoji: '🦁', color: 'bg-amber-400' },
  'family-words': { emoji: '👨‍👩‍👧‍👦', color: 'bg-green-400' },
  'greetings-manners': { emoji: '👋', color: 'bg-teal-400' },
}

export default function KidsProgressPage() {
  const [progress, setProgress] = useState<ProgressData>({
    isLoggedIn: false,
    isLoading: true,
    totalStars: 0,
    completedLessons: 0,
    totalLessons: 0,
    courseProgress: [],
  })

  const supabase = createClient()

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sb = supabase as any

        // Check if user is logged in
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
          setProgress(prev => ({ ...prev, isLoggedIn: false, isLoading: false }))
          return
        }

        // Get all courses
        const { data: courses } = await sb
          .from('kids_courses')
          .select('id, title, slug')
          .eq('is_published', true)
          .order('order_index')

        // Get all lessons grouped by course
        const { data: allLessons } = await sb
          .from('kids_lessons')
          .select('id, course_id')
          .eq('is_published', true)

        // Get user's completed lessons
        const { data: completedData } = await sb
          .from('kids_progress')
          .select('lesson_id, course_id')
          .eq('user_id', user.id)
          .eq('completed', true)

        const completedLessonIds = new Set(completedData?.map((p: { lesson_id: string }) => p.lesson_id) || [])

        // Calculate progress for each course
        const courseProgress: CourseProgress[] = (courses || []).map((course: { id: string; title: string; slug: string }) => {
          const courseLessons = (allLessons || []).filter((l: { course_id: string }) => l.course_id === course.id)
          const completedInCourse = courseLessons.filter((l: { id: string }) => completedLessonIds.has(l.id)).length
          const style = courseStyles[course.slug] || { emoji: '📖', color: 'bg-slate-400' }

          return {
            id: course.id,
            title: course.title,
            slug: course.slug,
            emoji: style.emoji,
            color: style.color,
            completedLessons: completedInCourse,
            totalLessons: courseLessons.length,
          }
        })

        const totalCompleted = completedData?.length || 0
        const totalLessons = allLessons?.length || 0

        setProgress({
          isLoggedIn: true,
          isLoading: false,
          totalStars: totalCompleted, // 1 star per completed lesson
          completedLessons: totalCompleted,
          totalLessons: totalLessons,
          courseProgress: courseProgress,
        })
      } catch (error) {
        console.error('Error fetching progress:', error)
        setProgress(prev => ({ ...prev, isLoading: false }))
      }
    }

    fetchProgress()
  }, [supabase])

  const progressPercentage = progress.totalLessons > 0
    ? Math.round((progress.completedLessons / progress.totalLessons) * 100)
    : 0

  // Calculate level based on stars
  const getLevel = (stars: number) => {
    if (stars >= 50) return { level: 5, name: 'Master', nextLevel: null, starsNeeded: 0 }
    if (stars >= 30) return { level: 4, name: 'Champion', nextLevel: 'Master', starsNeeded: 50 - stars }
    if (stars >= 15) return { level: 3, name: 'Super Star', nextLevel: 'Champion', starsNeeded: 30 - stars }
    if (stars >= 5) return { level: 2, name: 'Learner', nextLevel: 'Super Star', starsNeeded: 15 - stars }
    return { level: 1, name: 'Beginner', nextLevel: 'Learner', starsNeeded: 5 - stars }
  }

  const levelInfo = getLevel(progress.totalStars)

  // Loading state
  if (progress.isLoading) {
    return (
      <div className="py-8 px-4">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-10">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-48 mx-auto" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))}
          </div>
          <Skeleton className="h-48 rounded-3xl mb-10" />
          <Skeleton className="h-64 rounded-3xl" />
        </div>
      </div>
    )
  }

  // Not logged in state
  if (!progress.isLoggedIn) {
    return (
      <div className="py-8 px-4">
        <div className="mx-auto max-w-5xl">
          <div className="text-center py-16">
            <span className="text-8xl mb-6 block">🔒</span>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Sign In to See Your Stars!
            </h1>
            <p className="text-xl text-slate-600 mb-8">
              Create an account to track your learning progress and earn stars!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="text-lg bg-gradient-to-r from-purple-500 to-pink-500"
                asChild
              >
                <Link href="/login">Sign In</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg"
                asChild
              >
                <Link href="/kids">Go Back Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // No progress yet state
  if (progress.completedLessons === 0) {
    return (
      <div className="py-8 px-4">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              My Stars & Progress
            </h1>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-8 text-center mb-10">
            <span className="text-8xl mb-6 block">🌟</span>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              Start Learning to Earn Stars!
            </h2>
            <p className="text-lg text-slate-600 mb-6">
              Complete lessons to earn stars and track your progress here.
              Each lesson you finish earns you a star!
            </p>
            <Button
              size="lg"
              className="text-lg px-8 bg-gradient-to-r from-green-500 to-blue-500"
              asChild
            >
              <Link href="/kids/courses">
                <BookOpen className="w-5 h-5 mr-2" />
                Start a Course
              </Link>
            </Button>
          </div>

          {/* Show available courses */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              Available Courses
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {progress.courseProgress.map((course) => (
                <Link
                  key={course.id}
                  href={`/kids/courses/${course.slug}`}
                  className={cn(
                    'p-4 rounded-2xl text-center text-white transition-all hover:scale-105',
                    course.color
                  )}
                >
                  <span className="text-4xl mb-2 block">{course.emoji}</span>
                  <h3 className="font-bold">{course.title}</h3>
                  <p className="text-sm text-white/80">{course.totalLessons} lessons</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Main progress view with real data
  return (
    <div className="py-8 px-4">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            My Stars & Progress
          </h1>
          <p className="text-xl text-slate-600">
            Look at all the amazing things you&apos;ve learned!
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="w-14 h-14 mx-auto bg-yellow-100 rounded-full flex items-center justify-center mb-3">
              <Star className="w-7 h-7 text-yellow-500" fill="currentColor" />
            </div>
            <p className="text-3xl font-bold text-slate-800">{progress.totalStars}</p>
            <p className="text-sm text-slate-500 font-medium">Total Stars</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="w-14 h-14 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-3">
              <CheckCircle2 className="w-7 h-7 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-slate-800">{progress.completedLessons}</p>
            <p className="text-sm text-slate-500 font-medium">Lessons Done</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 text-center col-span-2 md:col-span-1">
            <div className="w-14 h-14 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-3">
              <Trophy className="w-7 h-7 text-purple-500" />
            </div>
            <p className="text-3xl font-bold text-slate-800">{progressPercentage}%</p>
            <p className="text-sm text-slate-500 font-medium">Complete</p>
          </div>
        </div>

        {/* Level Progress */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-10">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Medal className="w-6 h-6 text-yellow-500" />
            Your Level: {levelInfo.name}
          </h2>

          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 text-white text-4xl font-bold mb-4">
              {levelInfo.level}
            </div>
            <p className="text-xl font-bold text-slate-800">{levelInfo.name}</p>
          </div>

          {levelInfo.nextLevel && (
            <>
              <div className="w-full bg-slate-200 rounded-full h-4 mb-2">
                <div
                  className="h-4 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 transition-all"
                  style={{
                    width: `${Math.min(100, (progress.totalStars / (progress.totalStars + levelInfo.starsNeeded)) * 100)}%`
                  }}
                />
              </div>
              <p className="text-center text-slate-600">
                <span className="font-bold text-purple-600">{levelInfo.starsNeeded} more stars</span> to reach {levelInfo.nextLevel}!
              </p>
            </>
          )}

          {!levelInfo.nextLevel && (
            <p className="text-center text-slate-600">
              <span className="font-bold text-purple-600">Amazing!</span> You&apos;ve reached the highest level!
            </p>
          )}
        </div>

        {/* Course Progress */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-10">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            📊 Learning Progress by Course
          </h2>
          <div className="space-y-4">
            {progress.courseProgress.map((course) => (
              <Link
                key={course.id}
                href={`/kids/courses/${course.slug}`}
                className="flex items-center gap-4 p-2 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <div className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center text-2xl text-white',
                  course.color
                )}>
                  {course.emoji}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold text-slate-800">{course.title}</span>
                    <span className="text-sm text-slate-500">
                      {course.completedLessons}/{course.totalLessons}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div
                      className={cn('h-3 rounded-full transition-all', course.color)}
                      style={{
                        width: course.totalLessons > 0
                          ? `${(course.completedLessons / course.totalLessons) * 100}%`
                          : '0%'
                      }}
                    />
                  </div>
                </div>
                {course.completedLessons === course.totalLessons && course.totalLessons > 0 && (
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Back to Learning */}
        <div className="text-center">
          <Button
            size="lg"
            className="text-lg px-8 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
            asChild
          >
            <Link href="/kids/courses">
              Keep Learning! 🚀
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
