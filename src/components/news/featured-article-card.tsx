import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { CategoryBadge } from './category-badge'

interface FeaturedArticleCardProps {
  article: {
    id: string
    slug: string
    title: string
    summary?: string
    image_url?: string
    category: string
    published_at: string
  }
  size?: 'large' | 'medium'
}

export function FeaturedArticleCard({ article, size = 'large' }: FeaturedArticleCardProps) {
  const heightClass = size === 'large' ? 'h-96' : 'h-64'

  return (
    <Link
      href={`/news/${article.slug}`}
      className={`relative block ${heightClass} rounded-xl overflow-hidden group transition-transform duration-300 hover:scale-[1.02]`}
    >
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
        style={{
          backgroundImage: article.image_url
            ? `url(${article.image_url})`
            : 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <CategoryBadge category={article.category} className="mb-3" />
        <h3 className={`font-bold text-white mb-2 line-clamp-2 ${size === 'large' ? 'text-2xl md:text-3xl' : 'text-xl'}`}>
          {article.title}
        </h3>
        {article.summary && size === 'large' && (
          <p className="text-slate-300 line-clamp-2 mb-3 hidden md:block">
            {article.summary}
          </p>
        )}
        <time className="text-sm text-slate-400">
          {formatDistanceToNow(new Date(article.published_at), { addSuffix: true })}
        </time>
      </div>
    </Link>
  )
}
