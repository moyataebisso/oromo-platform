'use client'

import { useState, useEffect, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import {
  getPageComments,
  getUpvoteStatuses,
  getPageCommentCount,
} from '@/lib/supabase/page-comments'
import { PageComment, CommentType } from '@/types/page-comment'

interface UsePageCommentsOptions {
  commentType?: CommentType
  autoFetch?: boolean
}

export function usePageComments(options: UsePageCommentsOptions = {}) {
  const pathname = usePathname()
  const { commentType, autoFetch = true } = options

  const [comments, setComments] = useState<PageComment[]>([])
  const [upvoteStatuses, setUpvoteStatuses] = useState<Record<string, boolean>>({})
  const [commentCount, setCommentCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchComments = useCallback(async (guestId?: string) => {
    if (!pathname) return

    setIsLoading(true)
    setError(null)

    try {
      const data = await getPageComments(pathname, { comment_type: commentType })
      setComments(data)

      // Fetch upvote statuses
      if (data.length > 0 && guestId) {
        const statuses = await getUpvoteStatuses(
          data.map((c) => c.id),
          guestId
        )
        setUpvoteStatuses(statuses)
      }

      // Update count
      setCommentCount(data.length)
    } catch (err) {
      console.error('Error fetching comments:', err)
      setError('Failed to load comments')
    } finally {
      setIsLoading(false)
    }
  }, [pathname, commentType])

  const fetchCount = useCallback(async () => {
    if (!pathname) return

    try {
      const count = await getPageCommentCount(pathname)
      setCommentCount(count)
    } catch (err) {
      console.error('Error fetching comment count:', err)
    }
  }, [pathname])

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch) {
      fetchCount()
    }
  }, [autoFetch, fetchCount])

  const addComment = useCallback((comment: PageComment) => {
    setComments((prev) => [comment, ...prev])
    setCommentCount((prev) => prev + 1)
  }, [])

  const removeComment = useCallback((commentId: string) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId))
    setCommentCount((prev) => Math.max(0, prev - 1))
  }, [])

  const updateUpvote = useCallback(
    (commentId: string, upvoted: boolean, newCount: number) => {
      setUpvoteStatuses((prev) => ({ ...prev, [commentId]: upvoted }))
      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? { ...c, upvote_count: newCount } : c))
      )
    },
    []
  )

  return {
    comments,
    upvoteStatuses,
    commentCount,
    isLoading,
    error,
    fetchComments,
    fetchCount,
    addComment,
    removeComment,
    updateUpvote,
  }
}
