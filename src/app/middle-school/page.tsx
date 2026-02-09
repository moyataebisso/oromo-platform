import Link from 'next/link'
import { BookOpen, Briefcase, Trophy, Target, Star, Rocket, Brain, Gamepad2, Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

interface FeaturedCourse {
  id: string
  title: string
  slug: string
  description: string | null
  course_category: string
  xp_reward: number
  estimated_hours: number | null
  lesson_count: number
}

export default async function MiddleSchoolHome() {
  const supabase = await createClient()

  // Fetch featured courses with lesson count
  const { data: coursesData } = await supabase
    .from('middle_school_courses')
    .select(`
      id,
      title,
      slug,
      description,
      course_category,
      xp_reward,
      estimated_hours,
      middle_school_lessons(count)
    `)
    .eq('is_published', true)
    .eq('is_featured', true)
    .order('order_index')
    .limit(3)

  // Transform data to include lesson count
  const featuredCourses: FeaturedCourse[] = (coursesData || []).map((course: {
    id: string
    title: string
    slug: string
    description: string | null
    course_category: string
    xp_reward: number
    estimated_hours: number | null
    middle_school_lessons: { count: number }[]
  }) => ({
    id: course.id,
    title: course.title,
    slug: course.slug,
    description: course.description,
    course_category: course.course_category,
    xp_reward: course.xp_reward,
    estimated_hours: course.estimated_hours,
    lesson_count: course.middle_school_lessons?.[0]?.count || 0
  }))

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

  const getCategoryBadgeColor = (category: string) => {
    const colors: Record<string, string> = {
      'test_prep': 'text-red-600 dark:text-red-400',
      'math': 'text-blue-600 dark:text-blue-400',
      'reading': 'text-green-600 dark:text-green-400',
      'writing': 'text-emerald-600 dark:text-emerald-400',
      'oromo': 'text-orange-600 dark:text-orange-400',
      'study_skills': 'text-cyan-600 dark:text-cyan-400',
    }
    return colors[category] || 'text-blue-600 dark:text-blue-400'
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
            Welcome to Odda Academy Middle School!
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

          {featuredCourses.length > 0 ? (
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
                    <span className={`text-xs font-medium uppercase ${getCategoryBadgeColor(course.course_category)}`}>
                      {course.course_category?.replace('_', ' ')}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">{course.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 line-clamp-2">{course.description}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                        {course.lesson_count > 0 && (
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-4 h-4" />
                            {course.lesson_count} lessons
                          </span>
                        )}
                        {course.estimated_hours && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {course.estimated_hours}h
                          </span>
                        )}
                      </div>
                      <span className="text-yellow-600 dark:text-yellow-400 text-sm flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        {course.xp_reward} XP
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                New courses are being added soon!
              </p>
              <Link
                href="/middle-school/courses"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
              >
                Browse All Courses
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Why Odda Academy Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 text-center">Why Learn with Odda Academy?</h2>
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
