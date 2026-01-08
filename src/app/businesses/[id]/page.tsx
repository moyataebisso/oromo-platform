'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Globe,
  Star,
  Share2,
  CheckCircle,
  Flag,
  Edit,
  MessageSquare,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { HoursDisplay } from '@/components/businesses/hours-display'
import { ReviewCard } from '@/components/businesses/review-card'
import { SocialShare } from '@/components/shared/social-share'
import { Business, BusinessReview, BUSINESS_CATEGORIES } from '@/types/business'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

// Mock business data
const mockBusiness: Business = {
  id: '1',
  name: 'Oromia Restaurant',
  slug: 'oromia-restaurant',
  description: 'Authentic Oromo cuisine featuring traditional dishes like kitfo, tibs, and injera. Family-owned since 2010. We pride ourselves on using fresh, locally-sourced ingredients and traditional cooking methods passed down through generations. Our warm atmosphere and friendly staff make every visit feel like coming home. Whether you\'re new to Ethiopian cuisine or a longtime fan, our menu offers something for everyone.',
  category: 'restaurant',
  address: '1234 Lake Street',
  city: 'Minneapolis',
  state: 'MN',
  zip_code: '55407',
  phone: '(612) 555-0123',
  email: 'info@oromiarestaurant.com',
  website: 'https://oromiarestaurant.com',
  logo_url: null,
  cover_image_url: null,
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
  owner_id: '1',
  status: 'approved',
  created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
  updated_at: new Date().toISOString(),
}

const mockReviews: BusinessReview[] = [
  {
    id: '1',
    business_id: '1',
    user_id: '1',
    rating: 5,
    title: 'Best Ethiopian food in Minneapolis!',
    content: 'The injera is perfectly spongy, and the doro wat is authentic and flavorful. The service is always friendly and they make you feel like family. Highly recommend for anyone looking for genuine Oromo cuisine.',
    is_verified: true,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    user: { display_name: 'Chaltu B.', avatar_url: null },
  },
  {
    id: '2',
    business_id: '1',
    user_id: '2',
    rating: 5,
    title: 'A taste of home',
    content: 'As someone who grew up eating traditional Oromo food, this restaurant brings back so many memories. The kitfo is prepared exactly how my grandmother used to make it. The coffee ceremony is also a must-try!',
    is_verified: true,
    created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    user: { display_name: 'Abdii T.', avatar_url: null },
  },
  {
    id: '3',
    business_id: '1',
    user_id: '3',
    rating: 4,
    title: 'Great food, can get busy',
    content: 'The food is excellent and authentic. Only reason for 4 stars is that it can get very crowded on weekends. I recommend making a reservation if you\'re coming for dinner on Friday or Saturday.',
    is_verified: false,
    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    user: { display_name: 'Sarah M.', avatar_url: null },
  },
]

export default function BusinessDetailPage() {
  const [userRating, setUserRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [reviewText, setReviewText] = useState('')

  const business = mockBusiness
  const category = BUSINESS_CATEGORIES.find(c => c.value === business.category)

  const handleSubmitReview = () => {
    if (userRating === 0) {
      toast.error('Please select a rating')
      return
    }
    if (reviewText.trim().length < 10) {
      toast.error('Please write at least 10 characters')
      return
    }
    toast.success('Review submitted!', {
      description: 'Your review will be visible after moderation.',
    })
    setUserRating(0)
    setReviewText('')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-slate-50">
        {/* Cover Image */}
        <div className="relative h-64 md:h-80 bg-gradient-to-br from-emerald-400 to-teal-500">
          {business.cover_image_url ? (
            <img
              src={business.cover_image_url}
              alt={business.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-9xl opacity-50">{category?.icon || '🏪'}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

          {/* Back Button */}
          <Button
            variant="secondary"
            size="sm"
            className="absolute top-4 left-4"
            asChild
          >
            <Link href="/businesses">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Link>
          </Button>
        </div>

        <div className="mx-auto max-w-7xl px-4 -mt-16 relative z-10 pb-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Business Header Card */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Logo */}
                    <div className="w-20 h-20 rounded-xl bg-white shadow-lg flex items-center justify-center text-4xl border flex-shrink-0">
                      {business.logo_url ? (
                        <img
                          src={business.logo_url}
                          alt={business.name}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        category?.icon || '🏪'
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                          {business.name}
                        </h1>
                        {business.is_verified && (
                          <Badge className="bg-emerald-100 text-emerald-700">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary">
                          {category?.icon} {category?.label}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={cn(
                                'w-5 h-5',
                                star <= Math.round(business.rating)
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-slate-200'
                              )}
                            />
                          ))}
                          <span className="font-semibold text-slate-900 ml-1">
                            {business.rating}
                          </span>
                        </div>
                        <span className="text-slate-500">
                          ({business.review_count} reviews)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t">
                    <SocialShare title={business.name} />
                    <Button variant="outline" size="sm">
                      <Flag className="w-4 h-4 mr-2" />
                      Report
                    </Button>
                    {business.is_claimed && (
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-2" />
                        Suggest Edit
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Tabs */}
              <Tabs defaultValue="about" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews ({business.review_count})</TabsTrigger>
                </TabsList>

                <TabsContent value="about">
                  <Card>
                    <CardHeader>
                      <CardTitle>About {business.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-600 whitespace-pre-line">
                        {business.description}
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="reviews" className="space-y-4">
                  {/* Write Review Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Write a Review</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Star Rating */}
                      <div>
                        <label className="text-sm font-medium text-slate-700 mb-2 block">
                          Your Rating
                        </label>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => setUserRating(star)}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(0)}
                              className="p-1"
                            >
                              <Star
                                className={cn(
                                  'w-8 h-8 transition-colors',
                                  star <= (hoverRating || userRating)
                                    ? 'text-amber-400 fill-amber-400'
                                    : 'text-slate-200'
                                )}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Review Text */}
                      <div>
                        <label className="text-sm font-medium text-slate-700 mb-2 block">
                          Your Review
                        </label>
                        <Textarea
                          placeholder="Share your experience..."
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          rows={4}
                        />
                      </div>

                      <Button onClick={handleSubmitReview}>
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Submit Review
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Reviews List */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Customer Reviews</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {mockReviews.map((review) => (
                        <ReviewCard key={review.id} review={review} />
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-slate-900">{business.address}</p>
                      <p className="text-slate-600">
                        {business.city}, {business.state} {business.zip_code}
                      </p>
                    </div>
                  </div>

                  {business.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-slate-400" />
                      <a
                        href={`tel:${business.phone}`}
                        className="text-blue-600 hover:underline"
                      >
                        {business.phone}
                      </a>
                    </div>
                  )}

                  {business.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-slate-400" />
                      <a
                        href={`mailto:${business.email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {business.email}
                      </a>
                    </div>
                  )}

                  {business.website && (
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-slate-400" />
                      <a
                        href={business.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}

                  <Button className="w-full mt-4" asChild>
                    <a href={`tel:${business.phone}`}>
                      <Phone className="w-4 h-4 mr-2" />
                      Call Now
                    </a>
                  </Button>
                </CardContent>
              </Card>

              {/* Hours */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Business Hours</CardTitle>
                </CardHeader>
                <CardContent>
                  <HoursDisplay hours={business.hours} />
                </CardContent>
              </Card>

              {/* Map Placeholder */}
              <Card>
                <CardContent className="p-0">
                  <div className="h-48 bg-slate-200 flex items-center justify-center rounded-lg">
                    <div className="text-center text-slate-500">
                      <MapPin className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm">Map View</p>
                      <p className="text-xs">(Coming soon)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
