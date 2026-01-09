'use client'

import { Calendar, MapPin, Clock, Users, ExternalLink, Star, Video } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Event, eventCategoryColors, eventCategoryLabels, eventCategoryIcons } from '@/types/events'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface EventCardProps {
  event: Event
  featured?: boolean
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

export const EventCard = ({ event, featured = false }: EventCardProps) => {
  const categoryIcon = eventCategoryIcons[event.category]
  const categoryColor = eventCategoryColors[event.category]

  const eventDate = new Date(event.start_date)
  const month = eventDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
  const day = eventDate.getDate()

  return (
    <Card
      className={cn(
        'group bg-card/50 backdrop-blur border-border/50 overflow-hidden transition-all duration-300',
        'hover:border-primary/50 hover:shadow-xl hover:-translate-y-1',
        featured && 'md:col-span-2 lg:col-span-1'
      )}
    >
      {/* Event Image or Date Block */}
      <div className="relative">
        {event.image_url ? (
          <div className="h-48 overflow-hidden">
            <img
              src={event.image_url}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {/* Date overlay */}
            <div className="absolute top-4 left-4 bg-background/90 backdrop-blur rounded-lg p-2 text-center min-w-[60px]">
              <div className="text-xs font-semibold text-primary">{month}</div>
              <div className="text-2xl font-bold text-foreground">{day}</div>
            </div>
          </div>
        ) : (
          <div className="h-32 bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
            <div className="bg-background/90 backdrop-blur rounded-lg p-4 text-center">
              <div className="text-sm font-semibold text-primary">{month}</div>
              <div className="text-3xl font-bold text-foreground">{day}</div>
            </div>
          </div>
        )}
        {/* Featured badge */}
        {event.is_featured && (
          <div className="absolute top-4 right-4">
            <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 border">
              <Star className="w-3 h-3 mr-1 fill-amber-400" />
              Featured
            </Badge>
          </div>
        )}
      </div>

      <CardHeader className={cn('pb-3', featured && 'pb-4')}>
        <div className="flex items-center gap-2 mb-2">
          <Badge className={cn('border text-xs', categoryColor)}>
            <span className="mr-1">{categoryIcon}</span>
            {eventCategoryLabels[event.category]}
          </Badge>
          {event.is_virtual && (
            <Badge variant="outline" className="text-xs">
              <Video className="w-3 h-3 mr-1" />
              Virtual
            </Badge>
          )}
          {event.is_free && (
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 border text-xs">
              Free
            </Badge>
          )}
        </div>
        <CardTitle className={cn(
          'text-foreground group-hover:text-primary transition-colors line-clamp-2',
          featured ? 'text-xl' : 'text-lg'
        )}>
          <Link href={`/events/${event.id}`} className="hover:underline">
            {event.title}
          </Link>
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-0 space-y-3">
        {event.description && (
          <CardDescription className={cn(
            'text-muted-foreground',
            featured ? 'line-clamp-3' : 'line-clamp-2'
          )}>
            {event.description}
          </CardDescription>
        )}

        {/* Event Details */}
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <span>{formatTime(event.start_date)}</span>
          </div>
          {(event.location || event.city) && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="line-clamp-1">
                {event.location || `${event.city}${event.state ? `, ${event.state}` : ''}`}
              </span>
            </div>
          )}
          {event.attendee_count > 0 && (
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              <span>{event.attendee_count} attending</span>
            </div>
          )}
        </div>

        {/* Price if not free */}
        {!event.is_free && event.price && (
          <div className="pt-2">
            <span className="text-lg font-semibold text-foreground">{event.price}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 group-hover:bg-primary group-hover:text-white transition-colors"
            asChild
          >
            <Link href={`/events/${event.id}`}>
              View Details
            </Link>
          </Button>
          {event.ticket_url && (
            <Button
              variant="gradient"
              size="sm"
              asChild
            >
              <a href={event.ticket_url} target="_blank" rel="noopener noreferrer">
                Tickets
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
