export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
}

export interface Course {
  id: string
  title: string
  slug: string
  description: string | null
  thumbnail_url: string | null
  category_id: string | null
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  is_published: boolean
  created_at: string
  category?: Category
  lessons_count?: number
}

export interface Lesson {
  id: string
  course_id: string
  title: string
  content: string | null
  video_url: string | null
  order_index: number
  is_published: boolean
  created_at: string
  duration_minutes?: number
}

export interface CourseWithLessons extends Course {
  lessons: Lesson[]
}

export interface UserProgress {
  id: string
  user_id: string
  lesson_id: string
  completed: boolean
  completed_at: string | null
}
