'use client'

import { useState, useEffect } from 'react'

const GUEST_ID_KEY = 'odda_guest_id'

/**
 * Generate a unique guest ID
 */
function generateGuestId(): string {
  const timestamp = Date.now().toString(36)
  const randomPart = Math.random().toString(36).substring(2, 15)
  return `guest_${timestamp}_${randomPart}`
}

/**
 * Hook to manage guest ID for anonymous users
 * Persists across sessions using localStorage
 */
export function useGuestId() {
  const [guestId, setGuestId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if we already have a guest ID
    const existingId = localStorage.getItem(GUEST_ID_KEY)

    if (existingId) {
      setGuestId(existingId)
    } else {
      // Generate a new guest ID
      const newId = generateGuestId()
      localStorage.setItem(GUEST_ID_KEY, newId)
      setGuestId(newId)
    }

    setIsLoading(false)
  }, [])

  /**
   * Clear the guest ID (e.g., when user logs in)
   */
  const clearGuestId = () => {
    localStorage.removeItem(GUEST_ID_KEY)
    setGuestId(null)
  }

  /**
   * Regenerate a new guest ID
   */
  const regenerateGuestId = () => {
    const newId = generateGuestId()
    localStorage.setItem(GUEST_ID_KEY, newId)
    setGuestId(newId)
    return newId
  }

  return {
    guestId,
    isLoading,
    isGuest: !!guestId,
    clearGuestId,
    regenerateGuestId,
  }
}
