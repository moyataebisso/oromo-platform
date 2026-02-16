'use client'

import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { MessageSquare, Pin, Lock, MoreHorizontal, Flag, Trash2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { VoteButton } from './VoteButton'
import { cn } from '@/lib/utils'
import type { ForumPost } from '@/types/community'

interface PostCardProps {
  post: ForumPost
  showCategory?: boolean
  isModerator?: boolean
  onReport?: (postId: string) => void
  onDelete?: (postId: string) => void
}

export function PostCard({
  post,
  showCategory = true,
  isModerator = false,
  onReport,
  onDelete
}: PostCardProps) {
  const authorName = post.author?.display_name || post.author?.username || 'Anonymous'
  const authorInitials = authorName.slice(0, 2).toUpperCase()
  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true })

  // Truncate content for preview
  const contentPreview = post.content.length > 300
    ? post.content.slice(0, 300) + '...'
    : post.content

  return (
    <Card className={cn(
      'transition-shadow hover:shadow-md',
      post.is_pinned && 'border-amber-500/50 bg-amber-50/50 dark:bg-amber-950/10'
    )}>
      <CardContent className="pt-4">
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
            {/* Header */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 flex-wrap text-sm">
                {showCategory && post.category && (
                  <Link href={`/community/${post.category.slug}`}>
                    <Badge
                      variant="secondary"
                      className="hover:bg-secondary/80"
                      style={{
                        backgroundColor: post.category.color ? `${post.category.color}20` : undefined,
                        color: post.category.color || undefined
                      }}
                    >
                      {post.category.name}
                    </Badge>
                  </Link>
                )}
                <div className="flex items-center gap-2">
                  <Link
                    href={`/odda/profile/${post.user_id}`}
                    className="flex items-center gap-1.5 hover:underline"
                  >
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={post.author?.avatar_url || undefined} />
                      <AvatarFallback className="text-xs">{authorInitials}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-foreground">{authorName}</span>
                  </Link>
                  {post.author?.role === 'moderator' && (
                    <Badge variant="outline" className="text-xs py-0 text-green-600 border-green-600">
                      MOD
                    </Badge>
                  )}
                  {post.author?.role === 'admin' && (
                    <Badge variant="outline" className="text-xs py-0 text-red-600 border-red-600">
                      ADMIN
                    </Badge>
                  )}
                  <span className="text-muted-foreground">·</span>
                  <span className="text-muted-foreground">{timeAgo}</span>
                </div>
              </div>

              {/* Actions dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onReport?.(post.id)}>
                    <Flag className="w-4 h-4 mr-2" />
                    Report
                  </DropdownMenuItem>
                  {(isModerator || onDelete) && (
                    <DropdownMenuItem
                      onClick={() => onDelete?.(post.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Title with indicators */}
            <Link href={`/community/post/${post.id}`} className="group">
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                {post.is_pinned && (
                  <Pin className="w-4 h-4 text-amber-500 shrink-0" />
                )}
                {post.is_locked && (
                  <Lock className="w-4 h-4 text-muted-foreground shrink-0" />
                )}
                <span className="line-clamp-2">{post.title}</span>
              </h3>
            </Link>

            {/* Content preview */}
            <Link href={`/community/post/${post.id}`}>
              <p className="text-muted-foreground text-sm line-clamp-3 mb-3">
                {contentPreview}
              </p>
            </Link>

            {/* Footer stats */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {/* Mobile vote display */}
              <div className="sm:hidden">
                <VoteButton
                  type="post"
                  id={post.id}
                  upvotes={post.upvotes}
                  downvotes={post.downvotes}
                  userVote={post.user_vote || null}
                  size="sm"
                />
              </div>
              <Link
                href={`/community/post/${post.id}`}
                className="flex items-center gap-1.5 hover:text-foreground transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{post.comment_count} comments</span>
              </Link>
              <span className="text-muted-foreground/60">
                {post.view_count} views
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
