import { Suspense } from 'react'
import Link from 'next/link'
import { Search, ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Input } from '@/components/ui/input'
import { FeaturedArticleCard } from '@/components/news/featured-article-card'
import { ArticleCard } from '@/components/news/article-card'
import { ArticleSidebar } from '@/components/news/article-sidebar'

const categories = [
  { slug: 'all', name: 'All' },
  { slug: 'breaking', name: 'Breaking' },
  { slug: 'politics', name: 'Politics' },
  { slug: 'culture', name: 'Culture' },
  { slug: 'sports', name: 'Sports' },
  { slug: 'business', name: 'Business' },
  { slug: 'diaspora', name: 'Diaspora' },
  { slug: 'education', name: 'Education' },
  { slug: 'community', name: 'Community' },
]

interface CategoryPageProps {
  params: Promise<{ category: string }>
  searchParams: Promise<{ q?: string }>
}

interface Article {
  id: string
  title: string
  slug: string
  summary?: string
  category: string
  image_url?: string
  published_at: string
  is_featured?: boolean
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { category } = await params
  const { q: searchQuery = '' } = await searchParams
  const supabase = await createClient()

  // Get category info
  const categoryInfo = categories.find(c => c.slug === category)
  const categoryName = categoryInfo?.name || category

  // Fetch featured articles for this category
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: featuredData } = await (supabase as any)
    .from('news_articles')
    .select('*')
    .eq('is_published', true)
    .eq('is_featured', true)
    .eq('category', category)
    .order('published_at', { ascending: false })
    .limit(2)

  const featuredArticles = (featuredData || []) as Article[]

  // Fetch all articles for this category
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let articlesQuery = (supabase as any)
    .from('news_articles')
    .select('*')
    .eq('is_published', true)
    .eq('category', category)
    .order('published_at', { ascending: false })
    .limit(20)

  if (searchQuery) {
    articlesQuery = articlesQuery.ilike('title', `%${searchQuery}%`)
  }

  const { data: articlesData } = await articlesQuery
  const articles = (articlesData || []) as Article[]

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <section className="bg-gradient-to-b from-slate-800 to-slate-900 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            All News
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white capitalize mb-4">
            {categoryName} News
          </h1>
          <p className="text-slate-400 text-lg">
            Latest {categoryName.toLowerCase()} news and updates from the Oromo community
          </p>
        </div>
      </section>

      {/* Category Filters & Search */}
      <section className="bg-slate-800/50 border-y border-slate-700 sticky top-16 z-30 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={cat.slug === 'all' ? '/news' : `/news/category/${cat.slug}`}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    category === cat.slug
                      ? 'bg-primary text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
            <form className="relative md:ml-auto md:w-64" action={`/news/category/${category}`} method="GET">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                name="q"
                placeholder="Search in category..."
                defaultValue={searchQuery}
                className="pl-10 bg-slate-700 border-slate-600"
              />
            </form>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Featured Articles */}
            {featuredArticles && featuredArticles.length > 0 && (
              <div className="grid md:grid-cols-2 gap-4">
                {featuredArticles.map((article) => (
                  <FeaturedArticleCard
                    key={article.id}
                    article={article}
                    size="medium"
                  />
                ))}
              </div>
            )}

            {/* Articles Grid */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">All {categoryName} Articles</h2>
              {articles && articles.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {articles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-slate-800 rounded-xl">
                  <p className="text-slate-400 text-lg mb-2">No articles found in this category.</p>
                  <Link href="/news" className="text-primary hover:underline">
                    View all news
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <Suspense fallback={<div className="animate-pulse bg-slate-800 rounded-xl h-96" />}>
              <ArticleSidebar />
            </Suspense>
          </aside>
        </div>
      </section>
    </div>
  )
}
