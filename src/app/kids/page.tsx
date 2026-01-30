'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Star, Trophy, Sparkles, AlertCircle, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

// Learning categories for kids - using actual course slugs from database
const categories = [
  {
    id: 'alphabet',
    name: 'Qubee',
    emoji: '📝',
    description: 'Learn the alphabet!',
    bgColor: 'bg-gradient-to-br from-purple-400 to-pink-500',
    href: '/kids/courses/oromo-abcs',
  },
  {
    id: 'numbers',
    name: 'Numbers',
    emoji: '🔢',
    description: 'Count with us!',
    bgColor: 'bg-gradient-to-br from-blue-400 to-cyan-500',
    href: '/kids/courses/numbers-1-20',
  },
  {
    id: 'colors',
    name: 'Colors',
    emoji: '🌈',
    description: 'Learn Oromo colors!',
    bgColor: 'bg-gradient-to-br from-red-400 via-yellow-400 to-green-400',
    href: '/kids/courses/colors-shapes',
  },
  {
    id: 'animals',
    name: 'Animals',
    emoji: '🦁',
    description: 'Meet animal friends!',
    bgColor: 'bg-gradient-to-br from-amber-400 to-orange-500',
    href: '/kids/courses/animal-friends',
  },
  {
    id: 'family',
    name: 'Family',
    emoji: '👨‍👩‍👧‍👦',
    description: 'Family words!',
    bgColor: 'bg-gradient-to-br from-green-400 to-emerald-500',
    href: '/kids/courses/family-words',
  },
  {
    id: 'greetings',
    name: 'Greetings',
    emoji: '👋',
    description: 'Say hello!',
    bgColor: 'bg-gradient-to-br from-teal-400 to-cyan-500',
    href: '/kids/courses/greetings-manners',
  },
]

interface UserProgress {
  completedLessons: number
  totalLessons: number
  isLoggedIn: boolean
  isLoading: boolean
}

