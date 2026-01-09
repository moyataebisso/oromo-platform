'use client'

import { useState } from 'react'
import { Check, Calendar, Heart, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

type RSVPStatus = 'going' | 'interested' | 'not_going' | null

interface RSVPButtonProps {
  eventId: string
  initialStatus?: RSVPStatus
  onStatusChange?: (status: RSVPStatus) => void
  className?: string
}

export const RSVPButton = ({
  eventId,
  initialStatus = null,
  onStatusChange,
  className
}: RSVPButtonProps) => {
  const [status, setStatus] = useState<RSVPStatus>(initialStatus)
  const [isLoading, setIsLoading] = useState(false)

  const handleStatusChange = async (newStatus: RSVPStatus) => {
    setIsLoading(true)

    // Simulate API call - in production, this would call your Supabase function
    await new Promise(resolve => setTimeout(resolve, 300))

    // Toggle off if clicking the same status
    const finalStatus = status === newStatus ? null : newStatus
    setStatus(finalStatus)
    onStatusChange?.(finalStatus)
    setIsLoading(false)
  }

  const getButtonContent = () => {
    switch (status) {
      case 'going':
        return (
          <>
            <Check className="w-4 h-4 mr-2" />
            Going
          </>
        )
      case 'interested':
        return (
          <>
            <Heart className="w-4 h-4 mr-2" />
            Interested
          </>
        )
      case 'not_going':
        return (
          <>
            <X className="w-4 h-4 mr-2" />
            Not Going
          </>
        )
      default:
        return (
          <>
            <Calendar className="w-4 h-4 mr-2" />
            RSVP
          </>
        )
    }
  }

  const getButtonVariant = () => {
    switch (status) {
      case 'going':
        return 'gradient'
      case 'interested':
        return 'outline'
      case 'not_going':
        return 'ghost'
      default:
        return 'outline'
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={getButtonVariant() as any}
          className={cn(
            'transition-all',
            status === 'going' && 'shadow-lg shadow-indigo-500/25',
            className
          )}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
          ) : null}
          {getButtonContent()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          onClick={() => handleStatusChange('going')}
          className={cn(
            'cursor-pointer',
            status === 'going' && 'bg-primary/10 text-primary'
          )}
        >
          <Check className="w-4 h-4 mr-2" />
          Going
          {status === 'going' && <Check className="w-4 h-4 ml-auto" />}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleStatusChange('interested')}
          className={cn(
            'cursor-pointer',
            status === 'interested' && 'bg-amber-500/10 text-amber-400'
          )}
        >
          <Heart className="w-4 h-4 mr-2" />
          Interested
          {status === 'interested' && <Check className="w-4 h-4 ml-auto" />}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleStatusChange('not_going')}
          className={cn(
            'cursor-pointer',
            status === 'not_going' && 'bg-slate-500/10 text-slate-400'
          )}
        >
          <X className="w-4 h-4 mr-2" />
          Not Going
          {status === 'not_going' && <Check className="w-4 h-4 ml-auto" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
