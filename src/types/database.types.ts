export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          username: string | null
          display_name: string | null
          bio: string | null
          avatar_url: string | null
          role: 'user' | 'admin' | 'moderator'
          created_at: string
        }
        Insert: {
          id: string
          email: string
          username?: string | null
          display_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          role?: 'user' | 'admin' | 'moderator'
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          username?: string | null
          display_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          role?: 'user' | 'admin' | 'moderator'
          created_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          title: string
          slug: string
          description: string | null
          thumbnail_url: string | null
          category_id: string | null
          difficulty: 'beginner' | 'intermediate' | 'advanced'
          is_published: boolean
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description?: string | null
          thumbnail_url?: string | null
          category_id?: string | null
          difficulty?: 'beginner' | 'intermediate' | 'advanced'
          is_published?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          description?: string | null
          thumbnail_url?: string | null
          category_id?: string | null
          difficulty?: 'beginner' | 'intermediate' | 'advanced'
          is_published?: boolean
          created_at?: string
        }
      }
      lessons: {
        Row: {
          id: string
          course_id: string
          title: string
          content: string | null
          video_url: string | null
          order_index: number
          is_published: boolean
          created_at: string
        }
        Insert: {
          id?: string
          course_id: string
          title: string
          content?: string | null
          video_url?: string | null
          order_index?: number
          is_published?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          title?: string
          content?: string | null
          video_url?: string | null
          order_index?: number
          is_published?: boolean
          created_at?: string
        }
      }
      jobs: {
        Row: {
          id: string
          title: string
          company_name: string
          location: string | null
          job_type: 'full-time' | 'part-time' | 'contract' | 'internship'
          salary_min: number | null
          salary_max: number | null
          description: string
          status: 'active' | 'closed' | 'draft'
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          company_name: string
          location?: string | null
          job_type?: 'full-time' | 'part-time' | 'contract' | 'internship'
          salary_min?: number | null
          salary_max?: number | null
          description: string
          status?: 'active' | 'closed' | 'draft'
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          company_name?: string
          location?: string | null
          job_type?: 'full-time' | 'part-time' | 'contract' | 'internship'
          salary_min?: number | null
          salary_max?: number | null
          description?: string
          status?: 'active' | 'closed' | 'draft'
          created_at?: string
        }
      }
      wiki_articles: {
        Row: {
          id: string
          title: string
          slug: string
          content: string
          category_id: string | null
          author_id: string
          status: 'draft' | 'published' | 'archived'
          is_featured: boolean
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          content: string
          category_id?: string | null
          author_id: string
          status?: 'draft' | 'published' | 'archived'
          is_featured?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          content?: string
          category_id?: string | null
          author_id?: string
          status?: 'draft' | 'published' | 'archived'
          is_featured?: boolean
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
