'use client'

import Link from 'next/link'
import { BookOpen, BarChart, PlayCircle, Clock } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Course } from '@/types/academy'
import { useCourseProgress } from '@/hooks/use-lesson-progress'

interface CourseCardProps {
  course: Course
  className?: string
}

const difficultyColors: Record<string, string> = {
  beginner: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  intermediate: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  advanced: 'bg-red-500/10 text-red-400 border-red-500/20',
}

export const CourseCard = ({ course, className }: CourseCardProps) => {
  const { progressPercentage, hasStarted, nextLessonId, isLoading, totalLessons } = useCourseProgress(course.id)

  const continueUrl = nextLessonId
    ? `/academy/${course.slug}/lesson/${nextLessonId}`
    : `/academy/${course.slug}`

  const lessonCount = course.lessons_count || totalLessons || 0

  return (
    <Card className={cn(
      'group h-full flex flex-col overflow-hidden',
      'bg-card border-border hover:border-primary/50',
      'hover:shadow-xl hover:shadow-primary/10 transition-all duration-300',
      className
    )}>
      <Link href={`/academy/${course.slug}`}>
        <CardHeader className="p-0">
          <div className="aspect-video relative overflow-hidden">
            {course.thumbnail_url ? (
              <img
                src={course.thumbnail_url}
                alt={course.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-600 via-amber-600 to-red-600">
                <BookOpen className="w-16 h-16 text-white/60" />
              </div>
            )}
            {/* Progress overlay */}
            {hasStarted && !isLoading && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-amber-500 transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-white">{progressPercentage}%</span>
                </div>
              </div>
            )}
            {/* Difficulty badge overlay */}
            <div className="absolute top-3 right-3">
              <Badge className={cn('text-xs border capitalize', difficultyColors[course.difficulty])}>
                {course.difficulty}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-1">
          <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {course.title}
          </h3>
          {course.description && (
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
              {course.description}
            </p>
          )}
        </CardContent>
      </Link>
      <CardFooter className="px-4 pb-4 pt-0 flex flex-col gap-3">
        <div className="flex items-center justify-between w-full text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            <span>{lessonCount} lessons</span>
          </div>
          <div className="flex items-center gap-1">
            <BarChart className="w-4 h-4" />
            <span className="capitalize">{course.difficulty}</span>
          </div>
        </div>
        {hasStarted && !isLoading ? (
          <Button asChild className="w-full bg-gradient-to-r from-emerald-600 to-amber-600 hover:from-emerald-500 hover:to-amber-500" size="sm">
            <Link href={continueUrl}>
              <PlayCircle className="w-4 h-4 mr-2" />
              Continue Learning
            </Link>
          </Button>
        ) : (
          <Button asChild variant="outline" className="w-full border-border hover:bg-secondary hover:border-primary/50" size="sm">
            <Link href={`/academy/${course.slug}`}>
              Start Course
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
