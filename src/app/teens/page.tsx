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
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

// Mock user data
const userData = {
  name: 'Amina',
  gradeLevel: '11',
  streakDays: 12,
  coursesInProgress: 3,
  completedCourses: 8,
  totalPoints: 2450,
}

// Mock courses for the grade level
const recommendedCourses = [
  {
    id: '1',
    title: 'SAT Math Prep',
    description: 'Master the math concepts tested on the SAT',
    category: 'Test Prep',
    progress: 45,
    duration: '8 weeks',
    thumbnail: null,
  },
  {
    id: '2',
    title: 'Essay Writing Mastery',
    description: 'Learn to write compelling college application essays',
    category: 'Writing',
    progress: 20,
    duration: '4 weeks',
    thumbnail: null,
  },
  {
    id: '3',
    title: 'Oromo History & Culture',
    description: 'Explore the rich history and traditions of the Oromo people',
    category: 'Culture',
    progress: 0,
    duration: '6 weeks',
    thumbnail: null,
  },
]

// Mock college prep timeline
const collegeTimeline = [
  { grade: '9', tasks: ['Explore interests', 'Join clubs', 'Focus on grades'], current: false },
  { grade: '10', tasks: ['Take PSAT', 'Build extracurriculars', 'Research colleges'], current: false },
  { grade: '11', tasks: ['Take SAT/ACT', 'Visit colleges', 'Start essays'], current: true },
  { grade: '12', tasks: ['Apply to colleges', 'Financial aid', 'Make decision'], current: false },
]

// Mock upcoming deadlines
const deadlines = [
  { title: 'SAT Registration', date: 'Jan 15', urgent: true },
  { title: 'Scholarship Application', date: 'Feb 1', urgent: false },
  { title: 'College Fair', date: 'Feb 10', urgent: false },
]

// Mock community activity
const communityPosts = [
  { id: '1', author: 'Mohamed A.', avatar: 'M', content: 'Just got accepted to my dream college! 🎉', likes: 45, time: '2h ago' },
  { id: '2', author: 'Sara T.', avatar: 'S', content: 'Anyone have tips for the AP History exam?', likes: 12, time: '5h ago' },
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
      <p className="text-amber-800">That section is for adults only. Here&apos;s your teen dashboard!</p>
    </div>
  )
}

export default function TeensHomePage() {
  return (
    <div className="py-8 px-4">
      <div className="mx-auto max-w-7xl">
        {/* Restricted Alert */}
        <Suspense fallback={null}>
          <RestrictedAlert />
        </Suspense>

        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Welcome back, {userData.name}! 👋
          </h1>
          <p className="text-slate-600">
            Grade {userData.gradeLevel} • {userData.streakDays} day learning streak 🔥
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{userData.coursesInProgress}</p>
                  <p className="text-sm text-slate-500">In Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{userData.completedCourses}</p>
                  <p className="text-sm text-slate-500">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Star className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{userData.totalPoints.toLocaleString()}</p>
                  <p className="text-sm text-slate-500">Points</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{userData.streakDays}</p>
                  <p className="text-sm text-slate-500">Day Streak</p>
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
                  <Link href="/academy">
                    View All <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </div>
              <div className="space-y-4">
                {recommendedCourses.map((course) => (
                  <Link key={course.id} href={`/academy/courses/${course.id}`}>
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                            <BookOpen className="w-10 h-10 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                  {course.category}
                                </span>
                                <h3 className="font-semibold text-slate-900 mt-1">{course.title}</h3>
                                <p className="text-sm text-slate-600 line-clamp-1">{course.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 mt-3">
                              <div className="flex-1">
                                <div className="w-full bg-slate-200 rounded-full h-2">
                                  <div
                                    className="bg-blue-600 h-2 rounded-full"
                                    style={{ width: `${course.progress}%` }}
                                  />
                                </div>
                              </div>
                              <span className="text-sm text-slate-500">{course.progress}%</span>
                              <span className="text-sm text-slate-400 flex items-center gap-1">
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
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-stretch justify-between relative">
                    {/* Progress Line */}
                    <div className="absolute top-6 left-0 right-0 h-1 bg-slate-200">
                      <div
                        className="h-1 bg-blue-600"
                        style={{ width: `${((parseInt(userData.gradeLevel) - 9) / 3) * 100}%` }}
                      />
                    </div>

                    {collegeTimeline.map((item, i) => (
                      <div key={item.grade} className="flex flex-col items-center relative z-10 flex-1">
                        <div
                          className={cn(
                            'w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all',
                            item.current
                              ? 'bg-blue-600 text-white scale-110 shadow-lg'
                              : parseInt(item.grade) <= parseInt(userData.gradeLevel)
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-200 text-slate-400'
                          )}
                        >
                          {item.grade}
                        </div>
                        <div className={cn(
                          'mt-3 text-center',
                          item.current ? 'font-medium' : ''
                        )}>
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
                  <Link href="/community/teens">
                    Join Discussion <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </div>
              <div className="space-y-4">
                {communityPosts.map((post) => (
                  <Card key={post.id}>
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
                            <button className="hover:text-blue-600">❤️ {post.likes}</button>
                            <button className="hover:text-blue-600">💬 Reply</button>
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
            <Card>
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
                      <p className={cn(
                        'font-medium',
                        deadline.urgent ? 'text-red-700' : 'text-slate-700'
                      )}>
                        {deadline.title}
                      </p>
                      <p className="text-sm text-slate-500">{deadline.date}</p>
                    </div>
                    {deadline.urgent && (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                        Soon!
                      </span>
                    )}
                  </div>
                ))}
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/teens/college-prep">View All</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
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
                  <Link href="/community/teens">
                    <Users className="w-4 h-4 mr-2" />
                    Community
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Grade-Specific Resources */}
            <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              <CardContent className="pt-6">
                <h3 className="font-bold text-lg mb-2">11th Grade Resources</h3>
                <p className="text-white/80 text-sm mb-4">
                  This is a crucial year! Start preparing for standardized tests and researching colleges.
                </p>
                <Button variant="secondary" className="w-full" asChild>
                  <Link href="/teens/college-prep">
                    Start Preparing
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
