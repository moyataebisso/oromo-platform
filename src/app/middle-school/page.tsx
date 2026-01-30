'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BookOpen, Briefcase, Trophy, Target, Star, Rocket, Brain, Gamepad2, Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface FeaturedCourse {
  id: string
  title: string
  slug: string
  description: string
  course_category: string
  xp_reward: number
}

export default function MiddleSchoolHome() {
  const [featuredCourses, setFeaturedCourses] = useState<FeaturedCourse[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    async function fetchFeaturedCourses() {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sb = supabase as any

      const { data } = await sb
        .from('middle_school_courses')
        .select('id, title, slug, description, course_category, xp_reward')
        .eq('is_published', true)
        .eq('is_featured', true)
        .limit(3)

      setFeaturedCourses(data || [])
      setLoading(false)
    }

    fetchFeaturedCourses()
  }, [supabase])

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, React.ReactNode> = {
      'test_prep': <Target className="w-12 h-12 text-white" />,
      'math': <Brain className="w-12 h-12 text-white" />,
      'reading': <BookOpen className="w-12 h-12 text-white" />,
      'writing': <BookOpen className="w-12 h-12 text-white" />,
      'oromo': <Star className="w-12 h-12 text-white" />,
      'study_skills': <Brain className="w-12 h-12 text-white" />,
    }
    return icons[category] || <BookOpen className="w-12 h-12 text-white" />
  }

  const getCategoryGradient = (category: string) => {
    const gradients: Record<string, string> = {
      'test_prep': 'from-red-500 to-orange-500',
      'math': 'from-blue-500 to-cyan-500',
      'reading': 'from-green-500 to-emerald-500',
      'writing': 'from-emerald-500 to-teal-500',
      'oromo': 'from-orange-500 to-amber-500',
      'study_skills': 'from-cyan-500 to-teal-500',
    }
    return gradients[category] || 'from-blue-500 to-purple-500'
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-white text-sm mb-6">
            <Star className="w-4 h-4" />
            Grades 6-8
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Welcome to ODDA Middle School!
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Prepare for success with test prep, fun courses, and career exploration made just for you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/middle-school/courses"
              className="px-6 py-3 bg-white text-purple-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
            >
              Start Learning
            </Link>
            <Link
              href="/middle-school/careers"
              className="px-6 py-3 bg-white/20 text-white font-semibold rounded-xl hover:bg-white/30 transition-colors"
            >
              Explore Careers
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Links Grid */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 text-center">What do you want to do?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            href="/middle-school/courses?category=test_prep"
            className="bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl p-6 text-white hover:scale-105 transition-transform shadow-lg"
          >
            <Target className="w-10 h-10 mb-4" />
            <h3 className="text-xl font-bold mb-2">Test Prep</h3>
            <p className="text-white/80 text-sm">MCA, MAP, and more</p>
          </Link>

          <Link
            href="/middle-school/courses?category=math"
            className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white hover:scale-105 transition-transform shadow-lg"
          >
            <Brain className="w-10 h-10 mb-4" />
            <h3 className="text-xl font-bold mb-2">Math Help</h3>
            <p className="text-white/80 text-sm">Pre-algebra, geometry & more</p>
          </Link>

          <Link
            href="/middle-school/courses?category=reading"
            className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 text-white hover:scale-105 transition-transform shadow-lg"
          >
            <BookOpen className="w-10 h-10 mb-4" />
            <h3 className="text-xl font-bold mb-2">Reading & Writing</h3>
            <p className="text-white/80 text-sm">Comprehension & essays</p>
          </Link>

          <Link
            href="/middle-school/careers"
            className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white hover:scale-105 transition-transform shadow-lg"
          >
            <Rocket className="w-10 h-10 mb-4" />
            <h3 className="text-xl font-bold mb-2">Explore Careers</h3>
            <p className="text-white/80 text-sm">Find your future path</p>
          </Link>
        </div>
      </div>

      {/* Featured Courses */}
      <div className="bg-white dark:bg-gray-800 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Featured Courses</h2>
            <Link href="/middle-school/courses" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
              View all
            </Link>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-100 dark:bg-gray-700 rounded-xl h-64 animate-pulse" />
              ))}
            </div>
          ) : featuredCourses.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {featuredCourses.map(course => (
                <Link
                  key={course.id}
                  href={`/middle-school/courses/${course.slug}`}
                  className="bg-gray-50 dark:bg-gray-700 rounded-xl overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all shadow-sm"
                >
                  <div className={`h-32 bg-gradient-to-br ${getCategoryGradient(course.course_category)} flex items-center justify-center`}>
                    {getCategoryIcon(course.course_category)}
                  </div>
                  <div className="p-4">
                    <span className="text-xs text-blue-600 dark:text-blue-400 font-medium uppercase">
                      {course.course_category?.replace('_', ' ')}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">{course.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 line-clamp-2">{course.description}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-yellow-600 dark:text-yellow-400 text-sm flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        {course.xp_reward} XP
                      </span>
                      <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                        Start Course
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {/* Placeholder courses when database is empty */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl overflow-hidden shadow-sm">
                <div className="h-32 bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                  <Target className="w-12 h-12 text-white" />
                </div>
                <div className="p-4">
                  <span className="text-xs text-red-600 dark:text-red-400 font-medium">TEST PREP</span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">MCA Math Prep</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Master Minnesota&apos;s MCA Math test</p>
                  <div className="mt-4 text-sm text-gray-500">Coming Soon</div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl overflow-hidden shadow-sm">
                <div className="h-32 bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-white" />
                </div>
                <div className="p-4">
                  <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">READING</span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">MCA Reading Prep</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Reading comprehension strategies</p>
                  <div className="mt-4 text-sm text-gray-500">Coming Soon</div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl overflow-hidden shadow-sm">
                <div className="h-32 bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <Brain className="w-12 h-12 text-white" />
                </div>
                <div className="p-4">
                  <span className="text-xs text-green-600 dark:text-green-400 font-medium">STUDY SKILLS</span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">Study Skills 101</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Learn how to study effectively</p>
                  <div className="mt-4 text-sm text-gray-500">Coming Soon</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Why ODDA Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 text-center">Why Learn with ODDA?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm">
            <div className="w-16 h-16 bg-blue-500/10 dark:bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gamepad2 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Fun & Interactive</h3>
            <p className="text-gray-600 dark:text-gray-400">Learn with games, quizzes, and flashcards that make studying fun!</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm">
            <div className="w-16 h-16 bg-green-500/10 dark:bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Test Prep Ready</h3>
            <p className="text-gray-600 dark:text-gray-400">Prepare for MCA, MAP, and other important tests with practice materials.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm">
            <div className="w-16 h-16 bg-purple-500/10 dark:bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Earn XP & Rewards</h3>
            <p className="text-gray-600 dark:text-gray-400">Complete lessons and earn points as you learn and grow!</p>
          </div>
        </div>
      </div>
    </div>
  )
}
