import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, GraduationCap, Briefcase, DollarSign, TrendingUp, Lightbulb } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { MajorCard } from '@/components/careers/major-card'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

interface MajorDetailPageProps {
  params: Promise<{ slug: string }>
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

interface Advice {
  id: string
  title?: string
  content: string
  author?: string
  order_index?: number
}

export default async function MajorDetailPage({ params }: MajorDetailPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  // Fetch the major
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: majorData, error } = await (supabase as any)
    .from('majors')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !majorData) {
    notFound()
  }

  const major = majorData as Major

  // Fetch advice for this major
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: adviceData } = await (supabase as any)
    .from('major_advice')
    .select('*')
    .eq('major_id', major.id)
    .order('order_index')

  const advice = (adviceData || []) as Advice[]

  // Fetch related majors (same category)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: relatedMajorsData } = await (supabase as any)
    .from('majors')
    .select('*')
    .eq('category', major.category)
    .neq('id', major.id)
    .limit(4)

  const relatedMajors = (relatedMajorsData || []) as Major[]

  const categoryColors: Record<string, string> = {
    stem: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    business: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    healthcare: 'bg-green-500/20 text-green-400 border-green-500/30',
    'arts & humanities': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  }
  const colorClass = categoryColors[major.category?.toLowerCase()] || 'bg-slate-500/20 text-slate-400 border-slate-500/30'

  return (
    <div className="min-h-screen flex flex-col bg-slate-900">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-slate-800 to-slate-900 pt-24 pb-12">
          <div className="max-w-4xl mx-auto px-4">
            <Link
              href="/careers/majors"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Majors
            </Link>

            <Badge variant="outline" className={`capitalize ${colorClass} mb-4`}>
              {major.category}
            </Badge>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {major.name}
            </h1>

            <div className="flex flex-wrap gap-6 text-lg">
              {major.salary_range && (
                <div className="flex items-center gap-2 text-slate-300">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  <span>{major.salary_range}</span>
                </div>
              )}
              {major.job_outlook && (
                <div className="flex items-center gap-2 text-green-400">
                  <TrendingUp className="w-5 h-5" />
                  <span>{major.job_outlook}</span>
                </div>
              )}
            </div>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
          {/* Description */}
          {major.description && (
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-primary" />
                About This Major
              </h2>
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {major.description}
                </p>
              </div>
            </section>
          )}

          {/* Career Paths */}
          {major.career_paths && (
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-primary" />
                Career Paths
              </h2>
              <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                <div className="flex flex-wrap gap-2">
                  {major.career_paths.split(',').map((path: string, index: number) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1">
                      {path.trim()}
                    </Badge>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Advice Section */}
          {advice && advice.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-amber-400" />
                Tips & Advice
              </h2>
              <div className="space-y-4">
                {advice.map((item) => (
                  <div
                    key={item.id}
                    className="bg-slate-800 border border-slate-700 rounded-xl p-6"
                  >
                    {item.title && (
                      <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                    )}
                    <div className="text-slate-300 leading-relaxed whitespace-pre-wrap prose prose-invert max-w-none">
                      {item.content}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Related Majors */}
          {relatedMajors && relatedMajors.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-white mb-6">Related Majors</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {relatedMajors.map((related) => (
                  <MajorCard key={related.id} major={related} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
