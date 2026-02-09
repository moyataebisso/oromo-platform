'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  ArrowLeft,
  Star,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface Course {
  id: string
  title: string
  slug: string
}

interface Lesson {
  id: string
  title: string
  slug: string
  content: string | null
  video_url: string | null
  order_index: number
}

interface LessonNav {
  id: string
  title: string
  slug: string
  order_index: number
}

export default function KidsLessonPage() {
  const params = useParams()
  const router = useRouter()
  const courseSlug = params.slug as string
  const lessonSlug = params.lessonSlug as string

  const [course, setCourse] = useState<Course | null>(null)
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [allLessons, setAllLessons] = useState<LessonNav[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCompleted, setIsCompleted] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sb = supabase as any

        // Fetch course
        const { data: courseData, error: courseError } = await sb
          .from('kids_courses')
          .select('id, title, slug')
          .eq('slug', courseSlug)
          .single()

        if (courseError) {
          console.error('Course error:', courseError)
          setError('Course not found')
          setIsLoading(false)
          return
        }

        setCourse(courseData as Course)

        // Fetch lesson
        const { data: lessonData, error: lessonError } = await sb
          .from('kids_lessons')
          .select('*')
          .eq('course_id', courseData.id)
          .eq('slug', lessonSlug)
          .single()

        if (lessonError) {
          console.error('Lesson error:', lessonError)
          setError('Lesson not found')
          setIsLoading(false)
          return
        }

        setLesson(lessonData as Lesson)

        // Fetch all lessons for navigation
        const { data: allLessonsData } = await sb
          .from('kids_lessons')
          .select('id, title, slug, order_index')
          .eq('course_id', courseData.id)
          .eq('is_published', true)
          .order('order_index')

        setAllLessons((allLessonsData || []) as LessonNav[])

        // Check user progress
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          const { data: progressData } = await sb
            .from('kids_progress')
            .select('completed')
            .eq('user_id', session.user.id)
            .eq('lesson_id', lessonData.id)
            .single()

          if (progressData?.completed) {
            setIsCompleted(true)
          }
        }
      } catch (err) {
        console.error('Error fetching lesson:', err)
        setError('Failed to load lesson')
      } finally {
        setIsLoading(false)
      }
    }

    if (courseSlug && lessonSlug) {
      fetchLesson()
    }
  }, [courseSlug, lessonSlug, supabase])

  const handleMarkComplete = async () => {
    const { data: { session } } = await supabase.auth.getSession()

    if (!session?.user || !course || !lesson) {
      router.push(`/login?redirect=/kids/courses/${courseSlug}/lessons/${lessonSlug}`)
      return
    }

    setIsSaving(true)

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sb = supabase as any

      console.log('=== SAVING KIDS PROGRESS ===')
      console.log('User ID:', session.user.id)
      console.log('Lesson ID:', lesson.id)
      console.log('Course ID:', course.id)
      console.log('Data being sent:', {
        user_id: session.user.id,
        lesson_id: lesson.id,
        course_id: course.id,
        completed: true,
        completed_at: new Date().toISOString(),
        last_accessed_at: new Date().toISOString(),
      })

      const { data, error: upsertError } = await sb.from('kids_progress').upsert(
        {
          user_id: session.user.id,
          course_id: course.id,
          lesson_id: lesson.id,
          completed: true,
          completed_at: new Date().toISOString(),
          last_accessed_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,lesson_id' }
      )

      console.log('Upsert response:', { data, error: upsertError })

      if (upsertError) {
        console.error('Error saving progress:', JSON.stringify(upsertError, null, 2))
        console.error('Error code:', upsertError?.code)
        console.error('Error message:', upsertError?.message)
        console.error('Error details:', upsertError?.details)
        toast.error('Failed to save progress. Please try again.')
        setIsSaving(false)
        return
      }

      setIsCompleted(true)
      toast.success('Great job! You completed this lesson!')
    } catch (err) {
      console.error('Error marking complete:', err)
      toast.error('Failed to save progress. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  // Find prev/next lessons
  const currentIndex = allLessons.findIndex((l) => l.slug === lessonSlug)
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">📚</div>
          <p className="text-xl text-purple-600 font-semibold">Loading lesson...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !course || !lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-3xl p-8 shadow-lg max-w-md">
          <span className="text-6xl mb-4 block">😢</span>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Oops!</h1>
          <p className="text-lg text-slate-600 mb-6">{error || 'Lesson not found'}</p>
          <Button
            size="lg"
            className="text-lg bg-gradient-to-r from-purple-500 to-pink-500"
            asChild
          >
            <Link href="/kids/courses">See All Courses</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 px-4 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link
            href={`/kids/courses/${course.slug}`}
            className="flex items-center gap-2 text-white hover:text-white/80 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Back to {course.title}</span>
            <span className="sm:hidden">Back</span>
          </Link>
          {isCompleted && (
            <div className="flex items-center gap-2 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full font-medium">
              <Star className="w-4 h-4" fill="currentColor" />
              Completed!
            </div>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 pt-6">
        {/* Lesson title */}
        <div className="text-center mb-8">
          <span className="text-5xl mb-3 block">📖</span>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
            {lesson.title}
          </h1>
          <p className="text-lg text-slate-600">
            Lesson {currentIndex + 1} of {allLessons.length}
          </p>
        </div>

        {/* Video player */}
        {lesson.video_url && (
          <div className="mb-8">
            <div className="aspect-video bg-slate-900 rounded-2xl overflow-hidden shadow-lg">
              <iframe
                src={lesson.video_url}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* Lesson content */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-lg mb-8">
          {lesson.content ? (
            <article className="prose prose-lg max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children, ...props }) => (
                    <h1 className="text-2xl md:text-3xl font-bold text-purple-600 mt-6 mb-4" {...props}>{children}</h1>
                  ),
                  h2: ({ children, ...props }) => (
                    <h2 className="text-xl md:text-2xl font-bold text-blue-600 mt-6 mb-3" {...props}>{children}</h2>
                  ),
                  h3: ({ children, ...props }) => (
                    <h3 className="text-lg md:text-xl font-bold text-green-600 mt-4 mb-2" {...props}>{children}</h3>
                  ),
                  p: ({ children, ...props }) => (
                    <p className="text-lg md:text-xl text-slate-700 mb-4 leading-relaxed" {...props}>{children}</p>
                  ),
                  ul: ({ children, ...props }) => (
                    <ul className="list-disc list-outside ml-6 text-lg md:text-xl text-slate-700 mb-4 space-y-2" {...props}>{children}</ul>
                  ),
                  ol: ({ children, ...props }) => (
                    <ol className="list-decimal list-outside ml-6 text-lg md:text-xl text-slate-700 mb-4 space-y-2" {...props}>{children}</ol>
                  ),
                  li: ({ children, ...props }) => (
                    <li className="text-slate-700 text-lg md:text-xl" {...props}>{children}</li>
                  ),
                  strong: ({ children, ...props }) => (
                    <strong className="text-slate-900 font-bold" {...props}>{children}</strong>
                  ),
                  blockquote: ({ children, ...props }) => (
                    <blockquote className="border-l-4 border-purple-400 pl-4 py-2 my-4 bg-purple-50 rounded-r-lg text-slate-600 text-lg" {...props}>{children}</blockquote>
                  ),
                  a: ({ children, href, ...props }) => (
                    <a href={href} className="text-blue-600 underline hover:text-blue-700" {...props}>{children}</a>
                  ),
                  // Table components for kid-friendly styling
                  table: ({ children, ...props }) => (
                    <div className="overflow-x-auto my-6">
                      <table className="min-w-full border-collapse rounded-xl overflow-hidden shadow-md text-lg" {...props}>{children}</table>
                    </div>
                  ),
                  thead: ({ children, ...props }) => (
                    <thead className="bg-gradient-to-r from-purple-500 to-pink-500 text-white" {...props}>{children}</thead>
                  ),
                  tbody: ({ children, ...props }) => (
                    <tbody className="bg-white" {...props}>{children}</tbody>
                  ),
                  tr: ({ children, ...props }) => (
                    <tr className="border-b border-purple-100 even:bg-purple-50" {...props}>{children}</tr>
                  ),
                  th: ({ children, ...props }) => (
                    <th className="px-4 py-3 text-left font-bold text-lg" {...props}>{children}</th>
                  ),
                  td: ({ children, ...props }) => (
                    <td className="px-4 py-3 text-lg" {...props}>{children}</td>
                  ),
                  // Code blocks for any inline code
                  code: ({ children, ...props }) => (
                    <code className="bg-purple-100 text-purple-700 px-2 py-1 rounded-md text-base font-mono" {...props}>{children}</code>
                  ),
                  // Horizontal rule
                  hr: ({ ...props }) => (
                    <hr className="my-6 border-t-2 border-purple-200" {...props} />
                  ),
                }}
              >
                {lesson.content}
              </ReactMarkdown>
            </article>
          ) : (
            <div className="text-center py-8">
              <span className="text-5xl mb-4 block">🔜</span>
              <p className="text-lg text-slate-600">Content coming soon!</p>
            </div>
          )}
        </div>

        {/* Mark complete button */}
        {!isCompleted && (
          <div className="mb-8">
            <Button
              size="lg"
              className="w-full text-xl py-6 bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 shadow-lg"
              onClick={handleMarkComplete}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <div className="w-6 h-6 mr-2 border-3 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-6 h-6 mr-2" />
                  I Finished This Lesson!
                </>
              )}
            </Button>
          </div>
        )}

        {/* Completed celebration */}
        {isCompleted && (
          <div className="mb-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl p-6 text-center text-white">
            <span className="text-5xl mb-3 block">🎉</span>
            <h3 className="text-2xl font-bold mb-2">Great Job!</h3>
            <p className="text-lg">You completed this lesson!</p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between">
          {prevLesson ? (
            <Link
              href={`/kids/courses/${course.slug}/lessons/${prevLesson.slug}`}
              className="flex items-center gap-2 px-4 py-3 bg-white rounded-full shadow-md text-slate-700 font-medium hover:shadow-lg transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="hidden sm:inline">{prevLesson.title}</span>
              <span className="sm:hidden">Previous</span>
            </Link>
          ) : (
            <div />
          )}

          {nextLesson ? (
            <Link
              href={`/kids/courses/${course.slug}/lessons/${nextLesson.slug}`}
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full shadow-md font-medium hover:shadow-lg transition-all"
            >
              <span className="hidden sm:inline">Next: {nextLesson.title}</span>
              <span className="sm:hidden">Next</span>
              <ChevronRight className="w-5 h-5" />
            </Link>
          ) : (
            <Link
              href={`/kids/courses/${course.slug}`}
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full shadow-md font-medium hover:shadow-lg transition-all"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Finish Course!</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
