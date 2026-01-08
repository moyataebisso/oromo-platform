import Link from 'next/link'
import { Search, BookOpen, Users, MapPin, Music, Landmark, ScrollText, PenLine } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ArticleCard } from '@/components/wiki/article-card'
import { WikiArticle, WikiCategory } from '@/types/wiki'

// Mock data
const mockCategories: WikiCategory[] = [
  { id: '1', name: 'History', slug: 'history', description: 'Oromo history and historical events', articles_count: 45 },
  { id: '2', name: 'Culture', slug: 'culture', description: 'Cultural traditions and practices', articles_count: 38 },
  { id: '3', name: 'Language', slug: 'language', description: 'Afaan Oromoo language resources', articles_count: 52 },
  { id: '4', name: 'Geography', slug: 'geography', description: 'Oromo regions and places', articles_count: 29 },
  { id: '5', name: 'Notable People', slug: 'people', description: 'Famous Oromo figures', articles_count: 67 },
  { id: '6', name: 'Music & Arts', slug: 'arts', description: 'Music, art, and creative works', articles_count: 41 },
]

const categoryIcons: Record<string, React.ElementType> = {
  history: Landmark,
  culture: ScrollText,
  language: BookOpen,
  geography: MapPin,
  people: Users,
  arts: Music,
}

const mockFeaturedArticles: WikiArticle[] = [
  {
    id: '1',
    title: 'The Gadaa System: Ancient Democratic Governance',
    slug: 'gadaa-system',
    excerpt: 'The Gadaa system is an indigenous democratic socio-political system of the Oromo people that has been practiced for centuries.',
    content: '',
    category_id: '1',
    author_id: '1',
    status: 'published',
    is_featured: true,
    views_count: 1250,
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    category: { id: '1', name: 'History', slug: 'history', description: null },
    author: { id: '1', display_name: 'Bekele A.', avatar_url: null },
  },
  {
    id: '2',
    title: 'Irreecha: The Oromo Thanksgiving Festival',
    slug: 'irreecha-festival',
    excerpt: 'Irreecha is the most important annual Oromo thanksgiving holiday celebrated at the beginning of spring.',
    content: '',
    category_id: '2',
    author_id: '2',
    status: 'published',
    is_featured: true,
    views_count: 980,
    created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    category: { id: '2', name: 'Culture', slug: 'culture', description: null },
    author: { id: '2', display_name: 'Chaltu M.', avatar_url: null },
  },
]

const mockRecentArticles: WikiArticle[] = [
  {
    id: '3',
    title: 'Introduction to Qubee: The Oromo Alphabet',
    slug: 'qubee-alphabet',
    excerpt: 'Qubee is the Latin-based writing system adopted for Afaan Oromoo in the early 1990s.',
    content: '',
    category_id: '3',
    author_id: '3',
    status: 'published',
    is_featured: false,
    views_count: 456,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    category: { id: '3', name: 'Language', slug: 'language', description: null },
    author: { id: '3', display_name: 'Abdii T.', avatar_url: null },
  },
  {
    id: '4',
    title: 'Traditional Oromo Coffee Ceremony',
    slug: 'coffee-ceremony',
    excerpt: 'The coffee ceremony (buna qalaa) is an integral part of Oromo culture, representing hospitality and community.',
    content: '',
    category_id: '2',
    author_id: '4',
    status: 'published',
    is_featured: false,
    views_count: 324,
    created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    category: { id: '2', name: 'Culture', slug: 'culture', description: null },
    author: { id: '4', display_name: 'Lelise D.', avatar_url: null },
  },
  {
    id: '5',
    title: 'Abba Gadaa: Leadership in Oromo Society',
    slug: 'abba-gadaa',
    excerpt: 'The Abba Gadaa is the elected leader who serves as the head of the Gadaa assembly.',
    content: '',
    category_id: '1',
    author_id: '1',
    status: 'published',
    is_featured: false,
    views_count: 289,
    created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    category: { id: '1', name: 'History', slug: 'history', description: null },
    author: { id: '1', display_name: 'Bekele A.', avatar_url: null },
  },
  {
    id: '6',
    title: 'Oromo Proverbs and Their Meanings',
    slug: 'oromo-proverbs',
    excerpt: 'A collection of traditional Oromo proverbs (mammaaksa) that carry wisdom passed down through generations.',
    content: '',
    category_id: '3',
    author_id: '5',
    status: 'published',
    is_featured: false,
    views_count: 412,
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    category: { id: '3', name: 'Language', slug: 'language', description: null },
    author: { id: '5', display_name: 'Gurmesa K.', avatar_url: null },
  },
]

export default function WikiPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-b from-green-50 to-white">
          <div className="mx-auto max-w-7xl px-4">
            <div className="text-center max-w-2xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                Oromo Wiki
              </h1>
              <p className="mt-4 text-lg text-slate-600">
                Explore the comprehensive knowledge base of Oromo history, culture, language, and heritage.
              </p>

              {/* Search */}
              <div className="mt-6 flex gap-2 max-w-md mx-auto">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    type="search"
                    placeholder="Search articles..."
                    className="pl-10"
                  />
                </div>
                <Button>Search</Button>
              </div>

              <div className="mt-4">
                <Button variant="outline" asChild>
                  <Link href="/wiki/contribute">
                    <PenLine className="w-4 h-4 mr-2" />
                    Contribute an Article
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-12 border-b">
          <div className="mx-auto max-w-7xl px-4">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Browse by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {mockCategories.map((category) => {
                const Icon = categoryIcons[category.slug] || BookOpen
                return (
                  <Link key={category.id} href={`/wiki/category/${category.slug}`}>
                    <Card className="h-full hover:shadow-md hover:border-blue-200 transition-all duration-200 group">
                      <CardContent className="p-4 text-center">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-600 transition-colors">
                          <Icon className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
                        </div>
                        <h3 className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">
                          {category.articles_count} articles
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* Featured Articles */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Featured Articles</h2>
              <Button variant="ghost" asChild>
                <Link href="/wiki/featured">View all</Link>
              </Button>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {mockFeaturedArticles.map((article) => (
                <ArticleCard key={article.id} article={article} variant="featured" />
              ))}
            </div>
          </div>
        </section>

        {/* Recent Articles */}
        <section className="py-12 bg-slate-50">
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Recent Articles</h2>
              <Button variant="ghost" asChild>
                <Link href="/wiki/recent">View all</Link>
              </Button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {mockRecentArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
