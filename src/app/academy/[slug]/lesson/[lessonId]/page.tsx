import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { createClient } from '@/lib/supabase/server'
import { LessonContent } from '@/components/academy/lesson-content'

// Force dynamic rendering to avoid caching issues
export const dynamic = 'force-dynamic'

interface CourseData {
  id: string
  title: string
  slug: string
}

interface LessonData {
  id: string
  course_id: string
  title: string
  content: string | null
  video_url: string | null
}

interface SidebarLesson {
  id: string
  title: string
  order_index: number
}

interface Flashcard {
  id: string
  lesson_id: string
  term: string
  definition: string
  order_index: number
}

interface LessonPageProps {
  params: Promise<{ slug: string; lessonId: string }>
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { slug, lessonId } = await params
  const supabase = await createClient()

  // Fetch the course by slug
  const { data: courseData } = await supabase
    .from('courses')
    .select('id, title, slug')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  // Fetch the lesson by ID
  const { data: lessonData } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', lessonId)
    .eq('is_published', true)
    .single()

  // Validate course and lesson exist
  if (!courseData || !lessonData) {
    return notFound()
  }

  const course = courseData as unknown as CourseData
  const lesson = lessonData as unknown as LessonData

  // Verify lesson belongs to course
  if (lesson.course_id !== course.id) {
    return notFound()
  }

  // Fetch all lessons for this course (for sidebar)
  const { data: allLessonsData } = await supabase
    .from('lessons')
    .select('id, title, order_index')
    .eq('course_id', course.id)
    .eq('is_published', true)
    .order('order_index', { ascending: true })

  const lessons = (allLessonsData || []) as SidebarLesson[]

  // Fetch flashcards for this lesson
  const { data: flashcardsData, error: flashcardsError } = await supabase
    .from('flashcards')
    .select('*')
    .eq('lesson_id', lessonId)
    .order('order_index', { ascending: true })

  if (flashcardsError) {
    console.error('Error fetching flashcards:', flashcardsError)
  }

  const flashcards = (flashcardsData || []) as Flashcard[]

  // Debug logging
  console.log('========== LESSON DEBUG ==========')
  console.log('Lesson ID:', lessonId)
  console.log('Course slug:', slug)
  console.log('Flashcards found:', flashcards?.length || 0)
  if (flashcards.length > 0) {
    console.log('Sample flashcard:', flashcards[0])
  }
  console.log('==================================')

  const currentIndex = lessons.findIndex(l => l.id === lessonId)
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8">
          {/* Breadcrumb */}
          <Link
            href={`/academy/${slug}`}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {course.title}
          </Link>

          <LessonContent
            lesson={lesson}
            course={course}
            lessons={lessons}
            flashcards={flashcards}
            prevLesson={prevLesson}
            nextLesson={nextLesson}
            currentLessonId={lessonId}
          />
        </div>
      </main>

      <Footer />
    </div>
  )
}
