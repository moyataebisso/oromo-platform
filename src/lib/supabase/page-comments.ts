'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import {
  PageComment,
  CommentReply,
  CreateCommentData,
  CreateReplyData,
  UpdateCommentData,
  CommentFilters,
  CommentStatus,
} from '@/types/page-comment'

// Type for raw database response (before joining)
interface RawComment {
  id: string
  page_path: string
  page_title: string | null
  user_id: string | null
  guest_id: string | null
  display_name: string | null
  comment_type: string
  content: string
  element_selector: string | null
  position_x: number | null
  position_y: number | null
  status: string
  is_pinned: boolean
  resolved_by: string | null
  resolved_at: string | null
  admin_note: string | null
  upvote_count: number
  created_at: string
  updated_at: string
  user?: {
    id: string
    display_name: string | null
    avatar_url: string | null
  } | null
}

interface RawReply {
  id: string
  comment_id: string
  user_id: string | null
  guest_id: string | null
  display_name: string | null
  content: string
  status: string
  created_at: string
  user?: {
    id: string
    display_name: string | null
    avatar_url: string | null
  } | null
}

// ==================== READ OPERATIONS ====================

/**
 * Get comments for a specific page
 */
export async function getPageComments(
  pagePath: string,
  filters: Omit<CommentFilters, 'page_path'> = {}
): Promise<PageComment[]> {
  const supabase = await createClient()

  let query = supabase
    .from('page_comments')
    .select(`
      *,
      user:profiles(id, display_name, avatar_url)
    `)
    .eq('page_path', pagePath) as unknown as ReturnType<typeof supabase.from>

  // Filter by type
  if (filters.comment_type) {
    query = query.eq('comment_type', filters.comment_type)
  }

  // Filter by status (default to showing only active)
  if (filters.status) {
    query = query.eq('status', filters.status)
  } else {
    query = query.eq('status', 'active')
  }

  // Order by pinned first, then newest
  query = query
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })

  // Pagination
  if (filters.limit) {
    query = query.limit(filters.limit)
  }
  if (filters.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 20) - 1)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching page comments:', error)
    return []
  }

  const rawComments = (data || []) as unknown as RawComment[]
  const comments: PageComment[] = rawComments.map((c) => ({
    ...c,
    comment_type: c.comment_type as PageComment['comment_type'],
    status: c.status as PageComment['status'],
    reply_count: 0,
  }))

  // Fetch reply counts for each comment
  const commentIds = comments.map((c) => c.id)

  if (commentIds.length > 0) {
    const { data: replyCounts } = await supabase
      .from('page_comment_replies')
      .select('comment_id')
      .in('comment_id', commentIds)
      .eq('status', 'active')

    const rawReplies = (replyCounts || []) as unknown as { comment_id: string }[]
    const countMap: Record<string, number> = {}
    rawReplies.forEach((r) => {
      countMap[r.comment_id] = (countMap[r.comment_id] || 0) + 1
    })

    comments.forEach((comment) => {
      comment.reply_count = countMap[comment.id] || 0
    })
  }

  return comments
}

/**
 * Get replies for a comment
 */
export async function getCommentReplies(commentId: string): Promise<CommentReply[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('page_comment_replies')
    .select(`
      *,
      user:profiles(id, display_name, avatar_url)
    `)
    .eq('comment_id', commentId)
    .eq('status', 'active')
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching replies:', error)
    return []
  }

  const rawReplies = (data || []) as unknown as RawReply[]
  return rawReplies.map((r) => ({
    ...r,
    status: r.status as CommentReply['status'],
  }))
}

/**
 * Get comment count for a page (for badge)
 */
export async function getPageCommentCount(pagePath: string): Promise<number> {
  const supabase = await createClient()

  const { count, error } = await supabase
    .from('page_comments')
    .select('*', { count: 'exact', head: true })
    .eq('page_path', pagePath)
    .eq('status', 'active')

  if (error) {
    console.error('Error fetching comment count:', error)
    return 0
  }

  return count || 0
}

