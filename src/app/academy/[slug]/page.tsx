import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, BookOpen, BarChart, PlayCircle, GraduationCap, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { createClient } from '@/lib/supabase/server'

// Force dynamic rendering to avoid caching issues
export const dynamic = 'force-dynamic'

interface CourseData {
  id: string
  title: string
  slug: string
  description: string | null
  thumbnail_url: string | null
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  category_id: string | null
}

interface LessonData {
  id: string
  title: string
  order_index: number
}

const difficultyColors: Record<string, string> = {
  beginner: 'bg-green-500/10 text-green-400 border-green-500/20',
  intermediate: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  advanced: 'bg-red-500/10 text-red-400 border-red-500/20',
}

interface CourseDetailPageProps {
  params: Promise<{ slug: string }>
}

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  // Fetch course by slug (without category join - FK not set up in DB)
  const { data: courseData, error: courseError } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (courseError) {
    console.error('Error fetching course:', courseError)
  }

  if (!courseData) {
    return notFound()
  }

  const course = courseData as unknown as CourseData

  // Fetch category separately if course has category_id
  let categoryName: string | null = null
  if (course.category_id) {
    const { data: categoryData } = await supabase
      .from('categories')
      .select('name')
      .eq('id', course.category_id)
      .single()
    const category = categoryData as { name: string } | null
    categoryName = category?.name || null
  }

  // Fetch lessons for this course
  const { data: lessonsData } = await supabase
    .from('lessons')
    .select('id, title, order_index')
    .eq('course_id', course.id)
    .eq('is_published', true)
    .order('order_index', { ascending: true })

  const courseLessons = (lessonsData || []) as LessonData[]
  const firstLessonId = courseLessons[0]?.id

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Course Header */}
        <section className="py-16 bg-gradient-to-b from-slate-900 via-slate-800 to-background relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px]" />

          <div className="relative mx-auto max-w-7xl px-4">
            <Link
              href="/academy"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to courses
            </Link>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="flex flex-wrap gap-2 mb-4">
                  {categoryName && (
                    <Badge variant="secondary" className="bg-slate-700/50 text-slate-300 border-slate-600">
                      {categoryName}
                    </Badge>
                  )}
                  <Badge className={`border ${difficultyColors[course.difficulty]} capitalize`}>
                    {course.difficulty}
                  </Badge>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{course.title}</h1>
                <p className="text-lg text-slate-300 leading-relaxed">{course.description}</p>

                <div className="flex flex-wrap gap-6 mt-8">
                  <div className="flex items-center gap-2 text-slate-300">
                    <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Lessons</p>
                      <p className="font-semibold text-white">{courseLessons.length}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <BarChart className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Level</p>
                      <p className="font-semibold text-white capitalize">{course.difficulty}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">Access</p>
                      <p className="font-semibold text-white">Free</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1">
                <Card className="bg-slate-800/80 border-slate-700 backdrop-blur-sm sticky top-4">
                  <CardContent className="p-6">
                    {firstLessonId ? (
                      <Button asChild className="w-full mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500" size="lg">
                        <Link href={`/academy/${course.slug}/lesson/${firstLessonId}`}>
                          <PlayCircle className="w-5 h-5 mr-2" />
                          Start Learning
                        </Link>
                      </Button>
                    ) : (
                      <Button className="w-full mb-4" size="lg" disabled>
                        No lessons available
                      </Button>
                    )}
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-2 text-slate-300">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>Free access for all users</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>Track your progress</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>Interactive flashcards & quizzes</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Course Content */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="border-b border-slate-700">
                <CardTitle className="text-foreground">Course Content</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {courseLessons.length} lessons
                </p>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-700/50">
                  {courseLessons.map((lesson, index) => (
                    <Link
                      key={lesson.id}
                      href={`/academy/${course.slug}/lesson/${lesson.id}`}
                      className="flex items-center gap-4 p-4 hover:bg-slate-700/30 transition-colors group"
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center text-sm font-medium text-slate-400 group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-colors">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground group-hover:text-primary truncate transition-colors">
                          {lesson.title}
                        </h3>
                      </div>
                      <PlayCircle className="w-5 h-5 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
