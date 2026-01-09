import Link from 'next/link'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import { CategoryBadge } from './category-badge'

interface ArticleCardProps {
  article: {
    id: string
    slug: string
    title: string
    summary?: string
    image_url?: string
    category: string
    published_at: string
    author?: string
  }
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link
      href={`/news/${article.slug}`}
      className="block bg-slate-800 rounded-xl overflow-hidden border border-slate-700 transition-all duration-300 hover:ring-2 hover:ring-primary/50 hover:shadow-lg"
    >
      <div className="aspect-video relative bg-slate-700">
        {article.image_url ? (
          <Image
            src={article.image_url}
            alt={article.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl">📰</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <CategoryBadge category={article.category} />
          <time className="text-xs text-slate-500">
            {formatDistanceToNow(new Date(article.published_at), { addSuffix: true })}
          </time>
        </div>
        <h3 className="font-semibold text-white line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {article.title}
        </h3>
        {article.summary && (
          <p className="text-sm text-slate-400 line-clamp-2">
            {article.summary}
          </p>
        )}
      </div>
    </Link>
  )
}
