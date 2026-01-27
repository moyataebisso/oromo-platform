import { createClient } from './client'

// Types for Middle School module
export interface MiddleSchoolCourse {
  id: string
  title: string
  slug: string
  description: string | null
  thumbnail_url: string | null
  course_category: string
  grade_levels: number[]
  difficulty: string
  estimated_hours: number | null
  xp_reward: number
  is_featured: boolean
  is_published: boolean
  order_index: number
  created_at: string
}

export interface MiddleSchoolLesson {
  id: string
  course_id: string
  title: string
  slug: string
  content: string | null
  video_url: string | null
  duration_minutes: number | null
  xp_reward: number
  order_index: number
  is_published: boolean
  created_at: string
}

export interface MiddleSchoolCareer {
  id: string
  title: string
  slug: string
  description: string
  category: string
  icon: string
  salary_info: string | null
  education_needed: string | null
  skills_needed: string[] | null
  day_in_life: string | null
  is_featured: boolean
  is_published: boolean
  created_at: string
}

export interface MiddleSchoolProgress {
  id: string
  user_id: string
  course_id: string
  lesson_id: string | null
  activity_type: 'lesson' | 'quiz' | 'flashcard' | 'game'
  completed: boolean
  completed_at: string | null
  xp_earned: number
  score: number | null
  created_at: string
}

/**
 * Get all published middle school courses
 */
export async function getMiddleSchoolCourses(options?: {
  category?: string
  featured?: boolean
  limit?: number
}): Promise<MiddleSchoolCourse[]> {
  const supabase = createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any

  let query = sb
    .from('middle_school_courses')
    .select('*')
    .eq('is_published', true)

  if (options?.category) {
    query = query.eq('course_category', options.category)
  }

  if (options?.featured) {
    query = query.eq('is_featured', true)
  }

  query = query.order('is_featured', { ascending: false })
  query = query.order('order_index')

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching courses:', error)
    return []
  }

  return (data || []) as MiddleSchoolCourse[]
}

/**
 * Get a single course by slug
 */
export async function getMiddleSchoolCourseBySlug(
  slug: string
): Promise<MiddleSchoolCourse | null> {
  const supabase = createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any

  const { data, error } = await sb
    .from('middle_school_courses')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Error fetching course:', error)
    return null
  }

  return data as MiddleSchoolCourse
}

/**
 * Get lessons for a course
 */
export async function getMiddleSchoolLessons(
  courseId: string
): Promise<MiddleSchoolLesson[]> {
  const supabase = createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any

  const { data, error } = await sb
    .from('middle_school_lessons')
    .select('*')
    .eq('course_id', courseId)
    .eq('is_published', true)
    .order('order_index')

  if (error) {
    console.error('Error fetching lessons:', error)
    return []
  }

  return (data || []) as MiddleSchoolLesson[]
}

/**
 * Get a single lesson by slug
 */
export async function getMiddleSchoolLessonBySlug(
  courseId: string,
  lessonSlug: string
): Promise<MiddleSchoolLesson | null> {
  const supabase = createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any

  const { data, error } = await sb
    .from('middle_school_lessons')
    .select('*')
    .eq('course_id', courseId)
    .eq('slug', lessonSlug)
    .single()

  if (error) {
    console.error('Error fetching lesson:', error)
    return null
  }

  return data as MiddleSchoolLesson
}

/**
 * Get all published careers
 */
export async function getMiddleSchoolCareers(options?: {
  category?: string
  featured?: boolean
  limit?: number
}): Promise<MiddleSchoolCareer[]> {
  const supabase = createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any

  let query = sb
    .from('middle_school_careers')
    .select('*')
    .eq('is_published', true)

  if (options?.category) {
    query = query.eq('category', options.category)
  }

  if (options?.featured) {
    query = query.eq('is_featured', true)
  }

  query = query.order('is_featured', { ascending: false })
  query = query.order('title')

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching careers:', error)
    return []
  }

  return (data || []) as MiddleSchoolCareer[]
}

/**
 * Get a single career by slug
 */
