'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'

// Database row type for lesson_progress table
interface LessonProgressRow {
  id: string
  user_id: string
  lesson_id: string
  course_id: string
  completed: boolean
  completed_at: string | null
  quiz_score: number | null
  last_accessed_at: string | null
  created_at: string
  updated_at: string
}

// Database row type for lessons table (partial)
interface LessonRow {
  id: string
  order_index: number
}

// Database row type for completed lessons query
interface CompletedLessonRow {
  lesson_id: string
}

interface LessonProgress {
  lessonId: string
  courseId: string
  completed: boolean
  completedAt: string | null
  quizScore: number | null
  lastAccessedAt: string | null
}

interface UseLessonProgressReturn {
  user: User | null
  isLoading: boolean
  progress: LessonProgress | null
  courseProgress: Map<string, LessonProgress>
  isCompleted: boolean
  markComplete: (quizScore?: number) => Promise<void>
  updateLastAccessed: () => Promise<void>
  getCompletedLessons: (courseId: string) => string[]
}

const STORAGE_KEY = 'lesson_progress_guest'

// Get guest progress from localStorage
function getGuestProgress(): Record<string, LessonProgress> {
  if (typeof window === 'undefined') return {}
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

// Save guest progress to localStorage
function saveGuestProgress(progress: Record<string, LessonProgress>) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch {
    // localStorage might be full or disabled
  }
}

