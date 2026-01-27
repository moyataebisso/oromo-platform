'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Save,
  Trash2,
  Eye,
  Ban,
  CheckCircle,
  XCircle,
  Star,
  Clock,
  BarChart3,
  MapPin,
  Phone,
  Globe,
  Mail,
  Calendar,
  Building2,
  Crown,
  Sparkles,
  TrendingUp,
  MousePointer,
  AlertTriangle,
  Heart,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import { BUSINESS_CATEGORIES } from '@/types/business'

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

// Mock data - will be replaced with Supabase query
const mockBusiness: BusinessDetail = {
  id: '1',
  name: 'Oromia Coffee House',
  slug: 'oromia-coffee-house',
  description: 'Authentic Ethiopian coffee experience with traditional brewing methods. We source our beans directly from Oromia region farmers.',
  category: 'Food & Dining',
  address: '1234 Main Street',
  city: 'Minneapolis',
  state: 'MN',
  zip_code: '55401',
  phone: '(612) 555-0123',
  email: 'info@oromiacoffee.com',
  website: 'https://oromiacoffee.com',
  latitude: 44.9778,
  longitude: -93.2650,
  logo_url: null,
  cover_image_url: null,
  hours: {
    monday: { open: '07:00', close: '20:00', closed: false },
    tuesday: { open: '07:00', close: '20:00', closed: false },
    wednesday: { open: '07:00', close: '20:00', closed: false },
    thursday: { open: '07:00', close: '20:00', closed: false },
    friday: { open: '07:00', close: '21:00', closed: false },
    saturday: { open: '08:00', close: '21:00', closed: false },
    sunday: { open: '08:00', close: '18:00', closed: false },
  },
  status: 'approved',
  subscription_tier: 'premium',
  is_featured: true,
  featured_until: '2026-03-01',
  show_on_homepage: true,
  show_in_footer: true,
  owner_id: 'user-123',
  owner_name: 'Abdi Bekele',
  owner_email: 'abdi@example.com',
  created_at: '2025-10-15T10:30:00Z',
  updated_at: '2025-12-20T14:45:00Z',
  views_count: 1247,
  clicks_count: 423,
  favorites_count: 89,
  rating: 4.8,
  review_count: 56,
}

const analyticsData = {
  daily: [
    { date: '2025-12-14', views: 45, clicks: 12 },
    { date: '2025-12-15', views: 52, clicks: 18 },
    { date: '2025-12-16', views: 38, clicks: 9 },
    { date: '2025-12-17', views: 61, clicks: 22 },
    { date: '2025-12-18', views: 73, clicks: 28 },
    { date: '2025-12-19', views: 55, clicks: 15 },
    { date: '2025-12-20', views: 48, clicks: 14 },
  ],
}

