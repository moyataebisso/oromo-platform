'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Search,
  TrendingUp,
  Briefcase,
  GraduationCap,
  ArrowLeft,
  Sparkles,
  DollarSign,
  BookOpen,
  Compass,
  FileText
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

interface Career {
  id: string
  title: string
  slug: string
  description: string
  category: string
  what_they_do: string
  salary_range: string
  growth_outlook: string
  growth_percentage: string
  education_needed: string
  icon: string
  is_featured: boolean
  subjects_to_focus: string[]
  good_for_people_who: string[]
}

interface Category {
  id: string
  name: string
  slug: string
  icon: string
  order_index: number
}

export default function TeenCareersPage() {
  const [careers, setCareers] = useState<Career[]>([])
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
        .from('teen_career_categories')
        .select('*')
        .order('order_index')

      setCategories(catData || [])

      // Fetch careers
      const { data: careerData } = await sb
        .from('teen_careers')
        .select('*')
        .eq('is_published', true)
        .order('is_featured', { ascending: false })
        .order('title')

      setCareers(careerData || [])
      setLoading(false)
    }

    fetchData()
  }, [supabase])

  // Filter careers
  const filteredCareers = careers.filter(career => {
    const matchesCategory = selectedCategory === 'all' || career.category === selectedCategory
    const matchesSearch = searchQuery === '' ||
      career.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      career.description?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const getGrowthColor = (outlook: string) => {
    switch (outlook?.toLowerCase()) {
      case 'excellent': return 'text-green-400'
      case 'good': return 'text-blue-400'
      case 'stable': return 'text-yellow-400'
      case 'growing': return 'text-green-400'
      default: return 'text-gray-400'
    }
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      technology: 'bg-blue-500/20 text-blue-400',
      healthcare: 'bg-red-500/20 text-red-400',
      business: 'bg-green-500/20 text-green-400',
      engineering: 'bg-purple-500/20 text-purple-400',
      creative: 'bg-pink-500/20 text-pink-400',
      science: 'bg-cyan-500/20 text-cyan-400',
      education: 'bg-yellow-500/20 text-yellow-400',
      legal: 'bg-orange-500/20 text-orange-400',
      trades: 'bg-amber-500/20 text-amber-400',
    }
    return colors[category?.toLowerCase()] || 'bg-gray-500/20 text-gray-400'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading careers...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-gray-900">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-slate-100 dark:from-gray-800 to-slate-50 dark:to-gray-900 pt-24 pb-12 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <Link
              href="/teens"
              className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Teen Hub
            </Link>

            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Explore Careers
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto mb-8">
              Find your path to success. Discover careers that match your interests and skills.
            </p>

            {/* Quick Links */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <Link
                href="/teens/career-prep/quiz"
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                Career Quiz
              </Link>
              <Link
                href="/careers/interview-prep"
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                <Briefcase className="w-4 h-4" />
                Interview Prep
              </Link>
              <Link
                href="/careers/majors"
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                <GraduationCap className="w-4 h-4" />
                College Majors
              </Link>
            </div>
          </div>
        </section>

        {/* Additional Quick Resources */}
        <section className="max-w-6xl mx-auto px-4 py-6">
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Link
              href="/careers"
              className="bg-gradient-to-br from-blue-500/10 dark:from-blue-500/20 to-cyan-500/10 dark:to-cyan-500/20 border border-blue-500/20 dark:border-blue-500/30 rounded-xl p-5 hover:border-blue-400 transition-colors"
            >
              <Compass className="w-7 h-7 text-blue-500 dark:text-blue-400 mb-2" />
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1">All Career Paths</h3>
              <p className="text-sm text-gray-600 dark:text-slate-400">Browse 24+ career paths for adults</p>
            </Link>
            <Link
              href="/teens/career-prep/resources"
              className="bg-gradient-to-br from-green-500/10 dark:from-green-500/20 to-emerald-500/10 dark:to-emerald-500/20 border border-green-500/20 dark:border-green-500/30 rounded-xl p-5 hover:border-green-400 transition-colors"
            >
              <FileText className="w-7 h-7 text-green-500 dark:text-green-400 mb-2" />
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Career Resources</h3>
              <p className="text-sm text-gray-600 dark:text-slate-400">Guides & tips for high schoolers</p>
            </Link>
            <Link
              href="/careers/majors"
              className="bg-gradient-to-br from-purple-500/10 dark:from-purple-500/20 to-pink-500/10 dark:to-pink-500/20 border border-purple-500/20 dark:border-purple-500/30 rounded-xl p-5 hover:border-purple-400 transition-colors"
            >
              <GraduationCap className="w-7 h-7 text-purple-500 dark:text-purple-400 mb-2" />
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1">College Majors</h3>
              <p className="text-sm text-gray-600 dark:text-slate-400">Find your field of study</p>
            </Link>
          </div>
        </section>

        {/* Filters */}
        <section className="max-w-6xl mx-auto px-4 py-4">
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
              All Careers
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
              placeholder="Search careers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-96 pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-slate-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Results count */}
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Showing {filteredCareers.length} careers
            {selectedCategory !== 'all' && ` in ${selectedCategory}`}
          </p>

          {/* Career Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredCareers.map(career => (
              <Link
                key={career.id}
                href={`/teens/career-prep/careers/${career.slug}`}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-500 transition-all p-6 group shadow-sm hover:shadow-md"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="text-3xl">{career.icon}</div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getCategoryColor(career.category)}`}>
                    {career.category}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                  {career.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                  {career.description}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-slate-700 dark:text-gray-300">
                    <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span>{career.salary_range?.split(' - ')[0] || 'Varies'}</span>
                  </div>
                  <div className={`flex items-center gap-1 ${getGrowthColor(career.growth_outlook)}`}>
                    <TrendingUp className="w-4 h-4" />
                    <span>{career.growth_outlook}</span>
                  </div>
                </div>

                {/* Education */}
                <div className="mt-3 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-500">
                  <BookOpen className="w-3 h-3" />
                  <span>{career.education_needed}</span>
                </div>
              </Link>
            ))}
          </div>

          {filteredCareers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 mb-4">No careers found matching your criteria.</p>
              <button
                onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
                className="text-green-600 dark:text-green-400 hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}
