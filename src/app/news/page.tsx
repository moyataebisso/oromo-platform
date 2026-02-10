'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import {
  Globe, Flag, Search, Clock, ChevronRight,
  Newspaper, RefreshCw
} from 'lucide-react'
import { Header } from '@/components/layout/header'

interface NewsArticle {
  id: string
  title: string
  slug: string
  summary: string | null
  image_url: string | null
  category: string
  source: string
  published_at: string
  news_type: string
}

interface Category {
  id: string
  name: string
  slug: string
}

export default function NewsPage() {
  const [activeTab, setActiveTab] = useState<'oromo' | 'world'>('oromo')
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchArticles()
  }, [activeTab, selectedCategory])

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('news_categories')
      .select('*')
      .order('order_index') as { data: Category[] | null }
    setCategories(data || [])
  }

  const fetchArticles = async () => {
    setLoading(true)

    let query = supabase
      .from('news_articles')
      .select('*')
      .eq('is_published', true)
      .eq('news_type', activeTab)
      .order('published_at', { ascending: false })
      .limit(50)

    if (selectedCategory !== 'all') {
      query = query.eq('category', selectedCategory)
    }

    const { data } = await query as { data: NewsArticle[] | null }
    setArticles(data || [])
    setLoading(false)
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await fetch(`/api/news/fetch?type=${activeTab}&manual=true`)
      await fetchArticles()
    } catch (error) {
      console.error('Refresh error:', error)
    }
    setRefreshing(false)
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const featuredArticle = filteredArticles[0]
  const otherArticles = filteredArticles.slice(1)

  return (
    <>
      {/* Header */}
      <Header />

      <div className="min-h-screen bg-gray-900">
        {/* News Type Tabs */}
        <div className="bg-gray-800 border-b border-gray-700 sticky top-16 z-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-2">
                <Newspaper className="w-6 h-6 text-blue-400" />
                <h1 className="text-xl font-bold text-white">News</h1>
              </div>

              <div className="flex items-center gap-4">
                {/* Tabs */}
                <div className="flex bg-gray-700 rounded-lg p-1">
                  <button
                    onClick={() => setActiveTab('oromo')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${
                      activeTab === 'oromo'
                        ? 'bg-green-500 text-white'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    <Flag className="w-4 h-4" />
                    Oromo News
                  </button>
                  <button
                    onClick={() => setActiveTab('world')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${
                      activeTab === 'world'
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    <Globe className="w-4 h-4" />
                    World News
                  </button>
                </div>

                {/* Refresh button */}
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="p-2 text-gray-400 hover:text-white transition"
                  title="Refresh news"
                >
                  <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Featured Article */}
          {featuredArticle && (
            <Link
              href={`/news/${featuredArticle.slug}`}
              className="block relative rounded-2xl overflow-hidden mb-8 group"
            >
              <div className="aspect-[21/9] bg-gray-800">
                {featuredArticle.image_url ? (
                  <img
                    src={featuredArticle.image_url}
                    alt={featuredArticle.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                    <Newspaper className="w-20 h-20 text-gray-600" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-8">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${
                  activeTab === 'oromo' ? 'bg-green-500' : 'bg-blue-500'
                } text-white`}>
                  {featuredArticle.category}
                </span>
                <h2 className="text-3xl font-bold text-white mb-3 group-hover:text-blue-400 transition">
                  {featuredArticle.title}
                </h2>
                {featuredArticle.summary && (
                  <p className="text-gray-300 text-lg mb-4 line-clamp-2">
                    {featuredArticle.summary}
                  </p>
                )}
                <div className="flex items-center gap-4 text-gray-400 text-sm">
                  <span>{featuredArticle.source}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formatTimeAgo(featuredArticle.published_at)}
                  </span>
                </div>
              </div>
            </Link>
          )}

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Articles Grid */}
            <div className="flex-1">
              {/* Category Filters */}
              <div className="flex flex-wrap gap-2 mb-6">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    selectedCategory === 'all'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  All
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                      selectedCategory === cat.slug
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search news..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Articles */}
              {loading ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-gray-800 rounded-xl p-4 animate-pulse">
                      <div className="aspect-video bg-gray-700 rounded-lg mb-4" />
                      <div className="h-4 bg-gray-700 rounded w-1/4 mb-3" />
                      <div className="h-6 bg-gray-700 rounded mb-2" />
                      <div className="h-4 bg-gray-700 rounded w-3/4" />
                    </div>
                  ))}
                </div>
              ) : otherArticles.length === 0 && !featuredArticle ? (
                <div className="text-center py-12">
                  <Newspaper className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No articles found</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {otherArticles.map(article => (
                    <Link
                      key={article.id}
                      href={`/news/${article.slug}`}
                      className="bg-gray-800 rounded-xl overflow-hidden group hover:bg-gray-750 transition"
                    >
                      <div className="aspect-video bg-gray-700 relative overflow-hidden">
                        {article.image_url ? (
                          <img
                            src={article.image_url}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Newspaper className="w-12 h-12 text-gray-600" />
                          </div>
                        )}
                        <span className={`absolute top-3 left-3 px-2 py-1 rounded text-xs font-medium ${
                          activeTab === 'oromo' ? 'bg-green-500' : 'bg-blue-500'
                        } text-white`}>
                          {article.category}
                        </span>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition">
                          {article.title}
                        </h3>
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                          <span>{article.source}</span>
                          <span>•</span>
                          <span>{formatTimeAgo(article.published_at)}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:w-80 space-y-6">
              {/* Categories */}
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="font-semibold text-white mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.slug)}
                      className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-700 transition text-left"
                    >
                      <span className="text-gray-300">{cat.name}</span>
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Update Info */}
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="font-semibold text-white mb-2">Auto Updates</h3>
                <p className="text-gray-400 text-sm">
                  {activeTab === 'world'
                    ? 'World news updates every 30 minutes'
                    : 'Oromo news updates every 3 hours'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
