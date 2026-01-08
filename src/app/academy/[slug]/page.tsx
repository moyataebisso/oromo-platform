import Link from 'next/link'
import { ArrowLeft, Clock, BookOpen, BarChart, PlayCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { CourseWithLessons } from '@/types/academy'

// Mock course data - replace with Supabase fetch
const mockCourse: CourseWithLessons = {
  id: '1',
  title: 'Introduction to Afaan Oromoo',
  slug: 'intro-afaan-oromoo',
  description: 'Learn the basics of Afaan Oromoo, the Oromo language spoken by over 40 million people. This comprehensive beginner course covers essential vocabulary, grammar, pronunciation, and everyday conversations.',
  thumbnail_url: null,
  category_id: '1',
  difficulty: 'beginner',
  is_published: true,
  created_at: new Date().toISOString(),
  category: { id: '1', name: 'Language', slug: 'language', description: null },
  lessons_count: 12,
  lessons: [
    { id: '1', course_id: '1', title: 'Welcome & Course Overview', content: null, video_url: null, order_index: 1, is_published: true, created_at: '', duration_minutes: 10 },
    { id: '2', course_id: '1', title: 'The Oromo Alphabet (Qubee)', content: null, video_url: null, order_index: 2, is_published: true, created_at: '', duration_minutes: 25 },
    { id: '3', course_id: '1', title: 'Basic Greetings & Introductions', content: null, video_url: null, order_index: 3, is_published: true, created_at: '', duration_minutes: 20 },
    { id: '4', course_id: '1', title: 'Numbers and Counting', content: null, video_url: null, order_index: 4, is_published: true, created_at: '', duration_minutes: 15 },
    { id: '5', course_id: '1', title: 'Common Nouns & Articles', content: null, video_url: null, order_index: 5, is_published: true, created_at: '', duration_minutes: 30 },
    { id: '6', course_id: '1', title: 'Basic Verbs & Conjugation', content: null, video_url: null, order_index: 6, is_published: true, created_at: '', duration_minutes: 35 },
    { id: '7', course_id: '1', title: 'Family & Relationships', content: null, video_url: null, order_index: 7, is_published: true, created_at: '', duration_minutes: 20 },
    { id: '8', course_id: '1', title: 'Food & Dining', content: null, video_url: null, order_index: 8, is_published: true, created_at: '', duration_minutes: 25 },
    { id: '9', course_id: '1', title: 'Directions & Places', content: null, video_url: null, order_index: 9, is_published: true, created_at: '', duration_minutes: 20 },
    { id: '10', course_id: '1', title: 'Time & Dates', content: null, video_url: null, order_index: 10, is_published: true, created_at: '', duration_minutes: 15 },
    { id: '11', course_id: '1', title: 'Common Phrases & Expressions', content: null, video_url: null, order_index: 11, is_published: true, created_at: '', duration_minutes: 25 },
    { id: '12', course_id: '1', title: 'Course Review & Next Steps', content: null, video_url: null, order_index: 12, is_published: true, created_at: '', duration_minutes: 15 },
  ],
}

const difficultyColors = {
  beginner: 'bg-green-100 text-green-700',
  intermediate: 'bg-yellow-100 text-yellow-700',
  advanced: 'bg-red-100 text-red-700',
}

interface CourseDetailPageProps {
  params: Promise<{ slug: string }>
}

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { slug } = await params
  // In production, fetch course by slug from Supabase
  // For now using mock data - slug would be used in: supabase.from('courses').eq('slug', slug)
  void slug
  const course = mockCourse

  const totalDuration = course.lessons.reduce((acc, lesson) => acc + (lesson.duration_minutes || 0), 0)
  const hours = Math.floor(totalDuration / 60)
  const minutes = totalDuration % 60

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Course Header */}
        <section className="py-12 bg-gradient-to-b from-slate-900 to-slate-800 text-white">
          <div className="mx-auto max-w-7xl px-4">
            <Link
              href="/academy"
              className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to courses
            </Link>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="flex flex-wrap gap-2 mb-4">
                  {course.category && (
                    <Badge variant="secondary">{course.category.name}</Badge>
                  )}
                  <Badge className={difficultyColors[course.difficulty]}>
                    {course.difficulty}
                  </Badge>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold">{course.title}</h1>
                <p className="mt-4 text-lg text-slate-300">{course.description}</p>

                <div className="flex flex-wrap gap-6 mt-6 text-sm text-slate-300">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    <span>{course.lessons.length} lessons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <span>
                      {hours > 0 ? `${hours}h ` : ''}{minutes}m total
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BarChart className="w-5 h-5" />
                    <span className="capitalize">{course.difficulty} level</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1">
                <Card className="bg-white text-slate-900">
                  <CardContent className="p-6">
                    <Button className="w-full mb-4" size="lg">
                      Start Course
                    </Button>
                    <p className="text-sm text-slate-600 text-center">
                      Free access for all users
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Course Content */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4">
            <Card>
              <CardHeader>
                <CardTitle>Course Content</CardTitle>
                <p className="text-sm text-slate-600">
                  {course.lessons.length} lessons • {hours > 0 ? `${hours}h ` : ''}{minutes}m total length
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {course.lessons.map((lesson, index) => (
                    <Link
                      key={lesson.id}
                      href={`/academy/${course.slug}/lesson/${lesson.id}`}
                      className="flex items-center gap-4 p-4 rounded-lg hover:bg-slate-50 transition-colors group"
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-medium text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-600">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-slate-900 group-hover:text-blue-600 truncate">
                          {lesson.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Clock className="w-4 h-4" />
                        <span>{lesson.duration_minutes}m</span>
                      </div>
                      <PlayCircle className="w-5 h-5 text-slate-400 group-hover:text-blue-600" />
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
