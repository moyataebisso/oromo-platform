export type JobType = 'full-time' | 'part-time' | 'contract' | 'internship'
export type JobStatus = 'active' | 'closed' | 'draft'

export interface Job {
  id: string
  title: string
  company_name: string
  company_logo_url?: string | null
  location: string | null
  job_type: JobType
  salary_min: number | null
  salary_max: number | null
  description: string
  requirements?: string | null
  benefits?: string | null
  status: JobStatus
  posted_by?: string
  created_at: string
  expires_at?: string | null
}

export interface JobApplication {
  id: string
  job_id: string
  user_id: string
  cover_letter: string | null
  resume_url: string | null
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected'
  created_at: string
}

export interface JobFilters {
  search?: string
  job_type?: JobType
  location?: string
}