export default function AdminBusinessDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [business, setBusiness] = useState<BusinessDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [statusAction, setStatusAction] = useState<'approve' | 'reject' | 'suspend' | null>(null)
  const [statusReason, setStatusReason] = useState('')
  const [formData, setFormData] = useState<Partial<BusinessDetail>>({})

  useEffect(() => {
    // Simulate API call
    const fetchBusiness = async () => {
      await new Promise(resolve => setTimeout(resolve, 500))
      setBusiness(mockBusiness)
      setFormData(mockBusiness)
      setIsLoading(false)
    }
    fetchBusiness()
  }, [params.id])

  const handleInputChange = (field: keyof BusinessDetail, value: string | boolean | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setBusiness({ ...business!, ...formData } as BusinessDetail)
    toast.success('Business updated successfully')
    setIsSaving(false)
  }

  const handleStatusChange = async () => {
    if (!statusAction) return
    if ((statusAction === 'reject' || statusAction === 'suspend') && statusReason.trim().length < 10) {
      toast.error('Please provide a reason')
      return
    }

    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    const newStatus = statusAction === 'approve' ? 'approved' : statusAction === 'reject' ? 'rejected' : 'suspended'
    setBusiness({ ...business!, status: newStatus })
    setFormData(prev => ({ ...prev, status: newStatus }))

    toast.success(`Business ${statusAction === 'approve' ? 'approved' : statusAction === 'reject' ? 'rejected' : 'suspended'}`)
    setIsStatusDialogOpen(false)
    setStatusAction(null)
    setStatusReason('')
    setIsSaving(false)
  }

  const handleDelete = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    toast.success('Business deleted successfully')
    router.push('/admin/businesses')
  }

  const openStatusDialog = (action: 'approve' | 'reject' | 'suspend') => {
    setStatusAction(action)
    setIsStatusDialogOpen(true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-emerald-500/20 text-emerald-500">Approved</Badge>
      case 'pending':
        return <Badge className="bg-amber-500/20 text-amber-500">Pending</Badge>
      case 'rejected':
        return <Badge className="bg-red-500/20 text-red-500">Rejected</Badge>
      case 'suspended':
        return <Badge className="bg-gray-500/20 text-gray-500">Suspended</Badge>
      default:
        return null
    }
  }

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'premium':
        return <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white"><Crown className="w-3 h-3 mr-1" />Premium</Badge>
      case 'basic':
        return <Badge className="bg-blue-500/20 text-blue-500">Basic</Badge>
      default:
        return <Badge variant="outline">Free</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!business) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-semibold">Business not found</h2>
        <Button asChild className="mt-4">
          <Link href="/admin/businesses">Back to Businesses</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link
            href="/admin/businesses"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Businesses
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
              <Building2 className="w-7 h-7 text-emerald-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{business.name}</h1>
                {getStatusBadge(business.status)}
                {getTierBadge(business.subscription_tier)}
              </div>
              <p className="text-muted-foreground">{business.category}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/businesses/${business.slug}`} target="_blank">
              <Eye className="w-4 h-4 mr-2" />
              View Public
            </Link>
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">Views</span>
            </div>
            <p className="text-2xl font-bold">{business.views_count.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <MousePointer className="w-4 h-4" />
              <span className="text-sm">Clicks</span>
            </div>
            <p className="text-2xl font-bold">{business.clicks_count.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Star className="w-4 h-4" />
              <span className="text-sm">Rating</span>
            </div>
            <p className="text-2xl font-bold">{business.rating} <span className="text-sm font-normal text-muted-foreground">({business.review_count})</span></p>
          </CardContent>
        </Card>
        <Card className="bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Heart className="w-4 h-4" />
              <span className="text-sm">Favorites</span>
            </div>
            <p className="text-2xl font-bold">{business.favorites_count}</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">Listed</span>
            </div>
            <p className="text-lg font-semibold">{formatDate(business.created_at)}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="details" className="space-y-6">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="status">Status & Actions</TabsTrigger>
        </TabsList>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-6">
          <Card className="bg-card/50">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Edit the business listing details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Business Name</Label>
                  <Input
                    id="name"
                    value={formData.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleInputChange('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {BUSINESS_CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.icon} {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={formData.website || ''}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="https://"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50">
            <CardHeader>
              <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  value={formData.address || ''}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                />
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city || ''}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.state || ''}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zip_code">ZIP Code</Label>
                  <Input
                    id="zip_code"
                    value={formData.zip_code || ''}
                    onChange={(e) => handleInputChange('zip_code', e.target.value)}
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    value={formData.latitude || ''}
                    onChange={(e) => handleInputChange('latitude', parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    value={formData.longitude || ''}
                    onChange={(e) => handleInputChange('longitude', parseFloat(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50">
            <CardHeader>
              <CardTitle>Owner Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Owner Name</Label>
                  <p className="font-medium">{business.owner_name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Owner Email</Label>
                  <p className="font-medium">{business.owner_email}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Subscription Tab */}
        <TabsContent value="subscription" className="space-y-6">
          <Card className="bg-card/50">
            <CardHeader>
              <CardTitle>Subscription Plan</CardTitle>
              <CardDescription>Manage the business subscription tier and visibility</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Subscription Tier</Label>
                <Select
                  value={formData.subscription_tier}
                  onValueChange={(value) => handleInputChange('subscription_tier', value)}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Premium businesses get featured placement and enhanced visibility
                </p>
              </div>

              <div className="border-t pt-6 space-y-4">
                <h4 className="font-semibold">Featured Status</h4>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Featured Business</Label>
                    <p className="text-sm text-muted-foreground">Show featured badge and priority in search results</p>
                  </div>
                  <Switch
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => handleInputChange('is_featured', checked)}
                  />
                </div>

                {formData.is_featured && (
                  <div className="space-y-2">
                    <Label>Featured Until</Label>
                    <Input
                      type="date"
                      value={formData.featured_until?.split('T')[0] || ''}
                      onChange={(e) => handleInputChange('featured_until', e.target.value)}
                    />
                  </div>
                )}
              </div>

              <div className="border-t pt-6 space-y-4">
                <h4 className="font-semibold">Homepage & Footer Visibility</h4>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show on Homepage</Label>
                    <p className="text-sm text-muted-foreground">Display in the featured business gallery on homepage</p>
                  </div>
                  <Switch
                    checked={formData.show_on_homepage}
                    onCheckedChange={(checked) => handleInputChange('show_on_homepage', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show in Footer</Label>
                    <p className="text-sm text-muted-foreground">Display in the footer business banner across the site</p>
                  </div>
                  <Switch
                    checked={formData.show_in_footer}
                    onCheckedChange={(checked) => handleInputChange('show_in_footer', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <Card className="bg-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Performance Overview
              </CardTitle>
              <CardDescription>Last 7 days activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.daily.map((day) => (
                  <div key={day.date} className="flex items-center gap-4">
                    <span className="w-24 text-sm text-muted-foreground">
                      {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </span>
                    <div className="flex-1 flex items-center gap-2">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${(day.views / 100) * 100}%` }}
                        />
                      </div>
                      <span className="w-12 text-sm">{day.views} views</span>
                    </div>
                    <div className="flex-1 flex items-center gap-2">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${(day.clicks / 50) * 100}%` }}
                        />
                      </div>
                      <span className="w-12 text-sm">{day.clicks} clicks</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-card/50">
              <CardHeader>
                <CardTitle>Click-Through Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-emerald-500">
                  {((business.clicks_count / business.views_count) * 100).toFixed(1)}%
                </p>
                <p className="text-muted-foreground mt-1">
                  {business.clicks_count} clicks from {business.views_count} views
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50">
              <CardHeader>
                <CardTitle>Engagement Score</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-blue-500">
                  {Math.round((business.favorites_count + business.review_count) / business.views_count * 1000) / 10}%
                </p>
                <p className="text-muted-foreground mt-1">
                  Based on favorites and reviews
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Status & Actions Tab */}
        <TabsContent value="status" className="space-y-6">
          <Card className="bg-card/50">
            <CardHeader>
              <CardTitle>Current Status</CardTitle>
              <CardDescription>Manage the business listing status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-muted-foreground">Status:</span>
                {getStatusBadge(business.status)}
              </div>

              <div className="flex flex-wrap gap-2 pt-4 border-t">
                {business.status !== 'approved' && (
                  <Button
                    onClick={() => openStatusDialog('approve')}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                )}
                {business.status !== 'rejected' && business.status !== 'suspended' && (
                  <Button
                    variant="destructive"
                    onClick={() => openStatusDialog('reject')}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                )}
                {business.status === 'approved' && (
                  <Button
                    variant="outline"
                    onClick={() => openStatusDialog('suspend')}
                  >
                    <Ban className="w-4 h-4 mr-2" />
                    Suspend
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-red-500/20">
            <CardHeader>
              <CardTitle className="text-red-500 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Danger Zone
              </CardTitle>
              <CardDescription>Irreversible actions</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="destructive"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Business
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                This will permanently delete the business and all associated data.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Status Change Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {statusAction === 'approve' && 'Approve Business'}
              {statusAction === 'reject' && 'Reject Business'}
              {statusAction === 'suspend' && 'Suspend Business'}
            </DialogTitle>
            <DialogDescription>
              {statusAction === 'approve' && 'This will make the business visible to the public.'}
              {statusAction === 'reject' && 'Please provide a reason for rejection. This will be sent to the business owner.'}
              {statusAction === 'suspend' && 'Please provide a reason for suspension. This will be sent to the business owner.'}
            </DialogDescription>
          </DialogHeader>
          {(statusAction === 'reject' || statusAction === 'suspend') && (
            <div className="py-4">
              <Label htmlFor="reason">Reason</Label>
              <Textarea
                id="reason"
                value={statusReason}
                onChange={(e) => setStatusReason(e.target.value)}
                placeholder={`Please explain why this business is being ${statusAction === 'reject' ? 'rejected' : 'suspended'}...`}
                rows={4}
                className="mt-2"
              />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleStatusChange}
              disabled={isSaving}
              className={statusAction === 'approve' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
              variant={statusAction !== 'approve' ? 'destructive' : 'default'}
            >
              {isSaving ? 'Processing...' : `Confirm ${statusAction}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the business
              &quot;{business.name}&quot; and remove all associated data including reviews,
              analytics, and media.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              {isSaving ? 'Deleting...' : 'Delete Business'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
