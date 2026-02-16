'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  GraduationCap,
  BookOpen,
  Briefcase,
  Users,
  Trophy,
  ArrowRight,
  Clock,
  Target,
  Calendar,
  Star,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Rocket,
  Shield,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

interface UserProfile {
  id: string
  email: string
  display_name: string | null
}

interface TeenProfile {
  grade_level: number | null
  total_points: number | null
  streak_days: number | null
}

interface UserStats {
  coursesInProgress: number
  completedCourses: number
}

// Sample courses for exploration
const sampleCourses = [
  {
    id: '1',
    slug: 'sat-math-prep',
    title: 'SAT Math Prep',
    description: 'Master the math concepts tested on the SAT',
    category: 'Test Prep',
    duration: '8 weeks',
  },
  {
    id: '2',
    slug: 'essay-writing-mastery',
    title: 'Essay Writing Mastery',
    description: 'Learn to write compelling college application essays',
    category: 'Writing',
    duration: '4 weeks',
  },
  {
    id: '3',
    slug: 'oromo-history-culture',
    title: 'Oromo History & Culture',
    description: 'Explore the rich history and traditions of the Oromo people',
    category: 'Culture',
    duration: '6 weeks',
  },
]

// College prep timeline
const collegeTimeline = [
  { grade: '9', tasks: ['Explore interests', 'Join clubs', 'Focus on grades'], current: false },
  { grade: '10', tasks: ['Take PSAT', 'Build extracurriculars', 'Research colleges'], current: false },
  { grade: '11', tasks: ['Take SAT/ACT', 'Visit colleges', 'Start essays'], current: false },
  { grade: '12', tasks: ['Apply to colleges', 'Financial aid', 'Make decision'], current: false },
]

// Platform stats
const platformStats = [
  { label: 'Active Students', value: '2,500+', icon: Users },
  { label: 'Free Courses', value: '50+', icon: BookOpen },
  { label: 'Scholarships Listed', value: '100+', icon: Trophy },
  { label: 'College Acceptances', value: '500+', icon: GraduationCap },
]

// Features for guests
const features = [
  {
    icon: BookOpen,
    title: 'Free SAT Prep',
    description: 'Practice tests, video lessons, and study guides',
  },
  {
    icon: GraduationCap,
    title: 'College Guidance',
    description: 'Application help, essay reviews, and deadlines',
  },
  {
    icon: Briefcase,
    title: 'Career Exploration',
    description: 'Internships, mentorship, and career paths',
  },
  {
    icon: Users,
    title: 'Teen Community',
    description: 'Connect with other Oromo students worldwide',
  },
]

