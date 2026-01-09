import Link from 'next/link'
import { Search, Briefcase, TrendingUp, GraduationCap } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Input } from '@/components/ui/input'
import { CareerCard } from '@/components/careers/career-card'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

const categories = [
  { slug: 'all', name: 'All' },
  { slug: 'technology', name: 'Technology' },
  { slug: 'healthcare', name: 'Healthcare' },
  { slug: 'business', name: 'Business' },
  { slug: 'education', name: 'Education' },
  { slug: 'engineering', name: 'Engineering' },
  { slug: 'creative', name: 'Creative' },
  { slug: 'legal', name: 'Legal' },
]

interface CareersPageProps {
  searchParams: Promise<{ category?: string; q?: string }>
}

interface Career {
  id: string
  title: string
  slug: string
  category: string
  description?: string
  salary_min?: number
  salary_max?: number
  job_outlook?: string
}

export default async function CareersPage({ searchParams }: CareersPageProps) {
  const params = await searchParams
  const supabase = await createClient()
  const activeCategory = params.category || 'all'
  const searchQuery = params.q || ''

  // Build query
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query = (supabase as any)
    .from('careers')
    .select('*')
    .order('title')

  if (activeCategory !== 'all') {
    query = query.eq('category', activeCategory)
  }

  if (searchQuery) {
    query = query.ilike('title', `%${searchQuery}%`)
  }

  const { data: careersData } = await query
  const careers = (careersData || []) as Career[]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/10 to-background pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
              Explore Careers
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Find your path to success. Discover careers that match your interests and skills.
            </p>

            {/* Quick Links */}
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/careers/interview-prep"
                className="flex items-center gap-2 px-6 py-3 bg-secondary hover:bg-secondary/80 rounded-xl transition-colors"
              >
                <Briefcase className="w-5 h-5 text-primary" />
                <span className="text-foreground font-medium">Interview Prep</span>
              </Link>
              <Link
                href="/careers/majors"
                className="flex items-center gap-2 px-6 py-3 bg-secondary hover:bg-secondary/80 rounded-xl transition-colors"
              >
                <GraduationCap className="w-5 h-5 text-primary" />
                <span className="text-foreground font-medium">College Majors</span>
              </Link>
              <Link
                href="/teens/career-prep"
                className="flex items-center gap-2 px-6 py-3 bg-secondary hover:bg-secondary/80 rounded-xl transition-colors"
              >
                <TrendingUp className="w-5 h-5 text-primary" />
                <span className="text-foreground font-medium">Teen Career Prep</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Filters & Search */}
        <section className="bg-card/50 border-y border-border sticky top-16 z-30 backdrop-blur-lg">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={cat.slug === 'all' ? '/careers' : `/careers?category=${cat.slug}`}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      activeCategory === cat.slug
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
              <form className="relative md:ml-auto md:w-64" action="/careers" method="GET">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  name="q"
                  placeholder="Search careers..."
                  defaultValue={searchQuery}
                  className="pl-10"
                />
                {activeCategory !== 'all' && (
                  <input type="hidden" name="category" value={activeCategory} />
                )}
              </form>
            </div>
          </div>
        </section>

        {/* Careers Grid */}
        <section className="max-w-7xl mx-auto px-4 py-12">
          {careers && careers.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {careers.map((career) => (
                <CareerCard key={career.id} career={career} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No careers found.</p>
              <Link href="/careers" className="text-primary hover:underline mt-2 inline-block">
                View all careers
              </Link>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}
