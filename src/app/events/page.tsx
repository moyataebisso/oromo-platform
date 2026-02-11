import { Metadata } from 'next'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EventFilters } from '@/components/events/event-filters'
import { Event } from '@/types/events'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export const metadata: Metadata = {
  title: 'Community Events | Odda Academy',
  description: 'Discover and connect with the Oromo community through events worldwide.',
}

// Sample events data - replace with Supabase query
const sampleEvents: Event[] = [
  {
    id: '1',
    title: 'Oromo Cultural Festival 2026',
    description: 'Join us for a celebration of Oromo culture featuring traditional music, dance, food, and art. This annual festival brings together thousands of community members from across the region.',
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
    image_url: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800',
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
    description: 'Learn the basics of Afaan Oromoo in this interactive workshop. Perfect for beginners and those looking to reconnect with their heritage language.',
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
  {
    id: '3',
    title: 'Oromo Youth Sports Tournament',
    description: 'Annual soccer and basketball tournament for Oromo youth ages 12-18. Teams from across the country compete for the championship.',
    location: 'Minneapolis Sports Complex',
    address: '1234 Stadium Way',
    city: 'Minneapolis',
    state: 'MN',
    country: 'USA',
    is_virtual: false,
    virtual_link: null,
    start_date: '2026-02-08T09:00:00Z',
    end_date: '2026-02-09T18:00:00Z',
    timezone: 'America/Chicago',
    organizer_name: 'Oromo Youth Sports Association',
    organizer_email: 'sports@oromoyouth.org',
    organizer_id: null,
    category: 'sports',
    image_url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
    ticket_url: null,
    is_free: true,
    price: null,
    is_approved: true,
    is_featured: false,
    attendee_count: 89,
    created_at: '2025-12-10T00:00:00Z',
    updated_at: '2025-12-10T00:00:00Z',
  },
  {
    id: '4',
    title: 'Oromo Business Networking Event',
    description: 'Connect with Oromo entrepreneurs, professionals, and investors. Build relationships, share opportunities, and grow your business network.',
    location: 'Marriott Downtown',
    address: '500 Convention Way',
    city: 'Atlanta',
    state: 'GA',
    country: 'USA',
    is_virtual: false,
    virtual_link: null,
    start_date: '2026-01-25T17:30:00Z',
    end_date: '2026-01-25T21:00:00Z',
    timezone: 'America/New_York',
    organizer_name: 'Oromo Business Network',
    organizer_email: 'contact@oromobusiness.com',
    organizer_id: null,
    category: 'professional',
    image_url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800',
    ticket_url: 'https://example.com/business-tickets',
    is_free: false,
    price: '$45',
    is_approved: true,
    is_featured: true,
    attendee_count: 156,
    created_at: '2025-12-05T00:00:00Z',
    updated_at: '2025-12-05T00:00:00Z',
  },
  {
    id: '5',
    title: 'Community Prayer & Celebration',
    description: 'Monthly community gathering for prayer, fellowship, and celebration. All are welcome to join us for this meaningful time together.',
    location: 'Oromo Community Center',
    address: '789 Unity Street',
    city: 'Columbus',
    state: 'OH',
    country: 'USA',
    is_virtual: false,
    virtual_link: null,
    start_date: '2026-01-12T14:00:00Z',
    end_date: '2026-01-12T17:00:00Z',
    timezone: 'America/New_York',
    organizer_name: 'Oromo Faith Community',
    organizer_email: 'faith@oromocenter.org',
    organizer_id: null,
    category: 'religious',
    image_url: null,
    ticket_url: null,
    is_free: true,
    price: null,
    is_approved: true,
    is_featured: false,
    attendee_count: 67,
    created_at: '2025-12-08T00:00:00Z',
    updated_at: '2025-12-08T00:00:00Z',
  },
  {
    id: '6',
    title: 'Oromo Heritage Fundraising Gala',
    description: 'An elegant evening to raise funds for Oromo heritage preservation projects. Enjoy dinner, entertainment, and silent auction.',
    location: 'Grand Hyatt',
    address: '1000 H Street NW',
    city: 'Washington',
    state: 'DC',
    country: 'USA',
    is_virtual: false,
    virtual_link: null,
    start_date: '2026-04-05T18:00:00Z',
    end_date: '2026-04-05T23:00:00Z',
    timezone: 'America/New_York',
    organizer_name: 'Oromo Heritage Foundation',
    organizer_email: 'gala@oromoheritage.org',
    organizer_id: null,
    category: 'fundraiser',
    image_url: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800',
    ticket_url: 'https://example.com/gala-tickets',
    is_free: false,
    price: '$150',
    is_approved: true,
    is_featured: false,
    attendee_count: 234,
    created_at: '2025-12-12T00:00:00Z',
    updated_at: '2025-12-12T00:00:00Z',
  },
  {
    id: '7',
    title: 'Oromo Community Town Hall',
    description: 'Monthly community meeting to discuss important issues, share updates, and plan upcoming initiatives. Your voice matters!',
    location: 'Virtual Event',
    address: null,
    city: null,
    state: null,
    country: 'Global',
    is_virtual: true,
    virtual_link: 'https://zoom.us/townhall',
    start_date: '2026-01-18T19:00:00Z',
    end_date: '2026-01-18T21:00:00Z',
    timezone: 'America/New_York',
    organizer_name: 'Oromo Community Council',
    organizer_email: 'council@oromocommunity.org',
    organizer_id: null,
    category: 'community',
    image_url: null,
    ticket_url: null,
    is_free: true,
    price: null,
    is_approved: true,
    is_featured: false,
    attendee_count: 189,
    created_at: '2025-12-14T00:00:00Z',
    updated_at: '2025-12-14T00:00:00Z',
  },
  {
    id: '8',
    title: 'Traditional Coffee Ceremony Workshop',
    description: 'Learn the art of traditional Oromo coffee ceremony. Includes history, techniques, and hands-on practice. Coffee supplies provided.',
    location: 'Oromo Cultural Center',
    address: '456 Heritage Lane',
    city: 'Seattle',
    state: 'WA',
    country: 'USA',
    is_virtual: false,
    virtual_link: null,
    start_date: '2026-02-22T14:00:00Z',
    end_date: '2026-02-22T17:00:00Z',
    timezone: 'America/Los_Angeles',
    organizer_name: 'Oromo Cultural Association',
    organizer_email: 'culture@oromoseattle.org',
    organizer_id: null,
    category: 'cultural',
    image_url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800',
    ticket_url: null,
    is_free: false,
    price: '$20',
    is_approved: true,
    is_featured: false,
    attendee_count: 32,
    created_at: '2025-12-16T00:00:00Z',
    updated_at: '2025-12-16T00:00:00Z',
  },
]

export default function EventsPage() {
  // In production, fetch events from Supabase
  const events = sampleEvents

  return (
    <>
      <Header />

      <main className="min-h-screen bg-background">
        {/* Submit Event CTA */}
        <div className="fixed bottom-6 right-6 z-50">
          <Button variant="gradient" size="lg" asChild className="shadow-xl">
            <Link href="/events/submit">
              <Plus className="w-5 h-5 mr-2" />
              Submit Event
            </Link>
          </Button>
        </div>

        <EventFilters events={events} />

        {/* Submit Event Section */}
        <section className="py-16 bg-gradient-to-b from-background to-indigo-900/20">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Have an Event to Share?
            </h2>
            <p className="text-muted-foreground mb-8">
              Help grow our community by submitting your event. Whether it's a local gathering
              or a global virtual meetup, we want to help you spread the word.
            </p>
            <Button variant="gradient" size="lg" asChild>
              <Link href="/events/submit">
                <Plus className="w-5 h-5 mr-2" />
                Submit Your Event
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
