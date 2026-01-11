'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Search, BookOpen, Clock, Star } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Course {
  id: string
  title: string
  slug: string
  description: string
  course_category: string
  grade_levels: number[]
  difficulty: string
  estimated_hours: number
  xp_reward: number
  thumbnail_url: string
  is_featured: boolean
  is_published: boolean
}

export default function MiddleSchoolCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  const searchParams = useSearchParams()
  const supabase = createClient()

  const categories = [
    { slug: 'all', name: 'All Courses', icon: '📚' },
    { slug: 'test-prep', name: 'Test Prep', icon: '📝' },
    { slug: 'math', name: 'Math', icon: '🔢' },
    { slug: 'reading', name: 'Reading', icon: '📖' },
    { slug: 'science', name: 'Science', icon: '🔬' },
    { slug: 'social-studies', name: 'Social Studies', icon: '🌍' },
    { slug: 'oromo', name: 'Oromo', icon: '🇪🇹' },
    { slug: 'study-skills', name: 'Study Skills', icon: '💡' },
  ]

  useEffect(() => {
    const categoryParam = searchParams.get('category')
    if (categoryParam) {
      setSelectedCategory(categoryParam)
    }

    async function fetchCourses() {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sb = supabase as any

      const { data } = await sb
        .from('middle_school_courses')
        .select('*')
        .eq('is_published', true)
        .order('is_featured', { ascending: false })
        .order('order_index')

      setCourses(data || [])
      setLoading(false)
    }

    fetchCourses()
  }, [supabase, searchParams])

  const filteredCourses = courses.filter(course => {
    const matchesCategory = selectedCategory === 'all' || course.course_category === selectedCategory
    const matchesSearch = searchQuery === '' ||
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'test-prep': 'bg-red-500/20 text-red-600 dark:text-red-400',
      'math': 'bg-blue-500/20 text-blue-600 dark:text-blue-400',
      'reading': 'bg-green-500/20 text-green-600 dark:text-green-400',
      'science': 'bg-purple-500/20 text-purple-600 dark:text-purple-400',
      'social-studies': 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400',
      'oromo': 'bg-orange-500/20 text-orange-600 dark:text-orange-400',
      'study-skills': 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400',
    }
    return colors[category] || 'bg-gray-500/20 text-gray-600 dark:text-gray-400'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading courses...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Explore Courses</h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Learn at your own pace with interactive lessons, flashcards, quizzes, and games.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map(cat => (
            <button
              key={cat.slug}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === cat.slug
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-96 pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-slate-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Results */}
        <p className="text-gray-500 dark:text-gray-400 mb-6">{filteredCourses.length} courses available</p>

        {/* Course Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <Link
              key={course.id}
              href={`/middle-school/courses/${course.slug}`}
              className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all group shadow-sm hover:shadow-md"
            >
              {/* Thumbnail */}
              <div className="h-40 relative">
                {course.thumbnail_url ? (
                  <img
                    src={course.thumbnail_url}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-white/50" />
                  </div>
                )}
                {course.is_featured && (
                  <span className="absolute top-3 right-3 px-2 py-1 bg-yellow-500 text-yellow-900 text-xs font-bold rounded-full">
                    Featured
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(course.course_category)}`}>
                    {course.course_category?.replace('-', ' ')}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-500 capitalize">{course.difficulty}</span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {course.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">{course.description}</p>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-500 flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {course.estimated_hours}h
                  </span>
                  <span className="text-yellow-600 dark:text-yellow-400 flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    {course.xp_reward} XP
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">No courses found. Try a different filter!</p>
            <button
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              View all courses
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
