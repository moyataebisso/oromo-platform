'use client'

import { useState } from 'react'
import { Phone, Navigation, Share2, Heart, Flag, Globe, Facebook, Instagram, Twitter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Business } from '@/types/business'
import { cn } from '@/lib/utils'

interface BusinessActionsProps {
  business: Business
  className?: string
  variant?: 'full' | 'compact'
}

export const BusinessActions = ({ business, className, variant = 'full' }: BusinessActionsProps) => {
  const [isFavorite, setIsFavorite] = useState(false)
  const [reportOpen, setReportOpen] = useState(false)
  const [reportReason, setReportReason] = useState('')

  const handleCall = () => {
    if (business.phone) {
      // Log analytics event
      window.location.href = `tel:${business.phone}`
    }
  }

  const handleDirections = () => {
    const address = encodeURIComponent(
      `${business.address}, ${business.city}, ${business.state} ${business.zip_code || ''}`
    )
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${address}`, '_blank')
  }

  const handleWebsite = () => {
    if (business.website) {
      window.open(business.website, '_blank')
    }
  }

  const handleShare = async () => {
    const shareData = {
      title: business.name,
      text: `Check out ${business.name} on Odda Academy Business Directory`,
      url: window.location.href,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
        toast.success('Shared successfully!')
      } catch {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  const handleFavorite = () => {
    setIsFavorite(!isFavorite)
    toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites')
  }

  const handleReport = () => {
    if (reportReason.trim().length < 10) {
      toast.error('Please provide more details')
      return
    }
    // TODO: Send report to backend
    toast.success('Report submitted', {
      description: 'Thank you for helping us maintain quality listings.',
    })
    setReportOpen(false)
    setReportReason('')
  }

  if (variant === 'compact') {
    return (
      <div className={cn('flex flex-wrap gap-2', className)}>
        {business.phone && (
          <Button size="sm" onClick={handleCall}>
            <Phone className="w-4 h-4 mr-2" />
            Call
          </Button>
        )}
        <Button size="sm" variant="outline" onClick={handleDirections}>
          <Navigation className="w-4 h-4 mr-2" />
          Directions
        </Button>
        {business.website && (
          <Button size="sm" variant="outline" onClick={handleWebsite}>
            <Globe className="w-4 h-4 mr-2" />
            Website
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Primary Actions */}
      <div className="grid grid-cols-2 gap-3">
        {business.phone && (
          <Button onClick={handleCall} className="w-full">
            <Phone className="w-4 h-4 mr-2" />
            Call Now
          </Button>
        )}
        <Button variant="outline" onClick={handleDirections} className="w-full">
          <Navigation className="w-4 h-4 mr-2" />
          Get Directions
        </Button>
      </div>

      {/* Website Button */}
      {business.website && (
        <Button variant="outline" onClick={handleWebsite} className="w-full">
          <Globe className="w-4 h-4 mr-2" />
          Visit Website
        </Button>
      )}

      {/* Social Media Links */}
      {(business.facebook || business.instagram || business.twitter) && (
        <div className="flex justify-center gap-3 pt-2">
          {business.facebook && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.open(business.facebook!, '_blank')}
            >
              <Facebook className="w-5 h-5" />
            </Button>
          )}
          {business.instagram && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.open(business.instagram!, '_blank')}
            >
              <Instagram className="w-5 h-5" />
            </Button>
          )}
          {business.twitter && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.open(business.twitter!, '_blank')}
            >
              <Twitter className="w-5 h-5" />
            </Button>
          )}
        </div>
      )}

      {/* Secondary Actions */}
      <div className="flex justify-center gap-2 pt-2 border-t">
        <Button variant="ghost" size="sm" onClick={handleShare}>
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleFavorite}
          className={cn(isFavorite && 'text-red-500')}
        >
          <Heart className={cn('w-4 h-4 mr-2', isFavorite && 'fill-current')} />
          {isFavorite ? 'Saved' : 'Save'}
        </Button>
        <Dialog open={reportOpen} onOpenChange={setReportOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm">
              <Flag className="w-4 h-4 mr-2" />
              Report
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Report an Issue</DialogTitle>
              <DialogDescription>
                Let us know if there&apos;s something wrong with this listing.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label htmlFor="report-reason">What&apos;s the issue?</Label>
                <Textarea
                  id="report-reason"
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  placeholder="Please describe the problem..."
                  rows={4}
                  className="mt-2"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setReportOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleReport}>
                  Submit Report
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
