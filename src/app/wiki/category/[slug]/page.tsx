import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ArrowLeft, Eye, Calendar } from 'lucide-react'

// Wiki categories mapping
const WIKI_CATEGORIES: Record<string, { name: string; icon: string; description: string }> = {
  'history': { name: 'History', icon: '🏛️', description: 'Explore the rich history of the Oromo people' },
  'culture': { name: 'Culture', icon: '🎭', description: 'Traditional customs, ceremonies, and way of life' },
  'language': { name: 'Language', icon: '📖', description: 'Learn about Afaan Oromoo language' },
  'geography': { name: 'Geography', icon: '📍', description: 'The land of Oromia and its regions' },
  'people': { name: 'Notable People', icon: '👥', description: 'Famous Oromo figures throughout history' },
  'notable-people': { name: 'Notable People', icon: '👥', description: 'Famous Oromo figures throughout history' },
  'arts': { name: 'Music & Arts', icon: '🎵', description: 'Traditional and modern Oromo arts' },
  'music-arts': { name: 'Music & Arts', icon: '🎵', description: 'Traditional and modern Oromo arts' },
}

// Mock articles for each category
const MOCK_ARTICLES: Record<string, Array<{
  id: string
  slug: string
  title: string
  summary: string
  image_url: string | null
  view_count: number
  created_at: string
}>> = {
  'history': [
    { id: '1', slug: 'gadaa-system', title: 'The Gadaa System: Ancient Democratic Governance', summary: 'The Gadaa system is an indigenous democratic socio-political system of the Oromo people that has been practiced for centuries.', image_url: null, view_count: 1250, created_at: '2024-01-15' },
    { id: '2', slug: 'oromo-expansion', title: 'The Great Oromo Expansion (16th Century)', summary: 'The Oromo expansion, also known as the Oromo migrations, was a significant historical event.', image_url: null, view_count: 890, created_at: '2024-01-10' },
    { id: '3', slug: 'abba-gadaa', title: 'Abba Gadaa: Leadership in Oromo Society', summary: 'The Abba Gadaa is the elected leader who serves as the head of the Gadaa assembly.', image_url: null, view_count: 654, created_at: '2024-01-05' },
  ],
  'culture': [
    { id: '4', slug: 'irreecha-festival', title: 'Irreecha: The Oromo Thanksgiving Festival', summary: 'Irreecha is the most important annual Oromo thanksgiving holiday celebrated at the beginning of spring.', image_url: null, view_count: 980, created_at: '2024-01-12' },
    { id: '5', slug: 'coffee-ceremony', title: 'Traditional Oromo Coffee Ceremony', summary: 'The coffee ceremony (buna qalaa) is an integral part of Oromo culture, representing hospitality and community.', image_url: null, view_count: 756, created_at: '2024-01-08' },
    { id: '6', slug: 'waaqeffanna', title: 'Waaqeffanna: The Traditional Oromo Religion', summary: 'Waaqeffanna is the traditional religion of the Oromo people, centered on belief in one God called Waaqa.', image_url: null, view_count: 543, created_at: '2024-01-03' },
  ],
  'language': [
    { id: '7', slug: 'qubee-alphabet', title: 'Introduction to Qubee: The Oromo Alphabet', summary: 'Qubee is the Latin-based writing system adopted for Afaan Oromoo in the early 1990s.', image_url: null, view_count: 1100, created_at: '2024-01-14' },
    { id: '8', slug: 'oromo-proverbs', title: 'Oromo Proverbs and Their Meanings', summary: 'A collection of traditional Oromo proverbs (mammaaksa) that carry wisdom passed down through generations.', image_url: null, view_count: 890, created_at: '2024-01-09' },
    { id: '9', slug: 'afaan-oromoo-basics', title: 'Learning Afaan Oromoo: Basic Phrases', summary: 'Start your journey learning Afaan Oromoo with these essential everyday phrases.', image_url: null, view_count: 1450, created_at: '2024-01-01' },
  ],
  'geography': [
    { id: '10', slug: 'oromia-regions', title: 'The Regions of Oromia', summary: 'Oromia is the largest regional state in Ethiopia, home to diverse landscapes and communities.', image_url: null, view_count: 720, created_at: '2024-01-11' },
    { id: '11', slug: 'bale-mountains', title: 'Bale Mountains National Park', summary: 'One of the most important areas for biodiversity in Africa, home to unique wildlife.', image_url: null, view_count: 540, created_at: '2024-01-07' },
  ],
  'people': [
    { id: '12', slug: 'haile-fida', title: 'Haile Fida: Father of Qubee', summary: 'Haile Fida was an Oromo linguist and politician who developed the Latin-based Oromo alphabet.', image_url: null, view_count: 890, created_at: '2024-01-13' },
    { id: '13', slug: 'haile-gebrselassie', title: 'Haile Gebrselassie: The Running Legend', summary: 'One of the greatest distance runners of all time, with numerous world records.', image_url: null, view_count: 1200, created_at: '2024-01-06' },
  ],
  'notable-people': [
    { id: '12', slug: 'haile-fida', title: 'Haile Fida: Father of Qubee', summary: 'Haile Fida was an Oromo linguist and politician who developed the Latin-based Oromo alphabet.', image_url: null, view_count: 890, created_at: '2024-01-13' },
    { id: '13', slug: 'haile-gebrselassie', title: 'Haile Gebrselassie: The Running Legend', summary: 'One of the greatest distance runners of all time, with numerous world records.', image_url: null, view_count: 1200, created_at: '2024-01-06' },
  ],
  'arts': [
    { id: '14', slug: 'oromo-music', title: 'Traditional Oromo Music and Instruments', summary: 'Explore the rich musical heritage of the Oromo people, including traditional instruments.', image_url: null, view_count: 670, created_at: '2024-01-10' },
    { id: '15', slug: 'oromo-dance', title: 'Traditional Oromo Dances', summary: 'Learn about the various traditional dances that play important roles in Oromo culture.', image_url: null, view_count: 540, created_at: '2024-01-04' },
  ],
  'music-arts': [
    { id: '14', slug: 'oromo-music', title: 'Traditional Oromo Music and Instruments', summary: 'Explore the rich musical heritage of the Oromo people, including traditional instruments.', image_url: null, view_count: 670, created_at: '2024-01-10' },
    { id: '15', slug: 'oromo-dance', title: 'Traditional Oromo Dances', summary: 'Learn about the various traditional dances that play important roles in Oromo culture.', image_url: null, view_count: 540, created_at: '2024-01-04' },
  ],
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function WikiCategoryPage({ params }: PageProps) {
  const { slug } = await params
  const category = WIKI_CATEGORIES[slug]

  if (!category) {
    notFound()
  }

  const supabase = await createClient()

  // Try to fetch articles from database
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: dbArticles } = await (supabase as any)
    .from('wiki_articles')
    .select('*')
    .eq('category', slug)
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  // Use mock data if no database results
  const articles = dbArticles && dbArticles.length > 0 ? dbArticles : MOCK_ARTICLES[slug] || []

  return (
    <div className="min-h-screen flex flex-col bg-slate-900">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <div className="bg-gradient-to-b from-emerald-900/20 to-slate-900 py-16">
          <div className="container mx-auto px-4">
            <Link href="/wiki" className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Wiki
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-5xl">{category.icon}</span>
              <div>
                <h1 className="text-4xl font-bold text-white">{category.name}</h1>
                <p className="text-slate-300 mt-1">{category.description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="container mx-auto px-4 py-12">
          <p className="text-slate-400 mb-8">{articles.length} articles in this category</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article: {
              id: string
              slug: string
              title: string
              summary?: string
              image_url?: string | null
              view_count?: number
              created_at: string
            }) => (
              <Link
                key={article.id}
                href={`/wiki/${article.slug}`}
                className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-emerald-500/50 transition-all group"
              >
                {article.image_url && (
                  <img src={article.image_url} alt={article.title} className="w-full h-40 object-cover rounded-lg mb-4" />
                )}
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                  {article.title}
                </h3>
                <p className="text-slate-400 line-clamp-3">{article.summary}</p>
                <div className="flex items-center gap-4 mt-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {article.view_count || 0} views
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(article.created_at).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {articles.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-slate-400 mb-4">No articles in this category yet.</p>
              <Link href="/wiki/contribute" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                Be the first to contribute →
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
