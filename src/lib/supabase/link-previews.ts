'use server'

import { createClient } from '@/lib/supabase/server'

export interface LinkPreview {
  id: string
  link_path: string
  title_en: string
  title_om: string | null
  description_en: string
  description_om: string | null
  icon: string | null
  stats: string | null
  badge: string | null
  badge_color: string | null
  dynamic_stat_type: string | null
  is_active: boolean
  updated_at: string
}

/**
 * Get a single link preview by path
 */
export async function getLinkPreview(path: string): Promise<LinkPreview | null> {
  // Skip empty paths to avoid unnecessary database calls
  if (!path) {
    return null
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('link_previews')
    .select('*')
    .eq('link_path', path)
    .eq('is_active', true)
    .maybeSingle()

  if (error) {
    console.error('Error fetching link preview:', error)
    return null
  }

  return data as LinkPreview | null
}

/**
 * Get all active link previews (for caching)
 */
export async function getAllLinkPreviews(): Promise<LinkPreview[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('link_previews')
    .select('*')
    .eq('is_active', true)
    .order('link_path')

  if (error) {
    console.error('Error fetching link previews:', error)
    return []
  }

  return data as LinkPreview[]
}

/**
 * Get dynamic stat for a link preview
 */
export async function getDynamicStat(statType: string): Promise<string | null> {
  const supabase = await createClient()

  let count = 0

  switch (statType) {
    case 'course_count': {
      const { count: c } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true })
        .eq('is_published', true)
      count = c || 0
      return `${count}+ courses`
    }
    case 'job_count': {
      const { count: c } = await supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'open')
      count = c || 0
      return `${count}+ jobs`
    }
    case 'article_count': {
      const { count: c } = await supabase
        .from('wiki_articles')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published')
      count = c || 0
      return `${count}+ articles`
    }
    case 'business_count': {
      const { count: c } = await supabase
        .from('businesses')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved')
      count = c || 0
      return `${count}+ businesses`
    }
    case 'event_count': {
      const { count: c } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .gte('start_date', new Date().toISOString())
      count = c || 0
      return `${count} upcoming`
    }
    default:
      return null
  }
}
