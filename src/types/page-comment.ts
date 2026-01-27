// Page comment types for feedback system - matches Supabase schema

export type CommentType = 'error' | 'suggestion' | 'question' | 'general'
export type CommentStatus = 'active' | 'resolved' | 'hidden' | 'spam'
export type ReplyStatus = 'active' | 'hidden' | 'spam'

export interface PageComment {
  id: string
  page_path: string
  page_title: string | null
  user_id: string | null
  guest_id: string | null
  display_name: string | null
  comment_type: CommentType
  content: string
  element_selector: string | null
  position_x: number | null
  position_y: number | null
  status: CommentStatus
  is_pinned: boolean
  resolved_by: string | null
  resolved_at: string | null
  admin_note: string | null
  upvote_count: number
  created_at: string
  updated_at: string
  // Joined data
  user?: {
    id: string
    display_name: string | null
    avatar_url: string | null
  } | null
  replies?: CommentReply[]
  reply_count?: number
}

export interface CommentReply {
  id: string
  comment_id: string
  user_id: string | null
  guest_id: string | null
  display_name: string | null
  content: string
  status: ReplyStatus
  created_at: string
  // Joined data
  user?: {
    id: string
    display_name: string | null
    avatar_url: string | null
  } | null
}

export interface PageCommentUpvote {
  id: string
  comment_id: string
  user_id: string | null
  guest_id: string | null
  created_at: string
}

export interface CreateCommentData {
  page_path: string
  page_title?: string
  comment_type: CommentType
  content: string
  display_name?: string
  user_id?: string | null
  guest_id?: string | null
}

export interface CreateReplyData {
  comment_id: string
  content: string
  display_name?: string
  user_id?: string | null
  guest_id?: string | null
}

export interface UpdateCommentData {
  content?: string
  display_name?: string
  status?: CommentStatus
  admin_note?: string
  is_pinned?: boolean
  resolved_by?: string
  resolved_at?: string
}

export interface CommentFilters {
  page_path?: string
  comment_type?: CommentType
  status?: CommentStatus
  limit?: number
  offset?: number
}

// Comment type display config
export const COMMENT_TYPE_CONFIG = {
  error: {
    label: 'Report an Error',
    emoji: '',
    color: 'red',
    bgClass: 'bg-red-500',
    textClass: 'text-red-500',
    borderClass: 'border-red-500',
  },
  suggestion: {
    label: 'Suggestion',
    emoji: '',
    color: 'blue',
    bgClass: 'bg-blue-500',
    textClass: 'text-blue-500',
    borderClass: 'border-blue-500',
  },
  question: {
    label: 'Question',
    emoji: '',
    color: 'yellow',
    bgClass: 'bg-yellow-500',
    textClass: 'text-yellow-600',
    borderClass: 'border-yellow-500',
  },
  general: {
    label: 'General Comment',
    emoji: '',
    color: 'gray',
    bgClass: 'bg-gray-500',
    textClass: 'text-gray-500',
    borderClass: 'border-gray-500',
  },
} as const

// Status display config
export const COMMENT_STATUS_CONFIG = {
  active: {
    label: 'Active',
    color: 'green',
    bgClass: 'bg-green-500',
  },
  resolved: {
    label: 'Resolved',
    color: 'blue',
    bgClass: 'bg-blue-500',
  },
  hidden: {
    label: 'Hidden',
    color: 'gray',
    bgClass: 'bg-gray-500',
  },
  spam: {
    label: 'Spam',
    color: 'red',
    bgClass: 'bg-red-500',
  },
} as const
