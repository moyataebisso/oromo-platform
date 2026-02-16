import { createClient } from './server'
import type { ForumCategory, ForumPost, ForumComment, PostsFilter, SortOption } from '@/types/community'

// ============ CATEGORIES ============

export async function getCategories(): Promise<ForumCategory[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('forum_categories')
    .select('*')
    .order('display_order', { ascending: true }) as { data: ForumCategory[] | null; error: Error | null }

  if (error) throw error
  return data || []
}

export async function getCategoryBySlug(slug: string): Promise<ForumCategory | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('forum_categories')
    .select('*')
    .eq('slug', slug)
    .single() as { data: ForumCategory | null; error: Error | null }

  if (error) return null
  return data
}

// ============ POSTS ============

export async function getPosts(filters: PostsFilter = {}): Promise<{ posts: ForumPost[], total: number }> {
  const supabase = await createClient()
  const { category, sort = 'hot', page = 1, limit = 20, search } = filters
  const offset = (page - 1) * limit

  // Get current user for vote status
  const { data: { user } } = await supabase.auth.getUser()

  let query = supabase
    .from('forum_posts')
    .select(`
      *,
      author:profiles!forum_posts_user_id_fkey(id, display_name, username, avatar_url, role),
      category:forum_categories!forum_posts_category_id_fkey(id, name, slug, color, icon)
    `, { count: 'exact' })

  // Filter by category
  if (category) {
    const { data: cat } = await supabase
      .from('forum_categories')
      .select('id')
      .eq('slug', category)
      .single() as { data: { id: string } | null }
    if (cat) {
      query = query.eq('category_id', cat.id)
    }
  }

  // Search
  if (search) {
    query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`)
  }

  // Sorting
  switch (sort) {
    case 'new':
      query = query.order('created_at', { ascending: false })
      break
    case 'top':
      query = query.order('upvotes', { ascending: false })
      break
    case 'hot':
    default:
      // Hot = combination of upvotes and recency
      query = query.order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false })
      break
  }

  query = query.range(offset, offset + limit - 1)

  const { data, error, count } = await query as { data: ForumPost[] | null; error: Error | null; count: number | null }

  if (error) throw error

  // Get user votes if logged in
  let posts = data || []
  if (user && posts.length > 0) {
    const postIds = posts.map(p => p.id)
    const { data: votes } = await supabase
      .from('forum_votes')
      .select('post_id, vote_type')
      .eq('user_id', user.id)
      .in('post_id', postIds) as { data: { post_id: string; vote_type: number }[] | null }

    const voteMap = new Map(votes?.map(v => [v.post_id, v.vote_type]) || [])
    posts = posts.map(p => ({ ...p, user_vote: voteMap.get(p.id) || null }))
  }

  return { posts, total: count || 0 }
}

export async function getPostById(id: string): Promise<ForumPost | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from('forum_posts')
    .select(`
      *,
      author:profiles!forum_posts_user_id_fkey(id, display_name, username, avatar_url, role),
      category:forum_categories!forum_posts_category_id_fkey(id, name, slug, color, icon)
    `)
    .eq('id', id)
    .single() as { data: ForumPost | null; error: Error | null }

  if (error || !data) return null

  // Increment view count
  await supabase.rpc('increment_post_views', { post_id: id } as never)

  // Get user vote if logged in
  let post = data
  if (user) {
    const { data: vote } = await supabase
      .from('forum_votes')
      .select('vote_type')
      .eq('user_id', user.id)
      .eq('post_id', id)
      .single() as { data: { vote_type: number } | null }
    post = { ...post, user_vote: vote?.vote_type || null }
  }

  return post
}

export async function createPost(postData: { category_id: string, title: string, content: string }): Promise<ForumPost> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Must be logged in to create a post')

  const { data: post, error } = await supabase
    .from('forum_posts')
    .insert({
      category_id: postData.category_id,
      user_id: user.id,
      title: postData.title,
      content: postData.content,
    } as never)
    .select()
    .single() as { data: ForumPost | null; error: Error | null }

  if (error || !post) throw error || new Error('Failed to create post')
  return post
}

export async function deletePost(postId: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('forum_posts')
    .delete()
    .eq('id', postId)

  if (error) throw error
}

export async function togglePinPost(postId: string, isPinned: boolean): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('forum_posts')
    .update({ is_pinned: isPinned } as never)
    .eq('id', postId)

  if (error) throw error
}

export async function toggleLockPost(postId: string, isLocked: boolean): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('forum_posts')
    .update({ is_locked: isLocked } as never)
    .eq('id', postId)

  if (error) throw error
}

// ============ COMMENTS ============

export async function getCommentsByPostId(postId: string): Promise<ForumComment[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from('forum_comments')
    .select(`
      *,
      author:profiles!forum_comments_user_id_fkey(id, display_name, username, avatar_url, role)
    `)
    .eq('post_id', postId)
    .eq('is_deleted', false)
    .order('created_at', { ascending: true }) as { data: ForumComment[] | null; error: Error | null }

  if (error) throw error

  let comments = data || []

  // Get user votes if logged in
  if (user && comments.length > 0) {
    const commentIds = comments.map(c => c.id)
    const { data: votes } = await supabase
      .from('forum_votes')
      .select('comment_id, vote_type')
      .eq('user_id', user.id)
      .in('comment_id', commentIds) as { data: { comment_id: string; vote_type: number }[] | null }

    const voteMap = new Map(votes?.map(v => [v.comment_id, v.vote_type]) || [])
    comments = comments.map(c => ({ ...c, user_vote: voteMap.get(c.id) || null }))
  }

  // Build nested comment tree
  return buildCommentTree(comments)
}

function buildCommentTree(comments: ForumComment[]): ForumComment[] {
  const commentMap = new Map<string, ForumComment>()
  const roots: ForumComment[] = []

  // First pass: create map of all comments
  comments.forEach(comment => {
    commentMap.set(comment.id, { ...comment, replies: [], depth: 0 })
  })

  // Second pass: build tree structure
  comments.forEach(comment => {
    const node = commentMap.get(comment.id)!
    if (comment.parent_id && commentMap.has(comment.parent_id)) {
      const parent = commentMap.get(comment.parent_id)!
      node.depth = Math.min((parent.depth || 0) + 1, 5) // Max depth of 5
      parent.replies = parent.replies || []
      parent.replies.push(node)
    } else {
      roots.push(node)
    }
  })

  return roots
}

export async function createComment(commentData: { post_id: string, parent_id?: string, content: string }): Promise<ForumComment> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Must be logged in to comment')

  // Check if post is locked
  const { data: post } = await supabase
    .from('forum_posts')
    .select('is_locked')
    .eq('id', commentData.post_id)
    .single() as { data: { is_locked: boolean } | null }

  if (post?.is_locked) throw new Error('This post is locked and cannot receive new comments')

  const { data: comment, error } = await supabase
    .from('forum_comments')
    .insert({
      post_id: commentData.post_id,
      parent_id: commentData.parent_id || null,
      user_id: user.id,
      content: commentData.content,
    } as never)
    .select(`
      *,
      author:profiles!forum_comments_user_id_fkey(id, display_name, username, avatar_url, role)
    `)
    .single() as { data: ForumComment | null; error: Error | null }

  if (error || !comment) throw error || new Error('Failed to create comment')
  return comment
}

export async function deleteComment(commentId: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('forum_comments')
    .update({ is_deleted: true, content: '[deleted]' } as never)
    .eq('id', commentId)

  if (error) throw error
}

// ============ VOTING ============

export async function vote(type: 'post' | 'comment', id: string, voteType: number): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Must be logged in to vote')

  const field = type === 'post' ? 'post_id' : 'comment_id'

  // Check existing vote
  const { data: existingVote } = await supabase
    .from('forum_votes')
    .select('id, vote_type')
    .eq('user_id', user.id)
    .eq(field, id)
    .single() as { data: { id: string; vote_type: number } | null }

  if (existingVote) {
    if (existingVote.vote_type === voteType) {
      // Remove vote if same type (toggle off)
      await supabase.from('forum_votes').delete().eq('id', existingVote.id)
    } else {
      // Update vote if different type
      await supabase.from('forum_votes').update({ vote_type: voteType } as never).eq('id', existingVote.id)
    }
  } else {
    // Create new vote
    await supabase.from('forum_votes').insert({
      user_id: user.id,
      [field]: id,
      vote_type: voteType,
    } as never)
  }
}

// ============ REPORTS ============

export async function createReport(reportData: {
  post_id?: string
  comment_id?: string
  reason: 'spam' | 'harassment' | 'misinformation' | 'inappropriate' | 'other'
  description?: string
}): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Must be logged in to report')

  const { error } = await supabase
    .from('reports')
    .insert({
      reporter_id: user.id,
      post_id: reportData.post_id || null,
      comment_id: reportData.comment_id || null,
      reason: reportData.reason,
      description: reportData.description || null,
    } as never)

  if (error) throw error
}

// ============ USER POSTS ============

export async function getPostsByUserId(userId: string, limit = 5): Promise<ForumPost[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('forum_posts')
    .select(`
      *,
      category:forum_categories!forum_posts_category_id_fkey(id, name, slug, color)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit) as { data: ForumPost[] | null; error: Error | null }

  if (error) throw error
  return data || []
}
