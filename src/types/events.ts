export interface Event {
  id: string
  title: string
  description: string | null
  location: string | null
  address: string | null
  city: string | null
  state: string | null
  country: string
  is_virtual: boolean
  virtual_link: string | null
  start_date: string
  end_date: string | null
  timezone: string
  organizer_name: string | null
  organizer_email: string | null
  organizer_id: string | null
  category: EventCategory
  image_url: string | null
  ticket_url: string | null
  is_free: boolean
  price: string | null
  is_approved: boolean
  is_featured: boolean
  attendee_count: number
  created_at: string
  updated_at: string
}

export interface EventRSVP {
  id: string
  event_id: string
  user_id: string
  status: 'going' | 'interested' | 'not_going'
  created_at: string
}

export type EventCategory =
  | 'community'
  | 'cultural'
  | 'educational'
  | 'sports'
  | 'religious'
  | 'professional'
  | 'fundraiser'
  | 'other'

export const eventCategoryLabels: Record<EventCategory, string> = {
  community: 'Community',
  cultural: 'Cultural',
  educational: 'Educational',
  sports: 'Sports',
  religious: 'Religious',
  professional: 'Professional',
  fundraiser: 'Fundraiser',
  other: 'Other',
}

export const eventCategoryColors: Record<EventCategory, string> = {
  community: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  cultural: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  educational: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  sports: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  religious: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  professional: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  fundraiser: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
  other: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
}

export const eventCategoryIcons: Record<EventCategory, string> = {
  community: '👥',
  cultural: '🎭',
  educational: '📚',
  sports: '⚽',
  religious: '🙏',
  professional: '💼',
  fundraiser: '💰',
  other: '📅',
}
