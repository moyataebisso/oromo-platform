import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

interface ResourceDetailPageProps {
  params: Promise<{ slug: string }>
}

interface Resource {
  id: string
  title: string
  slug: string
  content: string
  category: string
  order_index: number
}

export default async function ResourceDetailPage({ params }: ResourceDetailPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  // Fetch the resource
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: resourceData, error } = await (supabase as any)
    .from('high_school_career_prep')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !resourceData) {
    notFound()
  }

  const resource = resourceData as Resource

  // Fetch all resources for navigation
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: allResourcesData } = await (supabase as any)
    .from('high_school_career_prep')
    .select('id, slug, title, category, order_index')
    .eq('category', resource.category)
    .order('order_index')

  const allResources = (allResourcesData || []) as Resource[]

  // Find previous and next
  const currentIndex = allResources.findIndex(r => r.id === resource.id)
  const prevResource = currentIndex > 0 ? allResources[currentIndex - 1] : null
  const nextResource = currentIndex < allResources.length - 1 ? allResources[currentIndex + 1] : null

  return (
    <div className="min-h-screen flex flex-col bg-slate-900">
      <Header />

      <main className="flex-1">
        {/* Header */}
        <section className="bg-gradient-to-b from-slate-800 to-slate-900 pt-24 pb-12">
          <div className="max-w-3xl mx-auto px-4">
            <Link
              href="/teens/career-prep"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Career Prep
            </Link>

            <p className="text-primary font-medium mb-2">{resource.category}</p>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              {resource.title}
            </h1>
          </div>
        </section>

        {/* Content */}
        <article className="max-w-3xl mx-auto px-4 py-12">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 md:p-8">
            <div className="prose prose-invert prose-lg max-w-none">
              {resource.content.split('\n').map((paragraph: string, index: number) => {
                if (paragraph.startsWith('# ')) {
                  return <h2 key={index} className="text-2xl font-bold text-white mt-8 mb-4">{paragraph.slice(2)}</h2>
                }
                if (paragraph.startsWith('## ')) {
                  return <h3 key={index} className="text-xl font-semibold text-white mt-6 mb-3">{paragraph.slice(3)}</h3>
                }
                if (paragraph.startsWith('### ')) {
                  return <h4 key={index} className="text-lg font-semibold text-white mt-4 mb-2">{paragraph.slice(4)}</h4>
                }
                if (paragraph.startsWith('- ')) {
                  return (
                    <li key={index} className="text-slate-300 ml-4">
                      {paragraph.slice(2)}
                    </li>
                  )
                }
                if (paragraph.startsWith('* ')) {
                  return (
                    <li key={index} className="text-slate-300 ml-4">
                      {paragraph.slice(2)}
                    </li>
                  )
                }
                if (paragraph.match(/^\d+\. /)) {
                  return (
                    <li key={index} className="text-slate-300 ml-4 list-decimal">
                      {paragraph.replace(/^\d+\. /, '')}
                    </li>
                  )
                }
                if (paragraph.startsWith('>')) {
                  return (
                    <blockquote key={index} className="border-l-4 border-primary pl-4 italic text-slate-400">
                      {paragraph.slice(1).trim()}
                    </blockquote>
                  )
                }
                if (paragraph.trim()) {
                  return <p key={index} className="text-slate-300 mb-4 leading-relaxed">{paragraph}</p>
                }
                return null
              })}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-8 border-t border-slate-800">
            {prevResource ? (
              <Link href={`/teens/career-prep/${prevResource.slug}`}>
                <Button variant="outline" className="gap-2">
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Previous:</span>
                  <span className="max-w-32 truncate">{prevResource.title}</span>
                </Button>
              </Link>
            ) : (
              <div />
            )}

            {nextResource ? (
              <Link href={`/teens/career-prep/${nextResource.slug}`}>
                <Button variant="outline" className="gap-2">
                  <span className="max-w-32 truncate">{nextResource.title}</span>
                  <span className="hidden sm:inline">:Next</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            ) : (
              <Link href="/teens/career-prep">
                <Button className="gap-2">
                  Finish
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            )}
          </div>
        </article>
      </main>

      <Footer />
    </div>
  )
}
