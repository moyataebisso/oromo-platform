'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Star, Trophy, Sparkles, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Learning categories for kids
const categories = [
  {
    id: 'colors',
    name: 'Colors',
    emoji: '🌈',
    description: 'Learn Oromo colors!',
    bgColor: 'bg-gradient-to-br from-red-400 via-yellow-400 to-green-400',
    href: '/kids/learn/colors',
  },
  {
    id: 'animals',
    name: 'Animals',
    emoji: '🦁',
    description: 'Meet animal friends!',
    bgColor: 'bg-gradient-to-br from-amber-400 to-orange-500',
    href: '/kids/learn/animals',
  },
  {
    id: 'numbers',
    name: 'Numbers',
    emoji: '🔢',
    description: 'Count with us!',
    bgColor: 'bg-gradient-to-br from-blue-400 to-cyan-500',
    href: '/kids/learn/numbers',
  },
  {
    id: 'alphabet',
    name: 'Qubee',
    emoji: '📝',
    description: 'Learn the alphabet!',
    bgColor: 'bg-gradient-to-br from-purple-400 to-pink-500',
    href: '/kids/learn/alphabet',
  },
  {
    id: 'family',
    name: 'Family',
    emoji: '👨‍👩‍👧‍👦',
    description: 'Family words!',
    bgColor: 'bg-gradient-to-br from-green-400 to-emerald-500',
    href: '/kids/learn/family',
  },
  {
    id: 'food',
    name: 'Food',
    emoji: '🍎',
    description: 'Yummy words!',
    bgColor: 'bg-gradient-to-br from-rose-400 to-red-500',
    href: '/kids/learn/food',
  },
  {
    id: 'songs',
    name: 'Songs',
    emoji: '🎵',
    description: 'Sing along!',
    bgColor: 'bg-gradient-to-br from-indigo-400 to-violet-500',
    href: '/kids/learn/songs',
  },
  {
    id: 'stories',
    name: 'Stories',
    emoji: '📚',
    description: 'Fun stories!',
    bgColor: 'bg-gradient-to-br from-teal-400 to-cyan-500',
    href: '/kids/learn/stories',
  },
]

// Mock progress data
const mockProgress = {
  totalStars: 47,
  completedLessons: 12,
  streak: 5,
  level: 3,
  levelName: 'Super Star',
  nextLevelStars: 50,
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
  const [progress, setProgress] = useState(mockProgress)

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
            <span className="font-semibold text-yellow-800">Level {progress.level}: {progress.levelName}!</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Welcome back! 👋
          </h1>
          <p className="text-xl text-slate-600">
            What do you want to learn today?
          </p>
        </div>

        {/* Progress Banner */}
        <div className="mb-10 p-6 bg-white rounded-3xl shadow-lg">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            {/* Stars */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-2">
                <Star className="w-8 h-8 text-yellow-500" fill="currentColor" />
              </div>
              <span className="text-3xl font-bold text-slate-800">{progress.totalStars}</span>
              <span className="text-sm text-slate-500 font-medium">Stars</span>
            </div>

            {/* Lessons */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
                <span className="text-3xl">📖</span>
              </div>
              <span className="text-3xl font-bold text-slate-800">{progress.completedLessons}</span>
              <span className="text-sm text-slate-500 font-medium">Lessons</span>
            </div>

            {/* Streak */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-2">
                <span className="text-3xl">🔥</span>
              </div>
              <span className="text-3xl font-bold text-slate-800">{progress.streak}</span>
              <span className="text-sm text-slate-500 font-medium">Day Streak</span>
            </div>

            {/* Level Progress */}
            <div className="flex flex-col items-center min-w-[120px]">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                <Trophy className="w-8 h-8 text-purple-500" />
              </div>
              <div className="w-full bg-purple-100 rounded-full h-3 mb-1">
                <div
                  className="bg-gradient-to-r from-purple-400 to-pink-500 h-3 rounded-full"
                  style={{ width: `${(progress.totalStars / progress.nextLevelStars) * 100}%` }}
                />
              </div>
              <span className="text-xs text-slate-500">{progress.nextLevelStars - progress.totalStars} stars to Level {progress.level + 1}!</span>
            </div>
          </div>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-10">
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

        {/* Continue Learning Section */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-10">
          <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span>📺</span> Continue Watching
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: 'Colors Song', progress: 75, emoji: '🌈', duration: '3:24' },
              { title: 'Animal Sounds', progress: 30, emoji: '🐘', duration: '4:15' },
              { title: 'Counting 1-10', progress: 90, emoji: '🔢', duration: '2:45' },
            ].map((video, i) => (
              <Link
                key={i}
                href={`/kids/watch/${i + 1}`}
                className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center text-3xl">
                  {video.emoji}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-800 group-hover:text-blue-600">
                    {video.title}
                  </h3>
                  <p className="text-sm text-slate-500">{video.duration}</p>
                  <div className="mt-2 w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${video.progress}%` }}
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Button
              size="lg"
              className="text-lg px-8 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              asChild
            >
              <Link href="/kids/watch">
                See All Videos 🎬
              </Link>
            </Button>
          </div>
        </div>

        {/* Achievement Banner */}
        <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-3xl shadow-lg p-6 text-center text-white">
          <div className="text-5xl mb-3">🏆</div>
          <h2 className="text-2xl font-bold mb-2">Great job this week!</h2>
          <p className="text-lg text-white/90 mb-4">
            You learned 5 new words and watched 3 videos!
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="text-lg font-semibold"
            asChild
          >
            <Link href="/kids/progress">
              See All My Stars ⭐
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
