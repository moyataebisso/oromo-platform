import { Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { CategoryBadge } from '@/components/news/category-badge'
import { ShareButtons } from '@/components/news/share-buttons'
import { ArticleCard } from '@/components/news/article-card'
import { ArticleSidebar } from '@/components/news/article-sidebar'

interface ArticlePageProps {
  params: Promise<{ slug: string }>
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

interface Article {
  id: string
  title: string
  slug: string
  summary?: string
  content: string
  category: string
  author?: string
  source?: string
  source_url?: string
  image_url?: string
  published_at: string
  view_count?: number
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  const supabase = await createClient()

  // Fetch the article
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: articleData, error } = await (supabase as any)
    .from('news_articles')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (error || !articleData) {
    notFound()
  }

  const article = articleData as Article

  // Increment view count (fire and forget)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(supabase as any)
    .from('news_articles')
    .update({ view_count: (article.view_count || 0) + 1 })
    .eq('id', article.id)
    .then()

  // Fetch related articles
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: relatedArticlesData } = await (supabase as any)
    .from('news_articles')
    .select('*')
    .eq('is_published', true)
    .eq('category', article.category)
    .neq('id', article.id)
    .order('published_at', { ascending: false })
    .limit(3)

  const relatedArticles = (relatedArticlesData || []) as Article[]

  const articleUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://oromo.org'}/news/${article.slug}`

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Image */}
      {article.image_url && (
        <div className="relative h-[400px] md:h-[500px]">
          <Image
            src={article.image_url}
            alt={decodeHTMLEntities(article.title)}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <article className={`lg:col-span-2 ${article.image_url ? '-mt-32 relative z-10' : 'pt-8'}`}>
            <div className="bg-slate-900 rounded-t-2xl p-6 md:p-8">
              {/* Back Link */}
              <Link
                href="/news"
                className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to News
              </Link>

              {/* Category */}
              <CategoryBadge category={article.category} className="mb-4" />

              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                {decodeHTMLEntities(article.title)}
              </h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-slate-400 mb-6 pb-6 border-b border-slate-700">
                {article.author && (
                  <span>By <strong className="text-white">{article.author}</strong></span>
                )}
                <span>
                  {formatDistanceToNow(new Date(article.published_at), { addSuffix: true })}
                </span>
                {article.source && (
                  <a
                    href={article.source_url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline"
                  >
                    {article.source}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              {/* Share Buttons */}
              <div className="mb-8">
                <ShareButtons url={articleUrl} title={decodeHTMLEntities(article.title)} />
              </div>

              {/* Content */}
              <div className="prose prose-invert prose-lg max-w-none">
                {article.content.split('\n').map((paragraph: string, index: number) => {
                  const decoded = decodeHTMLEntities(paragraph)
                  if (decoded.startsWith('# ')) {
                    return <h2 key={index} className="text-2xl font-bold text-white mt-8 mb-4">{decoded.slice(2)}</h2>
                  }
                  if (decoded.startsWith('## ')) {
                    return <h3 key={index} className="text-xl font-semibold text-white mt-6 mb-3">{decoded.slice(3)}</h3>
                  }
                  if (decoded.startsWith('*') && decoded.endsWith('*')) {
                    return <p key={index} className="text-slate-400 italic">{decoded.slice(1, -1)}</p>
                  }
                  if (decoded.trim()) {
                    return <p key={index} className="text-slate-300 mb-4 leading-relaxed">{decoded}</p>
                  }
                  return null
                })}
              </div>

              {/* Bottom Share Buttons */}
              <div className="mt-12 pt-8 border-t border-slate-700">
                <p className="text-slate-400 mb-4">Share this article</p>
                <ShareButtons url={articleUrl} title={decodeHTMLEntities(article.title)} />
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-1 pt-8">
            <Suspense fallback={<div className="animate-pulse bg-slate-800 rounded-xl h-96" />}>
              <ArticleSidebar currentArticleId={article.id} />
            </Suspense>
          </aside>
        </div>

        {/* Related Articles */}
        {relatedArticles && relatedArticles.length > 0 && (
          <section className="py-16 border-t border-slate-800">
            <h2 className="text-2xl font-bold text-white mb-8">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedArticles.map((related) => (
                <ArticleCard key={related.id} article={related} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
