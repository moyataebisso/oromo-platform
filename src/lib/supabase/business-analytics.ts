'use server'

import { createClient } from '@/lib/supabase/server'

export type AnalyticEventType =
  | 'view'
  | 'click_phone'
  | 'click_website'
  | 'click_directions'
  | 'click_share'
  | 'favorite'
  | 'unfavorite'
  | 'review_submit'

export interface AnalyticEvent {
  business_id: string
  event_type: AnalyticEventType
  metadata?: Record<string, unknown>
}

export interface BusinessAnalytics {
  total_views: number
  total_clicks: number
  click_phone: number
  click_website: number
  click_directions: number
  click_share: number
  favorites: number
  reviews: number
}

export interface DailyAnalytics {
  date: string
  views: number
  clicks: number
}

// ==================== LOGGING EVENTS ====================

/**
 * Log an analytics event for a business
 */
export async function logBusinessEvent(
  businessId: string,
  eventType: AnalyticEventType,
  metadata?: Record<string, unknown>
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any

  // Get current user if logged in (optional)
  const { data: { user } } = await supabase.auth.getUser()

  const { error } = await sb
    .from('business_analytics')
    .insert({
      business_id: businessId,
      event_type: eventType,
      user_id: user?.id || null,
      metadata: metadata || {},
      created_at: new Date().toISOString(),
    })

  if (error) {
    console.error('Error logging business event:', error)
    return { success: false, error: error.message }
  }

  // Update aggregate counts on business record for quick access
  await updateBusinessAnalyticsCounts(businessId, eventType)

  return { success: true }
}

/**
 * Log a business view (called when detail page is loaded)
 */
export async function logBusinessView(businessId: string): Promise<void> {
  await logBusinessEvent(businessId, 'view')
}

/**
 * Log a phone click
 */
export async function logPhoneClick(businessId: string): Promise<void> {
  await logBusinessEvent(businessId, 'click_phone')
}

/**
 * Log a website click
 */
export async function logWebsiteClick(businessId: string): Promise<void> {
  await logBusinessEvent(businessId, 'click_website')
}

/**
 * Log a directions click
 */
export async function logDirectionsClick(businessId: string): Promise<void> {
  await logBusinessEvent(businessId, 'click_directions')
}

/**
 * Log a share action
 */
export async function logShareClick(businessId: string): Promise<void> {
  await logBusinessEvent(businessId, 'click_share')
}

// ==================== UPDATE AGGREGATE COUNTS ====================

/**
 * Update the aggregate analytics counts on the business record
 * This allows for fast queries without needing to aggregate
 */
async function updateBusinessAnalyticsCounts(
  businessId: string,
  eventType: AnalyticEventType
): Promise<void> {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any

  // Get current business stats
  const { data: business } = await sb
    .from('businesses')
    .select('views_count, clicks_count')
    .eq('id', businessId)
    .single()

  if (!business) return

  const biz = business as { views_count?: number; clicks_count?: number }
  const updates: { views_count?: number; clicks_count?: number } = {}

  if (eventType === 'view') {
    updates.views_count = (biz.views_count || 0) + 1
  } else if (eventType.startsWith('click_')) {
    updates.clicks_count = (biz.clicks_count || 0) + 1
  }

  if (Object.keys(updates).length > 0) {
    await sb
      .from('businesses')
      .update(updates)
      .eq('id', businessId)
  }
}

// ==================== RETRIEVE ANALYTICS ====================

/**
 * Get analytics summary for a business
 */
