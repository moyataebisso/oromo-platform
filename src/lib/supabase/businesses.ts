'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { Business, BusinessReview, BusinessHours } from '@/types/business'

// Types for database operations
export interface BusinessFilters {
  search?: string
  category?: string
  city?: string
  state?: string
  is_featured?: boolean
  status?: 'pending' | 'approved' | 'rejected' | 'suspended'
  subscription_tier?: 'free' | 'basic' | 'premium'
  show_on_homepage?: boolean
  show_in_footer?: boolean
  open_now?: boolean
  limit?: number
  offset?: number
}

export interface BusinessFormData {
  name: string
  description: string
  category_id: string
  address: string
  city: string
  state: string
  zip_code: string
  phone: string
  email: string
  website?: string | null
  latitude?: number | null
  longitude?: number | null
  hours?: BusinessHours
  social_facebook?: string | null
  social_instagram?: string | null
  social_twitter?: string | null
  social_linkedin?: string | null
}

export interface CreateBusinessResult {
  success: boolean
  data?: Business
  error?: string
}

// ==================== READ OPERATIONS ====================

/**
 * Get all approved businesses with optional filters
 */
export async function getBusinesses(filters: BusinessFilters = {}): Promise<Business[]> {
  const supabase = await createClient()

  let query = supabase
    .from('businesses')
    .select(`
      *,
      category:business_categories(id, name, slug, icon),
      owner:profiles(id, display_name, avatar_url)
    `)

  // Apply status filter (default to approved for public queries)
  if (filters.status) {
    query = query.eq('status', filters.status)
  } else {
    query = query.eq('status', 'approved')
  }

  // Search filter
  if (filters.search) {
    query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
  }

  // Category filter
  if (filters.category) {
    query = query.eq('category_id', filters.category)
  }

  // Location filters
  if (filters.city) {
    query = query.ilike('city', `%${filters.city}%`)
  }
  if (filters.state) {
    query = query.eq('state', filters.state)
  }

  // Featured/Premium filters
  if (filters.is_featured !== undefined) {
    query = query.eq('is_featured', filters.is_featured)
  }
  if (filters.subscription_tier) {
    query = query.eq('subscription_tier', filters.subscription_tier)
  }

  // Homepage/Footer visibility
  if (filters.show_on_homepage !== undefined) {
    query = query.eq('show_on_homepage', filters.show_on_homepage)
  }
  if (filters.show_in_footer !== undefined) {
    query = query.eq('show_in_footer', filters.show_in_footer)
  }

  // Ordering: featured first, then by rating
  query = query
    .order('is_featured', { ascending: false })
    .order('subscription_tier', { ascending: false })
    .order('rating', { ascending: false })

  // Pagination
  if (filters.limit) {
    query = query.limit(filters.limit)
  }
  if (filters.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 20) - 1)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching businesses:', error)
    return []
  }

  return data as unknown as Business[]
}

/**
 * Get a single business by slug
 */
export async function getBusinessBySlug(slug: string): Promise<Business | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('businesses')
    .select(`
      *,
      category:business_categories(id, name, slug, icon),
      owner:profiles(id, display_name, avatar_url)
    `)
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Error fetching business:', error)
    return null
  }

  return data as unknown as Business
}

/**
 * Get a single business by ID
 */
