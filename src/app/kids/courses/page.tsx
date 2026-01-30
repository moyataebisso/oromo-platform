'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BookOpen, Star, Sparkles } from 'lucide-react'
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
  order_index: number
  is_published: boolean
  lesson_count?: number
}

// Kid-friendly category colors and emojis
const categoryStyles: Record<string, { emoji: string; gradient: string }> = {
  language: { emoji: '📝', gradient: 'from-purple-400 to-pink-500' },
  math: { emoji: '🔢', gradient: 'from-blue-400 to-cyan-500' },
  culture: { emoji: '🌍', gradient: 'from-green-400 to-emerald-500' },
  stories: { emoji: '📚', gradient: 'from-amber-400 to-orange-500' },
  general: { emoji: '🌟', gradient: 'from-indigo-400 to-purple-500' },
}

export default function KidsCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sb = supabase as any

        const { data: coursesData, error } = await sb
          .from('kids_courses')
          .select('*')
          .eq('is_published', true)
          .order('order_index')

        if (error) {
          console.error('Error fetching kids courses:', error)
          setIsLoading(false)
          return
        }

        // Fetch lesson counts for each course
        if (coursesData && coursesData.length > 0) {
          const coursesWithCounts = await Promise.all(
            (coursesData as Course[]).map(async (course: Course) => {
              const { count } = await sb
                .from('kids_lessons')
                .select('*', { count: 'exact', head: true })
                .eq('course_id', course.id)
                .eq('is_published', true)

              return { ...course, lesson_count: count || 0 }
            })
          )
          setCourses(coursesWithCounts)
        }
      } catch (error) {
        console.error('Error fetching courses:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCourses()
  }, [supabase])

  return (
    <div className="py-8 px-4">
      <div className="mx-auto max-w-5xl">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-200 rounded-full mb-4">
            <Sparkles className="w-5 h-5 text-yellow-600" />
            <span className="font-semibold text-yellow-800">Learning is Fun!</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Our Courses
          </h1>
          <p className="text-xl text-slate-600">
            Pick a course and start learning Oromo!
          </p>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-square">
                <Skeleton className="w-full h-full rounded-3xl" />
              </div>
            ))}
          </div>
        )}

        {/* No courses found */}
        {!isLoading && courses.length === 0 && (
          <div className="text-center py-12 bg-white rounded-3xl shadow-lg">
            <BookOpen className="w-20 h-20 text-slate-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              Coming Soon!
            </h2>
            <p className="text-lg text-slate-600">
              We&apos;re creating fun courses for you. Check back soon!
            </p>
          </div>
        )}

        {/* Courses Grid */}
        {!isLoading && courses.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {courses.map((course) => {
              const style = categoryStyles[course.category] || categoryStyles.general

              return (
                <Link
                  key={course.id}
                  href={`/kids/courses/${course.slug}`}
                  className={cn(
                    'group relative rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105',
                    `bg-gradient-to-br ${style.gradient}`
                  )}
                >
                  <div className="aspect-square p-4 flex flex-col items-center justify-center text-white">
                    {/* Emoji */}
                    <span className="text-6xl md:text-7xl mb-3 group-hover:animate-bounce">
                      {style.emoji}
                    </span>

                    {/* Title */}
                    <h3 className="text-lg md:text-xl font-bold text-center drop-shadow-md mb-1">
                      {course.title}
                    </h3>

                    {/* Lesson count */}
                    {course.lesson_count !== undefined && course.lesson_count > 0 && (
                      <span className="text-sm text-white/80">
                        {course.lesson_count} lessons
                      </span>
                    )}

                    {/* Age badge */}
                    <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm rounded-full px-2 py-1">
                      <span className="text-xs font-medium text-white">
                        Ages {course.age_range}
                      </span>
                    </div>

                    {/* Sparkle effect on hover */}
                    <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Star className="w-6 h-6 text-yellow-300" fill="currentColor" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        {/* Back to Home */}
        <div className="mt-10 text-center">
          <Link
            href="/kids"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-md text-slate-700 font-semibold hover:shadow-lg transition-all"
          >
            <span className="text-2xl">🏠</span>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
