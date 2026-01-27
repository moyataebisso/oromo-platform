'use client'

import { useState, useEffect } from 'react'
import {
  ChevronUp,
  MessageCircle,
  MoreHorizontal,
  Pencil,
  Trash2,
  User,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { cn } from '@/lib/utils'
import { ReplyCard } from './ReplyCard'
import { ReplyForm } from './ReplyForm'
import {
  toggleUpvote,
  deleteComment,
  getCommentReplies,
} from '@/lib/supabase/page-comments'
import {
  PageComment,
  CommentReply,
  COMMENT_TYPE_CONFIG,
} from '@/types/page-comment'
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

interface CommentCardProps {
  comment: PageComment
  isUpvoted: boolean
  guestId: string | null
  onUpvoteChange: (commentId: string, upvoted: boolean, newCount: number) => void
  onDeleted: (commentId: string) => void
  onReplyAdded: () => void
}

export const CommentCard = ({
  comment,
  isUpvoted,
  guestId,
  onUpvoteChange,
  onDeleted,
  onReplyAdded,
}: CommentCardProps) => {
  const [showReplies, setShowReplies] = useState(false)
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replies, setReplies] = useState<CommentReply[]>([])
  const [isLoadingReplies, setIsLoadingReplies] = useState(false)
  const [isUpvoting, setIsUpvoting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [expanded, setExpanded] = useState(false)

  const typeConfig = COMMENT_TYPE_CONFIG[comment.comment_type]

  // Check if current user is the owner
  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUserId(user?.id || null)
    }
    checkUser()
  }, [])

  const isOwner =
    (comment.user_id && comment.user_id === currentUserId) ||
    (comment.guest_id && comment.guest_id === guestId)

  const handleUpvote = async () => {
    setIsUpvoting(true)
    try {
      const result = await toggleUpvote(comment.id, guestId || undefined)
      if (result.success) {
        onUpvoteChange(comment.id, result.upvoted, result.newCount)
      } else {
        toast.error(result.error || 'Failed to upvote')
      }
    } catch (error) {
      toast.error('Failed to upvote')
    } finally {
      setIsUpvoting(false)
    }
  }

  const handleToggleReplies = async () => {
    if (!showReplies && replies.length === 0) {
      setIsLoadingReplies(true)
      try {
        const data = await getCommentReplies(comment.id)
        setReplies(data)
      } catch (error) {
        toast.error('Failed to load replies')
      } finally {
        setIsLoadingReplies(false)
      }
    }
    setShowReplies(!showReplies)
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const result = await deleteComment(comment.id, guestId || undefined)
      if (result.success) {
        toast.success('Comment deleted')
        onDeleted(comment.id)
      } else {
        toast.error(result.error || 'Failed to delete')
      }
    } catch (error) {
      toast.error('Failed to delete')
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  const handleReplyCreated = (reply: CommentReply) => {
    setReplies((prev) => [...prev, reply])
    setShowReplyForm(false)
    setShowReplies(true)
    onReplyAdded()
  }

  const timeAgo = formatDistanceToNow(new Date(comment.created_at), {
    addSuffix: true,
  })

  const isLongContent = comment.content.length > 200

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-4">
      {/* Header */}
      <div className="mb-2 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            {comment.user?.avatar_url ? (
              <AvatarImage src={comment.user.avatar_url} />
            ) : null}
            <AvatarFallback className="bg-gray-700 text-gray-300">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-white">
                {comment.display_name || 'Anonymous'}
              </span>
              {!comment.user_id && (
                <Badge
                  variant="outline"
                  className="border-gray-600 text-[10px] text-gray-400"
                >
                  Guest
                </Badge>
              )}
            </div>
            <span className="text-xs text-gray-500">{timeAgo}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Type Badge */}
          <Badge
            className={cn(
              'text-[10px]',
              typeConfig.bgClass,
              'text-white border-0'
            )}
          >
            {typeConfig.label}
          </Badge>

          {/* Actions Menu */}
          {isOwner && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-gray-400 hover:text-white"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="border-gray-700 bg-gray-800"
              >
                <DropdownMenuItem
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-red-400 focus:bg-red-900/50 focus:text-red-300"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="mb-3">
        <p
          className={cn(
            'text-sm text-gray-300',
            !expanded && isLongContent && 'line-clamp-3'
          )}
        >
          {comment.content}
        </p>
        {isLongContent && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-1 text-xs text-green-500 hover:text-green-400"
          >
            {expanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Upvote */}
        <button
          onClick={handleUpvote}
          disabled={isUpvoting}
          className={cn(
            'flex items-center gap-1 text-sm transition-colors',
            isUpvoted
              ? 'text-green-500'
              : 'text-gray-400 hover:text-green-500'
          )}
        >
          <ChevronUp
            className={cn('h-5 w-5', isUpvoted && 'fill-current')}
          />
          <span>{comment.upvote_count}</span>
        </button>

        {/* Reply Button */}
        <button
          onClick={handleToggleReplies}
          className={cn(
            'flex items-center gap-1 text-sm text-gray-400 hover:text-white'
          )}
        >
          <MessageCircle className="h-4 w-4" />
          <span>
            {(comment.reply_count || 0) > 0
              ? `${comment.reply_count} ${(comment.reply_count || 0) === 1 ? 'reply' : 'replies'}`
              : 'Reply'}
          </span>
        </button>
      </div>

      {/* Replies Section */}
      {showReplies && (
        <div className="mt-4 border-t border-gray-700 pt-4">
          {isLoadingReplies ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
            </div>
          ) : (
            <div className="space-y-3">
              {replies.map((reply) => (
                <ReplyCard
                  key={reply.id}
                  reply={reply}
                  guestId={guestId}
                  currentUserId={currentUserId}
                />
              ))}

              {showReplyForm ? (
                <ReplyForm
                  commentId={comment.id}
                  guestId={guestId}
                  onSuccess={handleReplyCreated}
                  onCancel={() => setShowReplyForm(false)}
                />
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowReplyForm(true)}
                  className="text-gray-400 hover:text-white"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Add Reply
                </Button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="border-gray-700 bg-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Delete Comment
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete this comment? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="border-gray-600 bg-gray-700 text-white hover:bg-gray-600"
              disabled={isDeleting}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
