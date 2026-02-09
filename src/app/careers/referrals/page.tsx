import Link from 'next/link'
import {
  Users,
  DollarSign,
  TrendingUp,
  Award,
  ArrowRight,
  Gift,
  Briefcase,
  Trophy,
  CheckCircle2
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

interface JobWithReferral {
  id: string
  title: string
  company_name: string
  location: string | null
  job_type: string
  referral_program?: {
    bonus_amount: number
    bonus_currency: string
    bonus_type: string
  } | null
}

export default async function ReferralsPage() {
  const supabase = await createClient()

  // Fetch jobs with referral programs
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: jobsData } = await (supabase as any)
    .from('jobs')
    .select(`
      id,
      title,
      company_name,
      location,
      job_type,
      referral_programs (
        bonus_amount,
        bonus_currency,
        bonus_type
      )
    `)
    .eq('status', 'active')
    .not('referral_programs', 'is', null)
    .limit(6)

  const jobsWithReferrals: JobWithReferral[] = (jobsData || []).map((job: {
    id: string
    title: string
    company_name: string
    location: string | null
    job_type: string
    referral_programs?: { bonus_amount: number; bonus_currency: string; bonus_type: string }[] | null
  }) => ({
    ...job,
    referral_program: job.referral_programs?.[0] || null
  }))

  // Fetch top referrers for preview
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: topReferrers } = await (supabase as any)
    .from('referral_stats')
    .select(`
      user_id,
      successful_hires,
      badge,
      profiles (
        display_name,
        avatar_url
      )
    `)
    .eq('show_on_leaderboard', true)
    .order('successful_hires', { ascending: false })
    .limit(3)

  const howItWorks = [
    {
      step: 1,
      icon: Briefcase,
      title: 'Find a Job',
      description: 'Browse jobs with referral bonuses and find one that matches someone you know.'
    },
    {
      step: 2,
      icon: Users,
      title: 'Refer Someone',
      description: 'Share your unique referral link with friends, family, or professional contacts.'
    },
    {
      step: 3,
      icon: CheckCircle2,
      title: 'They Get Hired',
      description: 'When your referral is hired and completes their probation period, you earn your bonus.'
    },
    {
      step: 4,
      icon: Gift,
      title: 'Get Rewarded',
      description: 'Receive cash, Odda Academy points, or other rewards directly to your account.'
    }
  ]

  const formatCurrency = (amount: number, currency: string) => {
    const symbols: Record<string, string> = { USD: '$', EUR: '€', ETB: 'ETB ' }
    return `${symbols[currency] || ''}${amount.toLocaleString()}`
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/10 to-background pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <Badge variant="secondary" className="mb-4">
              <Users className="w-4 h-4 mr-1" />
              Odda Academy Referral Network
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
              Help Your Community Find Jobs
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Earn rewards for successful referrals. Connect talented Oromo professionals with great opportunities.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="#jobs-with-bonuses">
                  Browse Jobs with Bonuses
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/careers/referrals/leaderboard">
                  <Trophy className="mr-2 w-4 h-4" />
                  View Leaderboard
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-4xl mx-auto">
              <div className="p-4 bg-card rounded-xl border">
                <DollarSign className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">$50K+</p>
                <p className="text-sm text-muted-foreground">Total Paid Out</p>
              </div>
              <div className="p-4 bg-card rounded-xl border">
                <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">500+</p>
                <p className="text-sm text-muted-foreground">Active Referrers</p>
              </div>
              <div className="p-4 bg-card rounded-xl border">
                <Briefcase className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">120+</p>
                <p className="text-sm text-muted-foreground">Successful Hires</p>
              </div>
              <div className="p-4 bg-card rounded-xl border">
                <TrendingUp className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">$1,000</p>
                <p className="text-sm text-muted-foreground">Average Bonus</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">How Referrals Work</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Earn money by helping your network find their dream jobs
              </p>
            </div>
            <div className="grid md:grid-cols-4 gap-6">
              {howItWorks.map((item) => (
                <div key={item.step} className="relative">
                  <Card className="text-center h-full">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <item.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                        {item.step}
                      </div>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{item.description}</CardDescription>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Jobs with Referral Bonuses */}
        <section id="jobs-with-bonuses" className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">Jobs with Referral Bonuses</h2>
                <p className="text-muted-foreground">
                  Refer someone to these jobs and earn when they get hired
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/careers?referral=true">
                  View All
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>

            {jobsWithReferrals.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobsWithReferrals.map((job) => (
                  <Card key={job.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{job.title}</CardTitle>
                          <CardDescription>{job.company_name}</CardDescription>
                        </div>
                        {job.referral_program && (
                          <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                            <Gift className="w-3 h-3 mr-1" />
                            {formatCurrency(job.referral_program.bonus_amount, job.referral_program.bonus_currency)}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.location && (
                          <Badge variant="outline">{job.location}</Badge>
                        )}
                        <Badge variant="outline" className="capitalize">{job.job_type}</Badge>
                      </div>
                      <Button className="w-full" asChild>
                        <Link href={`/careers/jobs/${job.id}`}>
                          View & Refer
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Jobs with Referral Bonuses Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Check back soon for new opportunities
                  </p>
                  <Button variant="outline" asChild>
                    <Link href="/careers">Browse All Jobs</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* Top Referrers Preview */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">Top Referrers</h2>
                <p className="text-muted-foreground">
                  Community members making a difference
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/careers/referrals/leaderboard">
                  Full Leaderboard
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {(topReferrers || []).map((referrer: {
                user_id: string
                successful_hires: number
                badge: string
                profiles: { display_name: string; avatar_url: string | null }
              }, index: number) => (
                <Card key={referrer.user_id} className="text-center">
                  <CardContent className="pt-6">
                    <div className="relative inline-block mb-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-amber-500 flex items-center justify-center text-white text-2xl font-bold">
                        {referrer.profiles?.display_name?.[0] || '?'}
                      </div>
                      <div className="absolute -top-2 -right-2 text-2xl">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                      </div>
                    </div>
                    <h3 className="font-semibold">{referrer.profiles?.display_name || 'Anonymous'}</h3>
                    <p className="text-muted-foreground text-sm mb-2">
                      {referrer.successful_hires} successful referrals
                    </p>
                    <Badge className={
                      referrer.badge === 'platinum' ? 'bg-purple-100 text-purple-700' :
                      referrer.badge === 'gold' ? 'bg-amber-100 text-amber-700' :
                      referrer.badge === 'silver' ? 'bg-slate-100 text-slate-700' :
                      'bg-orange-100 text-orange-700'
                    }>
                      <Award className="w-3 h-3 mr-1" />
                      {referrer.badge.charAt(0).toUpperCase() + referrer.badge.slice(1)}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
              {(!topReferrers || topReferrers.length === 0) && (
                <>
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="text-center">
                      <CardContent className="pt-6">
                        <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                          <Users className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="font-semibold text-muted-foreground">Be the first!</h3>
                        <p className="text-muted-foreground text-sm">
                          Start referring to appear here
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </>
              )}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <Card className="bg-gradient-to-r from-emerald-500/10 to-amber-500/10 border-none">
              <CardContent className="py-12">
                <h2 className="text-3xl font-bold mb-4">Ready to Start Referring?</h2>
                <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                  Sign in to access your referral dashboard, track your referrals, and see your earnings.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button size="lg" asChild>
                    <Link href="/login">
                      Sign In to Start
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/careers/my-referrals">
                      My Referrals Dashboard
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
