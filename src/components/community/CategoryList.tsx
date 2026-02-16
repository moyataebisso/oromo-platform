'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MessageSquare } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { ForumCategory } from '@/types/community'

interface CategoryListProps {
  categories: ForumCategory[]
  showHeader?: boolean
}

const categoryIcons: Record<string, string> = {
  general: '💬',
  culture: '🎭',
  language: '📚',
  history: '📜',
  diaspora: '🌍',
  business: '💼',
  technology: '💻',
  education: '🎓',
}

export function CategoryList({ categories, showHeader = true }: CategoryListProps) {
  const pathname = usePathname()
  const currentCategory = pathname.split('/')[2] || ''

  return (
    <Card>
      {showHeader && (
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Categories
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className={cn(!showHeader && 'pt-4')}>
        <div className="space-y-1">
          <Link
            href="/community"
            className={cn(
              'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              !currentCategory
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )}
          >
            <span>All Posts</span>
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/community/${category.slug}`}
              className={cn(
                'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                currentCategory === category.slug
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <span className="flex items-center gap-2">
                <span>{categoryIcons[category.slug] || category.icon || '📁'}</span>
                <span>{category.name}</span>
              </span>
              <span className="text-xs opacity-70">{category.post_count}</span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
