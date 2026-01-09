'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Calendar,
  MapPin,
  Clock,
  ArrowLeft,
  Video,
  Globe,
  DollarSign,
  Upload,
  CheckCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { EventCategory, eventCategoryLabels, eventCategoryIcons } from '@/types/events'

const categories: { value: EventCategory; label: string; icon: string }[] = [
  { value: 'community', label: 'Community', icon: '👥' },
  { value: 'cultural', label: 'Cultural', icon: '🎭' },
  { value: 'educational', label: 'Educational', icon: '📚' },
  { value: 'sports', label: 'Sports', icon: '⚽' },
  { value: 'religious', label: 'Religious', icon: '🙏' },
  { value: 'professional', label: 'Professional', icon: '💼' },
  { value: 'fundraiser', label: 'Fundraiser', icon: '💰' },
  { value: 'other', label: 'Other', icon: '📅' },
]

export default function SubmitEventPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isVirtual, setIsVirtual] = useState(false)
  const [isFree, setIsFree] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-card/80 backdrop-blur border-border/50 text-center">
          <CardContent className="pt-12 pb-8">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Event Submitted!</h2>
            <p className="text-muted-foreground mb-6">
              Thank you for submitting your event. Our team will review it and
              it will be published once approved.
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="outline" asChild>
                <Link href="/events">View Events</Link>
              </Button>
              <Button variant="gradient" onClick={() => setIsSubmitted(false)}>
                Submit Another
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-b from-indigo-900/50 via-background to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px]" />

        <div className="relative mx-auto max-w-3xl px-4">
          <Button variant="ghost" size="sm" asChild className="mb-6">
            <Link href="/events">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Events
            </Link>
          </Button>

          <Badge className="mb-4 bg-indigo-500/10 text-indigo-400">
            <Calendar className="w-3 h-3 mr-1" />
            Submit Event
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Share Your Event
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Submit your event to be featured on our community calendar.
            Events are reviewed before being published.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12">
        <div className="mx-auto max-w-3xl px-4">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info */}
            <Card className="bg-card/80 backdrop-blur border-border/50">
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
                <CardDescription>
                  Provide the basic information about your event.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Event Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter event title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your event..."
                    rows={5}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Category *</Label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <Badge
                        key={category.value}
                        variant={selectedCategory === category.value ? 'default' : 'outline'}
                        className="cursor-pointer px-3 py-2 transition-all hover:scale-105"
                        onClick={() => setSelectedCategory(category.value)}
                      >
                        <span className="mr-1">{category.icon}</span>
                        {category.label}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Event Image (Optional)</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Drag and drop an image, or click to browse
                    </p>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      className="hidden"
                    />
                    <Button variant="outline" size="sm" className="mt-4">
                      Choose File
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Date & Time */}
            <Card className="bg-card/80 backdrop-blur border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Date & Time
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start_date">Start Date *</Label>
                    <Input
                      id="start_date"
                      type="date"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="start_time">Start Time *</Label>
                    <Input
                      id="start_time"
                      type="time"
                      required
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="end_date">End Date (Optional)</Label>
                    <Input
                      id="end_date"
                      type="date"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end_time">End Time (Optional)</Label>
                    <Input
                      id="end_time"
                      type="time"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <select
                    id="timezone"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    defaultValue="America/New_York"
                  >
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/Denver">Mountain Time (MT)</option>
                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    <option value="Europe/London">London (GMT)</option>
                    <option value="Africa/Addis_Ababa">East Africa Time (EAT)</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card className="bg-card/80 backdrop-blur border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Video className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <Label>Virtual Event</Label>
                      <p className="text-sm text-muted-foreground">
                        This event will be held online
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={isVirtual}
                    onCheckedChange={setIsVirtual}
                  />
                </div>

                {isVirtual ? (
                  <div className="space-y-2">
                    <Label htmlFor="virtual_link">Meeting Link</Label>
                    <Input
                      id="virtual_link"
                      type="url"
                      placeholder="https://zoom.us/..."
                    />
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="location">Venue Name *</Label>
                      <Input
                        id="location"
                        placeholder="e.g., Community Center"
                        required={!isVirtual}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Street Address *</Label>
                      <Input
                        id="address"
                        placeholder="123 Main Street"
                        required={!isVirtual}
                      />
                    </div>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          placeholder="City"
                          required={!isVirtual}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          placeholder="State"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Country *</Label>
                        <Input
                          id="country"
                          placeholder="Country"
                          defaultValue="USA"
                          required={!isVirtual}
                        />
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card className="bg-card/80 backdrop-blur border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-primary" />
                  Pricing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Free Event</Label>
                    <p className="text-sm text-muted-foreground">
                      No admission fee required
                    </p>
                  </div>
                  <Switch
                    checked={isFree}
                    onCheckedChange={setIsFree}
                  />
                </div>

                {!isFree && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price</Label>
                      <Input
                        id="price"
                        placeholder="$25"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ticket_url">Ticket URL</Label>
                      <Input
                        id="ticket_url"
                        type="url"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Organizer Info */}
            <Card className="bg-card/80 backdrop-blur border-border/50">
              <CardHeader>
                <CardTitle>Organizer Information</CardTitle>
                <CardDescription>
                  Let attendees know who is organizing this event.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="organizer_name">Organizer Name *</Label>
                    <Input
                      id="organizer_name"
                      placeholder="Your name or organization"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="organizer_email">Contact Email *</Label>
                    <Input
                      id="organizer_email"
                      type="email"
                      placeholder="email@example.com"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex gap-4 justify-end">
              <Button variant="outline" type="button" asChild>
                <Link href="/events">Cancel</Link>
              </Button>
              <Button
                variant="gradient"
                type="submit"
                disabled={isSubmitting || !selectedCategory}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  'Submit Event'
                )}
              </Button>
            </div>
          </form>
        </div>
      </section>
    </main>
  )
}
