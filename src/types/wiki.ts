export type ArticleStatus = 'draft' | 'published' | 'archived'

export interface WikiCategory {
  id: string
  name: string
  slug: string
  description: string | null
  icon?: string
  articles_count?: number
}

export interface WikiArticle {
  id: string
  title: string
  slug: string
  excerpt?: string
  content: string
  category_id: string | null
  author_id: string
  status: ArticleStatus
  is_featured: boolean
  views_count?: number
  created_at: string
  updated_at?: string
  category?: WikiCategory
  author?: {
    id: string
    display_name: string | null
    avatar_url: string | null
  }
}

export interface WikiRevision {
  id: string
  article_id: string
  content: string
  editor_id: string
  created_at: string
  change_summary?: string
}
