'use client'

import { Star, CheckCircle, ThumbsUp, Flag } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { BusinessReview } from '@/types/business'

interface ReviewCardProps {
  review: BusinessReview
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export const ReviewCard = ({ review }: ReviewCardProps) => {
  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-start gap-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={review.user?.avatar_url || undefined} />
          <AvatarFallback className="bg-emerald-100 text-emerald-700">
            {review.user?.display_name?.[0] || 'U'}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-slate-900">
              {review.user?.display_name || 'Anonymous'}
            </span>
            {review.is_verified && (
              <Badge variant="outline" className="text-xs text-emerald-600 border-emerald-200">
                <CheckCircle className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    'w-4 h-4',
                    star <= review.rating
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-slate-200'
                  )}
                />
              ))}
            </div>
            <span className="text-sm text-slate-500">
              {formatDate(review.created_at)}
            </span>
          </div>

          {review.title && (
            <h4 className="font-medium text-slate-900 mt-2">{review.title}</h4>
          )}

          <p className="text-slate-600 mt-2">{review.content}</p>

          <div className="flex items-center gap-4 mt-4">
            <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-700">
              <ThumbsUp className="w-4 h-4 mr-1" />
              Helpful
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-700">
              <Flag className="w-4 h-4 mr-1" />
              Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
