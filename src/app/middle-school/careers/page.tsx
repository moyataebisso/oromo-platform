'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Rocket, Star, DollarSign, GraduationCap } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Career {
  id: string
  title: string
  slug: string
  description: string
  category: string
  icon: string
  salary_info: string
  education_needed: string
  is_featured: boolean
  is_published: boolean
}

export default function MiddleSchoolCareersPage() {
  const [careers, setCareers] = useState<Career[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  const categories = [
    { slug: 'all', name: 'All Careers', icon: '🌟' },
    { slug: 'technology', name: 'Technology', icon: '💻' },
    { slug: 'healthcare', name: 'Healthcare', icon: '🏥' },
    { slug: 'creative', name: 'Creative', icon: '🎨' },
    { slug: 'sports', name: 'Sports', icon: '⚽' },
    { slug: 'science', name: 'Science', icon: '🔬' },
    { slug: 'education', name: 'Education', icon: '📚' },
    { slug: 'business', name: 'Business', icon: '💼' },
  ]

  useEffect(() => {
    async function fetchCareers() {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sb = supabase as any

      const { data } = await sb
        .from('middle_school_careers')
        .select('*')
        .eq('is_published', true)
        .order('is_featured', { ascending: false })
        .order('title')

      setCareers(data || [])
      setLoading(false)
    }

    fetchCareers()
  }, [supabase])

  const filteredCareers = careers.filter(career => {
    const matchesCategory = selectedCategory === 'all' || career.category === selectedCategory
    const matchesSearch = searchQuery === '' ||
      career.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      career.description?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      technology: 'bg-blue-500/20 text-blue-600 dark:text-blue-400',
      healthcare: 'bg-red-500/20 text-red-600 dark:text-red-400',
      creative: 'bg-pink-500/20 text-pink-600 dark:text-pink-400',
      sports: 'bg-green-500/20 text-green-600 dark:text-green-400',
      science: 'bg-purple-500/20 text-purple-600 dark:text-purple-400',
      education: 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400',
      business: 'bg-orange-500/20 text-orange-600 dark:text-orange-400',
    }
    return colors[category?.toLowerCase()] || 'bg-gray-500/20 text-gray-600 dark:text-gray-400'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading careers...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900">
      {/* Hero */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Rocket className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Explore Cool Careers</h1>
          <p className="text-purple-100 text-lg max-w-2xl mx-auto">
            Discover awesome jobs you might want when you grow up. It&apos;s never too early to dream big!
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map(cat => (
            <button
              key={cat.slug}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === cat.slug
                  ? 'bg-purple-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
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
            className="w-full md:w-96 pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-slate-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Results count */}
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          {filteredCareers.length} careers to explore
        </p>

        {/* Career Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCareers.map(career => (
            <Link
              key={career.id}
              href={`/middle-school/careers/${career.slug}`}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 transition-all group shadow-sm hover:shadow-md"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="text-4xl">{career.icon}</div>
                {career.is_featured && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 text-xs rounded-full font-medium">
                    <Star className="w-3 h-3" /> Popular
                  </span>
                )}
              </div>

              <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mb-2 ${getCategoryColor(career.category)}`}>
                {career.category}
              </span>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                {career.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">{career.description}</p>

              <div className="space-y-1 text-sm">
                {career.salary_info && (
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    <span>{career.salary_info}</span>
                  </div>
                )}
                {career.education_needed && (
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <GraduationCap className="w-4 h-4 text-blue-500" />
                    <span>{career.education_needed}</span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        {filteredCareers.length === 0 && (
          <div className="text-center py-12">
            <Rocket className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">No careers found matching your search.</p>
            <button
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              className="text-purple-600 dark:text-purple-400 hover:underline"
            >
              View all careers
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
