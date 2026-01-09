export interface Resource {
  id: string
  name: string
  description: string | null
  url: string
  logo_url: string | null
  category: ResourceCategory
  is_featured: boolean
  is_approved: boolean
  order_index: number
  created_at: string
  updated_at: string
}

export type ResourceCategory =
  | 'education'
  | 'organization'
  | 'sports'
  | 'news'
  | 'government'
  | 'health'
  | 'legal'
  | 'business'
  | 'other'

export const resourceCategoryLabels: Record<ResourceCategory, string> = {
  education: 'Education',
  organization: 'Organization',
  sports: 'Sports',
  news: 'News',
  government: 'Government',
  health: 'Health',
  legal: 'Legal',
  business: 'Business',
  other: 'Other',
}

export const resourceCategoryColors: Record<ResourceCategory, string> = {
  education: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  organization: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  sports: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  news: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  government: 'bg-red-500/10 text-red-400 border-red-500/20',
  health: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  legal: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  business: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
  other: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
}

export const resourceCategoryIcons: Record<ResourceCategory, string> = {
  education: '📚',
  organization: '🏛️',
  sports: '⚽',
  news: '📰',
  government: '🏛️',
  health: '🏥',
  legal: '⚖️',
  business: '💼',
  other: '🔗',
}
