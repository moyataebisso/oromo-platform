'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, CheckCircle2, Circle, BookOpen, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Lesson {
  id: string
  title: string
  slug: string
  order_index: number
  duration_minutes?: number | null
}

interface LessonSidebarProps {
  courseTitle: string
  courseSlug: string
  lessons: Lesson[]
  currentLessonSlug: string
  completedLessons?: string[]
  className?: string
}

export function LessonSidebar({
  courseTitle,
  courseSlug,
  lessons,
  currentLessonSlug,
  completedLessons = [],
  className,
}: LessonSidebarProps) {
  const [isOpen, setIsOpen] = useState(false)

  const currentIndex = lessons.findIndex((l) => l.slug === currentLessonSlug)
  const progress = completedLessons.length / lessons.length

  return (
    <>
      {/* Mobile toggle button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-4 left-4 z-50 lg:hidden shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen w-72 bg-white border-r transform transition-transform duration-200 lg:translate-x-0 lg:static lg:h-auto',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          className
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b">
            <Link
              href={`/teens/courses/${courseSlug}`}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-3"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm">Back to course</span>
            </Link>
            <h2 className="font-semibold text-slate-900 line-clamp-2">{courseTitle}</h2>

            {/* Progress bar */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>{completedLessons.length} of {lessons.length} complete</span>
                <span>{Math.round(progress * 100)}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Lesson list */}
          <nav className="flex-1 overflow-y-auto p-2">
            <ul className="space-y-1">
              {lessons.map((lesson, index) => {
                const isCurrent = lesson.slug === currentLessonSlug
                const isCompleted = completedLessons.includes(lesson.id)

                return (
                  <li key={lesson.id}>
                    <Link
                      href={`/teens/courses/${courseSlug}/lessons/${lesson.slug}`}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        'flex items-start gap-3 p-3 rounded-lg transition-colors',
                        isCurrent
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-slate-600 hover:bg-slate-50'
                      )}
                    >
                      {/* Status icon */}
                      <div className="shrink-0 mt-0.5">
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : isCurrent ? (
                          <BookOpen className="w-5 h-5 text-blue-600" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-300" />
                        )}
                      </div>

                      {/* Lesson info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-400 mb-0.5">Lesson {index + 1}</p>
                        <p
                          className={cn(
                            'text-sm font-medium line-clamp-2',
                            isCurrent ? 'text-blue-700' : 'text-slate-900'
                          )}
                        >
                          {lesson.title}
                        </p>
                        {lesson.duration_minutes && (
                          <p className="text-xs text-slate-400 mt-1">
                            {lesson.duration_minutes} min
                          </p>
                        )}
                      </div>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Navigation buttons */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                disabled={currentIndex === 0}
                asChild={currentIndex > 0}
              >
                {currentIndex > 0 ? (
                  <Link
                    href={`/teens/courses/${courseSlug}/lessons/${lessons[currentIndex - 1].slug}`}
                    onClick={() => setIsOpen(false)}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Link>
                ) : (
                  <>
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </>
                )}
              </Button>
              <Button
                className="flex-1"
                disabled={currentIndex === lessons.length - 1}
                asChild={currentIndex < lessons.length - 1}
              >
                {currentIndex < lessons.length - 1 ? (
                  <Link
                    href={`/teens/courses/${courseSlug}/lessons/${lessons[currentIndex + 1].slug}`}
                    onClick={() => setIsOpen(false)}
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                ) : (
                  <>
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