function RestrictedAlert() {
  const searchParams = useSearchParams()
  const [showRestricted, setShowRestricted] = useState(false)

  useEffect(() => {
    if (searchParams.get('restricted') === 'true') {
      setShowRestricted(true)
      const timer = setTimeout(() => setShowRestricted(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [searchParams])

  if (!showRestricted) return null

  return (
    <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-3">
      <AlertCircle className="w-5 h-5 text-amber-600" />
      <p className="text-amber-800">That section is for adults only. Here&apos;s the teen section!</p>
    </div>
  )
}

// Guest Hero Section
function GuestHero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-2xl p-8 md:p-12 text-white mb-8">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <Rocket className="w-6 h-6" />
          <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
            For Oromo Teens
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Level Up Your Future
        </h1>
        <p className="text-xl text-white/90 mb-6 max-w-2xl">
          Free SAT prep, college guidance, and career exploration designed for Oromo students.
          Join thousands of teens building their path to success.
        </p>
        <div className="flex flex-wrap gap-4 mb-8">
          <Button size="lg" className="bg-white text-blue-700 hover:bg-white/90" asChild>
            <Link href="/teens/courses">
              <BookOpen className="w-5 h-5 mr-2" />
              Start Learning
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
            <Link href="/signup?redirect=/teens">
              Sign Up Free
            </Link>
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-6 text-sm text-white/80">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            No account required
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            Free forever
          </span>
          <span className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-green-400" />
            Safe for teens
          </span>
        </div>
      </div>
    </div>
  )
}

// Guest Stats Section
function GuestStats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {platformStats.map((stat, i) => {
        const Icon = stat.icon
        return (
          <Card key={i} className="bg-white border-slate-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Icon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  <p className="text-sm text-slate-600">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

// Guest Features Section
function GuestFeatures() {
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
        Everything You Need to Succeed
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((feature, i) => {
          const Icon = feature.icon
          return (
            <Card key={i} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-600">{feature.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}

// Guest Courses Preview
function GuestCoursesPreview() {
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-slate-900">Popular Courses</h2>
        <Button variant="ghost" asChild>
          <Link href="/teens/courses">
            Browse All <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </Button>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {sampleCourses.map((course) => (
          <Link key={course.id} href={`/teens/courses/${course.slug}`}>
            <Card className="hover:shadow-md transition-shadow h-full">
              <CardContent className="p-0">
                <div className="h-32 bg-gradient-to-br from-blue-500 to-purple-500 rounded-t-lg flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-white" />
                </div>
                <div className="p-4">
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                    {course.category}
                  </span>
                  <h3 className="font-semibold text-slate-900 mt-2">{course.title}</h3>
                  <p className="text-sm text-slate-600 mt-1 line-clamp-2">{course.description}</p>
                  <div className="flex items-center gap-2 mt-3 text-sm text-slate-500">
                    <Clock className="w-4 h-4" />
                    {course.duration}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}

// Guest CTA Section
function GuestCTA() {
  return (
    <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0">
      <CardContent className="p-8 text-center text-white">
        <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-80" />
        <h2 className="text-2xl font-bold mb-2">Ready to Start Your Journey?</h2>
        <p className="text-white/80 mb-6 max-w-md mx-auto">
          Create a free account to track your progress, save courses, and connect with other students.
        </p>
        <div className="flex justify-center gap-4">
          <Button size="lg" className="bg-white text-blue-700 hover:bg-white/90" asChild>
            <Link href="/signup?redirect=/teens">Create Free Account</Link>
          </Button>
          <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
            <Link href="/teens/courses">Continue as Guest</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Logged In Dashboard
function LoggedInDashboard({
  user,
  teenProfile,
  stats,
}: {
  user: UserProfile
  teenProfile: TeenProfile | null
  stats: UserStats
}) {
  const displayName = user.display_name || user.email?.split('@')[0] || 'Student'
  const gradeLevel = teenProfile?.grade_level || 11
  const streakDays = teenProfile?.streak_days || 0
  const totalPoints = teenProfile?.total_points || 0

  // Update timeline based on user's grade
  const userTimeline = collegeTimeline.map((item) => ({
    ...item,
    current: parseInt(item.grade) === gradeLevel,
  }))

  // Sample courses with progress for logged in users
  const userCourses = [
    { ...sampleCourses[0], progress: 45 },
    { ...sampleCourses[1], progress: 20 },
    { ...sampleCourses[2], progress: 0 },
  ]

  // Sample deadlines
  const deadlines = [
    { title: 'SAT Registration', date: 'Jan 15', urgent: true },
    { title: 'Scholarship Application', date: 'Feb 1', urgent: false },
    { title: 'College Fair', date: 'Feb 10', urgent: false },
  ]

  // Sample community posts
  const communityPosts = [
    { id: '1', author: 'Mohamed A.', avatar: 'M', content: 'Just got accepted to my dream college!', likes: 45, time: '2h ago' },
    { id: '2', author: 'Sara T.', avatar: 'S', content: 'Anyone have tips for the AP History exam?', likes: 12, time: '5h ago' },
  ]

  return (
    <>
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Welcome back, {displayName}!
        </h1>
        <p className="text-slate-600">
          Grade {gradeLevel} {streakDays > 0 && `• ${streakDays} day learning streak`}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-white">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.coursesInProgress}</p>
                <p className="text-sm text-slate-600">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.completedCourses}</p>
                <p className="text-sm text-slate-600">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{totalPoints.toLocaleString()}</p>
                <p className="text-sm text-slate-600">Points</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{streakDays}</p>
                <p className="text-sm text-slate-600">Day Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Continue Learning */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">Continue Learning</h2>
              <Button variant="ghost" asChild>
                <Link href="/teens/courses">
                  View All <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
            <div className="space-y-4">
              {userCourses.map((course) => (
                <Link key={course.id} href={`/teens/courses/${course.slug}`}>
                  <Card className="hover:shadow-md transition-shadow bg-white">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center shrink-0">
                          <BookOpen className="w-10 h-10 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                            {course.category}
                          </span>
                          <h3 className="font-semibold text-slate-900 mt-1">{course.title}</h3>
                          <p className="text-sm text-slate-600 line-clamp-1">{course.description}</p>
                          <div className="flex items-center gap-4 mt-3">
                            <div className="flex-1">
                              <div className="w-full bg-slate-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full transition-all"
                                  style={{ width: `${course.progress}%` }}
                                />
                              </div>
                            </div>
                            <span className="text-sm font-medium text-slate-700">{course.progress}%</span>
                            <span className="text-sm text-slate-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {course.duration}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>

          {/* College Prep Timeline */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-600" />
                Your College Prep Journey
              </h2>
              <Button variant="outline" asChild>
                <Link href="/teens/college-prep">
                  Full Guide <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="flex items-stretch justify-between relative">
                  {/* Progress Line */}
                  <div className="absolute top-6 left-0 right-0 h-1 bg-slate-200">
                    <div
                      className="h-1 bg-blue-600 transition-all"
                      style={{ width: `${((gradeLevel - 9) / 3) * 100}%` }}
                    />
                  </div>

                  {userTimeline.map((item) => (
                    <div key={item.grade} className="flex flex-col items-center relative z-10 flex-1">
                      <div
                        className={cn(
                          'w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all',
                          item.current
                            ? 'bg-blue-600 text-white scale-110 shadow-lg ring-4 ring-blue-200'
                            : parseInt(item.grade) <= gradeLevel
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-200 text-slate-500'
                        )}
                      >
                        {item.grade}
                      </div>
                      <div className={cn('mt-3 text-center', item.current ? 'font-medium' : '')}>
                        {item.current && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full mb-1 inline-block">
                            You are here
                          </span>
                        )}
                        <ul className="text-xs text-slate-600 mt-1 space-y-0.5">
                          {item.tasks.slice(0, 2).map((task, j) => (
                            <li key={j}>{task}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Community Preview */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                Community
              </h2>
              <Button variant="ghost" asChild>
                <Link href="/teens/community">
                  Join Discussion <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
            <div className="space-y-4">
              {communityPosts.map((post) => (
                <Card key={post.id} className="bg-white">
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center font-semibold text-purple-700">
                        {post.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-900">{post.author}</span>
                          <span className="text-sm text-slate-400">{post.time}</span>
                        </div>
                        <p className="text-slate-700 mt-1">{post.content}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                          <button className="hover:text-blue-600 transition-colors">❤️ {post.likes}</button>
                          <button className="hover:text-blue-600 transition-colors">💬 Reply</button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Deadlines */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="w-5 h-5 text-red-500" />
                Upcoming Deadlines
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {deadlines.map((deadline, i) => (
                <div
                  key={i}
                  className={cn(
                    'flex items-center justify-between p-3 rounded-lg',
                    deadline.urgent ? 'bg-red-50' : 'bg-slate-50'
                  )}
                >
                  <div>
                    <p
                      className={cn(
                        'font-medium',
                        deadline.urgent ? 'text-red-700' : 'text-slate-700'
                      )}
                    >
                      {deadline.title}
                    </p>
                    <p className="text-sm text-slate-500">{deadline.date}</p>
                  </div>
                  {deadline.urgent && (
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">Soon!</span>
                  )}
                </div>
              ))}
              <Button variant="outline" className="w-full" asChild>
                <Link href="/teens/college-prep">View All</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-lg">Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/teens/college-prep">
                  <Target className="w-4 h-4 mr-2" />
                  SAT Prep
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/teens/college-prep#scholarships">
                  <Trophy className="w-4 h-4 mr-2" />
                  Scholarships
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/careers">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Internships
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/teens/community">
                  <Users className="w-4 h-4 mr-2" />
                  Community
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Grade-Specific Resources */}
          <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white border-0">
            <CardContent className="pt-6">
              <h3 className="font-bold text-lg mb-2">Grade {gradeLevel} Resources</h3>
              <p className="text-white/80 text-sm mb-4">
                {gradeLevel === 9 && 'Start exploring your interests and building good study habits.'}
                {gradeLevel === 10 && 'Time to take the PSAT and start thinking about college.'}
                {gradeLevel === 11 && 'This is a crucial year! Focus on standardized tests and college research.'}
                {gradeLevel === 12 && 'Senior year! Time to finalize applications and make your choice.'}
                {gradeLevel < 9 && 'Get a head start on your academic journey!'}
                {gradeLevel > 12 && 'Explore resources for college students and graduates.'}
              </p>
              <Button variant="secondary" className="w-full" asChild>
                <Link href="/teens/college-prep">Start Preparing</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

export default function TeensHomePage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [teenProfile, setTeenProfile] = useState<TeenProfile | null>(null)
  const [stats, setStats] = useState<UserStats>({ coursesInProgress: 0, completedCourses: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user) {
          // Get user profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('id, email, display_name')
            .eq('id', session.user.id)
            .single()

          if (profile) {
            setUser(profile)

            // Get teen profile
            const { data: teen } = await supabase
              .from('teen_profiles')
              .select('grade_level, total_points, streak_days')
              .eq('user_id', session.user.id)
              .single()

            if (teen) {
              setTeenProfile(teen)
            }

            // Get course stats (example - adjust based on your schema)
            const { count: inProgress } = await supabase
              .from('course_enrollments')
              .select('*', { count: 'exact', head: true })
              .eq('user_id', session.user.id)
              .eq('status', 'in_progress')

            const { count: completed } = await supabase
              .from('course_enrollments')
              .select('*', { count: 'exact', head: true })
              .eq('user_id', session.user.id)
              .eq('status', 'completed')

            setStats({
              coursesInProgress: inProgress || 0,
              completedCourses: completed || 0,
            })
          }
        }
      } catch (error) {
        console.error('Auth check error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null)
        setTeenProfile(null)
        setStats({ coursesInProgress: 0, completedCourses: 0 })
      } else if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, email, display_name')
          .eq('id', session.user.id)
          .single()

        if (profile) {
          setUser(profile)
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  if (isLoading) {
    return (
      <div className="py-8 px-4">
        <div className="mx-auto max-w-7xl">
          {/* Loading skeleton */}
          <div className="animate-pulse">
            <div className="h-64 bg-slate-200 rounded-2xl mb-8" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-slate-200 rounded-lg" />
              ))}
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-slate-200 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-8 px-4">
      <div className="mx-auto max-w-7xl">
        {/* Restricted Alert */}
        <Suspense fallback={null}>
          <RestrictedAlert />
        </Suspense>

        {user ? (
          // Logged in user dashboard
          <LoggedInDashboard user={user} teenProfile={teenProfile} stats={stats} />
        ) : (
          // Guest mode
          <>
            <GuestHero />
            <GuestStats />
            <GuestFeatures />
            <GuestCoursesPreview />
            <GuestCTA />
          </>
        )}
      </div>
    </div>
  )
}
