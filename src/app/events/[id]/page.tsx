import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  ExternalLink,
  Share2,
  ArrowLeft,
  Video,
  Mail,
  Globe
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RSVPButton } from '@/components/events/rsvp-button'
import { Event, eventCategoryColors, eventCategoryLabels, eventCategoryIcons } from '@/types/events'

// Sample events data - same as main page, would come from Supabase
const sampleEvents: Event[] = [
  {
    id: '1',
    title: 'Oromo Cultural Festival 2026',
    description: 'Join us for a celebration of Oromo culture featuring traditional music, dance, food, and art. This annual festival brings together thousands of community members from across the region.\n\nThe festival will include:\n- Traditional music and dance performances\n- Authentic Oromo cuisine from local vendors\n- Art exhibitions showcasing Oromo artists\n- Cultural workshops and demonstrations\n- Children\'s activities and games\n- Community marketplace\n\nDon\'t miss this incredible opportunity to celebrate our heritage together!',
    location: 'Washington Convention Center',
    address: '801 Mt Vernon Pl NW',
    city: 'Washington',
    state: 'DC',
    country: 'USA',
    is_virtual: false,
    virtual_link: null,
    start_date: '2026-03-15T10:00:00Z',
    end_date: '2026-03-15T22:00:00Z',
    timezone: 'America/New_York',
    organizer_name: 'Oromo Community Association',
    organizer_email: 'events@oromocommunity.org',
    organizer_id: null,
    category: 'cultural',
    image_url: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200',
    ticket_url: 'https://example.com/tickets',
    is_free: false,
    price: '$25',
    is_approved: true,
    is_featured: true,
    attendee_count: 458,
    created_at: '2025-12-01T00:00:00Z',
    updated_at: '2025-12-01T00:00:00Z',
  },
  {
    id: '2',
    title: 'Afaan Oromoo Language Workshop',
    description: 'Learn the basics of Afaan Oromoo in this interactive workshop. Perfect for beginners and those looking to reconnect with their heritage language.\n\nTopics covered:\n- Basic greetings and introductions\n- Common phrases for daily life\n- Numbers and counting\n- Family vocabulary\n- Cultural context and usage\n\nMaterials will be provided digitally before the session.',
    location: 'Virtual Event',
    address: null,
    city: null,
    state: null,
    country: 'Global',
    is_virtual: true,
    virtual_link: 'https://zoom.us/meeting123',
    start_date: '2026-01-20T18:00:00Z',
    end_date: '2026-01-20T20:00:00Z',
    timezone: 'America/New_York',
    organizer_name: 'Oromo Language Institute',
    organizer_email: 'learn@oromolanguage.org',
    organizer_id: null,
    category: 'educational',
    image_url: null,
    ticket_url: null,
    is_free: true,
    price: null,
    is_approved: true,
    is_featured: true,
    attendee_count: 124,
    created_at: '2025-12-15T00:00:00Z',
    updated_at: '2025-12-15T00:00:00Z',
  },
]

