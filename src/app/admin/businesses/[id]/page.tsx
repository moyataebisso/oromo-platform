'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Building2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface BusinessDetail {
  id: string
  name: string
  slug: string
  description: string
  category: string
  address: string
  city: string
  state: string
  zip_code: string
  phone: string
  email: string
  website: string | null
  latitude: number | null
  longitude: number | null
  logo_url: string | null
  cover_image_url: string | null
  hours: Record<string, { open: string; close: string; closed: boolean }>
  status: 'pending' | 'approved' | 'rejected' | 'suspended'
  subscription_tier: 'free' | 'basic' | 'premium'
  is_featured: boolean
  featured_until: string | null
  show_on_homepage: boolean
  show_in_footer: boolean
  owner_id: string
  owner_name: string
  owner_email: string
  created_at: string
  updated_at: string
  views_count: number
  clicks_count: number
  favorites_count: number
  rating: number
  review_count: number
}

export default function AdminBusinessDetailPage() {
  const params = useParams()
  const [business] = useState<BusinessDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // TODO: Replace with real Supabase query to fetch business by params.id
    const fetchBusiness = async () => {
      setIsLoading(false)
    }
    fetchBusiness()
  }, [params.id])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!business) {
    return (
      <div className="space-y-6">
        <Link
          href="/admin/businesses"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Businesses
        </Link>

        <Card className="bg-card/50">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Building2 className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Business not found</h2>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              The business you are looking for does not exist or has not been loaded yet.
              Connect a data source to display business details here.
            </p>
            <Button asChild>
              <Link href="/admin/businesses">Back to Businesses</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}
