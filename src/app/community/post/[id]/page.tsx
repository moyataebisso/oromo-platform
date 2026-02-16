import Link from 'next/link'
import { notFound } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { ChevronLeft, Pin, Lock, Eye, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { createClient } from '@/lib/supabase/server'
import { getPostById, getCommentsByPostId } from '@/lib/supabase/community'
import { VoteButton, CommentThread } from '@/components/community'
import ReactMarkdown from 'react-markdown'

interface Props {
  params: Promise<{ id: string }>
}

export default async function PostDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Get user role for moderator check
  let isModerator = false
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single() as { data: { role: string } | null }
    isModerator = profile?.role === 'moderator' || profile?.role === 'admin'
  }

  const [post, comments] = await Promise.all([
    getPostById(id),
    getCommentsByPostId(id)
  ])

  if (!post) {
    notFound()
  }

  const authorName = post.author?.display_name || post.author?.username || 'Anonymous'
  const authorInitials = authorName.slice(0, 2).toUpperCase()
  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true })

  return (
    <div className="bg-background">
      {/* Navigation */}
      <div className="border-b">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={post.category ? `/community/${post.category.slug}` : '/community'}>
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to {post.category?.name || 'Community'}
            </Link>
          </Button>
        </div>
      </div>

      <main className="py-6 px-4">
        <div className="mx-auto max-w-4xl">
          <div className="grid lg:grid-cols-[1fr_280px] gap-6">
            {/* Main Content */}
            <div className="space-y-6">
              {/* Post */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    {/* Vote buttons */}
                    <div className="hidden sm:block">
                      <VoteButton
                        type="post"
                        id={post.id}
                        upvotes={post.upvotes}
                        downvotes={post.downvotes}
                        userVote={post.user_vote || null}
                        vertical
                      />
                    </div>

                    {/* Post content */}
                    <div className="flex-1 min-w-0">
                      {/* Category badge */}
                      {post.category && (
                        <Link href={`/community/${post.category.slug}`}>
                          <Badge
                            variant="secondary"
                            className="mb-3 hover:bg-secondary/80"
                            style={{
                              backgroundColor: post.category.color ? `${post.category.color}20` : undefined,
                              color: post.category.color || undefined
                            }}
                          >
                            {post.category.name}
                          </Badge>
                        </Link>
                      )}

                      {/* Title */}
                      <h1 className="text-2xl font-bold mb-3 flex items-center gap-2 flex-wrap">
                        {post.is_pinned && (
                          <Pin className="w-5 h-5 text-amber-500 shrink-0" />
                        )}
                        {post.is_locked && (
                          <Lock className="w-5 h-5 text-muted-foreground shrink-0" />
                        )}
                        {post.title}
                      </h1>

                      {/* Author info */}
                      <div className="flex items-center gap-3 mb-4">
                        <Link
                          href={`/odda/profile/${post.user_id}`}
                          className="flex items-center gap-2 hover:underline"
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={post.author?.avatar_url || undefined} />
                            <AvatarFallback>{authorInitials}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{authorName}</span>
                        </Link>
                        {post.author?.role === 'moderator' && (
                          <Badge variant="outline" className="text-xs text-green-600 border-green-600">
                            MOD
                          </Badge>
                        )}
                        {post.author?.role === 'admin' && (
                          <Badge variant="outline" className="text-xs text-red-600 border-red-600">
                            ADMIN
                          </Badge>
                        )}
                        <span className="text-sm text-muted-foreground">{timeAgo}</span>
                      </div>

                      {/* Content */}
                      <div className="prose prose-slate dark:prose-invert max-w-none mb-4">
                        <ReactMarkdown>{post.content}</ReactMarkdown>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground pt-4 border-t">
                        <div className="sm:hidden">
                          <VoteButton
                            type="post"
                            id={post.id}
                            upvotes={post.upvotes}
                            downvotes={post.downvotes}
                            userVote={post.user_vote || null}
                          />
                        </div>
                        <span className="flex items-center gap-1.5">
                          <Eye className="w-4 h-4" />
                          {post.view_count} views
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MessageSquare className="w-4 h-4" />
                          {post.comment_count} comments
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Comments Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Comments ({post.comment_count})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CommentThread
                    comments={comments}
                    postId={post.id}
                    postLocked={post.is_locked}
                    isModerator={isModerator}
                    currentUserId={user?.id}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="hidden lg:block space-y-6">
              {/* Author Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">About the author</CardTitle>
                </CardHeader>
                <CardContent>
                  <Link
                    href={`/odda/profile/${post.user_id}`}
                    className="flex items-center gap-3 hover:bg-accent -mx-2 px-2 py-2 rounded-lg transition-colors"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={post.author?.avatar_url || undefined} />
                      <AvatarFallback>{authorInitials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{authorName}</p>
                      <p className="text-xs text-muted-foreground">View profile</p>
                    </div>
                  </Link>
                </CardContent>
              </Card>

              {/* Related */}
              {post.category && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">More in {post.category.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Link
                      href={`/community/${post.category.slug}`}
                      className="text-sm text-primary hover:underline"
                    >
                      View all posts in {post.category.name} →
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
