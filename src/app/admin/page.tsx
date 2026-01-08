import { Users, GraduationCap, Briefcase, BookOpen, TrendingUp, Eye, UserPlus, FileText } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const stats = [
  { name: 'Total Users', value: '2,543', change: '+12%', icon: Users, color: 'text-blue-600 bg-blue-100' },
  { name: 'Active Courses', value: '48', change: '+3', icon: GraduationCap, color: 'text-green-600 bg-green-100' },
  { name: 'Job Listings', value: '156', change: '+8', icon: Briefcase, color: 'text-purple-600 bg-purple-100' },
  { name: 'Wiki Articles', value: '312', change: '+15', icon: BookOpen, color: 'text-orange-600 bg-orange-100' },
]

const recentActivity = [
  { type: 'user', action: 'New user registered', name: 'Chaltu Bekele', time: '5 minutes ago' },
  { type: 'course', action: 'Course published', name: 'Advanced Afaan Oromoo', time: '1 hour ago' },
  { type: 'job', action: 'New job posted', name: 'Software Engineer at Oromo Tech', time: '2 hours ago' },
  { type: 'article', action: 'Article submitted for review', name: 'History of the Gadaa System', time: '3 hours ago' },
  { type: 'user', action: 'New user registered', name: 'Abdii Tolessa', time: '4 hours ago' },
]

const pendingItems = [
  { type: 'article', title: 'Traditional Oromo Music Instruments', status: 'pending', submitted: '2 days ago' },
  { type: 'job', title: 'Community Manager Position', status: 'pending', submitted: '1 day ago' },
  { type: 'article', title: 'Oromo Marriage Customs', status: 'pending', submitted: '3 hours ago' },
]

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600">Welcome back! Here&apos;s what&apos;s happening on your platform.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1">{stat.change} this month</p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    activity.type === 'user' ? 'bg-blue-100 text-blue-600' :
                    activity.type === 'course' ? 'bg-green-100 text-green-600' :
                    activity.type === 'job' ? 'bg-purple-100 text-purple-600' :
                    'bg-orange-100 text-orange-600'
                  }`}>
                    {activity.type === 'user' && <UserPlus className="w-4 h-4" />}
                    {activity.type === 'course' && <GraduationCap className="w-4 h-4" />}
                    {activity.type === 'job' && <Briefcase className="w-4 h-4" />}
                    {activity.type === 'article' && <FileText className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900">{activity.action}</p>
                    <p className="text-sm text-slate-600 truncate">{activity.name}</p>
                  </div>
                  <span className="text-xs text-slate-500 shrink-0">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Moderation */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Moderation</CardTitle>
            <CardDescription>Items awaiting your review</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="capitalize">
                      {item.type}
                    </Badge>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{item.title}</p>
                      <p className="text-xs text-slate-500">Submitted {item.submitted}</p>
                    </div>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Eye className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Page Views Today</p>
                <p className="text-xl font-bold text-slate-900">12,543</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">New Users Today</p>
                <p className="text-xl font-bold text-slate-900">47</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Course Enrollments</p>
                <p className="text-xl font-bold text-slate-900">234</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
