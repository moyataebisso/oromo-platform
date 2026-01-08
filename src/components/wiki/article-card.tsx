import Link from 'next/link'
import { Clock, Eye } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { WikiArticle } from '@/types/wiki'

interface ArticleCardProps {
  article: WikiArticle
  variant?: 'default' | 'featured'
  className?: string
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export const ArticleCard = ({ article, variant = 'default', className }: ArticleCardProps) => {
  const isFeatured = variant === 'featured'

  return (
    <Link href={`/wiki/${article.slug}`}>
      <Card className={cn(
        'h-full hover:shadow-md transition-all duration-200 group',
        isFeatured && 'border-blue-200 bg-blue-50/50',
        className
      )}>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1">
              {article.category && (
                <Badge variant="secondary" className="text-xs">
                  {article.category.name}
                </Badge>
              )}
              <h3 className={cn(
                'font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2',
                isFeatured ? 'text-xl' : 'text-lg'
              )}>
                {article.title}
              </h3>
            </div>
            {article.is_featured && (
              <Badge className="bg-yellow-100 text-yellow-700 shrink-0">Featured</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          {article.excerpt && (
            <p className={cn(
              'text-slate-600 line-clamp-2',
              isFeatured ? 'text-base' : 'text-sm'
            )}>
              {article.excerpt}
            </p>
          )}
        </CardContent>
        <CardFooter className="pt-2">
          <div className="flex items-center justify-between w-full text-sm text-slate-500">
            <div className="flex items-center gap-2">
              {article.author && (
                <div className="flex items-center gap-1.5">
                  <Avatar className="w-5 h-5">
                    <AvatarImage src={article.author.avatar_url || undefined} />
                    <AvatarFallback className="text-xs">
                      {article.author.display_name?.[0] || 'A'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate max-w-24">
                    {article.author.display_name || 'Anonymous'}
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              {article.views_count !== undefined && (
                <div className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  <span>{article.views_count}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{formatDate(article.created_at)}</span>
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
