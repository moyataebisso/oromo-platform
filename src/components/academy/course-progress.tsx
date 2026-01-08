'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Check, Play, Lock, Trophy, ChevronRight } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Lesson {
  id: string
  title: string
  duration: string
  order_index: number
}

interface CourseProgressProps {
  courseId: string
  courseSlug: string
  lessons: Lesson[]
}

export const CourseProgress = ({ courseId, courseSlug, lessons }: CourseProgressProps) => {
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null)

  useEffect(() => {
    // Load progress from localStorage
    const savedProgress = localStorage.getItem(`course-progress-${courseId}`)
    if (savedProgress) {
      const progress = JSON.parse(savedProgress)
      setCompletedLessons(progress.completed || [])
      setCurrentLessonId(progress.currentLesson || lessons[0]?.id)
    } else {
      setCurrentLessonId(lessons[0]?.id)
    }
  }, [courseId, lessons])

  const saveProgress = (completed: string[], current: string | null) => {
    localStorage.setItem(`course-progress-${courseId}`, JSON.stringify({
      completed,
      currentLesson: current,
      lastUpdated: new Date().toISOString(),
    }))
  }

  const markLessonComplete = (lessonId: string) => {
    const newCompleted = [...completedLessons, lessonId]
    setCompletedLessons(newCompleted)

    // Find next lesson
    const currentIndex = lessons.findIndex(l => l.id === lessonId)
    const nextLesson = lessons[currentIndex + 1]
    if (nextLesson) {
      setCurrentLessonId(nextLesson.id)
    }

    saveProgress(newCompleted, nextLesson?.id || lessonId)
  }

  const progressPercentage = Math.round((completedLessons.length / lessons.length) * 100)
  const isComplete = completedLessons.length === lessons.length

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Course Progress</CardTitle>
          {isComplete && (
            <div className="flex items-center gap-1 text-emerald-600">
              <Trophy className="w-5 h-5" />
              <span className="text-sm font-medium">Complete!</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600">
              {completedLessons.length} of {lessons.length} lessons
            </span>
            <span className="text-sm font-medium text-slate-900">{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        <div className="space-y-2">
          {lessons.map((lesson, index) => {
            const isCompleted = completedLessons.includes(lesson.id)
            const isCurrent = lesson.id === currentLessonId
            const isLocked = !isCompleted && !isCurrent && index > 0 && !completedLessons.includes(lessons[index - 1]?.id)

            return (
              <div
                key={lesson.id}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-lg transition-colors',
                  isCompleted && 'bg-emerald-50',
                  isCurrent && !isCompleted && 'bg-blue-50 border border-blue-200',
                  isLocked && 'opacity-50'
                )}
              >
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                  isCompleted && 'bg-emerald-500 text-white',
                  isCurrent && !isCompleted && 'bg-blue-500 text-white',
                  !isCompleted && !isCurrent && 'bg-slate-200 text-slate-500'
                )}>
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : isLocked ? (
                    <Lock className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className={cn(
                    'text-sm font-medium truncate',
                    isCompleted && 'text-emerald-700',
                    isCurrent && !isCompleted && 'text-blue-700',
                    isLocked && 'text-slate-400'
                  )}>
                    {lesson.title}
                  </p>
                  <p className="text-xs text-slate-500">{lesson.duration}</p>
                </div>

                {!isLocked && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      isCompleted && 'text-emerald-600 hover:text-emerald-700',
                      isCurrent && !isCompleted && 'text-blue-600 hover:text-blue-700'
                    )}
                    asChild
                  >
                    <Link href={`/academy/${courseSlug}/lesson/${lesson.id}`}>
                      {isCompleted ? 'Review' : 'Start'}
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Button>
                )}
              </div>
            )
          })}
        </div>

        {!isComplete && currentLessonId && (
          <Button className="w-full mt-4" asChild>
            <Link href={`/academy/${courseSlug}/lesson/${currentLessonId}`}>
              <Play className="w-4 h-4 mr-2" />
              Continue Learning
            </Link>
          </Button>
        )}

        {isComplete && (
          <div className="mt-4 p-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg text-white text-center">
            <Trophy className="w-8 h-8 mx-auto mb-2" />
            <p className="font-semibold">Congratulations!</p>
            <p className="text-sm text-emerald-100">You&apos;ve completed this course</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