/**
 * Get a single comment by ID with replies
 */
export async function getCommentById(id: string): Promise<PageComment | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('page_comments')
    .select(`
      *,
      user:profiles(id, display_name, avatar_url)
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching comment:', error)
    return null
  }

  // Fetch replies
  const replies = await getCommentReplies(id)

  const rawComment = data as unknown as RawComment
  return {
    ...rawComment,
    comment_type: rawComment.comment_type as PageComment['comment_type'],
    status: rawComment.status as PageComment['status'],
    replies,
    reply_count: replies.length,
  }
}

/**
 * Get all comments for admin (across all pages)
 */
export async function getAllComments(
  filters: CommentFilters = {}
): Promise<PageComment[]> {
  const supabase = await createClient()

  let query = supabase
    .from('page_comments')
    .select(`
      *,
      user:profiles(id, display_name, avatar_url)
    `) as unknown as ReturnType<typeof supabase.from>

  // Filter by page path
  if (filters.page_path) {
    query = query.ilike('page_path', `%${filters.page_path}%`)
  }

  // Filter by type
  if (filters.comment_type) {
    query = query.eq('comment_type', filters.comment_type)
  }

  // Filter by status
  if (filters.status) {
    query = query.eq('status', filters.status)
  }

  // Order by newest first
  query = query.order('created_at', { ascending: false })

  // Pagination
  if (filters.limit) {
    query = query.limit(filters.limit)
  }
  if (filters.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching all comments:', error)
    return []
  }

  const rawComments = (data || []) as unknown as RawComment[]
  return rawComments.map((c) => ({
    ...c,
    comment_type: c.comment_type as PageComment['comment_type'],
    status: c.status as PageComment['status'],
  }))
}

/**
 * Get counts by status for admin dashboard
 */
export async function getCommentStatusCounts(): Promise<Record<CommentStatus, number>> {
  const supabase = await createClient()

  const statuses: CommentStatus[] = ['active', 'resolved', 'hidden', 'spam']
  const counts: Record<CommentStatus, number> = {
    active: 0,
    resolved: 0,
    hidden: 0,
    spam: 0,
  }

  for (const status of statuses) {
    const { count } = await supabase
      .from('page_comments')
      .select('*', { count: 'exact', head: true })
      .eq('status', status)

    counts[status] = count || 0
  }

  return counts
}

// ==================== CREATE OPERATIONS ====================

/**
 * Create a new comment
 */
export async function createComment(
  data: CreateCommentData
): Promise<{ success: boolean; data?: PageComment; error?: string }> {
  const supabase = await createClient()

  // Validate content length
  if (data.content.length < 10) {
    return { success: false, error: 'Comment must be at least 10 characters' }
  }
  if (data.content.length > 1000) {
    return { success: false, error: 'Comment must be less than 1000 characters' }
  }

  // Get current user if logged in
  const { data: { user } } = await supabase.auth.getUser()

  const insertData = {
    page_path: data.page_path,
    page_title: data.page_title || null,
    comment_type: data.comment_type,
    content: data.content,
    display_name: data.display_name || 'Anonymous',
    user_id: user?.id || null,
    guest_id: data.guest_id || null,
    status: 'active',
    upvote_count: 0,
    is_pinned: false,
  }

  const { data: comment, error } = await supabase
    .from('page_comments')
    .insert(insertData as never)
    .select(`
      *,
      user:profiles(id, display_name, avatar_url)
    `)
    .single()

  if (error) {
    console.error('Error creating comment:', error)
    return { success: false, error: error.message }
  }

  revalidatePath(data.page_path)

  const rawComment = comment as unknown as RawComment
  return {
    success: true,
    data: {
      ...rawComment,
      comment_type: rawComment.comment_type as PageComment['comment_type'],
      status: rawComment.status as PageComment['status'],
      reply_count: 0,
    },
  }
}

/**
 * Create a reply to a comment
 */
export async function createReply(
  data: CreateReplyData
): Promise<{ success: boolean; data?: CommentReply; error?: string }> {
  const supabase = await createClient()

  // Validate content length
  if (data.content.length < 3) {
    return { success: false, error: 'Reply must be at least 3 characters' }
  }
  if (data.content.length > 500) {
    return { success: false, error: 'Reply must be less than 500 characters' }
  }

  // Get current user if logged in
  const { data: { user } } = await supabase.auth.getUser()

  const insertData = {
    comment_id: data.comment_id,
    content: data.content,
    display_name: data.display_name || 'Anonymous',
    user_id: user?.id || null,
    guest_id: data.guest_id || null,
    status: 'active',
  }

  const { data: reply, error } = await supabase
    .from('page_comment_replies')
    .insert(insertData as never)
    .select(`
      *,
      user:profiles(id, display_name, avatar_url)
    `)
    .single()

  if (error) {
    console.error('Error creating reply:', error)
    return { success: false, error: error.message }
  }

  // Get parent comment's page path for revalidation
  const { data: parentComment } = await supabase
    .from('page_comments')
    .select('page_path')
    .eq('id', data.comment_id)
    .single()

  const rawParent = parentComment as unknown as { page_path: string } | null
  if (rawParent) {
    revalidatePath(rawParent.page_path)
  }

  const rawReply = reply as unknown as RawReply
  return {
    success: true,
    data: {
      ...rawReply,
      status: rawReply.status as CommentReply['status'],
    },
  }
}

// ==================== UPDATE OPERATIONS ====================

/**
 * Update a comment
 */
export async function updateComment(
  id: string,
  updates: UpdateCommentData,
  guestId?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch the comment to verify ownership
  const { data: comment } = await supabase
    .from('page_comments')
    .select('user_id, guest_id, page_path')
    .eq('id', id)
    .single()

  const rawComment = comment as unknown as { user_id: string | null; guest_id: string | null; page_path: string } | null

  if (!rawComment) {
    return { success: false, error: 'Comment not found' }
  }

  // Check permissions
  const isOwner =
    (rawComment.user_id && rawComment.user_id === user?.id) ||
    (rawComment.guest_id && rawComment.guest_id === guestId)

  // Get user role for admin check
  let isAdmin = false
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const rawProfile = profile as unknown as { role: string } | null
    isAdmin = rawProfile?.role === 'admin'
  }

  if (!isOwner && !isAdmin) {
    return { success: false, error: 'You do not have permission to edit this comment' }
  }

  // Non-admins can only update content and display_name
  const allowedUpdates: UpdateCommentData = {}
  if (isAdmin) {
    Object.assign(allowedUpdates, updates)
  } else {
    if (updates.content) allowedUpdates.content = updates.content
    if (updates.display_name) allowedUpdates.display_name = updates.display_name
  }

  const { error } = await supabase
    .from('page_comments')
    .update({
      ...allowedUpdates,
      updated_at: new Date().toISOString(),
    } as never)
    .eq('id', id)

  if (error) {
    console.error('Error updating comment:', error)
    return { success: false, error: error.message }
  }

  revalidatePath(rawComment.page_path)

  return { success: true }
}

/**
 * Soft delete a comment (set status to hidden)
 */
export async function deleteComment(
  id: string,
  guestId?: string
): Promise<{ success: boolean; error?: string }> {
  return updateComment(id, { status: 'hidden' }, guestId)
}

/**
 * Mark comment as resolved (admin)
 */
export async function resolveComment(
  id: string,
  adminNote?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return updateComment(id, {
    status: 'resolved',
    admin_note: adminNote,
    resolved_by: user?.id,
    resolved_at: new Date().toISOString(),
  })
}

/**
 * Mark comment as spam (admin)
 */
export async function markAsSpam(id: string): Promise<{ success: boolean; error?: string }> {
  return updateComment(id, { status: 'spam' })
}

/**
 * Toggle pin status (admin)
 */
export async function togglePinComment(
  id: string,
  isPinned: boolean
): Promise<{ success: boolean; error?: string }> {
  return updateComment(id, { is_pinned: isPinned })
}

// ==================== UPVOTE OPERATIONS ====================

/**
 * Toggle upvote on a comment
 */
export async function toggleUpvote(
  commentId: string,
  guestId?: string
): Promise<{ success: boolean; upvoted: boolean; newCount: number; error?: string }> {
  const supabase = await createClient()

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  const currentUserId = user?.id

  if (!currentUserId && !guestId) {
    return { success: false, upvoted: false, newCount: 0, error: 'Must be logged in or have guest ID' }
  }

  // Check if already upvoted
  let query = supabase
    .from('page_comment_upvotes')
    .select('id')
    .eq('comment_id', commentId) as unknown as ReturnType<typeof supabase.from>

  if (currentUserId) {
    query = query.eq('user_id', currentUserId)
  } else if (guestId) {
    query = query.eq('guest_id', guestId)
  }

  const { data: existing } = await query.maybeSingle()

  // Get current count
  const { data: comment } = await supabase
    .from('page_comments')
    .select('upvote_count')
    .eq('id', commentId)
    .single()

  const rawComment = comment as unknown as { upvote_count: number } | null
  const currentCount = rawComment?.upvote_count || 0

  const rawExisting = existing as unknown as { id: string } | null

  if (rawExisting) {
    // Remove upvote
    await supabase
      .from('page_comment_upvotes')
      .delete()
      .eq('id', rawExisting.id)

    // Decrement count
    const newCount = Math.max(0, currentCount - 1)
    await supabase
      .from('page_comments')
      .update({ upvote_count: newCount } as never)
      .eq('id', commentId)

    return {
      success: true,
      upvoted: false,
      newCount,
    }
  } else {
    // Add upvote
    const { error } = await supabase
      .from('page_comment_upvotes')
      .insert({
        comment_id: commentId,
        user_id: currentUserId || null,
        guest_id: guestId || null,
      } as never)

    if (error) {
      console.error('Error adding upvote:', error)
      return { success: false, upvoted: false, newCount: currentCount, error: error.message }
    }

    // Increment count
    const newCount = currentCount + 1
    await supabase
      .from('page_comments')
      .update({ upvote_count: newCount } as never)
      .eq('id', commentId)

    return {
      success: true,
      upvoted: true,
      newCount,
    }
  }
}

/**
 * Check if user has upvoted a comment
 */
export async function hasUpvoted(
  commentId: string,
  guestId?: string
): Promise<boolean> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  const currentUserId = user?.id

  if (!currentUserId && !guestId) {
    return false
  }

  let query = supabase
    .from('page_comment_upvotes')
    .select('id')
    .eq('comment_id', commentId) as unknown as ReturnType<typeof supabase.from>

  if (currentUserId) {
    query = query.eq('user_id', currentUserId)
  } else if (guestId) {
    query = query.eq('guest_id', guestId)
  }

  const { data } = await query.maybeSingle()

  return !!data
}

/**
 * Get upvote status for multiple comments
 */
export async function getUpvoteStatuses(
  commentIds: string[],
  guestId?: string
): Promise<Record<string, boolean>> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  const currentUserId = user?.id

  if ((!currentUserId && !guestId) || commentIds.length === 0) {
    return {}
  }

  let query = supabase
    .from('page_comment_upvotes')
    .select('comment_id')
    .in('comment_id', commentIds) as unknown as ReturnType<typeof supabase.from>

  if (currentUserId) {
    query = query.eq('user_id', currentUserId)
  } else if (guestId) {
    query = query.eq('guest_id', guestId)
  }

  const { data } = await query

  const rawData = (data || []) as unknown as { comment_id: string }[]
  const statuses: Record<string, boolean> = {}
  commentIds.forEach((id) => {
    statuses[id] = rawData.some((d) => d.comment_id === id)
  })

  return statuses
}
