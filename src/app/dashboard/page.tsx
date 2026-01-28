'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  BookOpen,
  Briefcase,
  FileText,
  TrendingUp,
  Clock,
  Award,
  ChevronRight,
  Play,
  Bookmark,
  Target,
  Calendar,
  Bell,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { createClient } from '@/lib/supabase/client'

interface UserData {
  name: string
  email: string
  avatar: string | null
  memberSince: string
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name, avatar_url, created_at')
        .eq('id', user.id)
        .single() as { data: { display_name: string | null; avatar_url: string | null; created_at: string } | null }

      setUserData({
        name: profile?.display_name || user.user_metadata?.display_name || user.email?.split('@')[0] || 'User',
        email: user.email || '',
        avatar: profile?.avatar_url || user.user_metadata?.avatar_url || null,
        memberSince: new Date(profile?.created_at || user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      })

      setLoading(false)
    }

    loadUser()
  }, [router])

  if (loading || !userData) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 py-8">
        <div className="mx-auto max-w-7xl px-4">
          {/* Welcome Header */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={userData.avatar || undefined} />
                <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xl">
                  {userData.name[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                  Welcome back, {userData.name.split(' ')[0]}!
                </h1>
                <p className="text-slate-600">
                  Member since {userData.memberSince}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button asChild>
                <Link href="/academy">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Continue Learning
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Courses</p>
                    <p className="text-3xl font-bold">0</p>
                  </div>
                  <BookOpen className="w-10 h-10 text-blue-200" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-100 text-sm">Jobs Saved</p>
                    <p className="text-3xl font-bold">0</p>
                  </div>
                  <Briefcase className="w-10 h-10 text-emerald-200" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-amber-100 text-sm">Learning Streak</p>
                    <p className="text-3xl font-bold">0 days</p>
                  </div>
                  <TrendingUp className="w-10 h-10 text-amber-200" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Total Points</p>
                    <p className="text-3xl font-bold">0</p>
                  </div>
                  <Award className="w-10 h-10 text-purple-200" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-white shadow-sm">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="courses">My Courses</TabsTrigger>
              <TabsTrigger value="jobs">Saved Jobs</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Continue Learning */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle>Continue Learning</CardTitle>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href="/academy">
                            View all
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Link>
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8 text-slate-500">
                        <BookOpen className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                        <p>No courses started yet.</p>
                        <Button variant="outline" size="sm" className="mt-3" asChild>
                          <Link href="/academy">Browse Courses</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Actions */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm" className="justify-start" asChild>
                        <Link href="/academy">
                          <Target className="w-4 h-4 mr-2" />
                          Browse Courses
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" className="justify-start" asChild>
                        <Link href="/careers">
                          <Briefcase className="w-4 h-4 mr-2" />
                          Find Jobs
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" className="justify-start" asChild>
                        <Link href="/wiki">
                          <FileText className="w-4 h-4 mr-2" />
                          Read Wiki
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" className="justify-start" asChild>
                        <Link href="/profile/edit">
                          <Calendar className="w-4 h-4 mr-2" />
                          Edit Profile
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Courses Tab */}
            <TabsContent value="courses">
              <Card>
                <CardHeader>
                  <CardTitle>My Enrolled Courses</CardTitle>
                  <CardDescription>Track your progress across all enrolled courses</CardDescription>
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

            {/* Jobs Tab */}
            <TabsContent value="jobs">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Saved Jobs</CardTitle>
                      <CardDescription>Jobs you&apos;ve bookmarked for later</CardDescription>
                    </div>
                    <Button asChild>
                      <Link href="/careers">
                        Browse More Jobs
                      </Link>
                    </Button>
                  </div>
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

            {/* Activity Tab */}
            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your learning and engagement history</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-slate-500">
                    <Clock className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                    <p>No recent activity.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}
