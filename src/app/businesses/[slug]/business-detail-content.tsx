'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Globe,
  Star,
  CheckCircle,
  Edit,
  MessageSquare,
  ChevronRight,
  Sparkles,
  ImageIcon,
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
import { BusinessActions } from '@/components/businesses/business-actions'
import { BusinessCard } from '@/components/businesses/business-card'
import { Business, BusinessReview, BUSINESS_CATEGORIES } from '@/types/business'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

// Mock reviews - will be replaced with Supabase query
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

interface BusinessDetailContentProps {
  business: Business
  similarBusinesses: Business[]
}

export function BusinessDetailContent({ business, similarBusinesses }: BusinessDetailContentProps) {
  const [userRating, setUserRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const category = BUSINESS_CATEGORIES.find(c => c.value === business.category)
  const isPremium = business.subscription_tier === 'premium'

  // Log page view
  useEffect(() => {
    // TODO: Connect to analytics
    console.log('Business view logged:', business.id)
  }, [business.id])

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

      <main className="flex-1 bg-slate-50 dark:bg-background">
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

          {/* Featured Badge */}
          {isPremium && (
            <Badge className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
              <Sparkles className="w-3 h-3 mr-1" />
              Featured Business
            </Badge>
          )}

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
                    <div className="w-20 h-20 rounded-xl bg-white dark:bg-slate-800 shadow-lg flex items-center justify-center text-4xl border flex-shrink-0">
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
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">
                          {business.name}
                        </h1>
                        {business.is_verified && (
                          <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
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
                                  : 'text-slate-200 dark:text-slate-600'
                              )}
                            />
                          ))}
                          <span className="font-semibold text-slate-900 dark:text-slate-100 ml-1">
                            {business.rating}
                          </span>
                        </div>
                        <span className="text-slate-500 dark:text-slate-400">
                          ({business.review_count} reviews)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-center gap-2 mt-4 text-slate-600 dark:text-slate-400">
                    <MapPin className="w-4 h-4" />
                    <span>{business.address}, {business.city}, {business.state} {business.zip_code}</span>
                  </div>

                  {/* Actions - Mobile */}
                  <div className="mt-6 pt-6 border-t lg:hidden">
                    <BusinessActions business={business} variant="compact" />
                  </div>
                </CardContent>
              </Card>

              {/* Tabs */}
              <Tabs defaultValue="about" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="photos">Photos</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews ({business.review_count})</TabsTrigger>
                </TabsList>

                <TabsContent value="about">
                  <Card>
                    <CardHeader>
                      <CardTitle>About {business.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-600 dark:text-slate-400 whitespace-pre-line">
                        {business.description}
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="photos">
                  <Card>
                    <CardHeader>
                      <CardTitle>Photos</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {business.gallery_images && business.gallery_images.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {business.gallery_images.map((image, index) => (
                            <button
                              key={index}
                              onClick={() => setSelectedImage(image)}
                              className="aspect-video rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 hover:opacity-90 transition-opacity"
                            >
                              <img
                                src={image}
                                alt={`${business.name} photo ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <ImageIcon className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                          <p className="text-slate-500 dark:text-slate-400">No photos available yet</p>
                        </div>
                      )}
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
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
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
                                    : 'text-slate-200 dark:text-slate-600'
                                )}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Review Text */}
                      <div>
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
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
              {/* Actions Card - Desktop */}
              <Card className="hidden lg:block">
                <CardHeader>
                  <CardTitle className="text-lg">Get in Touch</CardTitle>
                </CardHeader>
                <CardContent>
                  <BusinessActions business={business} />
                </CardContent>
              </Card>

              {/* Contact Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-slate-900 dark:text-slate-100">{business.address}</p>
                      <p className="text-slate-600 dark:text-slate-400">
                        {business.city}, {business.state} {business.zip_code}
                      </p>
                    </div>
                  </div>

                  {business.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-slate-400" />
                      <a
                        href={`tel:${business.phone}`}
                        className="text-emerald-600 dark:text-emerald-400 hover:underline"
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
                        className="text-emerald-600 dark:text-emerald-400 hover:underline"
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
                        className="text-emerald-600 dark:text-emerald-400 hover:underline"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
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

              {/* Claim Business */}
              {!business.is_claimed && (
                <Card className="border-dashed">
                  <CardContent className="p-4 text-center">
                    <Edit className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                      Is this your business?
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/businesses/${business.slug}/claim`}>
                        Claim this listing
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Similar Businesses */}
          {similarBusinesses.length > 0 && (
            <div className="mt-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  Similar Businesses
                </h2>
                <Button variant="ghost" asChild>
                  <Link href={`/businesses?category=${business.category}`}>
                    View All
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {similarBusinesses.map((similarBusiness) => (
                  <BusinessCard key={similarBusiness.id} business={similarBusiness} showActions={false} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
