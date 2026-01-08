'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface WatchHistoryItem {
  videoId: string
  title: string
  progress: number // 0-100
  lastWatched: string // ISO date string
  completed: boolean
}

interface KidsGuestContextType {
  // Watch history
  watchHistory: WatchHistoryItem[]
  addToWatchHistory: (item: Omit<WatchHistoryItem, 'lastWatched'>) => void
  updateProgress: (videoId: string, progress: number) => void
  getVideoProgress: (videoId: string) => number

  // Stars/Points
  totalStars: number
  earnStars: (amount: number) => void

  // Guest mode
  isGuest: boolean
  showAccountPrompt: boolean
  setShowAccountPrompt: (show: boolean) => void
  dismissAccountPrompt: () => void

  // Sync with account
  getDataForSync: () => {
    watchHistory: WatchHistoryItem[]
    totalStars: number
  }
  clearGuestData: () => void
}

const KidsGuestContext = createContext<KidsGuestContextType | null>(null)

const STORAGE_KEYS = {
  WATCH_HISTORY: 'kids_guest_watch_history',
  TOTAL_STARS: 'kids_guest_stars',
  PROMPT_DISMISSED: 'kids_guest_prompt_dismissed',
  PROMPT_SHOWN_COUNT: 'kids_guest_prompt_count',
}

export function KidsGuestProvider({ children }: { children: ReactNode }) {
  const [watchHistory, setWatchHistory] = useState<WatchHistoryItem[]>([])
  const [totalStars, setTotalStars] = useState(0)
  const [showAccountPrompt, setShowAccountPrompt] = useState(false)
  const [isGuest, setIsGuest] = useState(true)

  // Load data from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem(STORAGE_KEYS.WATCH_HISTORY)
    const savedStars = localStorage.getItem(STORAGE_KEYS.TOTAL_STARS)

    if (savedHistory) {
      try {
        setWatchHistory(JSON.parse(savedHistory))
      } catch (e) {
        console.error('Failed to parse watch history:', e)
      }
    }

    if (savedStars) {
      setTotalStars(parseInt(savedStars, 10) || 0)
    }
  }, [])

  // Save watch history to localStorage
  useEffect(() => {
    if (watchHistory.length > 0) {
      localStorage.setItem(STORAGE_KEYS.WATCH_HISTORY, JSON.stringify(watchHistory))
    }
  }, [watchHistory])

  // Save stars to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TOTAL_STARS, totalStars.toString())
  }, [totalStars])

  // Show account prompt after certain actions
  const maybeShowAccountPrompt = () => {
    const dismissed = localStorage.getItem(STORAGE_KEYS.PROMPT_DISMISSED) === 'true'
    if (dismissed) return

    const shownCount = parseInt(localStorage.getItem(STORAGE_KEYS.PROMPT_SHOWN_COUNT) || '0', 10)

    // Show prompt after watching 3 videos and not shown more than 3 times
    if (watchHistory.length >= 3 && shownCount < 3) {
      setShowAccountPrompt(true)
      localStorage.setItem(STORAGE_KEYS.PROMPT_SHOWN_COUNT, (shownCount + 1).toString())
    }
  }

  const addToWatchHistory = (item: Omit<WatchHistoryItem, 'lastWatched'>) => {
    setWatchHistory(prev => {
      const existing = prev.findIndex(h => h.videoId === item.videoId)
      const newItem: WatchHistoryItem = {
        ...item,
        lastWatched: new Date().toISOString(),
      }

      if (existing >= 0) {
        // Update existing entry
        const updated = [...prev]
        updated[existing] = {
          ...updated[existing],
          ...newItem,
          progress: Math.max(updated[existing].progress, item.progress),
          completed: updated[existing].completed || item.completed,
        }
        return updated
      }

      // Add new entry
      return [newItem, ...prev]
    })

    maybeShowAccountPrompt()
  }

  const updateProgress = (videoId: string, progress: number) => {
    setWatchHistory(prev =>
      prev.map(item =>
        item.videoId === videoId
          ? {
              ...item,
              progress: Math.max(item.progress, progress),
              completed: item.completed || progress >= 90,
              lastWatched: new Date().toISOString(),
            }
          : item
      )
    )
  }

  const getVideoProgress = (videoId: string): number => {
    const item = watchHistory.find(h => h.videoId === videoId)
    return item?.progress || 0
  }

  const earnStars = (amount: number) => {
    setTotalStars(prev => prev + amount)
    maybeShowAccountPrompt()
  }

  const dismissAccountPrompt = () => {
    setShowAccountPrompt(false)
    localStorage.setItem(STORAGE_KEYS.PROMPT_DISMISSED, 'true')
  }

  const getDataForSync = () => ({
    watchHistory,
    totalStars,
  })

  const clearGuestData = () => {
    setWatchHistory([])
    setTotalStars(0)
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key))
  }

  return (
    <KidsGuestContext.Provider
      value={{
        watchHistory,
        addToWatchHistory,
        updateProgress,
        getVideoProgress,
        totalStars,
        earnStars,
        isGuest,
        showAccountPrompt,
        setShowAccountPrompt,
        dismissAccountPrompt,
        getDataForSync,
        clearGuestData,
      }}
    >
      {children}
    </KidsGuestContext.Provider>
  )
}

export function useKidsGuest() {
  const context = useContext(KidsGuestContext)
  if (!context) {
    throw new Error('useKidsGuest must be used within a KidsGuestProvider')
  }
  return context
}
