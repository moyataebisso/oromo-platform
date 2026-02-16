'use client'

import { useState } from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { Reply, MoreHorizontal, Flag, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { VoteButton } from './VoteButton'
import { ReportDialog } from './ReportDialog'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import type { ForumComment } from '@/types/community'
import ReactMarkdown from 'react-markdown'

interface CommentThreadProps {
  comments: ForumComment[]
  postId: string
  postLocked: boolean
  isModerator?: boolean
  currentUserId?: string
  onCommentAdded?: () => void
}

export function CommentThread({
  comments,
  postId,
  postLocked,
  isModerator = false,
  currentUserId,
  onCommentAdded
}: CommentThreadProps) {
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [reportCommentId, setReportCommentId] = useState<string | null>(null)

  const handleSubmitReply = async (parentId: string | null) => {
    if (!replyContent.trim()) return

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      toast.error('Please log in to comment')
      return
    }

    setIsSubmitting(true)

    try {
      const { error } = await supabase
        .from('forum_comments')
        .insert({
          post_id: postId,
          parent_id: parentId,
          user_id: user.id,
          content: replyContent.trim(),
        } as never)

      if (error) throw error

      setReplyContent('')
      setReplyingTo(null)
      toast.success('Comment posted!')
      onCommentAdded?.()
    } catch {
      toast.error('Failed to post comment')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return

    const supabase = createClient()

    try {
      const { error } = await supabase
        .from('forum_comments')
        .update({ is_deleted: true, content: '[deleted]' } as never)
        .eq('id', commentId)

      if (error) throw error

      toast.success('Comment deleted')
      onCommentAdded?.()
    } catch {
      toast.error('Failed to delete comment')
    }
  }

  return (
    <div className="space-y-4">
      {/* New comment input */}
      {!postLocked && currentUserId && (
        <div className="space-y-3">
          <Textarea
            placeholder="Write a comment..."
            value={replyingTo === null ? replyContent : ''}
            onChange={(e) => {
              if (replyingTo === null) {
                setReplyContent(e.target.value)
              }
            }}
            rows={3}
            className="resize-none"
          />
          <div className="flex justify-end">
            <Button
              onClick={() => handleSubmitReply(null)}
              disabled={isSubmitting || !replyContent.trim()}
            >
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </Button>
          </div>
        </div>
      )}

      {postLocked && (
        <div className="text-center py-4 text-muted-foreground bg-muted rounded-lg">
          This post is locked. New comments cannot be added.
        </div>
      )}

      {/* Comments list */}
      <div className="space-y-4">
        {comments.map(comment => (
          <CommentItem
            key={comment.id}
            comment={comment}
            postLocked={postLocked}
            isModerator={isModerator}
            currentUserId={currentUserId}
            replyingTo={replyingTo}
            replyContent={replyContent}
            isSubmitting={isSubmitting}
            onReplyStart={setReplyingTo}
            onReplyContentChange={setReplyContent}
            onSubmitReply={handleSubmitReply}
            onDelete={handleDelete}
            onReport={setReportCommentId}
          />
        ))}
      </div>

      {/* Report dialog */}
      {reportCommentId && (
        <ReportDialog
          type="comment"
          id={reportCommentId}
          open={!!reportCommentId}
          onClose={() => setReportCommentId(null)}
        />
      )}
    </div>
  )
}

interface CommentItemProps {
  comment: ForumComment
  postLocked: boolean
  isModerator: boolean
  currentUserId?: string
  replyingTo: string | null
  replyContent: string
  isSubmitting: boolean
  onReplyStart: (id: string | null) => void
  onReplyContentChange: (content: string) => void
  onSubmitReply: (parentId: string) => void
  onDelete: (id: string) => void
  onReport: (id: string) => void
}

function CommentItem({
  comment,
  postLocked,
  isModerator,
  currentUserId,
  replyingTo,
  replyContent,
  isSubmitting,
  onReplyStart,
  onReplyContentChange,
  onSubmitReply,
  onDelete,
  onReport
}: CommentItemProps) {
  const authorName = comment.author?.display_name || comment.author?.username || 'Anonymous'
  const authorInitials = authorName.slice(0, 2).toUpperCase()
  const timeAgo = formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })
  const canReply = !postLocked && currentUserId && (comment.depth || 0) < 5
  const canDelete = isModerator || (currentUserId === comment.user_id)

  const marginLeft = Math.min((comment.depth || 0) * 24, 96)

  return (
    <div style={{ marginLeft: `${marginLeft}px` }}>
      <div className="flex gap-3">
        {/* Vote buttons */}
        <div className="hidden sm:block">
          <VoteButton
            type="comment"
            id={comment.id}
            upvotes={comment.upvotes}
            downvotes={comment.downvotes}
            userVote={comment.user_vote || null}
            vertical
            size="sm"
          />
        </div>

        {/* Comment content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 text-sm mb-1">
            <Link
              href={`/odda/profile/${comment.user_id}`}
              className="flex items-center gap-1.5 hover:underline"
            >
              <Avatar className="h-5 w-5">
                <AvatarImage src={comment.author?.avatar_url || undefined} />
                <AvatarFallback className="text-xs">{authorInitials}</AvatarFallback>
              </Avatar>
              <span className="font-medium">{authorName}</span>
            </Link>
            {comment.author?.role === 'moderator' && (
              <Badge variant="outline" className="text-xs py-0 text-green-600 border-green-600">
                MOD
              </Badge>
            )}
            {comment.author?.role === 'admin' && (
              <Badge variant="outline" className="text-xs py-0 text-red-600 border-red-600">
                ADMIN
              </Badge>
            )}
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground">{timeAgo}</span>
          </div>

          {/* Content */}
          <div className={cn(
            'prose prose-sm dark:prose-invert max-w-none mb-2',
            comment.is_deleted && 'italic text-muted-foreground'
          )}>
            <ReactMarkdown>{comment.content}</ReactMarkdown>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Mobile vote */}
            <div className="sm:hidden">
              <VoteButton
                type="comment"
                id={comment.id}
                upvotes={comment.upvotes}
                downvotes={comment.downvotes}
                userVote={comment.user_vote || null}
                size="sm"
              />
            </div>

            {canReply && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={() => onReplyStart(comment.id)}
              >
                <Reply className="w-3 h-3 mr-1" />
                Reply
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 w-7">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onReport(comment.id)}>
                  <Flag className="w-4 h-4 mr-2" />
                  Report
                </DropdownMenuItem>
                {canDelete && (
                  <DropdownMenuItem
                    onClick={() => onDelete(comment.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Reply input */}
          {replyingTo === comment.id && (
            <div className="mt-3 space-y-2">
              <Textarea
                placeholder={`Reply to ${authorName}...`}
                value={replyContent}
                onChange={(e) => onReplyContentChange(e.target.value)}
                rows={2}
                className="resize-none"
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onReplyStart(null)
                    onReplyContentChange('')
                  }}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={() => onSubmitReply(comment.id)}
                  disabled={isSubmitting || !replyContent.trim()}
                >
                  {isSubmitting ? 'Posting...' : 'Reply'}
                </Button>
              </div>
            </div>
          )}

          {/* Nested replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 space-y-4">
              {comment.replies.map(reply => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  postLocked={postLocked}
                  isModerator={isModerator}
                  currentUserId={currentUserId}
                  replyingTo={replyingTo}
                  replyContent={replyContent}
                  isSubmitting={isSubmitting}
                  onReplyStart={onReplyStart}
                  onReplyContentChange={onReplyContentChange}
                  onSubmitReply={onSubmitReply}
                  onDelete={onDelete}
                  onReport={onReport}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
