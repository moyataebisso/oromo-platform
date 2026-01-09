import { Suspense } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Input } from '@/components/ui/input'
import { FeaturedArticleCard } from '@/components/news/featured-article-card'
import { ArticleCard } from '@/components/news/article-card'
import { ArticleSidebar } from '@/components/news/article-sidebar'
import { CategoryBadge } from '@/components/news/category-badge'

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

interface NewsPageProps {
  searchParams: Promise<{ category?: string; q?: string }>
}

interface Article {
  id: string
  title: string
  slug: string
  summary?: string
  category: string
  author?: string
  image_url?: string
  published_at: string
  is_featured?: boolean
}

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const params = await searchParams
  const supabase = await createClient()
  const activeCategory = params.category || 'all'
  const searchQuery = params.q || ''

  // Build query for featured articles
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let featuredQuery = (supabase as any)
    .from('news_articles')
    .select('*')
    .eq('is_published', true)
    .eq('is_featured', true)
    .order('published_at', { ascending: false })
    .limit(3)

  if (activeCategory !== 'all') {
    featuredQuery = featuredQuery.eq('category', activeCategory)
  }

  const { data: featuredData } = await featuredQuery
  const featuredArticles = (featuredData || []) as Article[]

  // Build query for latest articles
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let latestQuery = (supabase as any)
    .from('news_articles')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(12)

  if (activeCategory !== 'all') {
    latestQuery = latestQuery.eq('category', activeCategory)
  }

  if (searchQuery) {
    latestQuery = latestQuery.ilike('title', `%${searchQuery}%`)
  }

  const { data: latestData } = await latestQuery
  const latestArticles = (latestData || []) as Article[]

  // Get the hero article (most recent featured or most recent)
  const heroArticle = featuredArticles[0] || latestArticles[0]
  const otherFeatured = featuredArticles.slice(1) || []

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      {heroArticle && (
        <section className="relative">
          <div className="absolute inset-0 h-[500px]">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: heroArticle.image_url
                  ? `url(${heroArticle.image_url})`
                  : 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
          </div>
          <div className="relative pt-32 pb-16 px-4 max-w-7xl mx-auto">
            <CategoryBadge category={heroArticle.category} className="mb-4" />
            <Link href={`/news/${heroArticle.slug}`}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground max-w-4xl mb-4 hover:text-primary/90 transition-colors">
                {heroArticle.title}
              </h1>
            </Link>
            {heroArticle.summary && (
              <p className="text-xl text-muted-foreground max-w-2xl mb-6">
                {heroArticle.summary}
              </p>
            )}
            <div className="flex items-center gap-4 text-muted-foreground">
              {heroArticle.author && <span>By {heroArticle.author}</span>}
              <span>{new Date(heroArticle.published_at).toLocaleDateString()}</span>
            </div>
          </div>
        </section>
      )}

      {/* Category Filters & Search */}
      <section className="bg-card/50 border-y border-border sticky top-16 z-30 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={cat.slug === 'all' ? '/news' : `/news?category=${cat.slug}`}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === cat.slug
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
            <form className="relative md:ml-auto md:w-64" action="/news" method="GET">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                name="q"
                placeholder="Search news..."
                defaultValue={searchQuery}
                className="pl-10"
              />
              {activeCategory !== 'all' && (
                <input type="hidden" name="category" value={activeCategory} />
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Featured Articles Row */}
            {otherFeatured.length > 0 && (
              <div className="grid md:grid-cols-2 gap-4">
                {otherFeatured.map((article) => (
                  <FeaturedArticleCard
                    key={article.id}
                    article={article}
                    size="medium"
                  />
                ))}
              </div>
            )}

            {/* Latest News Grid */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Latest News</h2>
              {latestArticles && latestArticles.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {latestArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No articles found.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <Suspense fallback={<div className="animate-pulse bg-card rounded-xl h-96" />}>
              <ArticleSidebar />
            </Suspense>
          </aside>
        </div>
      </section>
    </div>
  )
}
