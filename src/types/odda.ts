// ODDA Professional Network Types

export interface ProfessionalProfile {
  id: string
  user_id: string
  headline: string | null
  bio: string | null
  location: string | null
  website_url: string | null
  linkedin_url: string | null
  twitter_url: string | null
  github_url: string | null
  is_open_to_work: boolean
  is_open_to_hire: boolean
  profile_views: number
  connection_count: number
  created_at: string
  updated_at: string
  // Joined fields
  user?: {
    id: string
    display_name: string | null
    username: string | null
    avatar_url: string | null
    email: string
  }
  experiences?: Experience[]
  education?: Education[]
  skills?: Skill[]
}

export interface Experience {
  id: string
  profile_id: string
  company_name: string
  title: string
  location: string | null
  start_date: string
  end_date: string | null
  is_current: boolean
  description: string | null
  order_index: number
  created_at: string
}

export interface Education {
  id: string
  profile_id: string
  institution_name: string
  degree: string | null
  field_of_study: string | null
  start_date: string | null
  end_date: string | null
  description: string | null
  order_index: number
  created_at: string
}

export interface Skill {
  id: string
  profile_id: string
  name: string
  endorsement_count: number
  created_at: string
}

export interface Connection {
  id: string
  requester_id: string
  addressee_id: string
  status: 'pending' | 'accepted' | 'rejected'
  message: string | null
  created_at: string
  updated_at: string
  // Joined fields
  requester?: ProfessionalProfile
  addressee?: ProfessionalProfile
}

export type ConnectionStatus = 'none' | 'pending_sent' | 'pending_received' | 'connected'

export interface ProfileFormData {
  headline: string
  bio: string
  location: string
  website_url: string
  linkedin_url: string
  twitter_url: string
  github_url: string
  is_open_to_work: boolean
  is_open_to_hire: boolean
}

export interface ExperienceFormData {
  company_name: string
  title: string
  location: string
  start_date: string
  end_date: string
  is_current: boolean
  description: string
}

export interface EducationFormData {
  institution_name: string
  degree: string
  field_of_study: string
  start_date: string
  end_date: string
  description: string
}

export interface MemberFilters {
  search?: string
  location?: string
  skill?: string
  is_open_to_work?: boolean
  page?: number
  limit?: number
}