interface EventDetailPageProps {
  params: { id: string }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
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

export async function generateMetadata({ params }: EventDetailPageProps): Promise<Metadata> {
  const event = sampleEvents.find(e => e.id === params.id)

  if (!event) {
    return {
      title: 'Event Not Found | Odda Academy',
    }
  }

  return {
    title: `${event.title} | Odda Academy`,
    description: event.description?.slice(0, 160),
  }
}

export default function EventDetailPage({ params }: EventDetailPageProps) {
  const event = sampleEvents.find(e => e.id === params.id)

  if (!event) {
    notFound()
  }

  const categoryIcon = eventCategoryIcons[event.category]
  const categoryColor = eventCategoryColors[event.category]

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Image or Gradient */}
      <div className="relative h-64 md:h-96">
        {event.image_url ? (
          <img
            src={event.image_url}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-900/50 via-purple-900/50 to-pink-900/50" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

        {/* Back button */}
        <div className="absolute top-6 left-6">
          <Button variant="outline" size="sm" asChild className="bg-background/80 backdrop-blur">
            <Link href="/events">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Events
            </Link>
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 -mt-32 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Header */}
            <Card className="bg-card/80 backdrop-blur border-border/50">
              <CardContent className="pt-6">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <Badge className={categoryColor}>
                    <span className="mr-1">{categoryIcon}</span>
                    {eventCategoryLabels[event.category]}
                  </Badge>
                  {event.is_virtual && (
                    <Badge variant="outline">
                      <Video className="w-3 h-3 mr-1" />
                      Virtual
                    </Badge>
                  )}
                  {event.is_free && (
                    <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 border">
                      Free Event
                    </Badge>
                  )}
                  {event.is_featured && (
                    <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 border">
                      Featured
                    </Badge>
                  )}
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  {event.title}
                </h1>

                {/* Quick Info */}
                <div className="grid sm:grid-cols-2 gap-4 text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {formatDate(event.start_date)}
                      </p>
                      <p className="text-sm">
                        {formatTime(event.start_date)}
                        {event.end_date && ` - ${formatTime(event.end_date)}`}
                      </p>
                    </div>
                  </div>

                  {(event.location || event.is_virtual) && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        {event.is_virtual ? (
                          <Globe className="w-5 h-5 text-primary" />
                        ) : (
                          <MapPin className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {event.is_virtual ? 'Virtual Event' : event.location}
                        </p>
                        {!event.is_virtual && event.city && (
                          <p className="text-sm">
                            {event.city}{event.state ? `, ${event.state}` : ''}, {event.country}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card className="bg-card/80 backdrop-blur border-border/50">
              <CardHeader>
                <CardTitle>About This Event</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-invert max-w-none">
                  {event.description?.split('\n').map((paragraph, index) => (
                    <p key={index} className="text-muted-foreground mb-4 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Location Details */}
            {!event.is_virtual && event.address && (
              <Card className="bg-card/80 backdrop-blur border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    Location
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium text-foreground">{event.location}</p>
                  <p className="text-muted-foreground">{event.address}</p>
                  <p className="text-muted-foreground">
                    {event.city}{event.state ? `, ${event.state}` : ''} {event.country}
                  </p>
                  <Button variant="outline" className="mt-4" asChild>
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(
                        `${event.address}, ${event.city}, ${event.state} ${event.country}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      View on Map
                      <ExternalLink className="w-3 h-3 ml-2" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Card */}
            <Card className="bg-card/80 backdrop-blur border-border/50 sticky top-24">
              <CardContent className="pt-6 space-y-4">
                {/* Price */}
                {event.is_free ? (
                  <div className="text-center py-4">
                    <span className="text-3xl font-bold text-emerald-400">Free</span>
                  </div>
                ) : event.price && (
                  <div className="text-center py-4">
                    <span className="text-3xl font-bold text-foreground">{event.price}</span>
                  </div>
                )}

                {/* Attendee Count */}
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Users className="w-5 h-5" />
                  <span>{event.attendee_count} attending</span>
                </div>

                {/* RSVP Button */}
                <RSVPButton eventId={event.id} className="w-full" />

                {/* Ticket Button */}
                {event.ticket_url && (
                  <Button variant="gradient" className="w-full" asChild>
                    <a href={event.ticket_url} target="_blank" rel="noopener noreferrer">
                      Get Tickets
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                )}

                {/* Virtual Link */}
                {event.is_virtual && event.virtual_link && (
                  <Button variant="outline" className="w-full" asChild>
                    <a href={event.virtual_link} target="_blank" rel="noopener noreferrer">
                      <Video className="w-4 h-4 mr-2" />
                      Join Virtual Event
                      <ExternalLink className="w-3 h-3 ml-2" />
                    </a>
                  </Button>
                )}

                {/* Share Button */}
                <Button variant="ghost" className="w-full">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Event
                </Button>
              </CardContent>
            </Card>

            {/* Organizer Card */}
            {event.organizer_name && (
              <Card className="bg-card/80 backdrop-blur border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Organized by</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium text-foreground mb-2">{event.organizer_name}</p>
                  {event.organizer_email && (
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <a href={`mailto:${event.organizer_email}`}>
                        <Mail className="w-4 h-4 mr-2" />
                        Contact Organizer
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Event Details */}
            <Card className="bg-card/80 backdrop-blur border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Timezone: {event.timezone}</span>
                </div>
                {event.end_date && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Ends: {formatDate(event.end_date)}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Bottom Spacing */}
      <div className="h-24" />
    </main>
  )
}