export async function getBusinessById(id: string): Promise<Business | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('businesses')
    .select(`
      *,
      category:business_categories(id, name, slug, icon),
      owner:profiles(id, display_name, avatar_url)
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching business:', error)
    return null
  }

  return data as unknown as Business
}

/**
 * Get featured businesses for homepage gallery
 */
export async function getFeaturedBusinesses(limit: number = 8): Promise<Business[]> {
  return getBusinesses({
    show_on_homepage: true,
    is_featured: true,
    limit,
  })
}

/**
 * Get businesses for footer banner
 */
export async function getFooterBusinesses(limit: number = 6): Promise<Business[]> {
  return getBusinesses({
    show_in_footer: true,
    limit,
  })
}

/**
 * Get similar businesses (same category, excluding current)
 */
export async function getSimilarBusinesses(
  categoryId: string,
  excludeId: string,
  limit: number = 4
): Promise<Business[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('businesses')
    .select(`
      *,
      category:business_categories(id, name, slug, icon)
    `)
    .eq('status', 'approved')
    .eq('category_id', categoryId)
    .neq('id', excludeId)
    .order('rating', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching similar businesses:', error)
    return []
  }

  return data as unknown as Business[]
}

/**
 * Get all business categories
 */
export async function getBusinessCategories() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('business_categories')
    .select('*')
    .order('name')

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  return data
}

/**
 * Get pending businesses for admin review
 */
export async function getPendingBusinesses(): Promise<Business[]> {
  return getBusinesses({ status: 'pending' })
}

// ==================== CREATE OPERATIONS ====================

/**
 * Submit a new business (pending approval)
 */
export async function createBusiness(
  formData: BusinessFormData
): Promise<CreateBusinessResult> {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any

  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: 'You must be logged in to submit a business' }
  }

  // Generate slug from name
  const slug = formData.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

  // Check if slug already exists
  const { data: existingBusiness } = await sb
    .from('businesses')
    .select('id')
    .eq('slug', slug)
    .single()

  const finalSlug = existingBusiness ? `${slug}-${Date.now()}` : slug

  const { data, error } = await sb
    .from('businesses')
    .insert({
      ...formData,
      slug: finalSlug,
      owner_id: user.id,
      status: 'pending',
      subscription_tier: 'free',
      is_featured: false,
      show_on_homepage: false,
      show_in_footer: false,
      rating: 0,
      review_count: 0,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating business:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/businesses/pending')

  return { success: true, data: data as Business }
}

// ==================== UPDATE OPERATIONS ====================

/**
 * Update a business (owner or admin)
 */
export async function updateBusiness(
  id: string,
  updates: Partial<BusinessFormData & {
    status?: 'pending' | 'approved' | 'rejected' | 'suspended'
    subscription_tier?: 'free' | 'basic' | 'premium'
    is_featured?: boolean
    featured_until?: string | null
    show_on_homepage?: boolean
    show_in_footer?: boolean
  }>
): Promise<CreateBusinessResult> {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any

  // Get current user and verify permissions
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: 'You must be logged in' }
  }

  // Check if user owns the business or is admin
  const { data: business } = await sb
    .from('businesses')
    .select('owner_id')
    .eq('id', id)
    .single()

  if (!business) {
    return { success: false, error: 'Business not found' }
  }

  // Get user role
  const { data: profile } = await sb
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const profileData = profile as { role?: string } | null
  const businessData = business as { owner_id?: string }
  const isAdmin = profileData?.role === 'admin'
  const isOwner = businessData.owner_id === user.id

  if (!isAdmin && !isOwner) {
    return { success: false, error: 'You do not have permission to edit this business' }
  }

  // Only admins can change certain fields
  if (!isAdmin) {
    delete updates.status
    delete updates.subscription_tier
    delete updates.is_featured
    delete updates.featured_until
    delete updates.show_on_homepage
    delete updates.show_in_footer
  }

  const { data, error } = await sb
    .from('businesses')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating business:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/businesses')
  revalidatePath(`/businesses/${data.slug}`)
  revalidatePath('/admin/businesses')

  return { success: true, data: data as Business }
}

/**
 * Approve a business (admin only)
 */
export async function approveBusiness(id: string): Promise<CreateBusinessResult> {
  return updateBusiness(id, { status: 'approved' })
}

/**
 * Reject a business (admin only)
 */
export async function rejectBusiness(
  id: string,
  reason: string
): Promise<CreateBusinessResult> {
  const supabase = await createClient()

  // Store rejection reason in a separate table or send notification
  // For now, just update status
  const result = await updateBusiness(id, { status: 'rejected' })

  if (result.success) {
    // TODO: Send notification to business owner with rejection reason
    console.log(`Business ${id} rejected. Reason: ${reason}`)
  }

  return result
}

/**
 * Suspend a business (admin only)
 */
export async function suspendBusiness(
  id: string,
  reason: string
): Promise<CreateBusinessResult> {
  const result = await updateBusiness(id, { status: 'suspended' })

  if (result.success) {
    // TODO: Send notification to business owner with suspension reason
    console.log(`Business ${id} suspended. Reason: ${reason}`)
  }

  return result
}

// ==================== DELETE OPERATIONS ====================

/**
 * Delete a business (owner or admin)
 */
export async function deleteBusiness(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any

  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: 'You must be logged in' }
  }

  // Check if user owns the business or is admin
  const { data: business } = await sb
    .from('businesses')
    .select('owner_id, slug')
    .eq('id', id)
    .single()

  if (!business) {
    return { success: false, error: 'Business not found' }
  }

  const { data: profile } = await sb
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const profileData = profile as { role?: string } | null
  const businessData = business as { owner_id?: string }
  const isAdmin = profileData?.role === 'admin'
  const isOwner = businessData.owner_id === user.id

  if (!isAdmin && !isOwner) {
    return { success: false, error: 'You do not have permission to delete this business' }
  }

  const { error } = await sb
    .from('businesses')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting business:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/businesses')
  revalidatePath('/admin/businesses')

  return { success: true }
}

// ==================== REVIEWS ====================

/**
 * Get reviews for a business
 */
export async function getBusinessReviews(
  businessId: string,
  limit: number = 10,
  offset: number = 0
): Promise<BusinessReview[]> {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any

  const { data, error } = await sb
    .from('business_reviews')
    .select(`
      *,
      user:profiles(id, display_name, avatar_url)
    `)
    .eq('business_id', businessId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error('Error fetching reviews:', error)
    return []
  }

  return data as unknown as BusinessReview[]
}

/**
 * Add a review to a business
 */
export async function addBusinessReview(
  businessId: string,
  rating: number,
  comment: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, error: 'You must be logged in to leave a review' }
  }

  // Check if user already reviewed this business
  const { data: existingReview } = await sb
    .from('business_reviews')
    .select('id')
    .eq('business_id', businessId)
    .eq('user_id', user.id)
    .single()

  if (existingReview) {
    return { success: false, error: 'You have already reviewed this business' }
  }

  const { error } = await sb
    .from('business_reviews')
    .insert({
      business_id: businessId,
      user_id: user.id,
      rating,
      comment,
    })

  if (error) {
    console.error('Error adding review:', error)
    return { success: false, error: error.message }
  }

  // Update business rating
  await updateBusinessRating(businessId)

  return { success: true }
}

/**
 * Update business rating based on all reviews
 */
async function updateBusinessRating(businessId: string) {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any

  const { data: reviews } = await sb
    .from('business_reviews')
    .select('rating')
    .eq('business_id', businessId)

  if (!reviews || reviews.length === 0) return

  const reviewData = reviews as Array<{ rating: number }>
  const avgRating = reviewData.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / reviewData.length

  await sb
    .from('businesses')
    .update({
      rating: Math.round(avgRating * 10) / 10,
      review_count: reviewData.length,
    })
    .eq('id', businessId)
}

// ==================== FAVORITES ====================

/**
 * Toggle favorite status for a business
 */
export async function toggleBusinessFavorite(
  businessId: string
): Promise<{ success: boolean; isFavorited: boolean; error?: string }> {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return { success: false, isFavorited: false, error: 'You must be logged in' }
  }

  // Check if already favorited
  const { data: existing } = await sb
    .from('business_favorites')
    .select('id')
    .eq('business_id', businessId)
    .eq('user_id', user.id)
    .single()

  if (existing) {
    // Remove favorite
    const existingData = existing as { id: string }
    const { error } = await sb
      .from('business_favorites')
      .delete()
      .eq('id', existingData.id)

    if (error) {
      return { success: false, isFavorited: true, error: error.message }
    }

    return { success: true, isFavorited: false }
  } else {
    // Add favorite
    const { error } = await sb
      .from('business_favorites')
      .insert({
        business_id: businessId,
        user_id: user.id,
      })

    if (error) {
      return { success: false, isFavorited: false, error: error.message }
    }

    return { success: true, isFavorited: true }
  }
}

/**
 * Check if a business is favorited by current user
 */
export async function isBusinessFavorited(businessId: string): Promise<boolean> {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { data } = await sb
    .from('business_favorites')
    .select('id')
    .eq('business_id', businessId)
    .eq('user_id', user.id)
    .single()

  return !!data
}

/**
 * Get user's favorite businesses
 */
export async function getUserFavoriteBusinesses(): Promise<Business[]> {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await sb
    .from('business_favorites')
    .select(`
      business:businesses(
        *,
        category:business_categories(id, name, slug, icon)
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching favorites:', error)
    return []
  }

  return (data as Array<{ business: Business }>).map((f: { business: Business }) => f.business) as Business[]
}

