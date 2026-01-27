'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  CheckCircle,
  XCircle,
  Eye,
  MapPin,
  Phone,
  Globe,
  Clock,
  ChevronRight,
  AlertCircle,
  Building2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'

interface PendingBusiness {
  id: string
  name: string
  description: string
  category: string
  city: string
  state: string
  address: string
  phone: string
  email: string
  website: string | null
  submitted_by: string
  submitted_at: string
}

const mockPendingBusinesses: PendingBusiness[] = [
  {
    id: '1',
    name: 'Oromo Tech Solutions',
    description: 'IT consulting and software development for small businesses and startups. Specializing in web development, mobile apps, and cloud solutions.',
    category: 'Technology',
    city: 'Seattle',
    state: 'WA',
    address: '1234 Tech Way',
    phone: '(206) 555-0789',
    email: 'hello@oromotech.com',
    website: 'https://oromotech.com',
    submitted_by: 'Abdii Tolesa',
    submitted_at: '2025-12-20T10:30:00Z',
  },
  {
    id: '2',
    name: 'Finfinnee Fitness',
    description: 'Community gym with personal training services. Offering group classes, weightlifting, cardio, and specialized African dance fitness sessions.',
    category: 'Health & Wellness',
    city: 'Minneapolis',
    state: 'MN',
    address: '5678 Wellness Blvd',
    phone: '(612) 555-0456',
    email: 'info@finfinneefitness.com',
    website: null,
    submitted_by: 'Biiftu Gamada',
    submitted_at: '2025-12-19T14:15:00Z',
  },
  {
    id: '3',
    name: 'Harar Imports',
    description: 'Specialty importers of Ethiopian and East African goods. Coffee, textiles, spices, and artisanal crafts direct from Oromia.',
    category: 'Retail',
    city: 'Washington',
    state: 'DC',
    address: '9012 Import Ave',
    phone: '(202) 555-0123',
    email: 'orders@hararimports.com',
    website: 'https://hararimports.com',
    submitted_by: 'Gemechu Bekele',
    submitted_at: '2025-12-18T09:45:00Z',
  },
]

export default function AdminPendingBusinessesPage() {
  const [businesses, setBusinesses] = useState<PendingBusiness[]>(mockPendingBusinesses)
  const [selectedBusiness, setSelectedBusiness] = useState<PendingBusiness | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleApprove = async (business: PendingBusiness) => {
    setIsProcessing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    setBusinesses(businesses.filter(b => b.id !== business.id))
    toast.success(`${business.name} has been approved`, {
      description: 'The business owner will be notified.',
    })
    setIsProcessing(false)
    setIsPreviewOpen(false)
  }

  const handleReject = async () => {
    if (!selectedBusiness) return
    if (rejectReason.trim().length < 10) {
      toast.error('Please provide a reason for rejection')
      return
    }

    setIsProcessing(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    setBusinesses(businesses.filter(b => b.id !== selectedBusiness.id))
    toast.success(`${selectedBusiness.name} has been rejected`, {
      description: 'The business owner will be notified with the reason.',
    })
    setIsProcessing(false)
    setIsRejectDialogOpen(false)
    setRejectReason('')
    setSelectedBusiness(null)
  }

  const openPreview = (business: PendingBusiness) => {
    setSelectedBusiness(business)
    setIsPreviewOpen(true)
  }

  const openRejectDialog = (business: PendingBusiness) => {
    setSelectedBusiness(business)
    setIsRejectDialogOpen(true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Link href="/admin/businesses" className="hover:text-foreground">
              Businesses
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span>Pending Queue</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Pending Submissions</h1>
          <p className="text-muted-foreground">Review and approve new business listings</p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          <Clock className="w-4 h-4 mr-2" />
          {businesses.length} pending
        </Badge>
      </div>

      {businesses.length === 0 ? (
        <Card className="bg-card/50 border-border/50">
          <CardContent className="py-16 text-center">
            <CheckCircle className="w-16 h-16 mx-auto text-emerald-500 mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">All caught up!</h3>
            <p className="text-muted-foreground">No pending business submissions to review.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {businesses.map((business) => (
            <Card key={business.id} className="bg-card/50 border-border/50">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  {/* Business Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-7 h-7 text-emerald-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-foreground">{business.name}</h3>
                        <Badge variant="secondary" className="mt-1">{business.category}</Badge>
                        <p className="mt-2 text-muted-foreground line-clamp-2">{business.description}</p>
                      </div>
                    </div>

                    <div className="mt-4 grid sm:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        {business.address}, {business.city}, {business.state}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        {business.phone}
                      </div>
                      {business.website && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Globe className="w-4 h-4" />
                          <a href={business.website} target="_blank" rel="noopener noreferrer" className="hover:text-foreground truncate">
                            {business.website}
                          </a>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        Submitted {formatDate(business.submitted_at)}
                      </div>
                    </div>

                    <p className="mt-3 text-sm text-muted-foreground">
                      Submitted by: <span className="text-foreground">{business.submitted_by}</span>
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex lg:flex-col gap-2 lg:w-36">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 lg:w-full"
                      onClick={() => openPreview(business)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 lg:w-full bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => handleApprove(business)}
                      disabled={isProcessing}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="flex-1 lg:w-full"
                      onClick={() => openRejectDialog(business)}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Business Preview</DialogTitle>
            <DialogDescription>
              Review the submission before approving
            </DialogDescription>
          </DialogHeader>
          {selectedBusiness && (
            <div className="space-y-4 py-4">
              <div>
                <Label className="text-muted-foreground">Business Name</Label>
                <p className="text-lg font-semibold">{selectedBusiness.name}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Category</Label>
                <p>{selectedBusiness.category}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Description</Label>
                <p className="text-muted-foreground">{selectedBusiness.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Location</Label>
                  <p>{selectedBusiness.address}</p>
                  <p>{selectedBusiness.city}, {selectedBusiness.state}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Contact</Label>
                  <p>{selectedBusiness.phone}</p>
                  <p>{selectedBusiness.email}</p>
                </div>
              </div>
              {selectedBusiness.website && (
                <div>
                  <Label className="text-muted-foreground">Website</Label>
                  <a href={selectedBusiness.website} target="_blank" rel="noopener noreferrer" className="text-emerald-500 hover:underline">
                    {selectedBusiness.website}
                  </a>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
              Close
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setIsPreviewOpen(false)
                if (selectedBusiness) openRejectDialog(selectedBusiness)
              }}
            >
              <XCircle className="w-4 h-4 mr-2" />
              Reject
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={() => selectedBusiness && handleApprove(selectedBusiness)}
              disabled={isProcessing}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              {isProcessing ? 'Approving...' : 'Approve'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-500">
              <AlertCircle className="w-5 h-5" />
              Reject Business
            </DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting &quot;{selectedBusiness?.name}&quot;. This will be sent to the business owner.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="reject-reason">Rejection Reason</Label>
            <Textarea
              id="reject-reason"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Please explain why this submission is being rejected..."
              rows={4}
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={isProcessing || rejectReason.trim().length < 10}
            >
              {isProcessing ? 'Rejecting...' : 'Reject Submission'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
