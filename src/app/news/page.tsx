'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import {
  Globe, Flag, Search, Clock, ChevronRight,
  Newspaper, RefreshCw
} from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

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

// Decode HTML entities in text (for titles with encoded characters like &#xFC;)
const decodeHTMLEntities = (text: string): string => {
  if (!text) return ''
  return text
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
}

// Placeholder images based on category - multiple options per category for variety
const placeholderSets: Record<string, string[]> = {
  breaking: [
    'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&q=80',
    'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80',
    'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=800&q=80',
    'https://images.unsplash.com/photo-1557992260-ec58e38d363c?w=800&q=80',
  ],
  politics: [
    'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80',
    'https://images.unsplash.com/photo-1555848962-6e79363ec58f?w=800&q=80',
    'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&q=80',
    'https://images.unsplash.com/photo-1575320181282-9afab399332c?w=800&q=80',
  ],
  culture: [
    'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80',
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
    'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80',
  ],
  sports: [
    'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80',
    'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&q=80',
    'https://images.unsplash.com/photo-1461896836934-28f606d9a220?w=800&q=80',
    'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80',
  ],
  business: [
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
  ],
  education: [
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80',
    'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&q=80',
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80',
  ],
  diaspora: [
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80',
    'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&q=80',
    'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=800&q=80',
    'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80',
  ],
  community: [
    'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80',
    'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&q=80',
    'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=80',
    'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80',
  ],
  world: [
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
    'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800&q=80',
    'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?w=800&q=80',
    'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&q=80',
  ],
  technology: [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
    'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&q=80',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80',
  ],
  health: [
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
    'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&q=80',
    'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&q=80',
    'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=800&q=80',
  ],
  entertainment: [
    'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
    'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&q=80',
    'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=800&q=80',
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80',
  ],
}

// Generate a consistent but varied placeholder based on article properties
const getArticlePlaceholder = (article: NewsArticle): string => {
  const category = article.category.toLowerCase()
  const imageSet = placeholderSets[category] || placeholderSets.breaking

  // Use the article ID or title to consistently pick an image
  // This ensures the same article always gets the same placeholder
  const hash = article.id ?
    article.id.charCodeAt(0) + article.id.charCodeAt(article.id.length - 1) :
    article.title.length

  const index = hash % imageSet.length
  return imageSet[index]
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
                <img
                  src={featuredArticle.image_url || getArticlePlaceholder(featuredArticle)}
                  alt={decodeHTMLEntities(featuredArticle.title)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.src = getArticlePlaceholder(featuredArticle)
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-8">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${
                  activeTab === 'oromo' ? 'bg-green-500' : 'bg-blue-500'
                } text-white`}>
                  {featuredArticle.category}
                </span>
                <h2 className="text-3xl font-bold text-white mb-3 group-hover:text-blue-400 transition">
                  {decodeHTMLEntities(featuredArticle.title)}
                </h2>
                {featuredArticle.summary && (
                  <p className="text-gray-300 text-lg mb-4 line-clamp-2">
                    {decodeHTMLEntities(featuredArticle.summary)}
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
                        <img
                          src={article.image_url || getArticlePlaceholder(article)}
                          alt={decodeHTMLEntities(article.title)}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.currentTarget.src = getArticlePlaceholder(article)
                          }}
                        />
                        <span className={`absolute top-3 left-3 px-2 py-1 rounded text-xs font-medium ${
                          activeTab === 'oromo' ? 'bg-green-500' : 'bg-blue-500'
                        } text-white`}>
                          {article.category}
                        </span>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition">
                          {decodeHTMLEntities(article.title)}
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

      {/* Footer */}
      <Footer />
    </>
  )
}
