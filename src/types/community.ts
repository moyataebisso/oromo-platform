// Community Forum Types

export interface ForumCategory {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  color: string | null
  display_order: number
  post_count: number
  created_at: string
}

export interface ForumPost {
  id: string
  category_id: string
  user_id: string
  title: string
  content: string
  is_pinned: boolean
  is_locked: boolean
  view_count: number
  upvotes: number
  downvotes: number
  comment_count: number
  created_at: string
  updated_at: string
  // Joined fields
  author?: PostAuthor
  category?: ForumCategory
  user_vote?: number | null
}

export interface PostAuthor {
  id: string
  display_name: string | null
  username: string | null
  avatar_url: string | null
  role: 'user' | 'admin' | 'moderator'
}

export interface ForumComment {
  id: string
  post_id: string
  user_id: string
  parent_id: string | null
  content: string
  upvotes: number
  downvotes: number
  is_deleted: boolean
  created_at: string
  updated_at: string
  // Joined fields
  author?: PostAuthor
  replies?: ForumComment[]
  user_vote?: number | null
  depth?: number
}

export interface ForumVote {
  id: string
  user_id: string
  post_id: string | null
  comment_id: string | null
  vote_type: number // 1 for upvote, -1 for downvote
  created_at: string
}

export interface Report {
  id: string
  reporter_id: string
  post_id: string | null
  comment_id: string | null
  reason: 'spam' | 'harassment' | 'misinformation' | 'inappropriate' | 'other'
  description: string | null
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed'
  created_at: string
  resolved_at: string | null
  resolved_by: string | null
}

export type SortOption = 'hot' | 'new' | 'top'

export interface PostsFilter {
  category?: string
  sort?: SortOption
  page?: number
  limit?: number
  search?: string
}
