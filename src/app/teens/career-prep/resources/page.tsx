import Link from 'next/link'
import { ArrowLeft, Compass, FileText, GraduationCap } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

const categoryIcons: Record<string, React.ReactNode> = {
  'career exploration': <Compass className="w-6 h-6" />,
  'job prep': <FileText className="w-6 h-6" />,
  'college prep': <GraduationCap className="w-6 h-6" />,
}

const categoryColors: Record<string, string> = {
  'career exploration': 'from-blue-500 to-cyan-500',
  'job prep': 'from-green-500 to-emerald-500',
  'college prep': 'from-purple-500 to-pink-500',
}

interface Resource {
  id: string
  title: string
  slug: string
  description?: string
  content: string
  category: string
  order_index: number
}

export default async function TeenCareerResourcesPage() {
  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: resourcesData } = await (supabase as any)
    .from('high_school_career_prep')
    .select('*')
    .order('category')
    .order('order_index')

  const resources = (resourcesData || []) as Resource[]

  // Group resources by category
  const grouped = resources.reduce((acc, resource) => {
    const cat = resource.category || 'Other'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(resource)
    return acc
  }, {} as Record<string, Resource[]>)

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-slate-100 dark:from-slate-800 to-slate-50 dark:to-slate-900 pt-24 pb-12">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <Link
              href="/teens/career-prep"
              className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Career Exploration
            </Link>

            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Career Prep Resources
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Guides and tips to help you explore careers, prepare for jobs, and plan for college.
            </p>
          </div>
        </section>

        {/* Resources by Category */}
        <section className="max-w-4xl mx-auto px-4 py-12">
          {grouped && Object.entries(grouped).map(([category, items]) => (
            <div key={category} className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${categoryColors[category.toLowerCase()] || 'from-slate-500 to-slate-600'} flex items-center justify-center text-white`}>
                  {categoryIcons[category.toLowerCase()] || <FileText className="w-5 h-5" />}
                </div>
                {category}
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {items?.map((resource) => (
                  <Link
                    key={resource.id}
                    href={`/teens/career-prep/${resource.slug}`}
                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 hover:ring-2 hover:ring-green-500/50 transition-all group shadow-sm"
                  >
                    <h3 className="font-semibold text-slate-900 dark:text-white text-lg mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                      {resource.title}
                    </h3>
                    {resource.description && (
                      <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2">
                        {resource.description}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {(!grouped || Object.keys(grouped).length === 0) && (
            <div className="text-center py-12">
              <p className="text-slate-500 dark:text-slate-400">No resources available yet. Check back soon!</p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}
