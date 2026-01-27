'use client'

import { Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { LinkPreview } from '@/lib/supabase/link-previews'
import { useLanguage } from '@/contexts/LanguageContext'

interface PreviewTooltipContentProps {
  preview: LinkPreview | null
  isLoading: boolean
}

export const PreviewTooltipContent = ({
  preview,
  isLoading,
}: PreviewTooltipContentProps) => {
  const { language } = useLanguage()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
      </div>
    )
  }

  if (!preview) {
    return null
  }

  const title = language === 'om' && preview.title_om ? preview.title_om : preview.title_en
  const description =
    language === 'om' && preview.description_om
      ? preview.description_om
      : preview.description_en

  return (
    <div className="flex gap-3 p-3">
      {/* Icon */}
      {preview.icon && (
        <div className="flex-shrink-0 text-2xl">{preview.icon}</div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-semibold text-white text-sm">{title}</h4>
          {preview.badge && (
            <Badge
              variant="secondary"
              className={cn(
                'text-[10px] shrink-0',
                preview.badge_color === 'green' && 'bg-green-600/20 text-green-400',
                preview.badge_color === 'blue' && 'bg-blue-600/20 text-blue-400',
                preview.badge_color === 'purple' && 'bg-purple-600/20 text-purple-400',
                preview.badge_color === 'yellow' && 'bg-yellow-600/20 text-yellow-400',
                !preview.badge_color && 'bg-gray-600/20 text-gray-400'
              )}
            >
              {preview.badge}
            </Badge>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-1 line-clamp-2">{description}</p>
        {preview.stats && (
          <p className="text-xs text-green-400 mt-1.5 font-medium">
            {preview.stats}
          </p>
        )}
      </div>
    </div>
  )
}
