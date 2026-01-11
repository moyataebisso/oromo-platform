'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Search,
  ArrowLeft,
  GraduationCap,
  DollarSign,
  TrendingUp
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
  is_published: boolean
}

interface Category {
  id: string
  name: string
  slug: string
  icon: string
  order_index: number
}

export default function CollegeMajorsPage() {
  const [majors, setMajors] = useState<Major[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    async function fetchData() {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sb = supabase as any

      // Fetch categories
      const { data: catData } = await sb
        .from('major_categories')
        .select('*')
        .order('order_index')

      setCategories(catData || [])

      // Fetch majors
      const { data: majorData } = await sb
        .from('college_majors')
        .select('*')
        .eq('is_published', true)
        .order('is_popular', { ascending: false })
        .order('title')

      setMajors(majorData || [])
      setLoading(false)
    }

    fetchData()
  }, [supabase])

  // Filter majors
  const filteredMajors = majors.filter(major => {
    const matchesCategory = selectedCategory === 'all' || major.category === selectedCategory
    const matchesSearch = searchQuery === '' ||
      major.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      major.description?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'stem': 'bg-blue-500/20 text-blue-400',
      'business': 'bg-green-500/20 text-green-400',
      'healthcare': 'bg-red-500/20 text-red-400',
      'arts-humanities': 'bg-purple-500/20 text-purple-400',
      'social-sciences': 'bg-orange-500/20 text-orange-400',
    }
    return colors[category?.toLowerCase()] || 'bg-gray-500/20 text-gray-400'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading majors...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-gray-900">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-slate-100 dark:from-gray-800 to-slate-50 dark:to-gray-900 pt-24 pb-12 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <Link
              href="/teens/career-prep"
              className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Careers
            </Link>

            <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>

            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">College Majors Guide</h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
              Explore different majors, understand career paths, and make informed decisions about your education.
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="max-w-6xl mx-auto px-4 py-8">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              All Majors
            </button>
            {categories.map(cat => (
              <button
                key={cat.slug}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === cat.slug
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search majors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-96 pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-slate-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Results count */}
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Showing {filteredMajors.length} majors
            {selectedCategory !== 'all' && ` in ${selectedCategory.replace('-', ' & ')}`}
          </p>

          {/* Majors Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredMajors.map(major => (
              <Link
                key={major.id}
                href={`/teens/career-prep/college-majors/${major.slug}`}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-500 transition-all p-6 group shadow-sm hover:shadow-md"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="text-3xl">{major.icon}</div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getCategoryColor(major.category)}`}>
                    {major.category?.replace('-', ' & ')}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                  {major.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                  {major.description}
                </p>

                {/* Stats */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-slate-700 dark:text-gray-300">
                    <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span>{major.avg_starting_salary}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 dark:text-gray-300">
                    <TrendingUp className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                    <span>{major.job_outlook}</span>
                  </div>
                </div>

                {/* Career paths preview */}
                {major.career_paths && major.career_paths.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-500 mb-2">Career paths:</p>
                    <div className="flex flex-wrap gap-1">
                      {major.career_paths.slice(0, 3).map((career, i) => (
                        <span key={i} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
                          {career}
                        </span>
                      ))}
                      {major.career_paths.length > 3 && (
                        <span className="text-xs text-gray-500 dark:text-gray-500">+{major.career_paths.length - 3} more</span>
                      )}
                    </div>
                  </div>
                )}
              </Link>
            ))}
          </div>

          {filteredMajors.length === 0 && (
            <div className="text-center py-12">
              <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 mb-4">No majors found matching your criteria.</p>
              <button
                onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
                className="text-green-600 dark:text-green-400 hover:underline"
              >
                View all majors
              </button>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}
