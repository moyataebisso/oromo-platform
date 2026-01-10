'use client'

import Link from 'next/link'
import { BookOpen, Clock, Star, Trophy } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface CourseCardProps {
  course: {
    id: string
    title: string
    slug: string
    description: string | null
    thumbnail_url: string | null
    course_category: string
    difficulty: string
    estimated_hours: number | null
    xp_reward: number
    is_featured: boolean
  }
  lessonCount?: number
  progress?: number
}

const categoryColors: Record<string, string> = {
  'sat-prep': 'bg-blue-100 text-blue-700',
  'act-prep': 'bg-purple-100 text-purple-700',
  'college-prep': 'bg-green-100 text-green-700',
  'study-skills': 'bg-amber-100 text-amber-700',
  'oromo-culture': 'bg-rose-100 text-rose-700',
}

const categoryLabels: Record<string, string> = {
  'sat-prep': 'SAT Prep',
  'act-prep': 'ACT Prep',
  'college-prep': 'College Prep',
  'study-skills': 'Study Skills',
  'oromo-culture': 'Oromo Culture',
}

const difficultyColors: Record<string, string> = {
  beginner: 'text-green-600',
  intermediate: 'text-amber-600',
  advanced: 'text-red-600',
}

export function CourseCard({ course, lessonCount, progress }: CourseCardProps) {
  const categoryColor = categoryColors[course.course_category] || 'bg-slate-100 text-slate-700'
  const categoryLabel = categoryLabels[course.course_category] || course.course_category
  const difficultyColor = difficultyColors[course.difficulty] || 'text-slate-600'

  return (
    <Link href={`/teens/courses/${course.slug}`}>
      <Card className="group h-full hover:shadow-lg transition-all duration-200 overflow-hidden bg-white">
        {/* Thumbnail */}
        <div className="relative h-40 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 flex items-center justify-center">
          {course.thumbnail_url ? (
            <img
              src={course.thumbnail_url}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <BookOpen className="w-16 h-16 text-white/80" />
          )}

          {/* Featured badge */}
          {course.is_featured && (
            <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" />
              Featured
            </div>
          )}

          {/* Progress overlay */}
          {progress !== undefined && progress > 0 && (
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-3 py-1">
              <div className="w-full bg-white/30 rounded-full h-1.5">
                <div
                  className="bg-green-400 h-1.5 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          {/* Category and difficulty */}
          <div className="flex items-center gap-2 mb-2">
            <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', categoryColor)}>
              {categoryLabel}
            </span>
            <span className={cn('text-xs font-medium capitalize', difficultyColor)}>
              {course.difficulty}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
            {course.title}
          </h3>

          {/* Description */}
          {course.description && (
            <p className="text-sm text-slate-600 line-clamp-2 mb-3">
              {course.description}
            </p>
          )}

          {/* Stats */}
          <div className="flex items-center gap-4 text-xs text-slate-500">
            {lessonCount !== undefined && (
              <span className="flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" />
                {lessonCount} lessons
              </span>
            )}
            {course.estimated_hours && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {course.estimated_hours}h
              </span>
            )}
            <span className="flex items-center gap-1 text-amber-600">
              <Trophy className="w-3.5 h-3.5" />
              {course.xp_reward} XP
            </span>
          </div>

          {/* Progress text */}
          {progress !== undefined && progress > 0 && (
            <p className="text-xs text-green-600 font-medium mt-2">
              {progress}% complete
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
