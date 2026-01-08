export interface NewsItem {
  id: string
  title: string
  excerpt: string
  content: string | null
  source_name: string
  source_logo_url: string | null
  source_url: string
  image_url: string | null
  category: NewsCategory
  published_at: string
  created_at: string
}

export type NewsCategory =
  | 'politics'
  | 'culture'
  | 'business'
  | 'sports'
  | 'community'
  | 'world'
  | 'opinion'
