'use client'

import { useState } from 'react'
import {
  Users,
  GraduationCap,
  Briefcase,
  BookOpen,
  Calendar,
  Globe,
  BarChart3,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const overviewStats = [
  { name: 'Total Users', value: '0', change: 0, icon: Users, color: 'text-blue-600 bg-blue-100' },
  { name: 'Active Courses', value: '0', change: 0, icon: GraduationCap, color: 'text-emerald-600 bg-emerald-100' },
  { name: 'Job Applications', value: '0', change: 0, icon: Briefcase, color: 'text-purple-600 bg-purple-100' },
  { name: 'Wiki Views', value: '0', change: 0, icon: BookOpen, color: 'text-amber-600 bg-amber-100' },
]

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('7d')

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
                  <div className="flex items-center gap-1 mt-2 text-sm text-slate-500">
                    <span>{stat.change}%</span>
                    <span>vs last period</span>
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
        {/* User Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle>User Activity</CardTitle>
            <CardDescription>Daily active users this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <BarChart3 className="w-12 h-12 text-slate-300 mb-4" />
              <p className="text-slate-500 font-medium">No activity data yet</p>
              <p className="text-sm text-slate-400 mt-1">User activity will appear here once tracked</p>
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
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Globe className="w-12 h-12 text-slate-300 mb-4" />
              <p className="text-slate-500 font-medium">No traffic data yet</p>
              <p className="text-sm text-slate-400 mt-1">Traffic sources will appear here once tracked</p>
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
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <GraduationCap className="w-12 h-12 text-slate-300 mb-4" />
                <p className="text-slate-500 font-medium">No course data yet</p>
                <p className="text-sm text-slate-400 mt-1">Course performance metrics will appear here</p>
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
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <BookOpen className="w-12 h-12 text-slate-300 mb-4" />
                <p className="text-slate-500 font-medium">No article data yet</p>
                <p className="text-sm text-slate-400 mt-1">Article performance metrics will appear here</p>
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
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <BarChart3 className="w-12 h-12 text-slate-300 mb-4" />
              <p className="text-slate-500 font-medium">No device data yet</p>
              <p className="text-sm text-slate-400 mt-1">Device breakdown will appear here once tracked</p>
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
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Globe className="w-12 h-12 text-slate-300 mb-4" />
              <p className="text-slate-500 font-medium">No geographic data yet</p>
              <p className="text-sm text-slate-400 mt-1">Geographic distribution will appear here once tracked</p>
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
                <p className="text-3xl font-bold">0</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-8">
              <div>
                <p className="text-slate-400 text-sm">On Academy</p>
                <p className="text-xl font-semibold">0</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">On Careers</p>
                <p className="text-xl font-semibold">0</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">On Wiki</p>
                <p className="text-xl font-semibold">0</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
