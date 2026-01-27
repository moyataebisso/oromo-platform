'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  User,
  Calendar,
  ExternalLink,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader2,
  ChevronUp,
  MessageCircle,
  Pin,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import {
  getCommentById,
  resolveComment,
  markAsSpam,
  deleteComment,
  togglePinComment,
} from '@/lib/supabase/page-comments'
import {
  PageComment,
  COMMENT_TYPE_CONFIG,
  COMMENT_STATUS_CONFIG,
} from '@/types/page-comment'
import { format } from 'date-fns'
import { toast } from 'sonner'

export default function AdminFeedbackDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [comment, setComment] = useState<PageComment | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [adminNote, setAdminNote] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const commentId = params?.id as string

  useEffect(() => {
    const fetchComment = async () => {
      if (!commentId) return

      setIsLoading(true)
      try {
        const data = await getCommentById(commentId)
        setComment(data)
        setAdminNote(data?.admin_note || '')
      } catch (error) {
        console.error('Error fetching comment:', error)
        toast.error('Failed to load comment')
      } finally {
        setIsLoading(false)
      }
    }

    fetchComment()
  }, [commentId])

  const handleResolve = async () => {
    if (!comment) return

    setIsSubmitting(true)
    try {
      const result = await resolveComment(comment.id, adminNote || undefined)
      if (result.success) {
        toast.success('Comment marked as resolved')
        router.push('/admin/feedback')
      } else {
        toast.error(result.error || 'Failed to resolve')
      }
    } catch {
      toast.error('Failed to resolve')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleHide = async () => {
    if (!comment) return

    setIsSubmitting(true)
    try {
      const result = await deleteComment(comment.id)
      if (result.success) {
        toast.success('Comment hidden')
        router.push('/admin/feedback')
      } else {
        toast.error(result.error || 'Failed to hide')
      }
    } catch {
      toast.error('Failed to hide')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleMarkSpam = async () => {
    if (!comment) return

    setIsSubmitting(true)
    try {
      const result = await markAsSpam(comment.id)
      if (result.success) {
        toast.success('Marked as spam')
        router.push('/admin/feedback')
      } else {
        toast.error(result.error || 'Failed to mark as spam')
      }
    } catch {
      toast.error('Failed to mark as spam')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTogglePin = async () => {
    if (!comment) return

    setIsSubmitting(true)
    try {
      const result = await togglePinComment(comment.id, !comment.is_pinned)
      if (result.success) {
        toast.success(comment.is_pinned ? 'Unpinned' : 'Pinned')
        setComment((prev) => prev ? { ...prev, is_pinned: !prev.is_pinned } : null)
      } else {
        toast.error(result.error || 'Failed to toggle pin')
      }
    } catch {
      toast.error('Failed to toggle pin')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!comment) {
    return (
      <div className="flex h-64 flex-col items-center justify-center text-center">
        <p className="text-lg font-medium">Comment not found</p>
        <Link href="/admin/feedback">
          <Button variant="link">Back to Feedback</Button>
        </Link>
      </div>
    )
  }

  const typeConfig = COMMENT_TYPE_CONFIG[comment.comment_type]
  const statusConfig = COMMENT_STATUS_CONFIG[comment.status]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/feedback">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Feedback Details</h1>
          <p className="text-muted-foreground">
            Review and manage this feedback
          </p>
        </div>
        <div className="flex gap-2">
          <Badge
            className={cn('text-sm', typeConfig.bgClass, 'text-white border-0')}
          >
            {typeConfig.label}
          </Badge>
          <Badge
            variant="outline"
            className={cn(
              'text-sm',
              comment.status === 'active' && 'border-green-500 text-green-500',
              comment.status === 'resolved' && 'border-blue-500 text-blue-500',
              comment.status === 'hidden' && 'border-gray-500 text-gray-500',
              comment.status === 'spam' && 'border-red-500 text-red-500'
            )}
          >
            {statusConfig.label}
          </Badge>
          {comment.is_pinned && (
            <Badge variant="secondary">
              <Pin className="mr-1 h-3 w-3" />
              Pinned
            </Badge>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 md:col-span-2">
          {/* Comment Card */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    {comment.user?.avatar_url ? (
                      <AvatarImage src={comment.user.avatar_url} />
                    ) : null}
                    <AvatarFallback>
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {comment.display_name || 'Anonymous'}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(comment.created_at), 'PPP p')}
                      {!comment.user_id && (
                        <Badge variant="outline" className="text-[10px]">
                          Guest
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <ChevronUp className="h-4 w-4" />
                  <span className="text-sm">{comment.upvote_count} upvotes</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-foreground">
                {comment.content}
              </p>
            </CardContent>
          </Card>

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MessageCircle className="h-5 w-5" />
                  Replies ({comment.replies.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {comment.replies.map((reply) => (
                  <div
                    key={reply.id}
                    className="border-l-2 border-muted pl-4"
                  >
                    <div className="mb-1 flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        {reply.user?.avatar_url ? (
                          <AvatarImage src={reply.user.avatar_url} />
                        ) : null}
                        <AvatarFallback>
                          <User className="h-3 w-3" />
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">
                        {reply.display_name || 'Anonymous'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(reply.created_at), 'PP')}
                      </span>
                    </div>
                    <p className="text-sm">{reply.content}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Admin Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Admin Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-note">Admin Note (optional)</Label>
                <Textarea
                  id="admin-note"
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="Add a note about this feedback..."
                  className="min-h-[100px]"
                />
              </div>

              <Separator />

              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={handleTogglePin}
                  variant="outline"
                  disabled={isSubmitting}
                >
                  <Pin className="mr-2 h-4 w-4" />
                  {comment.is_pinned ? 'Unpin' : 'Pin'}
                </Button>

                {comment.status === 'active' && (
                  <Button
                    onClick={handleResolve}
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isSubmitting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle className="mr-2 h-4 w-4" />
                    )}
                    Mark Resolved
                  </Button>
                )}

                {comment.status !== 'hidden' && (
                  <Button
                    onClick={handleHide}
                    variant="outline"
                    disabled={isSubmitting}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Hide
                  </Button>
                )}

                {comment.status !== 'spam' && (
                  <Button
                    onClick={handleMarkSpam}
                    variant="destructive"
                    disabled={isSubmitting}
                  >
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Mark as Spam
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Page Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Page Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Page Path</p>
                <Link
                  href={comment.page_path}
                  target="_blank"
                  className="flex items-center gap-1 text-sm text-blue-500 hover:underline"
                >
                  {comment.page_path}
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
              {comment.page_title && (
                <div>
                  <p className="text-sm text-muted-foreground">Page Title</p>
                  <p className="text-sm">{comment.page_title}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">ID</span>
                <span className="font-mono text-xs">{comment.id.slice(0, 8)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created</span>
                <span>{format(new Date(comment.created_at), 'PP')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Updated</span>
                <span>{format(new Date(comment.updated_at), 'PP')}</span>
              </div>
              {comment.resolved_at && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Resolved</span>
                  <span>{format(new Date(comment.resolved_at), 'PP')}</span>
                </div>
              )}
              {comment.admin_note && (
                <div className="pt-2">
                  <p className="text-muted-foreground">Admin Note</p>
                  <p className="mt-1 rounded bg-muted p-2 text-xs">
                    {comment.admin_note}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
