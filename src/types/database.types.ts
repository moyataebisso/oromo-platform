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
      referral_programs: {
        Row: {
          id: string
          job_id: string
          bonus_amount: number
          bonus_currency: 'USD' | 'EUR' | 'ETB'
          bonus_type: 'cash' | 'odda_points' | 'gift_card' | 'other'
          bonus_description: string | null
          max_referrals: number | null
          probation_days: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          job_id: string
          bonus_amount: number
          bonus_currency?: 'USD' | 'EUR' | 'ETB'
          bonus_type?: 'cash' | 'odda_points' | 'gift_card' | 'other'
          bonus_description?: string | null
          max_referrals?: number | null
          probation_days?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          job_id?: string
          bonus_amount?: number
          bonus_currency?: 'USD' | 'EUR' | 'ETB'
          bonus_type?: 'cash' | 'odda_points' | 'gift_card' | 'other'
          bonus_description?: string | null
          max_referrals?: number | null
          probation_days?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      referrals: {
        Row: {
          id: string
          program_id: string
          referrer_id: string
          referral_code: string
          referred_user_id: string | null
          referred_email: string | null
          referred_name: string | null
          status: 'pending' | 'clicked' | 'applied' | 'interviewing' | 'hired' | 'completed' | 'rejected'
          bonus_earned: number | null
          clicked_at: string | null
          applied_at: string | null
          hired_at: string | null
          completed_at: string | null
          paid_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          program_id: string
          referrer_id: string
          referral_code: string
          referred_user_id?: string | null
          referred_email?: string | null
          referred_name?: string | null
          status?: 'pending' | 'clicked' | 'applied' | 'interviewing' | 'hired' | 'completed' | 'rejected'
          bonus_earned?: number | null
          clicked_at?: string | null
          applied_at?: string | null
          hired_at?: string | null
          completed_at?: string | null
          paid_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          program_id?: string
          referrer_id?: string
          referral_code?: string
          referred_user_id?: string | null
          referred_email?: string | null
          referred_name?: string | null
          status?: 'pending' | 'clicked' | 'applied' | 'interviewing' | 'hired' | 'completed' | 'rejected'
          bonus_earned?: number | null
          clicked_at?: string | null
          applied_at?: string | null
          hired_at?: string | null
          completed_at?: string | null
          paid_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      referral_messages: {
        Row: {
          id: string
          referral_id: string
          sender_id: string
          message: string
          created_at: string
        }
        Insert: {
          id?: string
          referral_id: string
          sender_id: string
          message: string
          created_at?: string
        }
        Update: {
          id?: string
          referral_id?: string
          sender_id?: string
          message?: string
          created_at?: string
        }
      }
      referral_stats: {
        Row: {
          id: string
          user_id: string
          total_referrals: number
          successful_hires: number
          total_earned: number
          odda_points: number
          badge: 'bronze' | 'silver' | 'gold' | 'platinum'
          show_on_leaderboard: boolean
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          total_referrals?: number
          successful_hires?: number
          total_earned?: number
          odda_points?: number
          badge?: 'bronze' | 'silver' | 'gold' | 'platinum'
          show_on_leaderboard?: boolean
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          total_referrals?: number
          successful_hires?: number
          total_earned?: number
          odda_points?: number
          badge?: 'bronze' | 'silver' | 'gold' | 'platinum'
          show_on_leaderboard?: boolean
          updated_at?: string
        }
      }
      odda_points_transactions: {
        Row: {
          id: string
          user_id: string
          amount: number
          type: 'referral_bonus' | 'course_completion' | 'wiki_contribution' | 'redemption' | 'other'
          description: string | null
          reference_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          type: 'referral_bonus' | 'course_completion' | 'wiki_contribution' | 'redemption' | 'other'
          description?: string | null
          reference_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          type?: 'referral_bonus' | 'course_completion' | 'wiki_contribution' | 'redemption' | 'other'
          description?: string | null
          reference_id?: string | null
          created_at?: string
        }
      }
      // Teen Section Tables
      teen_profiles: {
        Row: {
          id: string
          user_id: string
          grade_level: number | null
          school_name: string | null
          interests: string[] | null
          college_goals: string | null
          total_points: number
          streak_days: number
          last_activity_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          grade_level?: number | null
          school_name?: string | null
          interests?: string[] | null
          college_goals?: string | null
          total_points?: number
          streak_days?: number
          last_activity_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          grade_level?: number | null
          school_name?: string | null
          interests?: string[] | null
          college_goals?: string | null
          total_points?: number
          streak_days?: number
          last_activity_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      teen_courses: {
        Row: {
          id: string
          title: string
          slug: string
          description: string | null
          thumbnail_url: string | null
          category: 'sat-prep' | 'act-prep' | 'college-prep' | 'study-skills' | 'oromo-culture'
          difficulty: 'beginner' | 'intermediate' | 'advanced'
          estimated_hours: number | null
          xp_reward: number
          is_featured: boolean
          is_published: boolean
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description?: string | null
          thumbnail_url?: string | null
          category: 'sat-prep' | 'act-prep' | 'college-prep' | 'study-skills' | 'oromo-culture'
          difficulty?: 'beginner' | 'intermediate' | 'advanced'
          estimated_hours?: number | null
          xp_reward?: number
          is_featured?: boolean
          is_published?: boolean
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          description?: string | null
          thumbnail_url?: string | null
          category?: 'sat-prep' | 'act-prep' | 'college-prep' | 'study-skills' | 'oromo-culture'
          difficulty?: 'beginner' | 'intermediate' | 'advanced'
          estimated_hours?: number | null
          xp_reward?: number
          is_featured?: boolean
          is_published?: boolean
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      teen_lessons: {
        Row: {
          id: string
          course_id: string
          title: string
          slug: string
          description: string | null
          content: string | null
          video_url: string | null
          duration_minutes: number | null
          xp_reward: number
          order_index: number
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          course_id: string
          title: string
          slug: string
          description?: string | null
          content?: string | null
          video_url?: string | null
          duration_minutes?: number | null
          xp_reward?: number
          order_index?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          title?: string
          slug?: string
          description?: string | null
          content?: string | null
          video_url?: string | null
          duration_minutes?: number | null
          xp_reward?: number
          order_index?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      teen_flashcard_sets: {
        Row: {
          id: string
          lesson_id: string
          title: string
          description: string | null
          xp_reward: number
          created_at: string
        }
        Insert: {
          id?: string
          lesson_id: string
          title: string
          description?: string | null
          xp_reward?: number
          created_at?: string
        }
        Update: {
          id?: string
          lesson_id?: string
          title?: string
          description?: string | null
          xp_reward?: number
          created_at?: string
        }
      }
      teen_flashcards: {
        Row: {
          id: string
          set_id: string
          front_text: string
          back_text: string
          hint: string | null
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          set_id: string
          front_text: string
          back_text: string
          hint?: string | null
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          set_id?: string
          front_text?: string
          back_text?: string
          hint?: string | null
          order_index?: number
          created_at?: string
        }
      }
      teen_quizzes: {
        Row: {
          id: string
          lesson_id: string
          title: string
          description: string | null
          time_limit_minutes: number | null
          passing_score: number
          xp_reward: number
          created_at: string
        }
        Insert: {
          id?: string
          lesson_id: string
          title: string
          description?: string | null
          time_limit_minutes?: number | null
          passing_score?: number
          xp_reward?: number
          created_at?: string
        }
        Update: {
          id?: string
          lesson_id?: string
          title?: string
          description?: string | null
          time_limit_minutes?: number | null
          passing_score?: number
          xp_reward?: number
          created_at?: string
        }
      }
      teen_quiz_questions: {
        Row: {
          id: string
          quiz_id: string
          question_text: string
          question_type: 'multiple_choice' | 'true_false' | 'fill_blank'
          options: string[] | null
          correct_answer: string
          explanation: string | null
          points: number
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          quiz_id: string
          question_text: string
          question_type: 'multiple_choice' | 'true_false' | 'fill_blank'
          options?: string[] | null
          correct_answer: string
          explanation?: string | null
          points?: number
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          quiz_id?: string
          question_text?: string
          question_type?: 'multiple_choice' | 'true_false' | 'fill_blank'
          options?: string[] | null
          correct_answer?: string
          explanation?: string | null
          points?: number
          order_index?: number
          created_at?: string
        }
      }
      teen_matching_games: {
        Row: {
          id: string
          lesson_id: string
          title: string
          description: string | null
          time_limit_seconds: number | null
          xp_reward: number
          created_at: string
        }
        Insert: {
          id?: string
          lesson_id: string
          title: string
          description?: string | null
          time_limit_seconds?: number | null
          xp_reward?: number
          created_at?: string
        }
        Update: {
          id?: string
          lesson_id?: string
          title?: string
          description?: string | null
          time_limit_seconds?: number | null
          xp_reward?: number
          created_at?: string
        }
      }
      teen_matching_pairs: {
        Row: {
          id: string
          game_id: string
          left_text: string
          right_text: string
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          game_id: string
          left_text: string
          right_text: string
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          game_id?: string
          left_text?: string
          right_text?: string
          order_index?: number
          created_at?: string
        }
      }
      teen_progress: {
        Row: {
          id: string
          user_id: string
          course_id: string | null
          lesson_id: string | null
          activity_type: 'lesson' | 'flashcard' | 'quiz' | 'matching_game'
          activity_id: string | null
          completed: boolean
          score: number | null
          xp_earned: number
          time_spent_seconds: number | null
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          course_id?: string | null
          lesson_id?: string | null
          activity_type: 'lesson' | 'flashcard' | 'quiz' | 'matching_game'
          activity_id?: string | null
          completed?: boolean
          score?: number | null
          xp_earned?: number
          time_spent_seconds?: number | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string | null
          lesson_id?: string | null
          activity_type?: 'lesson' | 'flashcard' | 'quiz' | 'matching_game'
          activity_id?: string | null
          completed?: boolean
          score?: number | null
          xp_earned?: number
          time_spent_seconds?: number | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      teen_community_posts: {
        Row: {
          id: string
          user_id: string
          title: string | null
          content: string
          category: 'general' | 'question' | 'achievement' | 'college' | 'study-tips' | 'motivation'
          likes_count: number
          comments_count: number
          is_pinned: boolean
          is_approved: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title?: string | null
          content: string
          category?: 'general' | 'question' | 'achievement' | 'college' | 'study-tips' | 'motivation'
          likes_count?: number
          comments_count?: number
          is_pinned?: boolean
          is_approved?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string | null
          content?: string
          category?: 'general' | 'question' | 'achievement' | 'college' | 'study-tips' | 'motivation'
          likes_count?: number
          comments_count?: number
          is_pinned?: boolean
          is_approved?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      teen_community_comments: {
        Row: {
          id: string
          post_id: string
          user_id: string
          content: string
          likes_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          post_id: string
          user_id: string
          content: string
          likes_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          user_id?: string
          content?: string
          likes_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      teen_community_likes: {
        Row: {
          id: string
          user_id: string
          post_id: string | null
          comment_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          post_id?: string | null
          comment_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          post_id?: string | null
          comment_id?: string | null
          created_at?: string
        }
      }
      course_enrollments: {
        Row: {
          id: string
          user_id: string
          course_id: string
          status: 'not_started' | 'in_progress' | 'completed'
          progress_percent: number
          enrolled_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          status?: 'not_started' | 'in_progress' | 'completed'
          progress_percent?: number
          enrolled_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string
          status?: 'not_started' | 'in_progress' | 'completed'
          progress_percent?: number
          enrolled_at?: string
          completed_at?: string | null
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