function RestrictedAlert() {
  const searchParams = useSearchParams()
  const [showRestricted, setShowRestricted] = useState(false)

  useEffect(() => {
    if (searchParams.get('restricted') === 'true') {
      setShowRestricted(true)
      const timer = setTimeout(() => setShowRestricted(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [searchParams])

  if (!showRestricted) return null

  return (
    <div className="mb-6 p-4 bg-white rounded-2xl shadow-lg flex items-center gap-3 animate-bounce">
      <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
        <AlertCircle className="w-6 h-6 text-amber-600" />
      </div>
      <div>
        <p className="font-bold text-slate-800 text-lg">Oops!</p>
        <p className="text-slate-600">That page is for grown-ups only. Let&apos;s learn here instead!</p>
      </div>
    </div>
  )
}

export default function KidsHomePage() {
  const [progress, setProgress] = useState<UserProgress>({
    completedLessons: 0,
    totalLessons: 0,
    isLoggedIn: false,
    isLoading: true,
  })

  const supabase = createClient()

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sb = supabase as any

        // Check if user is logged in
        const { data: { user } } = await supabase.auth.getUser()

        // Get total lessons count
        const { count: totalLessons } = await sb
          .from('kids_lessons')
          .select('*', { count: 'exact', head: true })
          .eq('is_published', true)

        if (user) {
          // Get completed lessons count for this user
          const { data: progressData } = await sb
            .from('kids_progress')
            .select('lesson_id')
            .eq('user_id', user.id)
            .eq('completed', true)

          setProgress({
            completedLessons: progressData?.length || 0,
            totalLessons: totalLessons || 0,
            isLoggedIn: true,
            isLoading: false,
          })
        } else {
          setProgress({
            completedLessons: 0,
            totalLessons: totalLessons || 0,
            isLoggedIn: false,
            isLoading: false,
          })
        }
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

  return (
    <div className="py-8 px-4">
      <div className="mx-auto max-w-5xl">
        {/* Restricted Content Alert */}
        <Suspense fallback={null}>
          <RestrictedAlert />
        </Suspense>

        {/* Welcome Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-200 rounded-full mb-4">
            <Sparkles className="w-5 h-5 text-yellow-600" />
            <span className="font-semibold text-yellow-800">Let&apos;s Learn Oromo!</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Welcome! 👋
          </h1>
          <p className="text-xl text-slate-600">
            What do you want to learn today?
          </p>
        </div>

        {/* Progress Banner */}
        <div className="mb-10 p-6 bg-white rounded-3xl shadow-lg">
          {progress.isLoading ? (
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
              <Skeleton className="w-20 h-24 rounded-xl" />
              <Skeleton className="w-20 h-24 rounded-xl" />
              <Skeleton className="w-32 h-24 rounded-xl" />
            </div>
          ) : progress.isLoggedIn ? (
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
              {/* Completed Lessons */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
                  <span className="text-3xl">📖</span>
                </div>
                <span className="text-3xl font-bold text-slate-800">{progress.completedLessons}</span>
                <span className="text-sm text-slate-500 font-medium">Lessons Done</span>
              </div>

              {/* Stars (based on completed lessons) */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-2">
                  <Star className="w-8 h-8 text-yellow-500" fill="currentColor" />
                </div>
                <span className="text-3xl font-bold text-slate-800">{progress.completedLessons}</span>
                <span className="text-sm text-slate-500 font-medium">Stars</span>
              </div>

              {/* Progress */}
              <div className="flex flex-col items-center min-w-[140px]">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                  <Trophy className="w-8 h-8 text-purple-500" />
                </div>
                <div className="w-full bg-purple-100 rounded-full h-3 mb-1">
                  <div
                    className="bg-gradient-to-r from-purple-400 to-pink-500 h-3 rounded-full transition-all"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <span className="text-xs text-slate-500">
                  {progressPercentage}% complete ({progress.completedLessons}/{progress.totalLessons})
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <span className="text-4xl mb-3 block">🌟</span>
              <p className="text-lg text-slate-700 font-medium mb-2">Start learning to see your progress!</p>
              <p className="text-slate-500">Pick a course below to begin your adventure!</p>
            </div>
          )}
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-10">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              className={cn(
                'group relative rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105',
                category.bgColor
              )}
            >
              <div className="aspect-square p-4 flex flex-col items-center justify-center text-white">
                <span className="text-6xl md:text-7xl mb-2 group-hover:animate-bounce">
                  {category.emoji}
                </span>
                <h3 className="text-xl md:text-2xl font-bold text-center drop-shadow-md">
                  {category.name}
                </h3>
                <p className="text-sm md:text-base text-white/90 text-center mt-1 hidden md:block">
                  {category.description}
                </p>
              </div>
              {/* Sparkle effect on hover */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Sparkles className="w-6 h-6 text-white/80" />
              </div>
            </Link>
          ))}
        </div>

        {/* View All Courses Button */}
        <div className="text-center mb-10">
          <Button
            size="lg"
            className="text-lg px-8 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            asChild
          >
            <Link href="/kids/courses">
              <BookOpen className="w-5 h-5 mr-2" />
              See All Courses
            </Link>
          </Button>
        </div>

        {/* Videos Coming Soon Section */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-10">
          <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span>📺</span> Videos
          </h2>
          <div className="text-center py-8">
            <span className="text-6xl mb-4 block">🎬</span>
            <h3 className="text-xl font-bold text-slate-700 mb-2">Coming Soon!</h3>
            <p className="text-slate-500">Fun videos are on the way. Check back soon!</p>
          </div>
        </div>

        {/* Achievement Banner */}
        <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-3xl shadow-lg p-6 text-center text-white">
          <div className="text-5xl mb-3">🏆</div>
          <h2 className="text-2xl font-bold mb-2">Keep Learning!</h2>
          <p className="text-lg text-white/90 mb-4">
            Complete lessons to earn stars and track your progress!
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="text-lg font-semibold"
            asChild
          >
            <Link href="/kids/courses">
              Start a Course
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
