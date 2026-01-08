import Link from 'next/link'
import { BookOpen, BarChart } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Course } from '@/types/academy'

interface CourseCardProps {
  course: Course
  className?: string
}

const difficultyColors = {
  beginner: 'bg-green-100 text-green-700',
  intermediate: 'bg-yellow-100 text-yellow-700',
  advanced: 'bg-red-100 text-red-700',
}

export const CourseCard = ({ course, className }: CourseCardProps) => {
  return (
    <Link href={`/academy/${course.slug}`}>
      <Card className={cn('group h-full hover:shadow-lg transition-all duration-200', className)}>
        <CardHeader className="p-0">
          <div className="aspect-video relative bg-slate-100 rounded-t-lg overflow-hidden">
            {course.thumbnail_url ? (
              <img
                src={course.thumbnail_url}
                alt={course.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600">
                <BookOpen className="w-12 h-12 text-white/80" />
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            {course.category && (
              <Badge variant="secondary" className="text-xs">
                {course.category.name}
              </Badge>
            )}
            <Badge className={cn('text-xs', difficultyColors[course.difficulty])}>
              {course.difficulty}
            </Badge>
          </div>
          <h3 className="font-semibold text-lg text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
            {course.title}
          </h3>
          {course.description && (
            <p className="mt-2 text-sm text-slate-600 line-clamp-2">
              {course.description}
            </p>
          )}
        </CardContent>
        <CardFooter className="px-4 pb-4 pt-0">
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              <span>{course.lessons_count || 0} lessons</span>
            </div>
            <div className="flex items-center gap-1">
              <BarChart className="w-4 h-4" />
              <span className="capitalize">{course.difficulty}</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
