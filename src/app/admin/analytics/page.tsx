'use client'

import { useState } from 'react'
import {
  Users,
  GraduationCap,
  Briefcase,
  BookOpen,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Globe,
  Monitor,
  Smartphone,
  Clock,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'

// Mock analytics data
const overviewStats = [
  { name: 'Total Users', value: '2,543', change: 12, trend: 'up', icon: Users, color: 'text-blue-600 bg-blue-100' },
  { name: 'Active Courses', value: '48', change: 6.5, trend: 'up', icon: GraduationCap, color: 'text-emerald-600 bg-emerald-100' },
  { name: 'Job Applications', value: '1,234', change: -3.2, trend: 'down', icon: Briefcase, color: 'text-purple-600 bg-purple-100' },
  { name: 'Wiki Views', value: '45.2K', change: 23.5, trend: 'up', icon: BookOpen, color: 'text-amber-600 bg-amber-100' },
]

const weeklyData = [
  { day: 'Mon', users: 120, pageViews: 3200, enrollments: 45 },
  { day: 'Tue', users: 145, pageViews: 4100, enrollments: 52 },
  { day: 'Wed', users: 132, pageViews: 3800, enrollments: 38 },
  { day: 'Thu', users: 156, pageViews: 4500, enrollments: 61 },
  { day: 'Fri', users: 189, pageViews: 5200, enrollments: 72 },
  { day: 'Sat', users: 98, pageViews: 2800, enrollments: 28 },
  { day: 'Sun', users: 87, pageViews: 2400, enrollments: 22 },
]

const topCourses = [
  { name: 'Introduction to Afaan Oromoo', enrollments: 456, completion: 72, rating: 4.8 },
  { name: 'Oromo History: From Ancient Times', enrollments: 312, completion: 65, rating: 4.6 },
  { name: 'Gadaa System: Democratic Governance', enrollments: 287, completion: 58, rating: 4.9 },
  { name: 'Oromo Cultural Traditions', enrollments: 234, completion: 81, rating: 4.7 },
  { name: 'Business Oromo: Professional Communication', enrollments: 198, completion: 45, rating: 4.5 },
]

const topArticles = [
  { title: 'The Gadaa System: Ancient Democratic Governance', views: 12500, shares: 234 },
  { title: 'Qubee Alphabet: Writing System', views: 8900, shares: 156 },
  { title: 'Irreecha: The Oromo Thanksgiving', views: 7600, shares: 189 },
  { title: 'Famous Oromo Historical Figures', views: 6200, shares: 98 },
  { title: 'Traditional Oromo Clothing', views: 5400, shares: 87 },
]

const trafficSources = [
  { source: 'Organic Search', percentage: 45, users: 1144 },
  { source: 'Direct', percentage: 28, users: 712 },
  { source: 'Social Media', percentage: 18, users: 458 },
  { source: 'Referral', percentage: 9, users: 229 },
]

const deviceStats = [
  { device: 'Desktop', icon: Monitor, percentage: 52, color: 'bg-blue-500' },
  { device: 'Mobile', icon: Smartphone, percentage: 42, color: 'bg-emerald-500' },
  { device: 'Tablet', icon: Monitor, percentage: 6, color: 'bg-amber-500' },
]

const geographicData = [
  { country: 'United States', users: 1245, flag: '🇺🇸' },
  { country: 'Ethiopia', users: 567, flag: '🇪🇹' },
  { country: 'Kenya', users: 234, flag: '🇰🇪' },
  { country: 'United Kingdom', users: 189, flag: '🇬🇧' },
  { country: 'Canada', users: 156, flag: '🇨🇦' },
]

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('7d')
  const maxUsers = Math.max(...weeklyData.map(d => d.users))

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analytics Dashboard</h1>
          <p className="text-slate-600">Comprehensive platform metrics and insights</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">Export Report</Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewStats.map((stat) => (
          <Card key={stat.name}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                  <div className={`flex items-center gap-1 mt-2 text-sm ${
                    stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {stat.trend === 'up' ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                    <span>{Math.abs(stat.change)}%</span>
                    <span className="text-slate-500">vs last period</span>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* User Activity Chart (Simple bar representation) */}
        <Card>
          <CardHeader>
            <CardTitle>User Activity</CardTitle>
            <CardDescription>Daily active users this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weeklyData.map((day) => (
                <div key={day.day} className="flex items-center gap-4">
                  <span className="w-10 text-sm text-slate-600">{day.day}</span>
                  <div className="flex-1 h-8 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-end pr-3"
                      style={{ width: `${(day.users / maxUsers) * 100}%` }}
                    >
                      <span className="text-xs text-white font-medium">{day.users}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <div>
                <p className="text-sm text-slate-600">Weekly Total</p>
                <p className="text-xl font-bold text-slate-900">
                  {weeklyData.reduce((sum, d) => sum + d.users, 0).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-1 text-emerald-600">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">+15.3% from last week</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
            <CardDescription>Where your users come from</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trafficSources.map((source) => (
                <div key={source.source}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">{source.source}</span>
                    <span className="text-sm text-slate-500">{source.users.toLocaleString()} users</span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                      style={{ width: `${source.percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{source.percentage}% of total traffic</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Performance */}
      <Tabs defaultValue="courses" className="space-y-4">
        <TabsList>
          <TabsTrigger value="courses">Top Courses</TabsTrigger>
          <TabsTrigger value="articles">Top Articles</TabsTrigger>
        </TabsList>

        <TabsContent value="courses">
          <Card>
            <CardHeader>
              <CardTitle>Course Performance</CardTitle>
              <CardDescription>Most popular courses by enrollment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topCourses.map((course, index) => (
                  <div key={course.name} className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 truncate">{course.name}</p>
                      <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                        <span>{course.enrollments} enrolled</span>
                        <span>{course.completion}% completion</span>
                        <span className="flex items-center gap-1">
                          <span className="text-amber-500">★</span>
                          {course.rating}
                        </span>
                      </div>
                    </div>
                    <Badge variant="secondary">{course.enrollments} students</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="articles">
          <Card>
            <CardHeader>
              <CardTitle>Article Performance</CardTitle>
              <CardDescription>Most viewed wiki articles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topArticles.map((article, index) => (
                  <div key={article.title} className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 truncate">{article.title}</p>
                      <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                        <span>{article.views.toLocaleString()} views</span>
                        <span>{article.shares} shares</span>
                      </div>
                    </div>
                    <Badge variant="secondary">{article.views.toLocaleString()} views</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Device & Geography */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Device Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Device Breakdown</CardTitle>
            <CardDescription>User access by device type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center gap-8 mb-6">
              {deviceStats.map((device) => (
                <div key={device.device} className="text-center">
                  <div className={`w-16 h-16 rounded-full ${device.color} flex items-center justify-center mx-auto mb-2`}>
                    <device.icon className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{device.percentage}%</p>
                  <p className="text-sm text-slate-600">{device.device}</p>
                </div>
              ))}
            </div>
            <div className="h-4 bg-slate-100 rounded-full overflow-hidden flex">
              {deviceStats.map((device) => (
                <div
                  key={device.device}
                  className={`h-full ${device.color} first:rounded-l-full last:rounded-r-full`}
                  style={{ width: `${device.percentage}%` }}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Geographic Distribution */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-slate-600" />
              <CardTitle>Geographic Distribution</CardTitle>
            </div>
            <CardDescription>Users by country</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {geographicData.map((country, index) => (
                <div key={country.country} className="flex items-center gap-4">
                  <span className="text-2xl">{country.flag}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-slate-700">{country.country}</span>
                      <span className="text-sm text-slate-500">{country.users.toLocaleString()}</span>
                    </div>
                    <Progress
                      value={(country.users / geographicData[0].users) * 100}
                      className="h-2"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Stats */}
      <Card className="bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
              <div>
                <p className="text-slate-300 text-sm">Real-time Active Users</p>
                <p className="text-3xl font-bold">127</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-8">
              <div>
                <p className="text-slate-400 text-sm">On Academy</p>
                <p className="text-xl font-semibold">54</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">On Careers</p>
                <p className="text-xl font-semibold">38</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">On Wiki</p>
                <p className="text-xl font-semibold">35</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
