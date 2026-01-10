'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Users,
  Heart,
  MessageCircle,
  Send,
  Pin,
  Loader2,
  ThumbsUp,
  Filter,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

interface Post {
  id: string
  user_id: string
  title: string | null
  content: string
  category: string
  likes_count: number
  comments_count: number
  is_pinned: boolean
  created_at: string
  profiles: {
    display_name: string | null
    avatar_url: string | null
  } | null
}

interface User {
  id: string
  email: string
  display_name: string | null
}

const categories = [
  { id: 'all', label: 'All Posts' },
  { id: 'general', label: 'General' },
  { id: 'question', label: 'Questions' },
  { id: 'achievement', label: 'Achievements' },
  { id: 'college', label: 'College' },
  { id: 'study-tips', label: 'Study Tips' },
  { id: 'motivation', label: 'Motivation' },
]

const categoryColors: Record<string, string> = {
  general: 'bg-slate-100 text-slate-700',
  question: 'bg-blue-100 text-blue-700',
  achievement: 'bg-amber-100 text-amber-700',
  college: 'bg-purple-100 text-purple-700',
  'study-tips': 'bg-green-100 text-green-700',
  motivation: 'bg-rose-100 text-rose-700',
}

export default function TeenCommunityPage() {
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [newPost, setNewPost] = useState('')
  const [postCategory, setPostCategory] = useState('general')
  const [isPosting, setIsPosting] = useState(false)
  const [likedPosts, setLikedPosts] = useState<string[]>([])
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check auth
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('id, email, display_name')
            .eq('id', session.user.id)
            .single()

          if (profile) {
            setUser(profile)

            // Get user's liked posts
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data: likes } = await (supabase as any)
              .from('teen_community_likes')
              .select('post_id')
              .eq('user_id', session.user.id)
              .not('post_id', 'is', null)

            if (likes && likes.length > 0) {
              const likedIds = (likes as { post_id: string | null }[])
                .map((l) => l.post_id)
                .filter((id): id is string => id !== null)
              setLikedPosts(likedIds)
            }
          }
        }

        // Fetch posts
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: postsData, error } = await (supabase as any)
          .from('teen_community_posts')
          .select('*, profiles(display_name, avatar_url)')
          .eq('is_approved', true)
          .order('is_pinned', { ascending: false })
          .order('created_at', { ascending: false })
          .limit(50)

        if (error) throw error
        setPosts(postsData || [])
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [supabase])

  const handleSubmitPost = async () => {
    if (!newPost.trim() || !user) return

    setIsPosting(true)
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('teen_community_posts')
        .insert({
          user_id: user.id,
          content: newPost.trim(),
          category: postCategory,
          is_approved: true, // Auto-approve for now
        })
        .select('*, profiles(display_name, avatar_url)')
        .single()

      if (error) throw error

      if (data) {
        setPosts((prev) => [data as Post, ...prev])
        setNewPost('')
      }
    } catch (error) {
      console.error('Error posting:', error)
    } finally {
      setIsPosting(false)
    }
  }

  const handleLike = async (postId: string) => {
    if (!user) {
      router.push('/login?redirect=/teens/community')
      return
    }

    const isLiked = likedPosts.includes(postId)

    try {
      if (isLiked) {
        // Unlike
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase as any)
          .from('teen_community_likes')
          .delete()
          .eq('user_id', user.id)
          .eq('post_id', postId)

        setLikedPosts((prev) => prev.filter((id) => id !== postId))
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId ? { ...p, likes_count: Math.max(0, p.likes_count - 1) } : p
          )
        )
      } else {
        // Like
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase as any).from('teen_community_likes').insert({
          user_id: user.id,
          post_id: postId,
        })

        setLikedPosts((prev) => [...prev, postId])
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId ? { ...p, likes_count: p.likes_count + 1 } : p
          )
        )
      }
    } catch (error) {
      console.error('Error liking:', error)
    }
  }

  const formatTimeAgo = (date: string) => {
    const now = new Date()
    const postDate = new Date(date)
    const diffMs = now.getTime() - postDate.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return postDate.toLocaleDateString()
  }

  const filteredPosts =
    selectedCategory === 'all'
      ? posts
      : posts.filter((p) => p.category === selectedCategory)

  const pinnedPosts = filteredPosts.filter((p) => p.is_pinned)
  const regularPosts = filteredPosts.filter((p) => !p.is_pinned)

  return (
    <div className="py-8 px-4">
      <div className="mx-auto max-w-3xl">
        {/* Hero */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Teen Community</h1>
          <p className="text-slate-600">
            Connect with other Oromo students. Share tips, ask questions, and celebrate wins together!
          </p>
        </div>

        {/* Create post */}
        {user ? (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-purple-100 text-purple-700">
                    {(user.display_name || user.email || 'U').charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-3">
                  <Textarea
                    placeholder="What's on your mind?"
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    className="resize-none"
                    rows={3}
                  />
                  <div className="flex items-center justify-between">
                    <Select value={postCategory} onValueChange={setPostCategory}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.slice(1).map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={handleSubmitPost}
                      disabled={!newPost.trim() || isPosting}
                    >
                      {isPosting ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4 mr-2" />
                      )}
                      Post
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50">
            <CardContent className="py-6 text-center">
              <p className="text-slate-600 mb-4">
                Sign in to join the conversation and connect with other students.
              </p>
              <div className="flex justify-center gap-3">
                <Button variant="outline" asChild>
                  <Link href="/login?redirect=/teens/community">Log In</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup?redirect=/teens/community">Sign Up Free</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                selectedCategory === cat.id
                  ? 'bg-purple-600 hover:bg-purple-700'
                  : 'hover:bg-slate-100'
              )}
            >
              {cat.label}
            </Button>
          ))}
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="flex-1 space-y-3">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && filteredPosts.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <MessageCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-slate-900 mb-2">No posts yet</h2>
              <p className="text-slate-600">
                {selectedCategory === 'all'
                  ? 'Be the first to start a conversation!'
                  : 'No posts in this category yet.'}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Pinned posts */}
        {!isLoading && pinnedPosts.length > 0 && (
          <div className="space-y-4 mb-6">
            {pinnedPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                isLiked={likedPosts.includes(post.id)}
                onLike={() => handleLike(post.id)}
                formatTimeAgo={formatTimeAgo}
              />
            ))}
          </div>
        )}

        {/* Regular posts */}
        {!isLoading && regularPosts.length > 0 && (
          <div className="space-y-4">
            {regularPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                isLiked={likedPosts.includes(post.id)}
                onLike={() => handleLike(post.id)}
                formatTimeAgo={formatTimeAgo}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Post card component
function PostCard({
  post,
  isLiked,
  onLike,
  formatTimeAgo,
}: {
  post: Post
  isLiked: boolean
  onLike: () => void
  formatTimeAgo: (date: string) => string
}) {
  const displayName = post.profiles?.display_name || 'Anonymous'
  const initials = displayName.charAt(0).toUpperCase()
  const categoryColor = categoryColors[post.category] || 'bg-slate-100 text-slate-700'

  return (
    <Card className={cn(post.is_pinned && 'border-amber-200 bg-amber-50/30')}>
      <CardContent className="p-4">
        <div className="flex gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-purple-100 text-purple-700">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="font-medium text-slate-900">{displayName}</span>
              <span className="text-sm text-slate-400">{formatTimeAgo(post.created_at)}</span>
              <span className={cn('text-xs px-2 py-0.5 rounded-full', categoryColor)}>
                {post.category.replace('-', ' ')}
              </span>
              {post.is_pinned && (
                <span className="flex items-center gap-1 text-xs text-amber-600">
                  <Pin className="w-3 h-3" />
                  Pinned
                </span>
              )}
            </div>

            {post.title && (
              <h3 className="font-semibold text-slate-900 mb-1">{post.title}</h3>
            )}

            <p className="text-slate-700 whitespace-pre-wrap">{post.content}</p>

            <div className="flex items-center gap-4 mt-3">
              <button
                onClick={onLike}
                className={cn(
                  'flex items-center gap-1 text-sm transition-colors',
                  isLiked ? 'text-rose-600' : 'text-slate-500 hover:text-rose-600'
                )}
              >
                <Heart className={cn('w-4 h-4', isLiked && 'fill-current')} />
                {post.likes_count}
              </button>
              <button className="flex items-center gap-1 text-sm text-slate-500 hover:text-blue-600">
                <MessageCircle className="w-4 h-4" />
                {post.comments_count}
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
