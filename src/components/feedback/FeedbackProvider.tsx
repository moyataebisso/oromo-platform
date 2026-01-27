'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { getPageCommentCount } from '@/lib/supabase/page-comments'

interface FeedbackContextType {
  commentCount: number
  refreshCommentCount: () => Promise<void>
}

const FeedbackContext = createContext<FeedbackContextType>({
  commentCount: 0,
  refreshCommentCount: async () => {},
})

export const useFeedback = () => useContext(FeedbackContext)

interface FeedbackProviderProps {
  children: React.ReactNode
}

export const FeedbackProvider = ({ children }: FeedbackProviderProps) => {
  const pathname = usePathname()
  const [commentCount, setCommentCount] = useState(0)

  const fetchCommentCount = useCallback(async () => {
    if (!pathname) return

    try {
      const count = await getPageCommentCount(pathname)
      setCommentCount(count)
    } catch (error) {
      console.error('Error fetching comment count:', error)
    }
  }, [pathname])

  // Fetch count when path changes
  useEffect(() => {
    fetchCommentCount()
  }, [fetchCommentCount])

  const refreshCommentCount = useCallback(async () => {
    await fetchCommentCount()
  }, [fetchCommentCount])

  return (
    <FeedbackContext.Provider
      value={{
        commentCount,
        refreshCommentCount,
      }}
    >
      {children}
    </FeedbackContext.Provider>
  )
}
