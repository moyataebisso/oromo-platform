import Link from 'next/link'
import { ArrowLeft, Trophy, Award, Users, DollarSign, TrendingUp } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

interface ReferrerStats {
  user_id: string
  successful_hires: number
  total_earned: number
  badge: 'bronze' | 'silver' | 'gold' | 'platinum'
  profiles: {
    display_name: string | null
    avatar_url: string | null
  } | null
}

export default async function LeaderboardPage() {
  const supabase = await createClient()

  // Fetch all leaderboard participants
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: referrersData } = await (supabase as any)
    .from('referral_stats')
    .select(`
      user_id,
      successful_hires,
      total_earned,
      badge,
      profiles (
        display_name,
        avatar_url
      )
    `)
    .eq('show_on_leaderboard', true)
    .order('successful_hires', { ascending: false })
    .limit(50)

  const referrers: ReferrerStats[] = referrersData || []

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'platinum':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
      case 'gold':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300'
      case 'silver':
        return 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
      default:
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
    }
  }

  const getRankDisplay = (index: number) => {
    if (index === 0) return '🥇'
    if (index === 1) return '🥈'
    if (index === 2) return '🥉'
    return `#${index + 1}`
  }

  const badgeRequirements = [
    { badge: 'Bronze', hires: '0-2', icon: '🥉' },
    { badge: 'Silver', hires: '3-9', icon: '🥈' },
    { badge: 'Gold', hires: '10-24', icon: '🥇' },
    { badge: 'Platinum', hires: '25+', icon: '💎' }
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/10 to-background pt-24 pb-12">
          <div className="max-w-7xl mx-auto px-4">
            <Link
              href="/careers/referrals"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Referrals
            </Link>
            <div className="text-center">
              <Badge variant="secondary" className="mb-4">
                <Trophy className="w-4 h-4 mr-1" />
                Top Referrers
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Referral Leaderboard
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Celebrating our top community members who help others find great careers
              </p>
            </div>
          </div>
        </section>

        {/* Badge Requirements */}
        <section className="py-8 border-b">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-4">
              {badgeRequirements.map((req) => (
                <div key={req.badge} className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full">
                  <span className="text-lg">{req.icon}</span>
                  <span className="font-medium">{req.badge}:</span>
                  <span className="text-muted-foreground">{req.hires} hires</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Leaderboard */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4">
            {referrers.length > 0 ? (
              <div className="space-y-4">
                {/* Top 3 Cards */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  {referrers.slice(0, 3).map((referrer, index) => (
                    <Card
                      key={referrer.user_id}
                      className={`text-center ${
                        index === 0 ? 'md:order-2 border-amber-500/50 bg-gradient-to-b from-amber-50/50 dark:from-amber-950/20' :
                        index === 1 ? 'md:order-1' :
                        'md:order-3'
                      }`}
                    >
                      <CardContent className="pt-6">
                        <div className="text-4xl mb-4">{getRankDisplay(index)}</div>
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-amber-500 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                          {referrer.profiles?.display_name?.[0] || '?'}
                        </div>
                        <h3 className="font-semibold text-lg">
                          {referrer.profiles?.display_name || 'Anonymous'}
                        </h3>
                        <p className="text-2xl font-bold text-primary mt-2">
                          {referrer.successful_hires}
                        </p>
                        <p className="text-sm text-muted-foreground mb-3">successful referrals</p>
                        <Badge className={getBadgeColor(referrer.badge)}>
                          <Award className="w-3 h-3 mr-1" />
                          {referrer.badge.charAt(0).toUpperCase() + referrer.badge.slice(1)}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Rest of Leaderboard */}
                {referrers.length > 3 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>All Rankings</CardTitle>
                      <CardDescription>
                        Top 50 referrers this month
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="divide-y">
                        {referrers.slice(3).map((referrer, index) => (
                          <div
                            key={referrer.user_id}
                            className="flex items-center justify-between py-4"
                          >
                            <div className="flex items-center gap-4">
                              <span className="text-lg font-bold text-muted-foreground w-8">
                                #{index + 4}
                              </span>
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-amber-500 flex items-center justify-center text-white font-bold">
                                {referrer.profiles?.display_name?.[0] || '?'}
                              </div>
                              <div>
                                <p className="font-medium">
                                  {referrer.profiles?.display_name || 'Anonymous'}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {referrer.successful_hires} referrals
                                </p>
                              </div>
                            </div>
                            <Badge className={getBadgeColor(referrer.badge)}>
                              <Award className="w-3 h-3 mr-1" />
                              {referrer.badge.charAt(0).toUpperCase() + referrer.badge.slice(1)}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <Card className="text-center py-16">
                <CardContent>
                  <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Be the First on the Leaderboard!</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    No referrers on the leaderboard yet. Start referring to claim the top spot!
                  </p>
                  <Button asChild>
                    <Link href="/careers/referrals">Start Referring</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6 text-center">
                  <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{referrers.length}</p>
                  <p className="text-sm text-muted-foreground">Active Referrers</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">
                    {referrers.reduce((sum, r) => sum + r.successful_hires, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Hires</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <DollarSign className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">
                    ${referrers.reduce((sum, r) => sum + r.total_earned, 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Paid Out</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <Award className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">
                    {referrers.filter(r => r.badge === 'platinum' || r.badge === 'gold').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Gold+ Members</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-4">Want to Join the Leaderboard?</h2>
            <p className="text-muted-foreground mb-6">
              Start referring talented professionals today and climb the ranks!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/careers/referrals">Browse Referral Jobs</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/careers/my-referrals">My Referrals</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
