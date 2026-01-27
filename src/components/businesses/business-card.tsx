'use client'

import Link from 'next/link'
import { MapPin, Star, Clock, CheckCircle, Phone, Navigation, Globe, Sparkles } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Business, BUSINESS_CATEGORIES } from '@/types/business'
import { formatDistance } from '@/hooks/use-geolocation'

interface BusinessCardProps {
  business: Business
  className?: string
  showActions?: boolean
}

const isOpenNow = (hours: Business['hours']): boolean => {
  if (!hours) return false
  const now = new Date()
  const dayName = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() as keyof typeof hours
  const todayHours = hours[dayName]

  if (!todayHours) return false

  const currentTime = now.getHours() * 100 + now.getMinutes()
  const openTime = parseInt(todayHours.open.replace(':', ''))
  const closeTime = parseInt(todayHours.close.replace(':', ''))

  return currentTime >= openTime && currentTime <= closeTime
}

export const BusinessCard = ({ business, className, showActions = true }: BusinessCardProps) => {
  const category = BUSINESS_CATEGORIES.find(c => c.value === business.category)
  const open = isOpenNow(business.hours)
  const isPremium = business.subscription_tier === 'premium'
  const isFeatured = business.is_featured || isPremium

  const handleCall = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (business.phone) {
      window.location.href = `tel:${business.phone}`
    }
  }

  const handleDirections = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const address = encodeURIComponent(`${business.address}, ${business.city}, ${business.state} ${business.zip_code || ''}`)
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${address}`, '_blank')
  }

  const handleWebsite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (business.website) {
      window.open(business.website, '_blank')
    }
  }

  return (
    <Card className={cn(
      'overflow-hidden hover:shadow-lg transition-all duration-200 group relative',
      isFeatured && 'ring-2 ring-amber-400/50',
      className
    )}>
      <Link href={`/businesses/${business.slug}`}>
        {/* Cover Image */}
        <div className="relative h-40 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30">
          {business.cover_image_url ? (
            <img
              src={business.cover_image_url}
              alt={business.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">
              {category?.icon || '🏪'}
            </div>
          )}

          {/* Featured Badge */}
          {isFeatured && (
            <Badge
              className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0"
            >
              <Sparkles className="w-3 h-3 mr-1" />
              Featured
            </Badge>
          )}

          {/* Open/Closed Badge */}
          {business.hours && (
            <Badge
              className={cn(
                'absolute top-3 right-3',
                open ? 'bg-green-500' : 'bg-slate-500'
              )}
            >
              <Clock className="w-3 h-3 mr-1" />
              {open ? 'Open Now' : 'Closed'}
            </Badge>
          )}

          {/* Logo */}
          {business.logo_url && (
            <div className="absolute -bottom-6 left-4 w-14 h-14 rounded-lg bg-white dark:bg-slate-800 shadow-md overflow-hidden border-2 border-white dark:border-slate-700">
              <img
                src={business.logo_url}
                alt={`${business.name} logo`}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        <CardContent className={cn('p-4', business.logo_url && 'pt-8')}>
          {/* Category & Verified */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Badge variant="secondary" className="text-xs">
              {category?.icon} {category?.label}
            </Badge>
            {business.is_verified && (
              <Badge variant="outline" className="text-xs text-emerald-600 border-emerald-200 dark:text-emerald-400 dark:border-emerald-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            )}
          </div>

          {/* Name */}
          <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
            {business.name}
          </h3>

          {/* Location & Distance */}
          <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 mt-1">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{business.city}, {business.state}</span>
            {business.distance !== undefined && (
              <span className="ml-auto text-emerald-600 dark:text-emerald-400 font-medium flex-shrink-0">
                {formatDistance(business.distance)}
              </span>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  'w-4 h-4',
                  star <= Math.round(business.rating)
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-slate-200 dark:text-slate-600'
                )}
              />
            ))}
            <span className="text-sm text-slate-600 dark:text-slate-400 ml-1">
              {business.rating.toFixed(1)} ({business.review_count})
            </span>
          </div>
        </CardContent>
      </Link>

      {/* Quick Action Buttons */}
      {showActions && (
        <div className="px-4 pb-4 pt-0 flex gap-2">
          {business.phone && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs"
              onClick={handleCall}
            >
              <Phone className="w-3 h-3 mr-1" />
              Call
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-xs"
            onClick={handleDirections}
          >
            <Navigation className="w-3 h-3 mr-1" />
            Directions
          </Button>
          {business.website && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs"
              onClick={handleWebsite}
            >
              <Globe className="w-3 h-3 mr-1" />
              Website
            </Button>
          )}
        </div>
      )}
    </Card>
  )
}
