'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Users,
  DollarSign,
  Award,
  Clock,
  CheckCircle2,
  XCircle,
  Copy,
  ExternalLink,
  MessageSquare,
  TrendingUp,
  Gift,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { toast } from 'sonner'

interface Referral {
  id: string
  referral_code: string
  referred_name: string | null
  referred_email: string | null
  status: 'pending' | 'clicked' | 'applied' | 'interviewing' | 'hired' | 'completed' | 'rejected'
  bonus_earned: number | null
  created_at: string
  applied_at: string | null
  hired_at: string | null
  completed_at: string | null
  program: {
    job: {
      title: string
      company_name: string
    }
    bonus_amount: number
    bonus_currency: string
  }
}

interface ReferralStats {
  total_referrals: number
  successful_hires: number
  total_earned: number
  odda_points: number
  badge: 'bronze' | 'silver' | 'gold' | 'platinum'
}

// Mock data for demonstration
const mockReferrals: Referral[] = [
  {
    id: '1',
    referral_code: 'REF123ABC',
    referred_name: 'Bekele Abera',
    referred_email: 'bekele@example.com',
    status: 'completed',
    bonus_earned: 1000,
    created_at: '2025-12-01T10:00:00Z',
    applied_at: '2025-12-05T14:30:00Z',
    hired_at: '2025-12-20T09:00:00Z',
    completed_at: '2026-01-05T09:00:00Z',
    program: {
      job: {
        title: 'Software Engineer',
        company_name: 'Tech Corp'
      },
      bonus_amount: 1000,
      bonus_currency: 'USD'
    }
  },
  {
    id: '2',
    referral_code: 'REF456DEF',
    referred_name: 'Chaltu Lemma',
    referred_email: 'chaltu@example.com',
    status: 'interviewing',
    bonus_earned: null,
    created_at: '2026-01-02T08:00:00Z',
    applied_at: '2026-01-03T11:00:00Z',
    hired_at: null,
    completed_at: null,
    program: {
      job: {
        title: 'Product Manager',
        company_name: 'Innovation Labs'
      },
      bonus_amount: 1500,
      bonus_currency: 'USD'
    }
  },
  {
    id: '3',
    referral_code: 'REF789GHI',
    referred_name: null,
    referred_email: null,
    status: 'pending',
    bonus_earned: null,
    created_at: '2026-01-08T16:00:00Z',
    applied_at: null,
    hired_at: null,
    completed_at: null,
    program: {
      job: {
        title: 'Data Analyst',
        company_name: 'DataCo'
      },
      bonus_amount: 750,
      bonus_currency: 'USD'
    }
  }
]

const mockStats: ReferralStats = {
  total_referrals: 3,
  successful_hires: 1,
  total_earned: 1000,
  odda_points: 500,
  badge: 'bronze'
}

