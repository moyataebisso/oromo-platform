import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { CourseFilters } from '@/components/academy/course-filters'
import { Course, Category } from '@/types/academy'

// Mock data - replace with Supabase fetch when connected
const mockCategories: Category[] = [
  { id: '1', name: 'Language', slug: 'language', description: 'Learn Oromo language' },
  { id: '2', name: 'History', slug: 'history', description: 'Oromo history and heritage' },
  { id: '3', name: 'Culture', slug: 'culture', description: 'Oromo culture and traditions' },
  { id: '4', name: 'Business', slug: 'business', description: 'Business and entrepreneurship' },
]

const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Introduction to Afaan Oromoo',
    slug: 'intro-afaan-oromoo',
    description: 'Learn the basics of Afaan Oromoo, the Oromo language spoken by over 40 million people.',
    thumbnail_url: null,
    category_id: '1',
    difficulty: 'beginner',
    is_published: true,
    created_at: new Date().toISOString(),
    category: { id: '1', name: 'Language', slug: 'language', description: null },
    lessons_count: 12,
  },
  {
    id: '2',
    title: 'Oromo History: From Ancient Times',
    slug: 'oromo-history-ancient',
    description: 'Explore the rich history of the Oromo people from ancient times to modern day.',
    thumbnail_url: null,
    category_id: '2',
    difficulty: 'intermediate',
    is_published: true,
    created_at: new Date().toISOString(),
    category: { id: '2', name: 'History', slug: 'history', description: null },
    lessons_count: 8,
  },
  {
    id: '3',
    title: 'Gadaa System: Democratic Governance',
    slug: 'gadaa-system',
    description: 'Learn about the Gadaa system, the traditional democratic governance system of the Oromo people.',
    thumbnail_url: null,
    category_id: '3',
    difficulty: 'advanced',
    is_published: true,
    created_at: new Date().toISOString(),
    category: { id: '3', name: 'Culture', slug: 'culture', description: null },
    lessons_count: 10,
  },
  {
    id: '4',
    title: 'Intermediate Afaan Oromoo',
    slug: 'intermediate-afaan-oromoo',
    description: 'Build on your language skills with intermediate Afaan Oromoo lessons.',
    thumbnail_url: null,
    category_id: '1',
    difficulty: 'intermediate',
    is_published: true,
    created_at: new Date().toISOString(),
    category: { id: '1', name: 'Language', slug: 'language', description: null },
    lessons_count: 15,
  },
  {
    id: '5',
    title: 'Oromo Cultural Traditions',
    slug: 'cultural-traditions',
    description: 'Discover the beautiful cultural traditions, ceremonies, and customs of the Oromo people.',
    thumbnail_url: null,
    category_id: '3',
    difficulty: 'beginner',
    is_published: true,
    created_at: new Date().toISOString(),
    category: { id: '3', name: 'Culture', slug: 'culture', description: null },
    lessons_count: 6,
  },
  {
    id: '6',
    title: 'Business Oromo: Professional Communication',
    slug: 'business-oromo',
    description: 'Learn professional communication skills in Afaan Oromoo for business settings.',
    thumbnail_url: null,
    category_id: '4',
    difficulty: 'advanced',
    is_published: true,
    created_at: new Date().toISOString(),
    category: { id: '4', name: 'Business', slug: 'business', description: null },
    lessons_count: 9,
  },
]

export default function AcademyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <CourseFilters courses={mockCourses} categories={mockCategories} />
      </main>
      <Footer />
    </div>
  )
}
