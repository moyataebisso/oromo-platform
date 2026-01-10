'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ArrowLeft,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  MessageSquare,
  MoreHorizontal,
  Send,
  Loader2,
  Briefcase,
  Mail
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'

interface Referral {
  id: string
  referrer_id: string
  referrer_name: string
  referrer_email: string
  referred_name: string | null
  referred_email: string | null
  status: 'pending' | 'clicked' | 'applied' | 'interviewing' | 'hired' | 'completed' | 'rejected'
  bonus_earned: number | null
  created_at: string
  applied_at: string | null
  hired_at: string | null
  completed_at: string | null
  paid_at: string | null
}

interface JobInfo {
  id: string
  title: string
  company_name: string
  referral_program: {
    bonus_amount: number
    bonus_currency: string
    probation_days: number
  }
}

// Mock data
const mockJob: JobInfo = {
  id: '1',
  title: 'Senior Software Engineer',
  company_name: 'TechCorp International',
  referral_program: {
    bonus_amount: 1500,
    bonus_currency: 'USD',
    probation_days: 90
  }
}

const mockReferrals: Referral[] = [
  {
    id: '1',
    referrer_id: 'u1',
    referrer_name: 'Abdi Mohammed',
    referrer_email: 'abdi@example.com',
    referred_name: 'Bekele Abera',
    referred_email: 'bekele@example.com',
    status: 'hired',
    bonus_earned: null,
    created_at: '2025-12-01T10:00:00Z',
    applied_at: '2025-12-05T14:30:00Z',
    hired_at: '2025-12-20T09:00:00Z',
    completed_at: null,
    paid_at: null
  },
  {
    id: '2',
    referrer_id: 'u2',
    referrer_name: 'Chaltu Lemma',
    referrer_email: 'chaltu@example.com',
    referred_name: 'Feyisa Lelisa',
    referred_email: 'feyisa@example.com',
    status: 'interviewing',
    bonus_earned: null,
    created_at: '2026-01-02T08:00:00Z',
    applied_at: '2026-01-03T11:00:00Z',
    hired_at: null,
    completed_at: null,
    paid_at: null
  },
  {
    id: '3',
    referrer_id: 'u3',
    referrer_name: 'Dinku Oromia',
    referrer_email: 'dinku@example.com',
    referred_name: 'Gada Tullu',
    referred_email: 'gada@example.com',
    status: 'applied',
    bonus_earned: null,
    created_at: '2026-01-05T16:00:00Z',
    applied_at: '2026-01-06T09:00:00Z',
    hired_at: null,
    completed_at: null,
    paid_at: null
  },
  {
    id: '4',
    referrer_id: 'u4',
    referrer_name: 'Ebba Hundessa',
    referrer_email: 'ebba@example.com',
    referred_name: null,
    referred_email: null,
    status: 'pending',
    bonus_earned: null,
    created_at: '2026-01-08T14:00:00Z',
    applied_at: null,
    hired_at: null,
    completed_at: null,
    paid_at: null
  },
  {
    id: '5',
    referrer_id: 'u5',
    referrer_name: 'Fayyaa Boru',
    referrer_email: 'fayyaa@example.com',
    referred_name: 'Hailu Merga',
    referred_email: 'hailu@example.com',
    status: 'completed',
    bonus_earned: 1500,
    created_at: '2025-10-15T10:00:00Z',
    applied_at: '2025-10-17T14:30:00Z',
    hired_at: '2025-11-01T09:00:00Z',
    completed_at: '2025-12-01T09:00:00Z',
    paid_at: '2025-12-05T10:00:00Z'
  }
]

