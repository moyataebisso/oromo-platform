'use client'

import Link from 'next/link'
import { FileText, ArrowRight, Clock, Eye } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface RelatedArticle {
  slug: string
  title: string
  category?: string
  excerpt?: string
  views_count?: number
  reading_time?: string
}

interface RelatedArticlesProps {
  articles: RelatedArticle[]
  currentArticleSlug?: string
}

export const RelatedArticles = ({ articles, currentArticleSlug }: RelatedArticlesProps) => {
  // Filter out current article if present
  const filteredArticles = articles.filter(article => article.slug !== currentArticleSlug)

  if (filteredArticles.length === 0) return null

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Related Articles
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ul className="space-y-3">
          {filteredArticles.map((article) => (
            <li key={article.slug}>
              <Link
                href={`/wiki/${article.slug}`}
                className="block p-3 -mx-3 rounded-lg hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center flex-shrink-0 group-hover:from-amber-200 group-hover:to-orange-200 transition-colors">
                    <FileText className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-slate-900 group-hover:text-blue-600 line-clamp-2 transition-colors">
                      {article.title}
                    </h4>
                    {article.excerpt && (
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                        {article.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-2">
                      {article.category && (
                        <Badge variant="secondary" className="text-xs px-1.5 py-0">
                          {article.category}
                        </Badge>
                      )}
                      {article.views_count !== undefined && (
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                          <Eye className="w-3 h-3" />
                          {article.views_count.toLocaleString()}
                        </span>
                      )}
                      {article.reading_time && (
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                          <Clock className="w-3 h-3" />
                          {article.reading_time}
                        </span>
                      )}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {/* View More Link */}
        <Link
          href="/wiki"
          className="flex items-center justify-center gap-2 mt-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Browse all articles
          <ArrowRight className="w-4 h-4" />
        </Link>
      </CardContent>
    </Card>
  )
}
