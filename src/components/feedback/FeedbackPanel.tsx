'use client'

import { useState, useEffect, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { X, MessageSquare, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { CommentCard } from './CommentCard'
import { CommentForm } from './CommentForm'
import { useGuestId } from '@/hooks/useGuestId'
import { getPageComments, getUpvoteStatuses } from '@/lib/supabase/page-comments'
import { PageComment, CommentType } from '@/types/page-comment'

interface FeedbackPanelProps {
  isOpen: boolean
  onClose: () => void
}

type FilterType = 'all' | CommentType

export const FeedbackPanel = ({ isOpen, onClose }: FeedbackPanelProps) => {
  const pathname = usePathname()
  const { guestId } = useGuestId()
  const [comments, setComments] = useState<PageComment[]>([])
  const [upvoteStatuses, setUpvoteStatuses] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const [showForm, setShowForm] = useState(false)

  // Fetch comments for current page
  const fetchComments = useCallback(async () => {
    if (!pathname) return

    setIsLoading(true)
    try {
      const filter = activeFilter === 'all' ? undefined : activeFilter
      const data = await getPageComments(pathname, { comment_type: filter })
      setComments(data)

      // Fetch upvote statuses
      if (data.length > 0) {
        const statuses = await getUpvoteStatuses(
          data.map((c) => c.id),
          guestId || undefined
        )
        setUpvoteStatuses(statuses)
      }
    } catch (error) {
      console.error('Error fetching comments:', error)
    } finally {
      setIsLoading(false)
    }
  }, [pathname, activeFilter, guestId])

  // Fetch comments when panel opens or filter changes
  useEffect(() => {
    if (isOpen) {
      fetchComments()
    }
  }, [isOpen, fetchComments])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Prevent body scroll when panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const handleCommentCreated = (newComment: PageComment) => {
    setComments((prev) => [newComment, ...prev])
    setShowForm(false)
  }

  const handleUpvoteChange = (commentId: string, upvoted: boolean, newCount: number) => {
    setUpvoteStatuses((prev) => ({ ...prev, [commentId]: upvoted }))
    setComments((prev) =>
      prev.map((c) => (c.id === commentId ? { ...c, upvote_count: newCount } : c))
    )
  }

  const handleCommentDeleted = (commentId: string) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId))
  }

  const filteredComments = comments

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        className={cn(
          'fixed bottom-0 right-0 z-50 flex h-[80vh] w-full flex-col',
          'bg-gray-900 shadow-2xl transition-transform duration-300 ease-out',
          'md:bottom-6 md:right-6 md:h-[600px] md:w-[420px] md:rounded-lg',
          isOpen ? 'translate-y-0' : 'translate-y-full md:translate-y-[120%]'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-700 px-4 py-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-green-500" />
            <h2 className="text-lg font-semibold text-white">Page Feedback</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 text-gray-400 hover:bg-gray-800 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Tabs */}
        <Tabs
          defaultValue="all"
          value={activeFilter}
          onValueChange={(v) => setActiveFilter(v as FilterType)}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <TabsList className="mx-4 mt-3 grid h-auto w-auto grid-cols-5 gap-1 bg-gray-800 p-1">
            <TabsTrigger
              value="all"
              className="text-xs data-[state=active]:bg-gray-700"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="error"
              className="text-xs data-[state=active]:bg-red-900/50 data-[state=active]:text-red-300"
            >
              Errors
            </TabsTrigger>
            <TabsTrigger
              value="suggestion"
              className="text-xs data-[state=active]:bg-blue-900/50 data-[state=active]:text-blue-300"
            >
              Ideas
            </TabsTrigger>
            <TabsTrigger
              value="question"
              className="text-xs data-[state=active]:bg-yellow-900/50 data-[state=active]:text-yellow-300"
            >
              Q&A
            </TabsTrigger>
            <TabsTrigger
              value="general"
              className="text-xs data-[state=active]:bg-gray-700"
            >
              Other
            </TabsTrigger>
          </TabsList>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {isLoading ? (
              <div className="flex h-40 items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
              </div>
            ) : filteredComments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <MessageSquare className="mb-4 h-12 w-12 text-gray-600" />
                <p className="text-lg font-medium text-gray-400">No feedback yet</p>
                <p className="mt-1 text-sm text-gray-500">
                  Be the first to leave feedback on this page!
                </p>
                <Button
                  onClick={() => setShowForm(true)}
                  className="mt-4 bg-green-600 hover:bg-green-700"
                >
                  Add Comment
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredComments.map((comment) => (
                  <CommentCard
                    key={comment.id}
                    comment={comment}
                    isUpvoted={upvoteStatuses[comment.id] || false}
                    guestId={guestId}
                    onUpvoteChange={handleUpvoteChange}
                    onDeleted={handleCommentDeleted}
                    onReplyAdded={() => fetchComments()}
                  />
                ))}
              </div>
            )}
          </div>
        </Tabs>

        {/* Add Comment Button / Form */}
        <div className="border-t border-gray-700 p-4">
          {showForm ? (
            <CommentForm
              pagePath={pathname || '/'}
              guestId={guestId}
              onSuccess={handleCommentCreated}
              onCancel={() => setShowForm(false)}
            />
          ) : (
            <Button
              onClick={() => setShowForm(true)}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Add Feedback
            </Button>
          )}
        </div>
      </div>
    </>
  )
}