export default function JobReferralsManagementPage() {
  const params = useParams()
  const [job, setJob] = useState<JobInfo | null>(null)
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [messageDialog, setMessageDialog] = useState<{open: boolean; referral: Referral | null}>({
    open: false,
    referral: null
  })
  const [messageText, setMessageText] = useState('')
  const [isSending, setIsSending] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 300))
      setJob(mockJob)
      setReferrals(mockReferrals)
      setIsLoading(false)
    }
    fetchData()
  }, [params.id])

  const updateReferralStatus = async (referralId: string, newStatus: Referral['status']) => {
    // In production, call API to update status
    setReferrals(prev => prev.map(r => {
      if (r.id === referralId) {
        const updates: Partial<Referral> = { status: newStatus }
        if (newStatus === 'hired') {
          updates.hired_at = new Date().toISOString()
        } else if (newStatus === 'completed') {
          updates.completed_at = new Date().toISOString()
          updates.bonus_earned = job?.referral_program.bonus_amount || 0
        }
        return { ...r, ...updates }
      }
      return r
    }))
    toast.success('Status updated', {
      description: `Referral status changed to ${newStatus}`
    })
  }

  const markAsPaid = async (referralId: string) => {
    setReferrals(prev => prev.map(r => {
      if (r.id === referralId) {
        return { ...r, paid_at: new Date().toISOString() }
      }
      return r
    }))
    toast.success('Marked as paid', {
      description: 'The referrer will be notified'
    })
  }

  const sendMessage = async () => {
    if (!messageText.trim() || !messageDialog.referral) return
    setIsSending(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    toast.success('Message sent', {
      description: `Message sent to ${messageDialog.referral.referrer_name}`
    })
    setMessageDialog({ open: false, referral: null })
    setMessageText('')
    setIsSending(false)
  }

  const getStatusBadge = (status: Referral['status']) => {
    const config = {
      pending: { color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300', icon: Clock, label: 'Pending' },
      clicked: { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300', icon: Users, label: 'Link Clicked' },
      applied: { color: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300', icon: Briefcase, label: 'Applied' },
      interviewing: { color: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300', icon: MessageSquare, label: 'Interviewing' },
      hired: { color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300', icon: CheckCircle2, label: 'Hired' },
      completed: { color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300', icon: DollarSign, label: 'Completed' },
      rejected: { color: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300', icon: XCircle, label: 'Not Selected' }
    }
    const { color, icon: Icon, label } = config[status]
    return (
      <Badge className={color}>
        <Icon className="w-3 h-3 mr-1" />
        {label}
      </Badge>
    )
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const filteredReferrals = filterStatus === 'all'
    ? referrals
    : referrals.filter(r => r.status === filterStatus)

  const stats = {
    total: referrals.length,
    applied: referrals.filter(r => ['applied', 'interviewing', 'hired', 'completed'].includes(r.status)).length,
    hired: referrals.filter(r => ['hired', 'completed'].includes(r.status)).length,
    paid: referrals.filter(r => r.paid_at).length,
    totalPaid: referrals.reduce((sum, r) => sum + (r.bonus_earned || 0), 0)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4">
          <Link
            href={`/careers/jobs/${params.id}`}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Job
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Manage Referrals</h1>
            <p className="text-muted-foreground">
              {job?.title} at {job?.company_name}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6 text-center">
                <Users className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total Referrals</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Briefcase className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">{stats.applied}</p>
                <p className="text-xs text-muted-foreground">Applied</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">{stats.hired}</p>
                <p className="text-xs text-muted-foreground">Hired</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <DollarSign className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">{stats.paid}</p>
                <p className="text-xs text-muted-foreground">Bonuses Paid</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <DollarSign className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">${stats.totalPaid.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total Paid Out</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {['all', 'pending', 'applied', 'interviewing', 'hired', 'completed', 'rejected'].map((status) => (
              <Button
                key={status}
                variant={filterStatus === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>

          {/* Referrals Table */}
          <Card>
            <CardHeader>
              <CardTitle>Referrals</CardTitle>
              <CardDescription>
                {filteredReferrals.length} referral{filteredReferrals.length !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredReferrals.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="pb-3 font-medium text-muted-foreground">Referrer</th>
                        <th className="pb-3 font-medium text-muted-foreground">Referred Person</th>
                        <th className="pb-3 font-medium text-muted-foreground">Status</th>
                        <th className="pb-3 font-medium text-muted-foreground">Applied</th>
                        <th className="pb-3 font-medium text-muted-foreground">Bonus</th>
                        <th className="pb-3 font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filteredReferrals.map((referral) => (
                        <tr key={referral.id}>
                          <td className="py-4">
                            <div>
                              <p className="font-medium">{referral.referrer_name}</p>
                              <p className="text-sm text-muted-foreground">{referral.referrer_email}</p>
                            </div>
                          </td>
                          <td className="py-4">
                            {referral.referred_name ? (
                              <div>
                                <p className="font-medium">{referral.referred_name}</p>
                                <p className="text-sm text-muted-foreground">{referral.referred_email}</p>
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-sm">Not yet applied</span>
                            )}
                          </td>
                          <td className="py-4">
                            {getStatusBadge(referral.status)}
                          </td>
                          <td className="py-4 text-sm text-muted-foreground">
                            {formatDate(referral.applied_at)}
                          </td>
                          <td className="py-4">
                            {referral.status === 'completed' ? (
                              <div>
                                <span className="font-medium text-green-600">
                                  ${referral.bonus_earned?.toLocaleString()}
                                </span>
                                {referral.paid_at ? (
                                  <Badge variant="outline" className="ml-2">Paid</Badge>
                                ) : (
                                  <Badge variant="secondary" className="ml-2">Pending</Badge>
                                )}
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-sm">
                                ${job?.referral_program.bonus_amount.toLocaleString()} potential
                              </span>
                            )}
                          </td>
                          <td className="py-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => setMessageDialog({ open: true, referral })}
                                >
                                  <MessageSquare className="w-4 h-4 mr-2" />
                                  Message Referrer
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => updateReferralStatus(referral.id, 'interviewing')}
                                  disabled={['hired', 'completed', 'rejected'].includes(referral.status)}
                                >
                                  Mark as Interviewing
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => updateReferralStatus(referral.id, 'hired')}
                                  disabled={['hired', 'completed', 'rejected'].includes(referral.status)}
                                >
                                  Mark as Hired
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => updateReferralStatus(referral.id, 'completed')}
                                  disabled={referral.status !== 'hired'}
                                >
                                  Mark as Completed
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => updateReferralStatus(referral.id, 'rejected')}
                                  disabled={['hired', 'completed', 'rejected'].includes(referral.status)}
                                  className="text-red-600"
                                >
                                  Mark as Not Selected
                                </DropdownMenuItem>
                                {referral.status === 'completed' && !referral.paid_at && (
                                  <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() => markAsPaid(referral.id)}
                                      className="text-green-600"
                                    >
                                      <DollarSign className="w-4 h-4 mr-2" />
                                      Mark as Paid
                                    </DropdownMenuItem>
                                  </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No Referrals Yet</h3>
                  <p className="text-muted-foreground">
                    Share this job to start receiving referrals
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Message Dialog */}
      <Dialog open={messageDialog.open} onOpenChange={(open) => setMessageDialog({ open, referral: messageDialog.referral })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Message Referrer
            </DialogTitle>
            <DialogDescription>
              Send a message to {messageDialog.referral?.referrer_name} about their referral
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium">{messageDialog.referral?.referrer_name}</p>
              <p className="text-xs text-muted-foreground">{messageDialog.referral?.referrer_email}</p>
            </div>
            <Textarea
              placeholder="Type your message here..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMessageDialog({ open: false, referral: null })}>
              Cancel
            </Button>
            <Button onClick={sendMessage} disabled={isSending || !messageText.trim()}>
              {isSending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  )
}
