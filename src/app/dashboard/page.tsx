'use client'

import { useState } from 'react'
import Link from 'next/link'
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
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

// Mock user data
const userData = {
  name: 'Bekele Abera',
  email: 'bekele@example.com',
  avatar: null,
  memberSince: 'January 2024',
  streak: 7,
  totalPoints: 1250,
}

const enrolledCourses = [
  {
    id: '1',
    title: 'Introduction to Afaan Oromoo',
    progress: 75,
    lessonsCompleted: 9,
    totalLessons: 12,
    lastAccessed: '2 hours ago',
  },
  {
    id: '2',
    title: 'Oromo History: From Ancient Times',
    progress: 45,
    lessonsCompleted: 4,
    totalLessons: 8,
    lastAccessed: '1 day ago',
  },
  {
    id: '3',
    title: 'Gadaa System: Democratic Governance',
    progress: 10,
    lessonsCompleted: 1,
    totalLessons: 10,
    lastAccessed: '3 days ago',
  },
]

const savedJobs = [
  {
    id: '1',
    title: 'Software Engineer',
    company: 'Oromo Tech Solutions',
    location: 'Minneapolis, MN',
    savedDate: '2 days ago',
  },
  {
    id: '2',
    title: 'Community Outreach Coordinator',
    company: 'Oromo Community Center',
    location: 'Washington, DC',
    savedDate: '5 days ago',
  },
]

const recentActivity = [
  { type: 'lesson', action: 'Completed lesson "Basic Greetings"', time: '2 hours ago', icon: BookOpen },
  { type: 'quiz', action: 'Scored 95% on quiz', time: '3 hours ago', icon: Award },
  { type: 'job', action: 'Saved job "Software Engineer"', time: '2 days ago', icon: Briefcase },
  { type: 'article', action: 'Read "Gadaa System Overview"', time: '4 days ago', icon: FileText },
]

const notifications = [
  { title: 'New course available!', message: 'Check out "Advanced Afaan Oromoo"', time: '1 hour ago', unread: true },
  { title: 'Continue learning', message: 'You\'re 3 lessons away from completing your course', time: '1 day ago', unread: true },
  { title: 'Job alert', message: '5 new jobs match your preferences', time: '2 days ago', unread: false },
]

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview')

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
                  Keep up the great work! You&apos;re on a {userData.streak}-day learning streak.
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
              <Button variant="outline" className="relative">
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                  2
                </span>
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Courses Enrolled</p>
                    <p className="text-3xl font-bold">{enrolledCourses.length}</p>
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
                    <p className="text-3xl font-bold">{savedJobs.length}</p>
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
                    <p className="text-3xl font-bold">{userData.streak} days</p>
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
                    <p className="text-3xl font-bold">{userData.totalPoints}</p>
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
                    <CardContent className="space-y-4">
                      {enrolledCourses.slice(0, 2).map((course) => (
                        <div key={course.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                          <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <BookOpen className="w-6 h-6 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-slate-900 truncate">{course.title}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Progress value={course.progress} className="h-2 flex-1" />
                              <span className="text-sm text-slate-500">{course.progress}%</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">
                              {course.lessonsCompleted}/{course.totalLessons} lessons
                            </p>
                          </div>
                          <Button size="sm" asChild>
                            <Link href={`/academy/${course.id}`}>
                              <Play className="w-4 h-4" />
                            </Link>
                          </Button>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Actions & Notifications */}
                <div className="space-y-6">
                  {/* Quick Actions */}
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

                  {/* Notifications */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Notifications</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {notifications.slice(0, 3).map((notif, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-lg ${notif.unread ? 'bg-blue-50' : 'bg-slate-50'}`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-medium text-sm text-slate-900">{notif.title}</p>
                              <p className="text-xs text-slate-600">{notif.message}</p>
                            </div>
                            {notif.unread && (
                              <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />
                            )}
                          </div>
                          <p className="text-xs text-slate-400 mt-1">{notif.time}</p>
                        </div>
                      ))}
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
                <CardContent className="space-y-4">
                  {enrolledCourses.map((course) => (
                    <div key={course.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-8 h-8 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-slate-900">{course.title}</h4>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex-1">
                            <Progress value={course.progress} className="h-2" />
                          </div>
                          <span className="text-sm font-medium text-slate-700">{course.progress}%</span>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                          <span>{course.lessonsCompleted}/{course.totalLessons} lessons</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Last accessed {course.lastAccessed}
                          </span>
                        </div>
                      </div>
                      <Button asChild>
                        <Link href={`/academy/${course.id}`}>
                          Continue
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  ))}
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
                <CardContent className="space-y-4">
                  {savedJobs.map((job) => (
                    <div key={job.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-slate-900">{job.title}</h4>
                        <p className="text-sm text-slate-600">{job.company}</p>
                        <p className="text-sm text-slate-500">{job.location}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary" className="mb-2">
                          <Bookmark className="w-3 h-3 mr-1" />
                          Saved
                        </Badge>
                        <p className="text-xs text-slate-500">{job.savedDate}</p>
                      </div>
                      <Button asChild>
                        <Link href={`/careers/${job.id}`}>
                          View
                        </Link>
                      </Button>
                    </div>
                  ))}
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
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          activity.type === 'lesson' ? 'bg-blue-100' :
                          activity.type === 'quiz' ? 'bg-amber-100' :
                          activity.type === 'job' ? 'bg-emerald-100' :
                          'bg-purple-100'
                        }`}>
                          <activity.icon className={`w-5 h-5 ${
                            activity.type === 'lesson' ? 'text-blue-600' :
                            activity.type === 'quiz' ? 'text-amber-600' :
                            activity.type === 'job' ? 'text-emerald-600' :
                            'text-purple-600'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <p className="text-slate-900">{activity.action}</p>
                          <p className="text-sm text-slate-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
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
