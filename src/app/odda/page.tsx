import Link from 'next/link'
import { Users, Briefcase, Globe, ArrowRight, UserPlus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'
import { getOddaStats, getFeaturedMembers, hasProfile, getMyProfile, getSuggestedConnections } from '@/lib/supabase/odda'
import { ProfileCard } from '@/components/odda'

export default async function OddaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [stats, featuredMembers, userHasProfile] = await Promise.all([
    getOddaStats(),
    getFeaturedMembers(6),
    user ? hasProfile() : false
  ])

  // Get suggestions if user has a profile
  let suggestions: Awaited<ReturnType<typeof getSuggestedConnections>> = []
  let myProfile: Awaited<ReturnType<typeof getMyProfile>> = null
  if (user && userHasProfile) {
    [suggestions, myProfile] = await Promise.all([
      getSuggestedConnections(4),
      getMyProfile()
    ])
  }

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary/20 via-primary/10 to-background overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="mx-auto max-w-7xl px-4 py-16 md:py-24 relative">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              ODDA Professional Network
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Connect with Oromo professionals worldwide. Build meaningful relationships,
              discover opportunities, and grow your career within our global community.
            </p>

            {user ? (
              userHasProfile ? (
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" asChild>
                    <Link href={`/odda/profile/${user.id}`}>
                      View My Profile
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/odda/members">
                      <Search className="w-4 h-4 mr-2" />
                      Find Connections
                    </Link>
                  </Button>
                </div>
              ) : (
                <Button size="lg" asChild>
                  <Link href="/odda/profile/create">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Create Your Profile
                  </Link>
                </Button>
              )
            ) : (
              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild>
                  <Link href="/signup?redirect=/odda/profile/create">
                    Get Started Free
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/login?redirect=/odda">
                    Sign In
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <main className="py-12 px-4">
        <div className="mx-auto max-w-7xl">
          {/* Stats */}
          <div className="grid sm:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{stats.members.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Members</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Globe className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{stats.connections.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Connections Made</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-500/10 rounded-lg">
                    <Briefcase className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{stats.openToWork.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Open to Work</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Suggested Connections (for users with profiles) */}
          {user && userHasProfile && suggestions.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">People You May Know</h2>
                <Button variant="ghost" asChild>
                  <Link href="/odda/members">
                    View All
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {suggestions.map(profile => (
                  <ProfileCard
                    key={profile.id}
                    profile={profile}
                    showConnectButton={true}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Featured Members */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Featured Members</h2>
              <Button variant="ghost" asChild>
                <Link href="/odda/members">
                  View All Members
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
            {featuredMembers.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredMembers.map(profile => (
                  <ProfileCard
                    key={profile.id}
                    profile={profile}
                    showConnectButton={!!user && profile.user_id !== user.id}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Users className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Be the first to join!</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your professional profile and start building your network.
                  </p>
                  {user && !userHasProfile && (
                    <Button asChild>
                      <Link href="/odda/profile/create">Create Profile</Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </section>

          {/* Features */}
          <section>
            <h2 className="text-2xl font-bold mb-6 text-center">Why Join ODDA?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Build Your Network
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  Connect with Oromo professionals across industries and locations.
                  Grow your network with meaningful connections.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-primary" />
                    Find Opportunities
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  Discover job opportunities, mentorship, and collaboration
                  within the Oromo professional community.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-primary" />
                    Global Community
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  Join a worldwide network of Oromo diaspora professionals
                  united in supporting each other&apos;s success.
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
