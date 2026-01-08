'use client'

import { ExternalLink, Calendar } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { NewsItem } from '@/types/news'

interface NewsCardProps {
  news: NewsItem
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

  if (diffHours < 1) return 'Just now'
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffHours < 48) return 'Yesterday'
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const categoryColors: Record<string, string> = {
  politics: 'bg-red-100 text-red-700',
  culture: 'bg-purple-100 text-purple-700',
  business: 'bg-blue-100 text-blue-700',
  sports: 'bg-green-100 text-green-700',
  community: 'bg-amber-100 text-amber-700',
  world: 'bg-slate-100 text-slate-700',
  opinion: 'bg-pink-100 text-pink-700',
}

export const NewsCard = ({ news }: NewsCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 group h-full">
      <a
        href={news.source_url}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full"
      >
        {/* Image */}
        <div className="relative h-40 bg-gradient-to-br from-slate-100 to-slate-200">
          {news.image_url ? (
            <img
              src={news.image_url}
              alt={news.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl">
              📰
            </div>
          )}
          <div className="absolute top-3 left-3">
            <Badge className={categoryColors[news.category] || 'bg-slate-100 text-slate-700'}>
              {news.category}
            </Badge>
          </div>
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-white rounded-full p-1.5 shadow">
              <ExternalLink className="w-4 h-4 text-slate-600" />
            </div>
          </div>
        </div>

        <CardContent className="p-4">
          {/* Source */}
          <div className="flex items-center gap-2 mb-2">
            {news.source_logo_url ? (
              <img
                src={news.source_logo_url}
                alt={news.source_name}
                className="w-5 h-5 rounded"
              />
            ) : (
              <div className="w-5 h-5 rounded bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">
                {news.source_name[0]}
              </div>
            )}
            <span className="text-xs text-slate-500 font-medium">{news.source_name}</span>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors mb-2">
            {news.title}
          </h3>

          {/* Excerpt */}
          <p className="text-sm text-slate-600 line-clamp-2 mb-3">
            {news.excerpt}
          </p>

          {/* Date */}
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(news.published_at)}</span>
          </div>
        </CardContent>
      </a>
    </Card>
  )
}
