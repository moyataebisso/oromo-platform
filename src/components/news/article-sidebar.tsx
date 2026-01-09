import Link from 'next/link'
import { TrendingUp } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { CategoryBadge } from './category-badge'
import { NewsletterSignup } from './newsletter-signup'

interface ArticleSidebarProps {
  currentArticleId?: string
}

interface Category {
  id: string
  name: string
  slug: string
}

interface PopularArticle {
  id: string
  slug: string
  title: string
  category: string
  view_count?: number
}

export async function ArticleSidebar({ currentArticleId }: ArticleSidebarProps) {
  const supabase = await createClient()

  // Fetch categories with counts
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: categoriesData } = await (supabase as any)
    .from('news_categories')
    .select('*')
    .order('name')

  const categories = (categoriesData || []) as Category[]

  // Fetch popular articles
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: popularArticlesData } = await (supabase as any)
    .from('news_articles')
    .select('id, slug, title, category, view_count')
    .eq('is_published', true)
    .neq('id', currentArticleId || '')
    .order('view_count', { ascending: false })
    .limit(5)

  const popularArticles = (popularArticlesData || []) as PopularArticle[]

  // Get article counts per category
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: articleCountsData } = await (supabase as any)
    .from('news_articles')
    .select('category')
    .eq('is_published', true)

  const articleCounts = (articleCountsData || []) as { category: string }[]

  const categoryCounts: Record<string, number> = {}
  articleCounts.forEach(article => {
    categoryCounts[article.category] = (categoryCounts[article.category] || 0) + 1
  })

  return (
    <div className="space-y-6">
      {/* Categories Section */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h3 className="font-semibold text-white mb-4">Categories</h3>
        <div className="space-y-2">
          {categories?.map((category) => (
            <Link
              key={category.id}
              href={`/news/category/${category.slug}`}
              className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-slate-700 transition-colors group"
            >
              <span className="text-slate-300 group-hover:text-white transition-colors capitalize">
                {category.name}
              </span>
              <span className="text-xs text-slate-500 bg-slate-700 px-2 py-1 rounded-full">
                {categoryCounts[category.slug] || 0}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Newsletter Signup */}
      <NewsletterSignup />

      {/* Popular Articles */}
      {popularArticles && popularArticles.length > 0 && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-white">Popular</h3>
          </div>
          <div className="space-y-4">
            {popularArticles.map((article, index) => (
              <Link
                key={article.id}
                href={`/news/${article.slug}`}
                className="flex gap-3 group"
              >
                <span className="text-2xl font-bold text-slate-600 group-hover:text-primary transition-colors">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-slate-300 line-clamp-2 group-hover:text-white transition-colors">
                    {article.title}
                  </h4>
                  <CategoryBadge category={article.category} className="mt-1 text-[10px] px-2 py-0.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
