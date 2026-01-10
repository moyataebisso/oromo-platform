'use client'

import { useState, useEffect } from 'react'
import { BookOpen, GraduationCap, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { CourseCard } from '@/components/teens/CourseCard'
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
  lesson_count?: number
}

const categories = [
  { id: 'all', label: 'All Courses' },
  { id: 'sat-prep', label: 'SAT Prep' },
  { id: 'act-prep', label: 'ACT Prep' },
  { id: 'college-prep', label: 'College Prep' },
  { id: 'study-skills', label: 'Study Skills' },
  { id: 'oromo-culture', label: 'Oromo Culture' },
]

export default function TeenCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const supabase = createClient()

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sb = supabase as any

        // Fetch courses
        const { data: coursesData, error } = await sb
          .from('teen_courses')
          .select('*')
          .eq('is_published', true)
          .order('is_featured', { ascending: false })
          .order('order_index')

        if (error) {
          console.error('Error fetching courses:', error.message || error.code || error)
          // If table doesn't exist, show empty state instead of error
          if (error.code === '42P01' || error.message?.includes('does not exist')) {
            console.warn('teen_courses table not found. Please run database migrations.')
          }
          setIsLoading(false)
          return
        }

        // Fetch lesson counts for each course
        if (coursesData && coursesData.length > 0) {
          const coursesWithCounts = await Promise.all(
            (coursesData as Course[]).map(async (course: Course) => {
              const { count } = await sb
                .from('teen_lessons')
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

  const filteredCourses =
    selectedCategory === 'all'
      ? courses
      : courses.filter((c) => c.category === selectedCategory)

  const featuredCourses = filteredCourses.filter((c) => c.is_featured)
  const regularCourses = filteredCourses.filter((c) => !c.is_featured)

  return (
    <div className="py-8 px-4">
      <div className="mx-auto max-w-7xl">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-2xl p-8 md:p-12 text-white mb-8">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="w-8 h-8" />
              <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                Teen Academy
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Explore Our Courses
            </h1>
            <p className="text-lg text-white/90 max-w-2xl">
              Learn at your own pace with interactive lessons, flashcards, quizzes, and games.
              From SAT prep to Oromo culture, we&apos;ve got you covered.
            </p>
          </div>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                selectedCategory === cat.id
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'hover:bg-slate-100'
              )}
            >
              {cat.label}
            </Button>
          ))}
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden">
                <Skeleton className="h-40 w-full" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No courses found */}
        {!isLoading && filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              No courses found
            </h2>
            <p className="text-slate-600">
              {selectedCategory === 'all'
                ? 'No courses available yet. Check back soon!'
                : 'No courses in this category. Try another filter.'}
            </p>
            {selectedCategory !== 'all' && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setSelectedCategory('all')}
              >
                View all courses
              </Button>
            )}
          </div>
        )}

        {/* Featured courses */}
        {!isLoading && featuredCourses.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h2 className="text-xl font-bold text-slate-900">Featured Courses</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  lessonCount={course.lesson_count}
                />
              ))}
            </div>
          </section>
        )}

        {/* All courses */}
        {!isLoading && regularCourses.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              {featuredCourses.length > 0 ? 'More Courses' : 'All Courses'}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  lessonCount={course.lesson_count}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
