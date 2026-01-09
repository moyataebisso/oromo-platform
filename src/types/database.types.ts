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
          summary: string | null
          content: string
          category: string | null
          category_id: string | null
          author_id: string | null
          author_name: string | null
          image_url: string | null
          status: 'draft' | 'published' | 'archived'
          is_featured: boolean
          is_published: boolean
          view_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          summary?: string | null
          content: string
          category?: string | null
          category_id?: string | null
          author_id?: string | null
          author_name?: string | null
          image_url?: string | null
          status?: 'draft' | 'published' | 'archived'
          is_featured?: boolean
          is_published?: boolean
          view_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          summary?: string | null
          content?: string
          category?: string | null
          category_id?: string | null
          author_id?: string | null
          author_name?: string | null
          image_url?: string | null
          status?: 'draft' | 'published' | 'archived'
          is_featured?: boolean
          is_published?: boolean
          view_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          created_at?: string
        }
      }
      flashcards: {
        Row: {
          id: string
          lesson_id: string
          term: string
          definition: string
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          lesson_id: string
          term: string
          definition: string
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          lesson_id?: string
          term?: string
          definition?: string
          order_index?: number
          created_at?: string
        }
      }
      lesson_progress: {
        Row: {
          id: string
          user_id: string
          lesson_id: string
          course_id: string
          completed: boolean
          completed_at: string | null
          quiz_score: number | null
          last_accessed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          lesson_id: string
          course_id: string
          completed?: boolean
          completed_at?: string | null
          quiz_score?: number | null
          last_accessed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          lesson_id?: string
          course_id?: string
          completed?: boolean
          completed_at?: string | null
          quiz_score?: number | null
          last_accessed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      news_articles: {
        Row: {
          id: string
          title: string
          slug: string
          summary: string | null
          content: string
          category: string
          author: string | null
          source: string | null
          source_url: string | null
          image_url: string | null
          published_at: string
          is_published: boolean
          is_featured: boolean
          view_count: number
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          summary?: string | null
          content: string
          category: string
          author?: string | null
          source?: string | null
          source_url?: string | null
          image_url?: string | null
          published_at?: string
          is_published?: boolean
          is_featured?: boolean
          view_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          summary?: string | null
          content?: string
          category?: string
          author?: string | null
          source?: string | null
          source_url?: string | null
          image_url?: string | null
          published_at?: string
          is_published?: boolean
          is_featured?: boolean
          view_count?: number
          created_at?: string
        }
      }
      news_categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          created_at?: string
        }
      }
      news_sources: {
        Row: {
          id: string
          name: string
          url: string
          rss_url: string | null
          category: string | null
          is_active: boolean
          auto_publish: boolean
          last_fetched_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          url: string
          rss_url?: string | null
          category?: string | null
          is_active?: boolean
          auto_publish?: boolean
          last_fetched_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          url?: string
          rss_url?: string | null
          category?: string | null
          is_active?: boolean
          auto_publish?: boolean
          last_fetched_at?: string | null
          created_at?: string
        }
      }
      news_fetch_logs: {
        Row: {
          id: string
          source_id: string
          articles_fetched: number
          status: string
          error_message: string | null
          created_at: string
        }
        Insert: {
          id?: string
          source_id: string
          articles_fetched: number
          status: string
          error_message?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          source_id?: string
          articles_fetched?: number
          status?: string
          error_message?: string | null
          created_at?: string
        }
      }
      newsletter_subscribers: {
        Row: {
          id: string
          email: string
          name: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          is_active?: boolean
          created_at?: string
        }
      }
      careers: {
        Row: {
          id: string
          title: string
          slug: string
          category: string
          description: string | null
          education_required: string | null
          skills_needed: string | null
          salary_min: number | null
          salary_max: number | null
          job_outlook: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          category: string
          description?: string | null
          education_required?: string | null
          skills_needed?: string | null
          salary_min?: number | null
          salary_max?: number | null
          job_outlook?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          category?: string
          description?: string | null
          education_required?: string | null
          skills_needed?: string | null
          salary_min?: number | null
          salary_max?: number | null
          job_outlook?: string | null
          created_at?: string
        }
      }
      interview_questions: {
        Row: {
          id: string
          career_id: string | null
          question: string
          sample_answer: string | null
          tips: string | null
          category: string
          difficulty: string
          created_at: string
        }
        Insert: {
          id?: string
          career_id?: string | null
          question: string
          sample_answer?: string | null
          tips?: string | null
          category: string
          difficulty: string
          created_at?: string
        }
        Update: {
          id?: string
          career_id?: string | null
          question?: string
          sample_answer?: string | null
          tips?: string | null
          category?: string
          difficulty?: string
          created_at?: string
        }
      }
      majors: {
        Row: {
          id: string
          name: string
          slug: string
          category: string
          description: string | null
          career_paths: string | null
          salary_range: string | null
          job_outlook: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          category: string
          description?: string | null
          career_paths?: string | null
          salary_range?: string | null
          job_outlook?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          category?: string
          description?: string | null
          career_paths?: string | null
          salary_range?: string | null
          job_outlook?: string | null
          created_at?: string
        }
      }
      major_advice: {
        Row: {
          id: string
          major_id: string
          content: string
          author: string | null
          created_at: string
        }
        Insert: {
          id?: string
          major_id: string
          content: string
          author?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          major_id?: string
          content?: string
          author?: string | null
          created_at?: string
        }
      }
      high_school_career_prep: {
        Row: {
          id: string
          title: string
          slug: string
          content: string
          category: string
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          content: string
          category: string
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          content?: string
          category?: string
          order_index?: number
          created_at?: string
        }
      }
      wiki_flashcards: {
        Row: {
          id: string
          article_id: string
          term: string
          definition: string
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          article_id: string
          term: string
          definition: string
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          article_id?: string
          term?: string
          definition?: string
          order_index?: number
          created_at?: string
        }
      }
      wiki_quizzes: {
        Row: {
          id: string
          article_id: string
          question: string
          correct_answer: string
          wrong_answers: string[]
          explanation: string | null
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          article_id: string
          question: string
          correct_answer: string
          wrong_answers: string[]
          explanation?: string | null
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          article_id?: string
          question?: string
          correct_answer?: string
          wrong_answers?: string[]
          explanation?: string | null
          order_index?: number
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
