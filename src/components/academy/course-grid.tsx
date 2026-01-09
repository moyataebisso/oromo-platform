import { CourseCard } from './course-card'
import { Course } from '@/types/academy'

interface CourseGridProps {
  courses: Course[]
}

export const CourseGrid = ({ courses }: CourseGridProps) => {
  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No courses found.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  )
}