export function useLessonProgress(lessonId: string, courseId: string): UseLessonProgressReturn {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState<LessonProgress | null>(null)
  const [courseProgress, setCourseProgress] = useState<Map<string, LessonProgress>>(new Map())

  const supabase = createClient()

  // Check auth and fetch progress
  useEffect(() => {
    const init = async () => {
      setIsLoading(true)

      // Get current user
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      setUser(currentUser)

      if (currentUser) {
        // Fetch progress from database
        const { data: progressDataRaw } = await supabase
          .from('lesson_progress')
          .select('*')
          .eq('user_id', currentUser.id)
          .eq('lesson_id', lessonId)
          .single()

        const progressData = progressDataRaw as LessonProgressRow | null
        if (progressData) {
          setProgress({
            lessonId: progressData.lesson_id,
            courseId: progressData.course_id,
            completed: progressData.completed,
            completedAt: progressData.completed_at,
            quizScore: progressData.quiz_score,
            lastAccessedAt: progressData.last_accessed_at,
          })
        }

        // Fetch all progress for this course
        const { data: courseProgressDataRaw } = await supabase
          .from('lesson_progress')
          .select('*')
          .eq('user_id', currentUser.id)
          .eq('course_id', courseId)

        const courseProgressData = courseProgressDataRaw as LessonProgressRow[] | null
        if (courseProgressData) {
          const progressMap = new Map<string, LessonProgress>()
          courseProgressData.forEach(p => {
            progressMap.set(p.lesson_id, {
              lessonId: p.lesson_id,
              courseId: p.course_id,
              completed: p.completed,
              completedAt: p.completed_at,
              quizScore: p.quiz_score,
              lastAccessedAt: p.last_accessed_at,
            })
          })
          setCourseProgress(progressMap)
        }
      } else {
        // Get from localStorage for guests
        const guestProgress = getGuestProgress()
        const lessonProgress = guestProgress[lessonId]
        if (lessonProgress) {
          setProgress(lessonProgress)
        }

        // Get all course progress for guest
        const progressMap = new Map<string, LessonProgress>()
        Object.values(guestProgress).forEach(p => {
          if (p.courseId === courseId) {
            progressMap.set(p.lessonId, p)
          }
        })
        setCourseProgress(progressMap)
      }

      setIsLoading(false)
    }

    init()

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [lessonId, courseId, supabase])

  // Mark lesson as complete
  const markComplete = useCallback(async (quizScore?: number) => {
    const now = new Date().toISOString()

    const newProgress: LessonProgress = {
      lessonId,
      courseId,
      completed: true,
      completedAt: now,
      quizScore: quizScore ?? null,
      lastAccessedAt: now,
    }

    if (user) {
      // Save to database
      const upsertData = {
        user_id: user.id,
        lesson_id: lessonId,
        course_id: courseId,
        completed: true,
        completed_at: now,
        quiz_score: quizScore ?? null,
        last_accessed_at: now,
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.from('lesson_progress') as any)
        .upsert(upsertData, {
          onConflict: 'user_id,lesson_id'
        })

      if (!error) {
        setProgress(newProgress)
        setCourseProgress(prev => new Map(prev).set(lessonId, newProgress))
      }
    } else {
      // Save to localStorage for guests
      const guestProgress = getGuestProgress()
      guestProgress[lessonId] = newProgress
      saveGuestProgress(guestProgress)
      setProgress(newProgress)
      setCourseProgress(prev => new Map(prev).set(lessonId, newProgress))
    }
  }, [user, lessonId, courseId, supabase])

  // Update last accessed timestamp
  const updateLastAccessed = useCallback(async () => {
    const now = new Date().toISOString()

    if (user) {
      // Upsert to database
      const upsertData = {
        user_id: user.id,
        lesson_id: lessonId,
        course_id: courseId,
        last_accessed_at: now,
        completed: progress?.completed ?? false,
        completed_at: progress?.completedAt ?? null,
        quiz_score: progress?.quizScore ?? null,
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from('lesson_progress') as any)
        .upsert(upsertData, {
          onConflict: 'user_id,lesson_id'
        })
    } else {
      // Update localStorage for guests
      const guestProgress = getGuestProgress()
      guestProgress[lessonId] = {
        ...guestProgress[lessonId],
        lessonId,
        courseId,
        completed: progress?.completed ?? false,
        completedAt: progress?.completedAt ?? null,
        quizScore: progress?.quizScore ?? null,
        lastAccessedAt: now,
      }
      saveGuestProgress(guestProgress)
    }
  }, [user, lessonId, courseId, progress, supabase])

  // Get list of completed lesson IDs for a course
  const getCompletedLessons = useCallback((targetCourseId: string): string[] => {
    const completed: string[] = []
    courseProgress.forEach((p, id) => {
      if (p.courseId === targetCourseId && p.completed) {
        completed.push(id)
      }
    })
    return completed
  }, [courseProgress])

  return {
    user,
    isLoading,
    progress,
    courseProgress,
    isCompleted: progress?.completed ?? false,
    markComplete,
    updateLastAccessed,
    getCompletedLessons,
  }
}

// Hook to get course progress for course cards
export function useCourseProgress(courseId: string) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [completedCount, setCompletedCount] = useState(0)
  const [totalLessons, setTotalLessons] = useState(0)
  const [nextLessonId, setNextLessonId] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    const init = async () => {
      setIsLoading(true)

      // Get current user
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      setUser(currentUser)

      // Get total lessons for this course
      const { count: lessonCount } = await supabase
        .from('lessons')
        .select('*', { count: 'exact', head: true })
        .eq('course_id', courseId)
        .eq('is_published', true)

      setTotalLessons(lessonCount || 0)

      if (currentUser) {
        // Get completed lessons count
        const { count: completed } = await supabase
          .from('lesson_progress')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', currentUser.id)
          .eq('course_id', courseId)
          .eq('completed', true)

        setCompletedCount(completed || 0)

        // Find next incomplete lesson
        const { data: allLessonsRaw } = await supabase
          .from('lessons')
          .select('id, order_index')
          .eq('course_id', courseId)
          .eq('is_published', true)
          .order('order_index', { ascending: true })

        const { data: completedLessonsRaw } = await supabase
          .from('lesson_progress')
          .select('lesson_id')
          .eq('user_id', currentUser.id)
          .eq('course_id', courseId)
          .eq('completed', true)

        const allLessons = allLessonsRaw as LessonRow[] | null
        const completedLessons = completedLessonsRaw as CompletedLessonRow[] | null
        const completedIds = new Set(completedLessons?.map(l => l.lesson_id) || [])

        const nextLesson = allLessons?.find(l => !completedIds.has(l.id))
        setNextLessonId(nextLesson?.id || allLessons?.[0]?.id || null)
      } else {
        // Check localStorage for guests
        const guestProgress = getGuestProgress()
        const courseCompletedCount = Object.values(guestProgress)
          .filter(p => p.courseId === courseId && p.completed)
          .length

        setCompletedCount(courseCompletedCount)

        // Get first lesson as next for guests
        const { data: firstLessonRaw } = await supabase
          .from('lessons')
          .select('id')
          .eq('course_id', courseId)
          .eq('is_published', true)
          .order('order_index', { ascending: true })
          .limit(1)
          .single()

        const firstLesson = firstLessonRaw as { id: string } | null
        setNextLessonId(firstLesson?.id || null)
      }

      setIsLoading(false)
    }

    init()
  }, [courseId, supabase])

  const progressPercentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0

  return {
    user,
    isLoading,
    completedCount,
    totalLessons,
    progressPercentage,
    nextLessonId,
    hasStarted: completedCount > 0,
  }
}