export default function MyReferralsPage() {
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [stats, setStats] = useState<ReferralStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [isLoggedIn] = useState(true) // In production, check actual auth state

  useEffect(() => {
    // Simulate loading data
    const loadData = async () => {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 500))
      setReferrals(mockReferrals)
      setStats(mockStats)
      setIsLoading(false)
    }
    loadData()
  }, [])

  const getStatusBadge = (status: Referral['status']) => {
    const config = {
      pending: { color: 'bg-slate-100 text-slate-700', icon: Clock, label: 'Pending' },
      clicked: { color: 'bg-blue-100 text-blue-700', icon: ExternalLink, label: 'Link Clicked' },
      applied: { color: 'bg-purple-100 text-purple-700', icon: Users, label: 'Applied' },
      interviewing: { color: 'bg-amber-100 text-amber-700', icon: MessageSquare, label: 'Interviewing' },
      hired: { color: 'bg-green-100 text-green-700', icon: CheckCircle2, label: 'Hired!' },
      completed: { color: 'bg-emerald-100 text-emerald-700', icon: Gift, label: 'Completed' },
      rejected: { color: 'bg-red-100 text-red-700', icon: XCircle, label: 'Not Selected' }
    }
    const { color, icon: Icon, label } = config[status]
    return (
      <Badge className={color}>
        <Icon className="w-3 h-3 mr-1" />
        {label}
      </Badge>
    )
  }

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'platinum':
        return 'bg-purple-100 text-purple-700'
      case 'gold':
        return 'bg-amber-100 text-amber-700'
      case 'silver':
        return 'bg-slate-200 text-slate-700'
      default:
        return 'bg-orange-100 text-orange-700'
    }
  }

  const copyReferralLink = (code: string) => {
    const link = `${window.location.origin}/careers/jobs?ref=${code}`
    navigator.clipboard.writeText(link)
    toast.success('Referral link copied!', {
      description: 'Share this link with your network'
    })
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const filteredReferrals = filterStatus === 'all'
    ? referrals
    : referrals.filter(r => r.status === filterStatus)

  const potentialEarnings = referrals
    .filter(r => !['completed', 'rejected'].includes(r.status))
    .reduce((sum, r) => sum + r.program.bonus_amount, 0)

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Card className="max-w-md mx-4">
            <CardContent className="pt-6 text-center">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Sign In Required</h2>
              <p className="text-muted-foreground mb-6">
                Please sign in to view your referral dashboard
              </p>
              <Button asChild>
                <Link href="/login">Sign In</Link>
              </Button>
            </CardContent>
          </Card>
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
            href="/careers/referrals"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Referral Network
          </Link>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Referrals</h1>
              <p className="text-muted-foreground">
                Track your referrals and earnings
              </p>
            </div>
            <Button asChild className="mt-4 md:mt-0">
              <Link href="/careers/referrals">Find Jobs to Refer</Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              {stats && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <Users className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold">{stats.total_referrals}</p>
                      <p className="text-xs text-muted-foreground">Total Referrals</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold">{stats.successful_hires}</p>
                      <p className="text-xs text-muted-foreground">Successful Hires</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <DollarSign className="w-6 h-6 text-green-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold">${stats.total_earned.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Total Earned</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <TrendingUp className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold">${potentialEarnings.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Potential Earnings</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <Award className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                      <Badge className={getBadgeColor(stats.badge)}>
                        {stats.badge.charAt(0).toUpperCase() + stats.badge.slice(1)}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-2">Your Badge</p>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Filters */}
              <div className="flex flex-wrap gap-2 mb-6">
                {['all', 'pending', 'applied', 'interviewing', 'hired', 'completed'].map((status) => (
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

              {/* Referrals List */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Referrals</CardTitle>
                  <CardDescription>
                    {filteredReferrals.length} referral{filteredReferrals.length !== 1 ? 's' : ''} found
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {filteredReferrals.length > 0 ? (
                    <div className="divide-y">
                      {filteredReferrals.map((referral) => (
                        <div key={referral.id} className="py-4 first:pt-0 last:pb-0">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold">{referral.program.job.title}</h3>
                                {getStatusBadge(referral.status)}
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {referral.program.job.company_name}
                              </p>
                              {referral.referred_name ? (
                                <p className="text-sm">
                                  Referred: <span className="font-medium">{referral.referred_name}</span>
                                  {referral.referred_email && (
                                    <span className="text-muted-foreground"> ({referral.referred_email})</span>
                                  )}
                                </p>
                              ) : (
                                <p className="text-sm text-muted-foreground">
                                  No one has used this link yet
                                </p>
                              )}
                              <div className="flex flex-wrap gap-4 mt-2 text-xs text-muted-foreground">
                                <span>Created: {formatDate(referral.created_at)}</span>
                                {referral.applied_at && (
                                  <span>Applied: {formatDate(referral.applied_at)}</span>
                                )}
                                {referral.hired_at && (
                                  <span>Hired: {formatDate(referral.hired_at)}</span>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <div className="text-right">
                                {referral.status === 'completed' ? (
                                  <p className="text-lg font-bold text-green-600">
                                    +${referral.bonus_earned?.toLocaleString()}
                                  </p>
                                ) : (
                                  <p className="text-lg font-bold text-muted-foreground">
                                    ${referral.program.bonus_amount.toLocaleString()}
                                    <span className="text-xs font-normal"> potential</span>
                                  </p>
                                )}
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => copyReferralLink(referral.referral_code)}
                              >
                                <Copy className="w-3 h-3 mr-1" />
                                Copy Link
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold mb-2">No Referrals Yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Start referring friends and colleagues to earn rewards
                      </p>
                      <Button asChild>
                        <Link href="/careers/referrals">Find Jobs to Refer</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
