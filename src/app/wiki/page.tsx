import Link from 'next/link'
import { Search, BookOpen, Users, MapPin, Music, Landmark, ScrollText, PenLine, Eye, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { OromiaMap } from '@/components/wiki/oromia-map'
import { WikiFlashcards } from '@/components/wiki/wiki-flashcards'
import { createClient } from '@/lib/supabase/server'

// Categories with icons
const WIKI_CATEGORIES = [
  { name: 'History', slug: 'history', icon: '🏛️', count: 45, Icon: Landmark },
  { name: 'Culture', slug: 'culture', icon: '🎭', count: 38, Icon: ScrollText },
  { name: 'Language', slug: 'language', icon: '📖', count: 52, Icon: BookOpen },
  { name: 'Geography', slug: 'geography', icon: '📍', count: 29, Icon: MapPin },
  { name: 'Notable People', slug: 'people', icon: '👥', count: 67, Icon: Users },
  { name: 'Music & Arts', slug: 'arts', icon: '🎵', count: 41, Icon: Music },
]

// Mock featured articles
const mockFeaturedArticles = [
  {
    id: '1',
    title: 'The Gadaa System: Ancient Democratic Governance',
    slug: 'gadaa-system',
    summary: 'The Gadaa system is an indigenous democratic socio-political system of the Oromo people that has been practiced for centuries.',
    category: 'History',
    image_url: null,
    view_count: 1250,
    created_at: '2024-01-15',
    is_featured: true,
  },
  {
    id: '2',
    title: 'Irreecha: The Oromo Thanksgiving Festival',
    slug: 'irreecha-festival',
    summary: 'Irreecha is the most important annual Oromo thanksgiving holiday celebrated at the beginning of spring.',
    category: 'Culture',
    image_url: null,
    view_count: 980,
    created_at: '2024-01-12',
    is_featured: true,
  },
  {
    id: '3',
    title: 'Introduction to Qubee: The Oromo Alphabet',
    slug: 'qubee-alphabet',
    summary: 'Qubee is the Latin-based writing system adopted for Afaan Oromoo in the early 1990s.',
    category: 'Language',
    image_url: null,
    view_count: 1100,
    created_at: '2024-01-10',
    is_featured: true,
  },
  {
    id: '4',
    title: 'Abba Gadaa: Leadership in Oromo Society',
    slug: 'abba-gadaa',
    summary: 'The Abba Gadaa is the elected leader who serves as the head of the Gadaa assembly.',
    category: 'History',
    image_url: null,
    view_count: 890,
    created_at: '2024-01-08',
    is_featured: true,
  },
]

// Mock recent articles
const mockRecentArticles = [
  {
    id: '5',
    title: 'Traditional Oromo Coffee Ceremony',
    slug: 'coffee-ceremony',
    summary: 'The coffee ceremony (buna qalaa) is an integral part of Oromo culture.',
    category: 'Culture',
    view_count: 756,
    created_at: '2024-01-20',
  },
  {
    id: '6',
    title: 'Oromo Proverbs and Their Meanings',
    slug: 'oromo-proverbs',
    summary: 'A collection of traditional Oromo proverbs (mammaaksa).',
    category: 'Language',
    view_count: 654,
    created_at: '2024-01-19',
  },
  {
    id: '7',
    title: 'The Regions of Oromia',
    slug: 'oromia-regions',
    summary: 'Explore the diverse regions that make up Oromia.',
    category: 'Geography',
    view_count: 543,
    created_at: '2024-01-18',
  },
  {
    id: '8',
    title: 'Haile Gebrselassie: The Running Legend',
    slug: 'haile-gebrselassie',
    summary: 'One of the greatest distance runners of all time.',
    category: 'Notable People',
    view_count: 1200,
    created_at: '2024-01-17',
  },
  {
    id: '9',
    title: 'Traditional Oromo Music and Instruments',
    slug: 'oromo-music',
    summary: 'Explore the rich musical heritage of the Oromo people.',
    category: 'Music & Arts',
    view_count: 432,
    created_at: '2024-01-16',
  },
  {
    id: '10',
    title: 'Waaqeffanna: The Traditional Religion',
    slug: 'waaqeffanna',
    summary: 'The traditional religion centered on belief in Waaqa.',
    category: 'Culture',
    view_count: 876,
    created_at: '2024-01-15',
  },
]

export default async function WikiPage() {
  const supabase = await createClient()

  // Try to fetch featured articles from database
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: dbFeaturedArticles } = await (supabase as any)
    .from('wiki_articles')
    .select('*')
    .eq('is_featured', true)
    .eq('is_published', true)
    .limit(4)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: dbRecentArticles } = await (supabase as any)
    .from('wiki_articles')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(6)

  // Use mock data if no database results
  const featuredArticles = dbFeaturedArticles && dbFeaturedArticles.length > 0 ? dbFeaturedArticles : mockFeaturedArticles
  const recentArticles = dbRecentArticles && dbRecentArticles.length > 0 ? dbRecentArticles : mockRecentArticles

  return (
    <div className="min-h-screen flex flex-col bg-slate-900">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-emerald-900/20 via-slate-900 to-slate-900 py-16">
          <div className="mx-auto max-w-7xl px-4">
            <div className="text-center max-w-2xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Oromo Wiki
              </h1>
              <p className="mt-4 text-xl text-slate-300">
                Explore the comprehensive knowledge base of Oromo history, culture, language, and heritage.
              </p>

              {/* Search */}
              <div className="mt-8 flex gap-2 max-w-xl mx-auto">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="search"
                    placeholder="Search articles..."
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder:text-slate-500"
                  />
                </div>
                <Button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6">
                  Search
                </Button>
              </div>

              <div className="mt-6">
                <Link
                  href="/wiki/contribute"
                  className="inline-flex items-center gap-2 border border-slate-600 text-slate-300 hover:border-emerald-500 hover:text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <PenLine className="w-4 h-4" />
                  Contribute an Article
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4">
            <h2 className="text-2xl font-bold text-white mb-8">Browse by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {WIKI_CATEGORIES.map((category) => (
                <Link
                  key={category.slug}
                  href={`/wiki/category/${category.slug}`}
                  className="bg-slate-800 border border-slate-700 rounded-xl p-6 text-center hover:border-emerald-500/50 hover:bg-slate-700/50 transition-all group"
                >
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                    {category.icon}
                  </div>
                  <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">
                    {category.count} articles
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Map */}
        <section id="map" className="py-12 bg-slate-800/30">
          <div className="mx-auto max-w-7xl px-4">
            <OromiaMap />
          </div>
        </section>

        {/* Two Column Layout - Featured Articles & Flashcards */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Featured Articles - 2 columns */}
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Featured Articles</h2>
                  <Link href="/wiki/featured" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                    View all →
                  </Link>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {featuredArticles.map((article: {
                    id: string
                    title: string
                    slug: string
                    summary?: string
                    category?: string
                    image_url?: string | null
                    view_count?: number
                    created_at: string
                    is_featured?: boolean
                  }) => (
                    <Link
                      key={article.id}
                      href={`/wiki/${article.slug}`}
                      className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden hover:border-emerald-500/50 transition-all group"
                    >
                      {article.image_url && (
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={article.image_url}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                      )}
                      <div className="p-5">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">
                            {article.category}
                          </span>
                          {article.is_featured && (
                            <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-1 rounded">
                              Featured
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-slate-400 text-sm line-clamp-2">{article.summary}</p>
                        <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {article.view_count || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(article.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Flashcards Sidebar */}
              <div className="lg:col-span-1">
                <WikiFlashcards />
              </div>
            </div>
          </div>
        </section>

        {/* Recent Articles */}
        <section className="py-12 bg-slate-800/30">
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Recent Articles</h2>
              <Link href="/wiki/recent" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                View all →
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentArticles.map((article: {
                id: string
                title: string
                slug: string
                summary?: string
                category?: string
                view_count?: number
                created_at: string
              }) => (
                <Link
                  key={article.id}
                  href={`/wiki/${article.slug}`}
                  className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-emerald-500/50 transition-all group"
                >
                  <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">
                    {article.category}
                  </span>
                  <h3 className="text-lg font-semibold text-white mt-3 mb-2 group-hover:text-emerald-400 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-slate-400 text-sm line-clamp-2">{article.summary}</p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {article.view_count || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(article.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <div className="bg-gradient-to-r from-emerald-900/50 to-amber-900/50 rounded-2xl p-8 border border-emerald-500/20">
              <h2 className="text-3xl font-bold text-white mb-4">
                Help Build the Oromo Knowledge Base
              </h2>
              <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
                Share your knowledge and help preserve Oromo history, culture, and language for future generations.
                Every contribution makes a difference.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/wiki/contribute"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  ✏️ Write an Article
                </Link>
                <Link
                  href="/wiki/guidelines"
                  className="border border-slate-600 hover:border-emerald-500 text-slate-300 hover:text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  📋 View Guidelines
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