// ==================== IMAGE UPLOADS ====================

/**
 * Upload business logo to Supabase Storage
 */
export async function uploadBusinessLogo(
  businessId: string,
  file: File
): Promise<{ success: boolean; url?: string; error?: string }> {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any

  const fileExt = file.name.split('.').pop()
  const fileName = `${businessId}/logo.${fileExt}`

  const { error } = await supabase.storage
    .from('business-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true,
    })

  if (error) {
    console.error('Error uploading logo:', error)
    return { success: false, error: error.message }
  }

  const { data: { publicUrl } } = supabase.storage
    .from('business-images')
    .getPublicUrl(fileName)

  // Update business with logo URL
  await sb
    .from('businesses')
    .update({ logo_url: publicUrl })
    .eq('id', businessId)

  return { success: true, url: publicUrl }
}

/**
 * Upload business cover image to Supabase Storage
 */
export async function uploadBusinessCover(
  businessId: string,
  file: File
): Promise<{ success: boolean; url?: string; error?: string }> {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any

  const fileExt = file.name.split('.').pop()
  const fileName = `${businessId}/cover.${fileExt}`

  const { error } = await supabase.storage
    .from('business-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true,
    })

  if (error) {
    console.error('Error uploading cover:', error)
    return { success: false, error: error.message }
  }

  const { data: { publicUrl } } = supabase.storage
    .from('business-images')
    .getPublicUrl(fileName)

  // Update business with cover URL
  await sb
    .from('businesses')
    .update({ cover_image_url: publicUrl })
    .eq('id', businessId)

  return { success: true, url: publicUrl }
}

/**
 * Upload business gallery image
 */
export async function uploadBusinessGalleryImage(
  businessId: string,
  file: File
): Promise<{ success: boolean; url?: string; error?: string }> {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any

  const fileExt = file.name.split('.').pop()
  const fileName = `${businessId}/gallery/${Date.now()}.${fileExt}`

  const { error } = await supabase.storage
    .from('business-images')
    .upload(fileName, file, {
      cacheControl: '3600',
    })

  if (error) {
    console.error('Error uploading gallery image:', error)
    return { success: false, error: error.message }
  }

  const { data: { publicUrl } } = supabase.storage
    .from('business-images')
    .getPublicUrl(fileName)

  // Add to business_images table
  await sb
    .from('business_images')
    .insert({
      business_id: businessId,
      image_url: publicUrl,
      is_primary: false,
    })

  return { success: true, url: publicUrl }
}
