import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { CourseFilters } from '@/components/academy/course-filters'
import { createClient } from '@/lib/supabase/server'
import { Course, Category } from '@/types/academy'

// Force dynamic rendering to avoid caching issues
export const dynamic = 'force-dynamic'

export default async function AcademyPage() {
  const supabase = await createClient()

  // Fetch courses (without category join - FK not set up in DB)
  const { data: coursesData, error: coursesError } = await supabase
    .from('courses')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  if (coursesError) {
    console.error('Error fetching courses:', coursesError)
  }

  // Fetch categories
  const { data: categoriesData } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true })

  const courses = (coursesData || []) as Course[]
  const categories = (categoriesData || []) as Category[]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <CourseFilters courses={courses} categories={categories} />
      </main>
      <Footer />
    </div>
  )
}
