'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  DollarSign,
  GraduationCap,
  BookOpen,
  Sparkles,
  CheckCircle,
  Star,
  Briefcase,
  Heart,
  Lightbulb,
  Rocket
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Career {
  id: string
  title: string
  slug: string
  description: string
  category: string
  what_they_do: string
  why_its_cool: string
  salary_info: string
  education_needed: string
  icon: string
  is_featured: boolean
  is_published: boolean
  subjects_to_focus: string[]
  good_for_people_who: string[]
  skills_needed: string[]
  fun_facts: string[]
  related_careers: string[]
  day_in_life: string
}

interface RelatedCareer {
  id: string
  title: string
  slug: string
  icon: string
  category: string
}

export default function MiddleSchoolCareerDetailPage() {
  const params = useParams()
  const slug = params?.slug as string
  const [career, setCareer] = useState<Career | null>(null)
  const [relatedCareers, setRelatedCareers] = useState<RelatedCareer[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    async function fetchData() {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sb = supabase as any

      const { data: careerData } = await sb
        .from('middle_school_careers')
        .select('*')
        .eq('slug', slug)
        .maybeSingle()

      setCareer(careerData)

      // Fetch related careers
      if (careerData?.related_careers?.length > 0) {
        const { data: related } = await sb
          .from('middle_school_careers')
          .select('id, title, slug, icon, category')
          .in('slug', careerData.related_careers)
          .limit(3)

        setRelatedCareers(related || [])
      }

      setLoading(false)
    }

    if (slug) fetchData()
  }, [slug, supabase])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading career details...</p>
        </div>
      </div>
    )
  }

  if (!career) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Rocket className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Career Not Found</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">This career doesn&apos;t exist or has been removed.</p>
          <Link href="/middle-school/careers" className="text-purple-600 dark:text-purple-400 hover:underline">
            Back to Careers
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900">
      {/* Hero */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/middle-school/careers"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Careers
          </Link>

          <div className="flex items-start gap-4">
            <div className="text-5xl">{career.icon}</div>
            <div>
              <span className="text-sm text-white/80 font-medium capitalize">{career.category}</span>
              <h1 className="text-3xl md:text-4xl font-bold text-white">{career.title}</h1>
              <p className="text-white/90 mt-2">{career.description}</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <DollarSign className="w-5 h-5 text-white/80 mb-2" />
              <p className="text-xs text-white/70">Salary Info</p>
              <p className="text-white font-semibold">{career.salary_info}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <GraduationCap className="w-5 h-5 text-white/80 mb-2" />
              <p className="text-xs text-white/70">Education</p>
              <p className="text-white font-semibold text-sm">{career.education_needed}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-4 py-8">
        {/* What They Do */}
        {career.what_they_do && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              What Does a {career.title} Do?
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{career.what_they_do}</p>
            </div>
          </div>
        )}

        {/* Day in the Life */}
        {career.day_in_life && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />
              A Day in the Life
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{career.day_in_life}</p>
            </div>
          </div>
        )}

        {/* Why It's Cool */}
        {career.why_its_cool && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />
              Why It&apos;s Awesome
            </h2>
            <div className="bg-gradient-to-r from-purple-500/10 dark:from-purple-600/20 to-pink-500/10 dark:to-pink-600/20 border border-purple-500/20 dark:border-purple-500/30 rounded-xl p-6">
              <p className="text-gray-700 dark:text-gray-200 leading-relaxed">{career.why_its_cool}</p>
            </div>
          </div>
        )}

        {/* Good For People Who */}
        {career.good_for_people_who?.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-500 dark:text-pink-400" />
              This Career is Great if You...
            </h2>
            <div className="grid md:grid-cols-2 gap-3">
              {career.good_for_people_who.map((trait: string, index: number) => (
                <div key={index} className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                  <CheckCircle className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300 capitalize">{trait}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Subjects to Focus On */}
        {career.subjects_to_focus?.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-500 dark:text-blue-400" />
              Subjects to Focus On in School
            </h2>
            <div className="flex flex-wrap gap-2">
              {career.subjects_to_focus.map((subject: string, index: number) => (
                <span key={index} className="px-4 py-2 bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-full font-medium">
                  {subject}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Skills Needed */}
        {career.skills_needed?.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Skills You&apos;ll Need</h2>
            <div className="flex flex-wrap gap-2">
              {career.skills_needed.map((skill: string, index: number) => (
                <span key={index} className="px-4 py-2 bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-full font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Fun Facts */}
        {career.fun_facts?.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />
              Fun Facts
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <ul className="space-y-3">
                {career.fun_facts.map((fact: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-yellow-500/10 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 rounded-full flex items-center justify-center text-sm shrink-0 font-medium">
                      {index + 1}
                    </span>
                    <span className="text-gray-700 dark:text-gray-300">{fact}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Related Careers */}
        {relatedCareers.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Related Careers</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {relatedCareers.map(related => (
                <Link
                  key={related.id}
                  href={`/middle-school/careers/${related.slug}`}
                  className="bg-white dark:bg-gray-800 rounded-xl p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-3 shadow-sm"
                >
                  <span className="text-2xl">{related.icon}</span>
                  <span className="text-slate-900 dark:text-white font-medium">{related.title}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-center">
          <h3 className="text-xl font-bold text-white mb-2">Ready to Explore More?</h3>
          <p className="text-purple-100 mb-4">Check out more awesome careers you might love!</p>
          <Link
            href="/middle-school/careers"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Rocket className="w-5 h-5" />
            Explore More Careers
          </Link>
        </div>
      </section>
    </div>
  )
}
