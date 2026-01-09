import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, DollarSign, TrendingUp, GraduationCap, Briefcase, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { InterviewQuestionCard } from '@/components/careers/interview-question-card'
import { CareerCard } from '@/components/careers/career-card'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

interface CareerDetailPageProps {
  params: Promise<{ slug: string }>
}

function formatSalary(min?: number, max?: number): string {
  if (!min && !max) return 'Varies by experience and location'
  const formatK = (n: number) => `$${Math.round(n / 1000).toLocaleString()}K`
  if (min && max) return `${formatK(min)} - ${formatK(max)} per year`
  if (min) return `From ${formatK(min)} per year`
  return `Up to ${formatK(max!)} per year`
}

export default async function CareerDetailPage({ params }: CareerDetailPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  // Fetch the career
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: careerData, error } = await (supabase as any)
    .from('careers')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !careerData) {
    notFound()
  }

  const career = careerData as {
    id: string
    title: string
    slug: string
    category: string
    description?: string
    education_required?: string
    skills_needed?: string
    salary_min?: number
    salary_max?: number
    job_outlook?: string
  }

  // Fetch interview questions for this career
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: questionsData } = await (supabase as any)
    .from('interview_questions')
    .select('*')
    .eq('career_id', career.id)
    .order('difficulty')
    .limit(10)

  const questions = (questionsData || []) as Array<{
    id: string
    question: string
    sample_answer?: string
    tips?: string
    category: string
    difficulty: string
  }>

  // Fetch related careers (same category)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: relatedCareersData } = await (supabase as any)
    .from('careers')
    .select('*')
    .eq('category', career.category)
    .neq('id', career.id)
    .limit(4)

  const relatedCareers = (relatedCareersData || []) as Array<{
    id: string
    title: string
    slug: string
    category: string
    description?: string
    salary_min?: number
    salary_max?: number
    job_outlook?: string
  }>

  const categoryColors: Record<string, string> = {
    technology: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    healthcare: 'bg-green-500/20 text-green-400 border-green-500/30',
    business: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    education: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    engineering: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    creative: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    legal: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  }
  const colorClass = categoryColors[career.category?.toLowerCase()] || 'bg-slate-500/20 text-slate-400 border-slate-500/30'

  return (
    <div className="min-h-screen flex flex-col bg-slate-900">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-800 to-slate-900 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <Link
            href="/careers"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Careers
          </Link>

          <Badge variant="outline" className={`capitalize ${colorClass} mb-4`}>
            {career.category}
          </Badge>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {career.title}
          </h1>

          <div className="flex flex-wrap gap-6 text-lg">
            <div className="flex items-center gap-2 text-slate-300">
              <DollarSign className="w-5 h-5 text-green-400" />
              <span>{formatSalary(career.salary_min, career.salary_max)}</span>
            </div>
            {career.job_outlook && (
              <div className="flex items-center gap-2 text-green-400">
                <TrendingUp className="w-5 h-5" />
                <span>{career.job_outlook} Growth</span>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
        {/* Overview */}
        {career.description && (
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-primary" />
              Overview
            </h2>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                {career.description}
              </p>
            </div>
          </section>
        )}

        {/* Education Required */}
        {career.education_required && (
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-primary" />
              Education Required
            </h2>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                {career.education_required}
              </p>
            </div>
          </section>
        )}

        {/* Skills Needed */}
        {career.skills_needed && (
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              Skills Needed
            </h2>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <div className="flex flex-wrap gap-2">
                {career.skills_needed.split(',').map((skill: string, index: number) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1">
                    {skill.trim()}
                  </Badge>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Interview Questions */}
        {questions && questions.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-primary" />
                Interview Questions
              </h2>
              <Link
                href="/careers/interview-prep"
                className="text-primary hover:underline text-sm"
              >
                View All Questions
              </Link>
            </div>
            <div className="space-y-4">
              {questions.map((question) => (
                <InterviewQuestionCard key={question.id} question={question} />
              ))}
            </div>
          </section>
        )}

        {/* Related Careers */}
        {relatedCareers && relatedCareers.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">Related Careers</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {relatedCareers.map((related) => (
                <CareerCard key={related.id} career={related} />
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
