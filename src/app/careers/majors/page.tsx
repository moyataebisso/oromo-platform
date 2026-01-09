import Link from 'next/link'
import { Search, ArrowLeft, GraduationCap } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Input } from '@/components/ui/input'
import { MajorCard } from '@/components/careers/major-card'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

const categories = [
  { slug: 'all', name: 'All' },
  { slug: 'stem', name: 'STEM' },
  { slug: 'business', name: 'Business' },
  { slug: 'healthcare', name: 'Healthcare' },
  { slug: 'arts & humanities', name: 'Arts & Humanities' },
]

interface MajorsPageProps {
  searchParams: Promise<{ category?: string; q?: string }>
}

interface Major {
  id: string
  name: string
  slug: string
  category: string
  description?: string
  career_paths?: string
  salary_range?: string
  job_outlook?: string
}

export default async function MajorsPage({ searchParams }: MajorsPageProps) {
  const params = await searchParams
  const supabase = await createClient()
  const activeCategory = params.category || 'all'
  const searchQuery = params.q || ''

  // Build query
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query = (supabase as any)
    .from('majors')
    .select('*')
    .order('name')

  if (activeCategory !== 'all') {
    query = query.eq('category', activeCategory)
  }

  if (searchQuery) {
    query = query.ilike('name', `%${searchQuery}%`)
  }

  const { data: majorsData } = await query
  const majors = (majorsData || []) as Major[]

  return (
    <div className="min-h-screen flex flex-col bg-slate-900">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-slate-800 to-slate-900 pt-24 pb-12">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <Link
              href="/careers"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Careers
            </Link>

            <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <GraduationCap className="w-8 h-8 text-primary" />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              College Majors Guide
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Explore different majors, understand career paths, and make informed decisions about your education.
            </p>
          </div>
        </section>

        {/* Filters & Search */}
        <section className="bg-slate-800/50 border-y border-slate-700 sticky top-16 z-30 backdrop-blur-lg">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={cat.slug === 'all' ? '/careers/majors' : `/careers/majors?category=${cat.slug}`}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      activeCategory === cat.slug
                        ? 'bg-primary text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
              <form className="relative md:ml-auto md:w-64" action="/careers/majors" method="GET">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  name="q"
                  placeholder="Search majors..."
                  defaultValue={searchQuery}
                  className="pl-10 bg-slate-700 border-slate-600"
                />
                {activeCategory !== 'all' && (
                  <input type="hidden" name="category" value={activeCategory} />
                )}
              </form>
            </div>
          </div>
        </section>

        {/* Majors Grid */}
        <section className="max-w-4xl mx-auto px-4 py-12">
          {majors && majors.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {majors.map((major) => (
                <MajorCard key={major.id} major={major} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-400 text-lg">No majors found.</p>
              <Link href="/careers/majors" className="text-primary hover:underline mt-2 inline-block">
                View all majors
              </Link>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}
