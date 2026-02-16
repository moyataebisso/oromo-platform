'use client'

import { useState, useEffect } from 'react'
import { UserPlus, UserCheck, Clock, UserMinus, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import type { ConnectionStatus } from '@/types/odda'

interface ConnectionButtonProps {
  userId: string
  initialStatus?: ConnectionStatus
  onStatusChange?: (status: ConnectionStatus) => void
}

export function ConnectionButton({
  userId,
  initialStatus = 'none',
  onStatusChange
}: ConnectionButtonProps) {
  const [status, setStatus] = useState<ConnectionStatus>(initialStatus)
  const [isLoading, setIsLoading] = useState(false)
  const [showConnectDialog, setShowConnectDialog] = useState(false)
  const [message, setMessage] = useState('')
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUserId(user?.id || null)
    }
    checkAuth()
  }, [])

  useEffect(() => {
    const fetchStatus = async () => {
      if (!currentUserId || currentUserId === userId) return

      const supabase = createClient()
      type ConnectionData = { status: string; requester_id: string; addressee_id: string }
      const { data } = await supabase
        .from('connections')
        .select('*')
        .or(`and(requester_id.eq.${currentUserId},addressee_id.eq.${userId}),and(requester_id.eq.${userId},addressee_id.eq.${currentUserId})`)
        .single() as { data: ConnectionData | null }

      if (data) {
        if (data.status === 'accepted') {
          setStatus('connected')
        } else if (data.status === 'pending') {
          setStatus(data.requester_id === currentUserId ? 'pending_sent' : 'pending_received')
        }
      }
    }

    if (initialStatus === 'none') {
      fetchStatus()
    }
  }, [currentUserId, userId, initialStatus])

  const handleConnect = async () => {
    if (!currentUserId) {
      toast.error('Please log in to connect')
      return
    }

    setIsLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('connections')
        .insert({
          requester_id: currentUserId,
          addressee_id: userId,
          message: message || null,
        } as never)

      if (error) throw error

      setStatus('pending_sent')
      onStatusChange?.('pending_sent')
      toast.success('Connection request sent!')
      setShowConnectDialog(false)
      setMessage('')
    } catch (error) {
      console.error('Failed to send connection request:', error)
      toast.error('Failed to send connection request')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAccept = async () => {
    setIsLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('connections')
        .update({ status: 'accepted', updated_at: new Date().toISOString() } as never)
        .eq('addressee_id', currentUserId!)
        .eq('requester_id', userId)

      if (error) throw error

      setStatus('connected')
      onStatusChange?.('connected')
      toast.success('Connection accepted!')
    } catch (error) {
      console.error('Failed to accept connection:', error)
      toast.error('Failed to accept connection')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemove = async () => {
    if (!confirm('Are you sure you want to remove this connection?')) return

    setIsLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('connections')
        .delete()
        .or(`and(requester_id.eq.${currentUserId!},addressee_id.eq.${userId}),and(requester_id.eq.${userId},addressee_id.eq.${currentUserId!})`)

      if (error) throw error

      setStatus('none')
      onStatusChange?.('none')
      toast.success('Connection removed')
    } catch (error) {
      console.error('Failed to remove connection:', error)
      toast.error('Failed to remove connection')
    } finally {
      setIsLoading(false)
    }
  }

  // Don't show button for own profile
  if (currentUserId === userId) return null

  // Not logged in
  if (!currentUserId) {
    return (
      <Button variant="outline" onClick={() => toast.error('Please log in to connect')}>
        <UserPlus className="w-4 h-4 mr-2" />
        Connect
      </Button>
    )
  }

  if (isLoading) {
    return (
      <Button disabled>
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        Loading...
      </Button>
    )
  }

  switch (status) {
    case 'connected':
      return (
        <Button variant="outline" onClick={handleRemove}>
          <UserCheck className="w-4 h-4 mr-2" />
          Connected
        </Button>
      )

    case 'pending_sent':
      return (
        <Button variant="secondary" onClick={handleRemove}>
          <Clock className="w-4 h-4 mr-2" />
          Pending
        </Button>
      )

    case 'pending_received':
      return (
        <div className="flex gap-2">
          <Button onClick={handleAccept}>
            <UserCheck className="w-4 h-4 mr-2" />
            Accept
          </Button>
          <Button variant="outline" onClick={handleRemove}>
            <UserMinus className="w-4 h-4 mr-2" />
            Decline
          </Button>
        </div>
      )

    default:
      return (
        <>
          <Button onClick={() => setShowConnectDialog(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Connect
          </Button>

          <Dialog open={showConnectDialog} onOpenChange={setShowConnectDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Send Connection Request</DialogTitle>
                <DialogDescription>
                  Add a personal note to your connection request (optional)
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="message">Message (optional)</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Hi! I'd like to connect with you..."
                    rows={3}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowConnectDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleConnect} disabled={isLoading}>
                  {isLoading ? 'Sending...' : 'Send Request'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )
  }
}