export async function getMiddleSchoolCareerBySlug(
  slug: string
): Promise<MiddleSchoolCareer | null> {
  const supabase = createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any

  const { data, error } = await sb
    .from('middle_school_careers')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Error fetching career:', error)
    return null
  }

  return data as MiddleSchoolCareer
}

/**
 * Get user's progress for a course
 */
export async function getUserCourseProgress(
  userId: string,
  courseId: string
): Promise<MiddleSchoolProgress[]> {
  const supabase = createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any

  const { data, error } = await sb
    .from('middle_school_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('course_id', courseId)

  if (error) {
    console.error('Error fetching progress:', error)
    return []
  }

  return (data || []) as MiddleSchoolProgress[]
}

/**
 * Get completed lesson IDs for a user in a course
 */
export async function getCompletedLessonIds(
  userId: string,
  courseId: string
): Promise<string[]> {
  const supabase = createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any

  const { data, error } = await sb
    .from('middle_school_progress')
    .select('lesson_id')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .eq('activity_type', 'lesson')
    .eq('completed', true)

  if (error) {
    console.error('Error fetching completed lessons:', error)
    return []
  }

  return (data || [])
    .map((p: { lesson_id: string | null }) => p.lesson_id)
    .filter((id: string | null): id is string => id !== null)
}

/**
 * Mark a lesson as complete
 */
export async function markLessonComplete(
  userId: string,
  courseId: string,
  lessonId: string,
  xpReward: number
): Promise<boolean> {
  const supabase = createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any

  const { error } = await sb.from('middle_school_progress').upsert(
    {
      user_id: userId,
      course_id: courseId,
      lesson_id: lessonId,
      activity_type: 'lesson',
      completed: true,
      completed_at: new Date().toISOString(),
      xp_earned: xpReward,
    },
    { onConflict: 'user_id,lesson_id,activity_type' }
  )

  if (error) {
    console.error('Error marking lesson complete:', error)
    return false
  }

  return true
}

/**
 * Get user's total XP earned in middle school
 */
export async function getUserTotalXP(userId: string): Promise<number> {
  const supabase = createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any

  const { data, error } = await sb
    .from('middle_school_progress')
    .select('xp_earned')
    .eq('user_id', userId)
    .eq('completed', true)

  if (error) {
    console.error('Error fetching user XP:', error)
    return 0
  }

  return (data || []).reduce(
    (total: number, p: { xp_earned: number }) => total + (p.xp_earned || 0),
    0
  )
}

/**
 * Course category metadata
 */
export const COURSE_CATEGORIES = [
  { slug: 'all', name: 'All Courses', icon: '📚' },
  { slug: 'test-prep', name: 'Test Prep', icon: '📝' },
  { slug: 'math', name: 'Math', icon: '🔢' },
  { slug: 'reading', name: 'Reading', icon: '📖' },
  { slug: 'science', name: 'Science', icon: '🔬' },
  { slug: 'social-studies', name: 'Social Studies', icon: '🌍' },
  { slug: 'oromo', name: 'Oromo', icon: '🇪🇹' },
  { slug: 'study-skills', name: 'Study Skills', icon: '💡' },
] as const

/**
 * Career category metadata
 */
export const CAREER_CATEGORIES = [
  { slug: 'all', name: 'All Careers', icon: '🌟' },
  { slug: 'technology', name: 'Technology', icon: '💻' },
  { slug: 'healthcare', name: 'Healthcare', icon: '🏥' },
  { slug: 'creative', name: 'Creative', icon: '🎨' },
  { slug: 'sports', name: 'Sports', icon: '⚽' },
  { slug: 'science', name: 'Science', icon: '🔬' },
  { slug: 'education', name: 'Education', icon: '📚' },
  { slug: 'business', name: 'Business', icon: '💼' },
] as const

/**
 * Difficulty level metadata
 */
export const DIFFICULTY_LEVELS = {
  beginner: { label: 'Beginner', color: 'text-green-600 bg-green-50 dark:bg-green-900/30 dark:text-green-400' },
  intermediate: { label: 'Intermediate', color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/30 dark:text-amber-400' },
  advanced: { label: 'Advanced', color: 'text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-400' },
} as const
