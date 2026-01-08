export interface Business {
  id: string
  name: string
  slug: string
  description: string | null
  category: BusinessCategory
  address: string
  city: string
  state: string
  zip_code: string | null
  phone: string | null
  email: string | null
  website: string | null
  logo_url: string | null
  cover_image_url: string | null
  hours: BusinessHours | null
  rating: number
  review_count: number
  is_verified: boolean
  is_claimed: boolean
  owner_id: string | null
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  updated_at: string
}

export type BusinessCategory =
  | 'restaurant'
  | 'grocery'
  | 'clothing'
  | 'professional'
  | 'beauty'
  | 'auto'
  | 'real-estate'
  | 'healthcare'
  | 'education'
  | 'other'

export interface BusinessHours {
  monday?: { open: string; close: string } | null
  tuesday?: { open: string; close: string } | null
  wednesday?: { open: string; close: string } | null
  thursday?: { open: string; close: string } | null
  friday?: { open: string; close: string } | null
  saturday?: { open: string; close: string } | null
  sunday?: { open: string; close: string } | null
}

export interface BusinessReview {
  id: string
  business_id: string
  user_id: string
  rating: number
  title: string | null
  content: string
  is_verified: boolean
  created_at: string
  user?: {
    display_name: string | null
    avatar_url: string | null
  }
}

export const BUSINESS_CATEGORIES: { value: BusinessCategory; label: string; icon: string }[] = [
  { value: 'restaurant', label: 'Restaurant', icon: '🍽️' },
  { value: 'grocery', label: 'Grocery Store', icon: '🛒' },
  { value: 'clothing', label: 'Clothing', icon: '👕' },
  { value: 'professional', label: 'Professional Services', icon: '💼' },
  { value: 'beauty', label: 'Beauty & Salon', icon: '💇' },
  { value: 'auto', label: 'Auto Services', icon: '🚗' },
  { value: 'real-estate', label: 'Real Estate', icon: '🏠' },
  { value: 'healthcare', label: 'Healthcare', icon: '🏥' },
  { value: 'education', label: 'Education', icon: '📚' },
  { value: 'other', label: 'Other', icon: '📦' },
]
