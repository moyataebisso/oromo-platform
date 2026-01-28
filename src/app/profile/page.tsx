'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Settings, BookOpen, Briefcase, FileText, Calendar, MapPin, Mail, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ProfileCompletion } from '@/components/profile/profile-completion'
import { createClient } from '@/lib/supabase/client'

interface ProfileData {
  id: string
  email: string
  display_name: string | null
  username: string | null
  bio: string | null
  avatar_url: string | null
  role: string
  created_at: string
  location?: string | null
  phone?: string | null
  website?: string | null
  linkedin_url?: string | null
  skills?: string[] | null
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadProfile = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (data) {
        const profileRow = data as unknown as ProfileData
        setProfile({
          ...profileRow,
          email: user.email || profileRow.email,
        })
      } else {
        // Fallback: use auth user data if no profile row exists
        setProfile({
          id: user.id,
          email: user.email || '',
          display_name: user.user_metadata?.display_name || user.email?.split('@')[0] || 'User',
          username: null,
          bio: null,
          avatar_url: user.user_metadata?.avatar_url || null,
          role: 'user',
          created_at: user.created_at,
        })
      }

      setLoading(false)
    }

    loadProfile()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    )
  }

  if (!profile) {
    return null
  }

  const displayName = profile.display_name || profile.email.split('@')[0]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* Profile Header */}
              <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={profile.avatar_url || undefined} />
                  <AvatarFallback className="text-2xl">{displayName[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-slate-900">{displayName}</h1>
                      {profile.username && (
                        <p className="text-slate-600">@{profile.username}</p>
                      )}
                      {profile.role === 'admin' && (
                        <Badge className="mt-1 bg-red-100 text-red-700">Admin</Badge>
                      )}
                    </div>
                    <Button variant="outline" asChild>
                      <Link href="/profile/edit">
                        <Settings className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Link>
                    </Button>
                  </div>
                  {profile.bio && (
                    <p className="mt-3 text-slate-700">{profile.bio}</p>
                  )}
                  <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-600">
                    {profile.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {profile.location}
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {profile.email}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Joined {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="courses" className="space-y-6">
            <TabsList>
              <TabsTrigger value="courses">My Courses</TabsTrigger>
              <TabsTrigger value="jobs">Saved Jobs</TabsTrigger>
              <TabsTrigger value="contributions">Contributions</TabsTrigger>
            </TabsList>

            <TabsContent value="courses">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Enrolled Courses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-slate-500">
                    <BookOpen className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                    <p>No courses enrolled yet.</p>
                    <Button variant="outline" size="sm" className="mt-3" asChild>
                      <Link href="/academy">Browse Courses</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="jobs">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Saved Jobs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-slate-500">
                    <Briefcase className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                    <p>No saved jobs yet.</p>
                    <Button variant="outline" size="sm" className="mt-3" asChild>
                      <Link href="/careers">Browse Jobs</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contributions">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Wiki Contributions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-slate-500">
                    <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                    <p>No contributions yet.</p>
                    <Button variant="outline" size="sm" className="mt-3" asChild>
                      <Link href="/wiki">Explore Wiki</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
            </div>

            {/* Sidebar with Profile Completion */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <ProfileCompletion profile={profile} />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
