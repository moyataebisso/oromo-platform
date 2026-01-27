export interface Business {
  id: string
  name: string
  slug: string
  description: string | null
  category: BusinessCategory
  category_id?: string
  address: string
  city: string
  state: string
  zip_code: string | null
  country?: string
  latitude?: number | null
  longitude?: number | null
  phone: string | null
  email: string | null
  website: string | null
  facebook?: string | null
  instagram?: string | null
  twitter?: string | null
  tiktok?: string | null
  logo_url: string | null
  cover_image_url: string | null
  gallery_images?: string[] | null
  hours: BusinessHours | null
  rating: number
  review_count: number
  is_verified: boolean
  is_claimed: boolean
  is_featured?: boolean
  show_on_homepage?: boolean
  show_in_footer?: boolean
  featured_until?: string | null
  subscription_tier?: 'free' | 'basic' | 'premium'
  subscription_status?: 'inactive' | 'active' | 'cancelled' | 'past_due'
  owner_id: string | null
  status: 'pending' | 'approved' | 'rejected' | 'suspended'
  rejection_reason?: string | null
  view_count?: number
  click_count?: number
  distance?: number // calculated field for nearby searches
  created_at: string
  updated_at: string
}

export type BusinessCategory =
  | 'restaurant-food'
  | 'grocery-market'
  | 'retail-shopping'
  | 'professional-services'
  | 'health-wellness'
  | 'beauty-personal-care'
  | 'automotive'
  | 'real-estate'
  | 'education-tutoring'
  | 'technology-it'
  | 'legal-services'
  | 'financial-services'
  | 'entertainment-events'
  | 'religious-community'
  | 'restaurant'
  | 'grocery'
  | 'clothing'
  | 'professional'
  | 'beauty'
  | 'auto'
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
  { value: 'restaurant-food', label: 'Restaurant & Food', icon: '🍽️' },
  { value: 'grocery-market', label: 'Grocery & Market', icon: '🛒' },
  { value: 'retail-shopping', label: 'Retail & Shopping', icon: '🛍️' },
  { value: 'professional-services', label: 'Professional Services', icon: '💼' },
  { value: 'health-wellness', label: 'Health & Wellness', icon: '🏥' },
  { value: 'beauty-personal-care', label: 'Beauty & Personal Care', icon: '💇' },
  { value: 'automotive', label: 'Automotive', icon: '🚗' },
  { value: 'real-estate', label: 'Real Estate', icon: '🏠' },
  { value: 'education-tutoring', label: 'Education & Tutoring', icon: '📚' },
  { value: 'technology-it', label: 'Technology & IT', icon: '💻' },
  { value: 'legal-services', label: 'Legal Services', icon: '⚖️' },
  { value: 'financial-services', label: 'Financial Services', icon: '🏦' },
  { value: 'entertainment-events', label: 'Entertainment & Events', icon: '🎉' },
  { value: 'religious-community', label: 'Religious & Community', icon: '🕌' },
  { value: 'restaurant', label: 'Restaurant', icon: '🍽️' },
  { value: 'grocery', label: 'Grocery Store', icon: '🛒' },
  { value: 'clothing', label: 'Clothing', icon: '👕' },
  { value: 'professional', label: 'Professional Services', icon: '💼' },
  { value: 'beauty', label: 'Beauty & Salon', icon: '💇' },
  { value: 'auto', label: 'Auto Services', icon: '🚗' },
  { value: 'healthcare', label: 'Healthcare', icon: '🏥' },
  { value: 'education', label: 'Education', icon: '📚' },
  { value: 'other', label: 'Other', icon: '📦' },
]

export interface BusinessCategoryDb {
  id: string
  name: string
  slug: string
  icon: string | null
  description: string | null
  order_index: number
  created_at: string
}

export interface SubscriptionPlan {
  id: string
  name: string
  slug: string
  tier: 'basic' | 'premium'
  price_monthly: number
  price_yearly: number
  features: Record<string, boolean>
  stripe_price_id_monthly: string | null
  stripe_price_id_yearly: string | null
  is_active: boolean
  created_at: string
}

export interface BusinessAnalytic {
  id: string
  business_id: string
  event_type: 'view' | 'website_click' | 'phone_click' | 'directions_click' | 'share'
  user_id: string | null
  ip_hash: string | null
  user_agent: string | null
  referrer: string | null
  created_at: string
}

export interface BusinessFavorite {
  id: string
  business_id: string
  user_id: string
  created_at: string
}
