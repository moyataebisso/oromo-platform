import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { BusinessDetailContent } from './business-detail-content'

// Mock business data - will be replaced with Supabase query
const mockBusinesses = [
  {
    id: '1',
    name: 'Oromia Restaurant',
    slug: 'oromia-restaurant',
    description: 'Authentic Oromo cuisine featuring traditional dishes like kitfo, tibs, and injera. Family-owned since 2010. We pride ourselves on using fresh, locally-sourced ingredients and traditional cooking methods passed down through generations. Our warm atmosphere and friendly staff make every visit feel like coming home. Whether you\'re new to Ethiopian cuisine or a longtime fan, our menu offers something for everyone.',
    category: 'restaurant' as const,
    address: '1234 Lake Street',
    city: 'Minneapolis',
    state: 'MN',
    zip_code: '55407',
    latitude: 44.9478,
    longitude: -93.2638,
    phone: '(612) 555-0123',
    email: 'info@oromiarestaurant.com',
    website: 'https://oromiarestaurant.com',
    facebook: 'https://facebook.com/oromiarestaurant',
    instagram: 'https://instagram.com/oromiarestaurant',
    twitter: null,
    tiktok: null,
    logo_url: null,
    cover_image_url: null,
    gallery_images: null,
    hours: {
      monday: { open: '11:00', close: '22:00' },
      tuesday: { open: '11:00', close: '22:00' },
      wednesday: { open: '11:00', close: '22:00' },
      thursday: { open: '11:00', close: '22:00' },
      friday: { open: '11:00', close: '23:00' },
      saturday: { open: '10:00', close: '23:00' },
      sunday: { open: '10:00', close: '21:00' },
    },
    rating: 4.8,
    review_count: 127,
    is_verified: true,
    is_claimed: true,
    is_featured: true,
    show_on_homepage: true,
    subscription_tier: 'premium' as const,
    owner_id: '1',
    status: 'approved' as const,
    view_count: 1542,
    click_count: 234,
    created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Buna Coffee House',
    slug: 'buna-coffee-house',
    description: 'Traditional Ethiopian coffee ceremony and pastries. The perfect spot for authentic buna experience.',
    category: 'restaurant' as const,
    address: '5678 Central Ave',
    city: 'Minneapolis',
    state: 'MN',
    zip_code: '55418',
    latitude: 44.9823,
    longitude: -93.2471,
    phone: '(612) 555-0456',
    email: 'hello@bunacoffee.com',
    website: null,
    facebook: null,
    instagram: 'https://instagram.com/bunacoffee',
    twitter: null,
    tiktok: null,
    logo_url: null,
    cover_image_url: null,
    gallery_images: null,
    hours: {
      monday: { open: '07:00', close: '20:00' },
      tuesday: { open: '07:00', close: '20:00' },
      wednesday: { open: '07:00', close: '20:00' },
      thursday: { open: '07:00', close: '20:00' },
      friday: { open: '07:00', close: '21:00' },
      saturday: { open: '08:00', close: '21:00' },
      sunday: { open: '08:00', close: '18:00' },
    },
    rating: 4.6,
    review_count: 89,
    is_verified: true,
    is_claimed: true,
    is_featured: false,
    subscription_tier: 'basic' as const,
    owner_id: '2',
    status: 'approved' as const,
    view_count: 856,
    click_count: 123,
    created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
]

async function getBusiness(slug: string) {
  // TODO: Replace with Supabase query
  const business = mockBusinesses.find(b => b.slug === slug)
  return business || null
}

async function getSimilarBusinesses(categoryId: string, currentId: string) {
  // TODO: Replace with Supabase query
  return mockBusinesses.filter(b => b.category === categoryId && b.id !== currentId).slice(0, 4)
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const business = await getBusiness(slug)

  if (!business) {
    return {
      title: 'Business Not Found | Odda Academy',
    }
  }

  return {
    title: `${business.name} | Oromo Business Directory`,
    description: business.description || `${business.name} - ${business.city}, ${business.state}`,
    openGraph: {
      title: `${business.name} | Oromo Business Directory`,
      description: business.description || `${business.name} - ${business.city}, ${business.state}`,
      type: 'website',
      images: business.cover_image_url ? [business.cover_image_url] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${business.name} | Oromo Business Directory`,
      description: business.description || `${business.name} - ${business.city}, ${business.state}`,
    },
  }
}

export default async function BusinessDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const business = await getBusiness(slug)

  if (!business) {
    notFound()
  }

  const similarBusinesses = await getSimilarBusinesses(business.category, business.id)

  return <BusinessDetailContent business={business} similarBusinesses={similarBusinesses} />
}
