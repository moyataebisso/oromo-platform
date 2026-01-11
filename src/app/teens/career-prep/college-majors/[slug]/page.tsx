'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  GraduationCap,
  DollarSign,
  TrendingUp,
  BookOpen,
  Briefcase,
  CheckCircle,
  Heart,
  Sparkles
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

interface Major {
  id: string
  title: string
  slug: string
  description: string
  category: string
  what_you_learn: string
  career_paths: string[]
  avg_starting_salary: string
  job_outlook: string
  icon: string
  is_popular: boolean
  good_if_you_like: string[]
  typical_courses: string[]
  skills_gained: string[]
}

export default function MajorDetailPage() {
  const params = useParams()
  const slug = params?.slug as string
  const [major, setMajor] = useState<Major | null>(null)
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    async function fetchData() {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sb = supabase as any

      const { data } = await sb
        .from('college_majors')
        .select('*')
        .eq('slug', slug)
        .maybeSingle()

      setMajor(data)
      setLoading(false)
    }

    if (slug) fetchData()
  }, [slug, supabase])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading major details...</p>
        </div>
      </div>
    )
  }

  if (!major) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-gray-900 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <GraduationCap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Major Not Found</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-6">This major doesn&apos;t exist or has been removed.</p>
            <Link href="/teens/career-prep/college-majors" className="text-green-600 dark:text-green-400 hover:underline">
              Back to Majors
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-gray-900">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-slate-100 dark:from-gray-800 to-slate-50 dark:to-gray-900 pt-24 pb-8 px-4">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/teens/career-prep/college-majors"
              className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Majors
            </Link>

            <div className="flex items-start gap-4">
              <div className="text-5xl">{major.icon}</div>
              <div>
                <span className="text-sm text-green-600 dark:text-green-400 font-medium capitalize">
                  {major.category?.replace('-', ' & ')}
                </span>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">{major.title}</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">{major.description}</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400 mb-2" />
                <p className="text-xs text-gray-500 dark:text-gray-400">Starting Salary</p>
                <p className="text-slate-900 dark:text-white font-semibold">{major.avg_starting_salary}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                <TrendingUp className="w-5 h-5 text-blue-500 dark:text-blue-400 mb-2" />
                <p className="text-xs text-gray-500 dark:text-gray-400">Job Outlook</p>
                <p className="text-slate-900 dark:text-white font-semibold">{major.job_outlook}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                <GraduationCap className="w-5 h-5 text-purple-500 dark:text-purple-400 mb-2" />
                <p className="text-xs text-gray-500 dark:text-gray-400">Category</p>
                <p className="text-slate-900 dark:text-white font-semibold capitalize">{major.category?.replace('-', ' & ')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="max-w-4xl mx-auto px-4 py-8">
          {/* What You'll Learn */}
          {major.what_you_learn && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-green-600 dark:text-green-400" />
                What You&apos;ll Learn
              </h2>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{major.what_you_learn}</p>
              </div>
            </div>
          )}

          {/* This Major is Great If You Like */}
          {major.good_if_you_like?.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-500 dark:text-pink-400" />
                This Major is Great If You Like...
              </h2>
              <div className="flex flex-wrap gap-2">
                {major.good_if_you_like.map((item: string, i: number) => (
                  <span key={i} className="px-4 py-2 bg-pink-500/10 dark:bg-pink-500/20 text-pink-600 dark:text-pink-400 rounded-full capitalize font-medium">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Typical Courses */}
          {major.typical_courses?.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                Typical Courses
              </h2>
              <div className="grid md:grid-cols-2 gap-2">
                {major.typical_courses.map((course: string, i: number) => (
                  <div key={i} className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{course}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills You'll Gain */}
          {major.skills_gained?.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Skills You&apos;ll Gain</h2>
              <div className="flex flex-wrap gap-2">
                {major.skills_gained.map((skill: string, i: number) => (
                  <span key={i} className="px-4 py-2 bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-full font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Career Paths */}
          {major.career_paths?.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-orange-500 dark:text-orange-400" />
                Career Paths
              </h2>
              <div className="grid md:grid-cols-2 gap-3">
                {major.career_paths.map((career: string, i: number) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
                    <span className="text-slate-900 dark:text-white">{career}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-center mt-8">
            <h3 className="text-xl font-bold text-white mb-2">Explore Related Careers</h3>
            <p className="text-green-100 mb-4">See careers that match this major!</p>
            <Link
              href="/teens/career-prep"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-green-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Sparkles className="w-5 h-5" />
              Explore Careers
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
