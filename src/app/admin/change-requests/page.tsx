'use client'

import { useState, useEffect, useCallback } from 'react'
import { Send, Loader2, RefreshCw, Clock, CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface ChangeRequest {
  id: string
  request_type: string
  priority: string
  description: string
  status: string
  admin_notes?: string
  created_at: string
}

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: typeof Clock }> = {
  pending: { label: 'Pending', variant: 'secondary', icon: Clock },
  in_progress: { label: 'In Progress', variant: 'default', icon: AlertCircle },
  completed: { label: 'Completed', variant: 'outline', icon: CheckCircle2 },
}

const priorityConfig: Record<string, { label: string; color: string }> = {
  low: { label: 'Low', color: 'text-slate-600' },
  medium: { label: 'Medium', color: 'text-amber-600' },
  high: { label: 'High', color: 'text-orange-600' },
  urgent: { label: 'Urgent', color: 'text-red-600' },
}

export default function ChangeRequestsPage() {
  const [requests, setRequests] = useState<ChangeRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [requestType, setRequestType] = useState('')
  const [priority, setPriority] = useState('')
  const [description, setDescription] = useState('')

  const fetchRequests = useCallback(async () => {
    try {
      const res = await fetch('/api/change-requests/list')
      const json = await res.json()
      if (json.data) {
        setRequests(json.data)
      }
    } catch {
      // silently fail
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRequests()
    const interval = setInterval(fetchRequests, 30000)
    return () => clearInterval(interval)
  }, [fetchRequests])

  const handleSubmit = async () => {
    if (!requestType || !priority || !description.trim()) return

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/change-requests/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          request_type: requestType,
          priority,
          description: description.trim(),
        }),
      })

      if (res.ok) {
        setSubmitSuccess(true)
        setRequestType('')
        setPriority('')
        setDescription('')
        await fetchRequests()
        setTimeout(() => setSubmitSuccess(false), 3000)
      }
    } catch {
      // silently fail
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Change Requests</h1>
        <p className="text-muted-foreground">Submit and track platform change requests</p>
      </div>

      {/* Submit New Request */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle>New Change Request</CardTitle>
          <CardDescription>Describe the change you need for the Oromo Platform</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Request Type</Label>
              <Select value={requestType} onValueChange={setRequestType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bug_fix">Bug Fix</SelectItem>
                  <SelectItem value="feature">New Feature</SelectItem>
                  <SelectItem value="content_update">Content Update</SelectItem>
                  <SelectItem value="design_change">Design Change</SelectItem>
                  <SelectItem value="performance">Performance</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              placeholder="Describe the change you need in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !requestType || !priority || !description.trim()}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit Request
                </>
              )}
            </Button>
            {submitSuccess && (
              <span className="text-sm text-green-600 font-medium">
                Request submitted successfully!
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Request List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Previous Requests</h2>
          <Button variant="outline" size="sm" onClick={fetchRequests}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-card/50 border-border/50 animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-muted rounded w-1/3 mb-3" />
                  <div className="h-3 bg-muted rounded w-2/3 mb-2" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : requests.length === 0 ? (
          <Card className="bg-card/50 border-border/50">
            <CardContent className="p-12 text-center">
              <Clock className="w-10 h-10 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-muted-foreground">No change requests yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {requests.map((req) => {
              const status = statusConfig[req.status] || statusConfig.pending
              const priorityInfo = priorityConfig[req.priority] || priorityConfig.medium
              const StatusIcon = status.icon

              return (
                <Card key={req.id} className="bg-card/50 border-border/50 hover:border-primary/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="secondary">
                            {req.request_type.replace(/_/g, ' ')}
                          </Badge>
                          <span className={`text-xs font-medium ${priorityInfo.color}`}>
                            {priorityInfo.label} Priority
                          </span>
                        </div>
                        <p className="text-sm text-foreground">{req.description}</p>
                        {req.admin_notes && (
                          <div className="mt-2 p-3 rounded-md bg-muted/50">
                            <p className="text-xs font-medium text-muted-foreground mb-1">Admin Notes:</p>
                            <p className="text-sm text-foreground">{req.admin_notes}</p>
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {formatDate(req.created_at)}
                        </p>
                      </div>
                      <Badge variant={status.variant} className="flex items-center gap-1 shrink-0">
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
