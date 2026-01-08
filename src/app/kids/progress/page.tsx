'use client'

import Link from 'next/link'
import { Star, Trophy, Medal, Flame, CheckCircle2, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Mock achievements data
const achievements = [
  {
    id: 1,
    name: 'First Star',
    description: 'Complete your first lesson',
    emoji: '⭐',
    earned: true,
    earnedAt: '2024-01-15',
  },
  {
    id: 2,
    name: 'Color Master',
    description: 'Learn all the colors',
    emoji: '🌈',
    earned: true,
    earnedAt: '2024-01-20',
  },
  {
    id: 3,
    name: 'Animal Friend',
    description: 'Learn 10 animal names',
    emoji: '🦁',
    earned: true,
    earnedAt: '2024-01-25',
  },
  {
    id: 4,
    name: 'Number Ninja',
    description: 'Count from 1 to 20',
    emoji: '🔢',
    earned: false,
    progress: 15,
    total: 20,
  },
  {
    id: 5,
    name: 'Week Warrior',
    description: 'Learn 7 days in a row',
    emoji: '🔥',
    earned: false,
    progress: 5,
    total: 7,
  },
  {
    id: 6,
    name: 'Song Star',
    description: 'Sing along to 5 songs',
    emoji: '🎵',
    earned: false,
    progress: 2,
    total: 5,
  },
  {
    id: 7,
    name: 'Story Explorer',
    description: 'Read 3 stories',
    emoji: '📚',
    earned: false,
    progress: 1,
    total: 3,
  },
  {
    id: 8,
    name: 'Super Star',
    description: 'Earn 100 stars',
    emoji: '🌟',
    earned: false,
    progress: 47,
    total: 100,
  },
]

// Mock category progress
const categoryProgress = [
  { name: 'Colors', emoji: '🌈', completed: 8, total: 10, color: 'bg-red-400' },
  { name: 'Animals', emoji: '🦁', completed: 5, total: 15, color: 'bg-amber-400' },
  { name: 'Numbers', emoji: '🔢', completed: 15, total: 20, color: 'bg-blue-400' },
  { name: 'Qubee', emoji: '📝', completed: 3, total: 26, color: 'bg-purple-400' },
  { name: 'Family', emoji: '👨‍👩‍👧‍👦', completed: 6, total: 12, color: 'bg-green-400' },
  { name: 'Food', emoji: '🍎', completed: 4, total: 15, color: 'bg-rose-400' },
]

// Mock level data
const levels = [
  { level: 1, name: 'Beginner', stars: 0, unlocked: true },
  { level: 2, name: 'Learner', stars: 20, unlocked: true },
  { level: 3, name: 'Super Star', stars: 40, unlocked: true, current: true },
  { level: 4, name: 'Champion', stars: 60, unlocked: false },
  { level: 5, name: 'Master', stars: 100, unlocked: false },
]

export default function KidsProgressPage() {
  const totalStars = 47
  const currentLevel = 3

  return (
    <div className="py-8 px-4">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            My Stars & Badges ⭐
          </h1>
          <p className="text-xl text-slate-600">
            Look at all the amazing things you&apos;ve learned!
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="w-14 h-14 mx-auto bg-yellow-100 rounded-full flex items-center justify-center mb-3">
              <Star className="w-7 h-7 text-yellow-500" fill="currentColor" />
            </div>
            <p className="text-3xl font-bold text-slate-800">{totalStars}</p>
            <p className="text-sm text-slate-500 font-medium">Total Stars</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="w-14 h-14 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-3">
              <Trophy className="w-7 h-7 text-purple-500" />
            </div>
            <p className="text-3xl font-bold text-slate-800">3</p>
            <p className="text-sm text-slate-500 font-medium">Badges Earned</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="w-14 h-14 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-3">
              <Flame className="w-7 h-7 text-orange-500" />
            </div>
            <p className="text-3xl font-bold text-slate-800">5</p>
            <p className="text-sm text-slate-500 font-medium">Day Streak</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="w-14 h-14 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-3">
              <CheckCircle2 className="w-7 h-7 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-slate-800">41</p>
            <p className="text-sm text-slate-500 font-medium">Words Learned</p>
          </div>
        </div>

        {/* Level Progress */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-10">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Medal className="w-6 h-6 text-yellow-500" />
            Your Level Journey
          </h2>
          <div className="flex items-center justify-between relative">
            {/* Progress line */}
            <div className="absolute top-6 left-0 right-0 h-2 bg-slate-200 rounded-full -z-10">
              <div
                className="h-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"
                style={{ width: `${((currentLevel - 1) / (levels.length - 1)) * 100}%` }}
              />
            </div>

            {levels.map((level) => (
              <div key={level.level} className="flex flex-col items-center">
                <div
                  className={cn(
                    'w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold transition-all',
                    level.current
                      ? 'bg-gradient-to-r from-green-400 to-blue-500 text-white scale-125 shadow-lg'
                      : level.unlocked
                      ? 'bg-green-500 text-white'
                      : 'bg-slate-200 text-slate-400'
                  )}
                >
                  {level.unlocked ? level.level : <Lock className="w-5 h-5" />}
                </div>
                <span
                  className={cn(
                    'text-xs mt-2 font-medium',
                    level.current ? 'text-blue-600' : level.unlocked ? 'text-slate-700' : 'text-slate-400'
                  )}
                >
                  {level.name}
                </span>
                <span className="text-xs text-slate-400">{level.stars} stars</span>
              </div>
            ))}
          </div>
          <p className="text-center mt-6 text-slate-600">
            You need <span className="font-bold text-purple-600">13 more stars</span> to reach Level 4!
          </p>
        </div>

        {/* Achievements/Badges */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-10">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-purple-500" />
            My Badges
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={cn(
                  'relative p-4 rounded-2xl text-center transition-all',
                  achievement.earned
                    ? 'bg-gradient-to-br from-yellow-50 to-amber-100 shadow-md'
                    : 'bg-slate-50'
                )}
              >
                <div
                  className={cn(
                    'text-5xl mb-2',
                    !achievement.earned && 'grayscale opacity-50'
                  )}
                >
                  {achievement.emoji}
                </div>
                <h3 className={cn(
                  'font-bold mb-1',
                  achievement.earned ? 'text-slate-800' : 'text-slate-400'
                )}>
                  {achievement.name}
                </h3>
                <p className={cn(
                  'text-xs',
                  achievement.earned ? 'text-slate-600' : 'text-slate-400'
                )}>
                  {achievement.description}
                </p>
                {!achievement.earned && achievement.progress !== undefined && (
                  <div className="mt-2">
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full"
                        style={{ width: `${(achievement.progress / (achievement.total || 1)) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-500 mt-1">
                      {achievement.progress}/{achievement.total}
                    </span>
                  </div>
                )}
                {achievement.earned && (
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Category Progress */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-10">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            📊 Learning Progress
          </h2>
          <div className="space-y-4">
            {categoryProgress.map((category) => (
              <div key={category.name} className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-2xl">
                  {category.emoji}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold text-slate-800">{category.name}</span>
                    <span className="text-sm text-slate-500">
                      {category.completed}/{category.total}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div
                      className={cn('h-3 rounded-full', category.color)}
                      style={{ width: `${(category.completed / category.total) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
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
            <Link href="/kids">
              Keep Learning! 🚀
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
