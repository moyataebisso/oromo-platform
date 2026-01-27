'use client'

import { useState, useEffect, useCallback } from 'react'
import { getLinkPreview, LinkPreview } from '@/lib/supabase/link-previews'

// Cache for link previews
const previewCache = new Map<string, LinkPreview>()

interface UseLinkPreviewResult {
  preview: LinkPreview | null
  isLoading: boolean
  error: string | null
}

export function useLinkPreview(href: string): UseLinkPreviewResult {
  const [preview, setPreview] = useState<LinkPreview | null>(
    href ? previewCache.get(href) || null : null
  )
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPreview = useCallback(async () => {
    // Skip empty hrefs
    if (!href) {
      return
    }

    // Check cache first
    if (previewCache.has(href)) {
      setPreview(previewCache.get(href)!)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const data = await getLinkPreview(href)
      if (data) {
        previewCache.set(href, data)
        setPreview(data)
      }
    } catch (err) {
      setError('Failed to load preview')
      console.error('Error fetching link preview:', err)
    } finally {
      setIsLoading(false)
    }
  }, [href])

  useEffect(() => {
    // Only fetch if we have an href and need to
    if (href && !previewCache.has(href) && !preview) {
      fetchPreview()
    }
  }, [href, fetchPreview, preview])

  return { preview, isLoading, error }
}

/**
 * Preload all link previews for caching
 */
export function usePreloadLinkPreviews() {
  useEffect(() => {
    const preloadPreviews = async () => {
      try {
        // Import dynamically to avoid server-side issues
        const { getAllLinkPreviews } = await import(
          '@/lib/supabase/link-previews'
        )
        const previews = await getAllLinkPreviews()
        previews.forEach((preview) => {
          previewCache.set(preview.link_path, preview)
        })
      } catch (err) {
        console.error('Error preloading link previews:', err)
      }
    }

    preloadPreviews()
  }, [])
}

/**
 * Clear the preview cache
 */
export function clearPreviewCache() {
  previewCache.clear()
}
