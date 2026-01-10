'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'
import {
  ArrowLeft,
  MapPin,
  DollarSign,
  Clock,
  Building2,
  Share2,
  Gift,
  Users,
  Copy,
  Mail,
  Linkedin,
  MessageCircle,
  ExternalLink,
  CheckCircle2,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { toast } from 'sonner'

interface Job {
  id: string
  title: string
  company_name: string
  location: string | null
  job_type: string
  salary_min: number | null
  salary_max: number | null
  description: string
  requirements: string | null
  benefits: string | null
  status: string
  created_at: string
  referral_program?: {
    id: string
    bonus_amount: number
    bonus_currency: string
    bonus_type: string
    bonus_description: string | null
    probation_days: number
    is_active: boolean
  } | null
}

// Mock job data - in production, fetch from Supabase
const mockJob: Job = {
  id: '1',
  title: 'Senior Software Engineer',
  company_name: 'TechCorp International',
  location: 'Minneapolis, MN (Remote)',
  job_type: 'full-time',
  salary_min: 120000,
  salary_max: 160000,
  description: `We are looking for a Senior Software Engineer to join our growing team. You will be responsible for designing and implementing scalable solutions for our platform.

Key Responsibilities:
- Design and develop high-quality software solutions
- Lead technical discussions and code reviews
- Mentor junior engineers
- Collaborate with cross-functional teams
- Contribute to architectural decisions`,
  requirements: `- 5+ years of experience in software development
- Strong proficiency in React, TypeScript, and Node.js
- Experience with cloud platforms (AWS, GCP, or Azure)
- Excellent problem-solving skills
- Strong communication abilities`,
  benefits: `- Competitive salary and equity
- Health, dental, and vision insurance
- 401(k) with company match
- Flexible PTO
- Remote work options
- Professional development budget`,
  status: 'active',
  created_at: '2026-01-05T10:00:00Z',
  referral_program: {
    id: 'rp1',
    bonus_amount: 1500,
    bonus_currency: 'USD',
    bonus_type: 'cash',
    bonus_description: 'Plus $500 in ODDA points',
    probation_days: 90,
    is_active: true
  }
}

export default function JobDetailPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const [job, setJob] = useState<Job | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isShareOpen, setIsShareOpen] = useState(false)
  const [referralCode, setReferralCode] = useState<string | null>(null)
  const [isLoggedIn] = useState(true) // In production, check actual auth state

  const refCode = searchParams.get('ref')

  useEffect(() => {
    // Simulate fetching job data
    const fetchJob = async () => {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 300))
      setJob(mockJob)
      setIsLoading(false)

      // If user came from a referral link, store it
      if (refCode) {
        localStorage.setItem('referral_code', refCode)
        localStorage.setItem('referral_job_id', params.id as string)
        toast.success('Referral link detected!', {
          description: 'You were referred by a community member'
        })
      }
    }
    fetchJob()
  }, [params.id, refCode])

  const generateReferralCode = () => {
    // In production, this would call an API to create a referral record
    const code = `REF${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    setReferralCode(code)
    return code
  }

  const getReferralLink = () => {
    const code = referralCode || generateReferralCode()
    return `${window.location.origin}/careers/jobs/${params.id}?ref=${code}`
  }

  const copyReferralLink = () => {
    const link = getReferralLink()
    navigator.clipboard.writeText(link)
    toast.success('Link copied!', {
      description: 'Share this link with your network'
    })
  }

  const shareVia = (platform: string) => {
    const link = getReferralLink()
    const text = `Check out this job opportunity: ${job?.title} at ${job?.company_name}`

    let shareUrl = ''
    switch (platform) {
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(`${text}\n\nApply here: ${link}`)}`
        break
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(link)}`
        break
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`${text}\n${link}`)}`
        break
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(link)}`
        break
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank')
    }
  }

  const formatSalary = (min: number | null, max: number | null) => {
    if (!min && !max) return 'Salary not specified'
    const format = (n: number) => `$${(n / 1000).toFixed(0)}K`
    if (min && max) return `${format(min)} - ${format(max)}`
    if (min) return `From ${format(min)}`
    return `Up to ${format(max!)}`
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getJobTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'full-time': 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
      'part-time': 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
      'contract': 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
      'internship': 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
    }
    return colors[type] || 'bg-slate-100 text-slate-700'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Job Not Found</h2>
            <p className="text-muted-foreground mb-4">This job posting may have been removed</p>
            <Button asChild>
              <Link href="/careers">Browse All Jobs</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <Link
            href="/careers"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Jobs
          </Link>

          {/* Referral Banner */}
          {refCode && (
            <Card className="mb-6 bg-gradient-to-r from-emerald-500/10 to-amber-500/10 border-emerald-500/30">
              <CardContent className="py-4 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <p className="text-sm">
                  <span className="font-medium">You were referred!</span>
                  <span className="text-muted-foreground ml-1">
                    If you apply and get hired, your referrer will earn a bonus.
                  </span>
                </p>
              </CardContent>
            </Card>
          )}

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header Card */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl mb-2">{job.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2 text-base">
                        <Building2 className="w-4 h-4" />
                        {job.company_name}
                      </CardDescription>
                    </div>
                    {job.referral_program?.is_active && (
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                        <Gift className="w-3 h-3 mr-1" />
                        ${job.referral_program.bonus_amount} Referral Bonus
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4 text-sm">
                    {job.location && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </div>
                    )}
                    <Badge className={getJobTypeColor(job.job_type)}>
                      {job.job_type.replace('-', ' ')}
                    </Badge>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <DollarSign className="w-4 h-4" />
                      {formatSalary(job.salary_min, job.salary_max)}
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      Posted {formatDate(job.created_at)}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Job Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p className="whitespace-pre-wrap">{job.description}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Requirements */}
              {job.requirements && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                      <p className="whitespace-pre-wrap">{job.requirements}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Benefits */}
              {job.benefits && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Benefits</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                      <p className="whitespace-pre-wrap">{job.benefits}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Apply Card */}
              <Card className="sticky top-24">
                <CardContent className="pt-6 space-y-4">
                  <Button className="w-full" size="lg">
                    Apply Now
                  </Button>

                  {/* Refer Someone Button */}
                  {job.referral_program?.is_active && isLoggedIn && (
                    <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full" size="lg">
                          <Users className="w-4 h-4 mr-2" />
                          Refer Someone
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <Gift className="w-5 h-5 text-primary" />
                            Refer Someone
                          </DialogTitle>
                          <DialogDescription>
                            Share this job with your network and earn ${job.referral_program.bonus_amount} when they get hired!
                          </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">
                          {/* Referral Link */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Your Referral Link</label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                readOnly
                                value={getReferralLink()}
                                className="flex-1 px-3 py-2 text-sm bg-muted rounded-md border"
                              />
                              <Button onClick={copyReferralLink} variant="outline" size="icon">
                                <Copy className="w-4 h-4" />
                              </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Your code: {referralCode || 'Click to generate'}
                            </p>
                          </div>

                          {/* Share Buttons */}
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Share via</label>
                            <div className="grid grid-cols-4 gap-2">
                              <Button
                                variant="outline"
                                className="flex flex-col gap-1 h-auto py-3"
                                onClick={() => shareVia('email')}
                              >
                                <Mail className="w-5 h-5" />
                                <span className="text-xs">Email</span>
                              </Button>
                              <Button
                                variant="outline"
                                className="flex flex-col gap-1 h-auto py-3"
                                onClick={() => shareVia('whatsapp')}
                              >
                                <MessageCircle className="w-5 h-5" />
                                <span className="text-xs">WhatsApp</span>
                              </Button>
                              <Button
                                variant="outline"
                                className="flex flex-col gap-1 h-auto py-3"
                                onClick={() => shareVia('linkedin')}
                              >
                                <Linkedin className="w-5 h-5" />
                                <span className="text-xs">LinkedIn</span>
                              </Button>
                              <Button
                                variant="outline"
                                className="flex flex-col gap-1 h-auto py-3"
                                onClick={() => shareVia('twitter')}
                              >
                                <ExternalLink className="w-5 h-5" />
                                <span className="text-xs">Twitter</span>
                              </Button>
                            </div>
                          </div>

                          {/* Bonus Info */}
                          <div className="p-4 bg-muted/50 rounded-lg">
                            <h4 className="font-medium mb-2">Referral Bonus</h4>
                            <p className="text-2xl font-bold text-primary">
                              ${job.referral_program.bonus_amount}
                              <span className="text-sm font-normal text-muted-foreground ml-1">
                                {job.referral_program.bonus_currency}
                              </span>
                            </p>
                            {job.referral_program.bonus_description && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {job.referral_program.bonus_description}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground mt-2">
                              Paid after {job.referral_program.probation_days} day probation period
                            </p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}

                  {!isLoggedIn && job.referral_program?.is_active && (
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">
                        Sign in to refer someone and earn ${job.referral_program.bonus_amount}
                      </p>
                      <Button variant="link" asChild className="p-0 h-auto">
                        <Link href="/login">Sign In</Link>
                      </Button>
                    </div>
                  )}

                  <Button variant="ghost" className="w-full" size="sm">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Job
                  </Button>
                </CardContent>
              </Card>

              {/* Referral Program Info */}
              {job.referral_program?.is_active && (
                <Card className="bg-gradient-to-br from-emerald-500/5 to-amber-500/5 border-emerald-500/20">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Gift className="w-5 h-5 text-primary" />
                      Referral Program
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Know someone perfect for this role? Refer them and earn a bonus when they get hired!
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Bonus Amount</span>
                        <span className="font-medium">${job.referral_program.bonus_amount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Bonus Type</span>
                        <span className="font-medium capitalize">{job.referral_program.bonus_type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Paid After</span>
                        <span className="font-medium">{job.referral_program.probation_days} days</span>
                      </div>
                    </div>
                    <Button asChild variant="link" className="w-full mt-4 p-0">
                      <Link href="/careers/referrals">
                        Learn more about referrals
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