export async function getBusinessAnalytics(
  businessId: string
): Promise<BusinessAnalytics> {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any

  // Get counts by event type
  const { data, error } = await sb
    .from('business_analytics')
    .select('event_type')
    .eq('business_id', businessId)

  if (error || !data) {
    console.error('Error fetching analytics:', error)
    return {
      total_views: 0,
      total_clicks: 0,
      click_phone: 0,
      click_website: 0,
      click_directions: 0,
      click_share: 0,
      favorites: 0,
      reviews: 0,
    }
  }

  // Count events by type
  const counts = (data as Array<{ event_type: string }>).reduce(
    (acc: Record<string, number>, event: { event_type: string }) => {
      acc[event.event_type] = (acc[event.event_type] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  return {
    total_views: counts['view'] || 0,
    total_clicks:
      (counts['click_phone'] || 0) +
      (counts['click_website'] || 0) +
      (counts['click_directions'] || 0) +
      (counts['click_share'] || 0),
    click_phone: counts['click_phone'] || 0,
    click_website: counts['click_website'] || 0,
    click_directions: counts['click_directions'] || 0,
    click_share: counts['click_share'] || 0,
    favorites: counts['favorite'] || 0,
    reviews: counts['review_submit'] || 0,
  }
}

/**
 * Get daily analytics for a business (for charts)
 */
export async function getBusinessDailyAnalytics(
  businessId: string,
  days: number = 7
): Promise<DailyAnalytics[]> {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any

  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const { data, error } = await sb
    .from('business_analytics')
    .select('event_type, created_at')
    .eq('business_id', businessId)
    .gte('created_at', startDate.toISOString())
    .order('created_at', { ascending: true })

  if (error || !data) {
    console.error('Error fetching daily analytics:', error)
    return []
  }

  // Group by date
  const dailyMap: Record<string, { views: number; clicks: number }> = {}

  // Initialize all days
  for (let i = 0; i < days; i++) {
    const date = new Date()
    date.setDate(date.getDate() - (days - 1 - i))
    const dateStr = date.toISOString().split('T')[0]
    dailyMap[dateStr] = { views: 0, clicks: 0 }
  }

  // Count events
  (data as Array<{ event_type: string; created_at: string }>).forEach(
    (event: { event_type: string; created_at: string }) => {
      const dateStr = new Date(event.created_at).toISOString().split('T')[0]
      if (dailyMap[dateStr]) {
        if (event.event_type === 'view') {
          dailyMap[dateStr].views++
        } else if (event.event_type.startsWith('click_')) {
          dailyMap[dateStr].clicks++
        }
      }
    }
  )

  return Object.entries(dailyMap).map(([date, stats]) => ({
    date,
    views: stats.views,
    clicks: stats.clicks,
  }))
}

/**
 * Get top performing businesses (for admin dashboard)
 */
export async function getTopBusinesses(
  limit: number = 10,
  metric: 'views' | 'clicks' | 'rating' = 'views'
): Promise<Array<{
  id: string
  name: string
  slug: string
  views_count: number
  clicks_count: number
  rating: number
}>> {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any

  const orderColumn = metric === 'views'
    ? 'views_count'
    : metric === 'clicks'
    ? 'clicks_count'
    : 'rating'

  const { data, error } = await sb
    .from('businesses')
    .select('id, name, slug, views_count, clicks_count, rating')
    .eq('status', 'approved')
    .order(orderColumn, { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching top businesses:', error)
    return []
  }

  return data as Array<{
    id: string
    name: string
    slug: string
    views_count: number
    clicks_count: number
    rating: number
  }>
}

/**
 * Get analytics overview for admin dashboard
 */
export async function getAnalyticsOverview(
  days: number = 30
): Promise<{
  totalViews: number
  totalClicks: number
  totalBusinesses: number
  pendingReviews: number
  newBusinesses: number
}> {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any

  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  // Get event counts
  const { count: viewCount } = await sb
    .from('business_analytics')
    .select('*', { count: 'exact', head: true })
    .eq('event_type', 'view')
    .gte('created_at', startDate.toISOString())

  const { count: clickCount } = await sb
    .from('business_analytics')
    .select('*', { count: 'exact', head: true })
    .in('event_type', ['click_phone', 'click_website', 'click_directions', 'click_share'])
    .gte('created_at', startDate.toISOString())

  // Get business counts
  const { count: totalBusinesses } = await supabase
    .from('businesses')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'approved')

  const { count: pendingReviews } = await supabase
    .from('businesses')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')

  const { count: newBusinesses } = await supabase
    .from('businesses')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', startDate.toISOString())

  return {
    totalViews: viewCount || 0,
    totalClicks: clickCount || 0,
    totalBusinesses: totalBusinesses || 0,
    pendingReviews: pendingReviews || 0,
    newBusinesses: newBusinesses || 0,
  }
}

// ==================== CLICK-THROUGH RATE ====================

/**
 * Calculate click-through rate for a business
 */
export async function getBusinessCTR(businessId: string): Promise<number> {
  const analytics = await getBusinessAnalytics(businessId)

  if (analytics.total_views === 0) return 0

  return Math.round((analytics.total_clicks / analytics.total_views) * 1000) / 10
}

/**
 * Get businesses with best CTR (for insights)
 */
export async function getTopCTRBusinesses(
  limit: number = 10,
  minViews: number = 100
): Promise<Array<{
  id: string
  name: string
  slug: string
  ctr: number
  views: number
  clicks: number
}>> {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any

  const { data, error } = await sb
    .from('businesses')
    .select('id, name, slug, views_count, clicks_count')
    .eq('status', 'approved')
    .gte('views_count', minViews)
    .order('views_count', { ascending: false })
    .limit(limit * 2) // Get extra to filter

  if (error || !data) {
    console.error('Error fetching businesses for CTR:', error)
    return []
  }

  interface BusinessCTRRow {
    id: string
    name: string
    slug: string
    views_count: number
    clicks_count: number
  }

  // Calculate CTR and sort
  const withCTR = (data as BusinessCTRRow[])
    .map((b: BusinessCTRRow) => ({
      id: b.id,
      name: b.name,
      slug: b.slug,
      ctr: b.views_count > 0
        ? Math.round((b.clicks_count / b.views_count) * 1000) / 10
        : 0,
      views: b.views_count,
      clicks: b.clicks_count,
    }))
    .sort((a, b) => b.ctr - a.ctr)
    .slice(0, limit)

  return withCTR
}
