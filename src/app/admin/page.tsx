import Link from 'next/link'
import {
  Users,
  GraduationCap,
  Briefcase,
  BookOpen,
  TrendingUp,
  Eye,
  UserPlus,
  FileText,
  Calendar,
  Link2,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const stats = [
  { name: 'Total Users', value: '2,543', change: '+12%', trend: 'up', icon: Users, color: 'from-blue-500 to-cyan-500' },
  { name: 'Active Courses', value: '48', change: '+3', trend: 'up', icon: GraduationCap, color: 'from-emerald-500 to-green-500' },
  { name: 'Job Listings', value: '156', change: '+8', trend: 'up', icon: Briefcase, color: 'from-purple-500 to-indigo-500' },
  { name: 'Wiki Articles', value: '312', change: '+15', trend: 'up', icon: BookOpen, color: 'from-orange-500 to-amber-500' },
  { name: 'Events', value: '24', change: '+5', trend: 'up', icon: Calendar, color: 'from-pink-500 to-rose-500' },
  { name: 'Resources', value: '86', change: '+12', trend: 'up', icon: Link2, color: 'from-indigo-500 to-purple-500' },
]

const recentActivity = [
  { type: 'user', action: 'New user registered', name: 'Chaltu Bekele', time: '5 minutes ago', status: 'success' },
  { type: 'course', action: 'Course published', name: 'Advanced Afaan Oromoo', time: '1 hour ago', status: 'success' },
  { type: 'job', action: 'New job posted', name: 'Software Engineer at Oromo Tech', time: '2 hours ago', status: 'pending' },
  { type: 'event', action: 'Event submitted', name: 'Oromo Cultural Festival 2026', time: '3 hours ago', status: 'pending' },
  { type: 'article', action: 'Article submitted for review', name: 'History of the Gadaa System', time: '3 hours ago', status: 'pending' },
  { type: 'resource', action: 'Resource added', name: 'Oromo Language Institute', time: '4 hours ago', status: 'success' },
]

const pendingItems = [
  { type: 'event', title: 'Oromo Cultural Festival 2026', status: 'pending', submitted: '1 hour ago', priority: 'high' },
  { type: 'article', title: 'Traditional Oromo Music Instruments', status: 'pending', submitted: '2 days ago', priority: 'medium' },
  { type: 'job', title: 'Community Manager Position', status: 'pending', submitted: '1 day ago', priority: 'low' },
  { type: 'resource', title: 'Oromo Business Directory', status: 'pending', submitted: '5 hours ago', priority: 'medium' },
  { type: 'article', title: 'Oromo Marriage Customs', status: 'pending', submitted: '3 hours ago', priority: 'low' },
]

const quickActions = [
  { name: 'Add User', href: '/admin/users/new', icon: UserPlus },
  { name: 'Create Course', href: '/admin/courses/new', icon: GraduationCap },
  { name: 'Post Job', href: '/admin/jobs/new', icon: Briefcase },
  { name: 'Add Event', href: '/admin/events/new', icon: Calendar },
  { name: 'Add Resource', href: '/admin/resources/new', icon: Link2 },
  { name: 'Write Article', href: '/admin/articles/new', icon: FileText },
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'success': return <CheckCircle className="w-4 h-4 text-emerald-400" />
    case 'pending': return <Clock className="w-4 h-4 text-amber-400" />
    case 'error': return <AlertCircle className="w-4 h-4 text-red-400" />
    default: return null
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'bg-red-500/10 text-red-400 border-red-500/20'
    case 'medium': return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    case 'low': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20'
  }
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'user': return <Users className="w-4 h-4" />
    case 'course': return <GraduationCap className="w-4 h-4" />
    case 'job': return <Briefcase className="w-4 h-4" />
    case 'article': return <FileText className="w-4 h-4" />
    case 'event': return <Calendar className="w-4 h-4" />
    case 'resource': return <Link2 className="w-4 h-4" />
    default: return null
  }
}

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening on your platform.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Download Report</Button>
          <Button variant="gradient">
            <UserPlus className="w-4 h-4 mr-2" />
            Add New
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="bg-card/50 border-border/50 hover:border-primary/50 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium ${
                  stat.trend === 'up' ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3" />
                  )}
                  {stat.change}
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.name}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks at your fingertips</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {quickActions.map((action) => (
              <Link key={action.name} href={action.href}>
                <Button
                  variant="outline"
                  className="w-full h-auto py-4 flex flex-col gap-2 hover:border-primary/50 hover:bg-primary/5"
                >
                  <action.icon className="w-5 h-5 text-primary" />
                  <span className="text-xs">{action.name}</span>
                </Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest actions on the platform</CardDescription>
            </div>
            <Button variant="ghost" size="sm">View All</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-4 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    activity.type === 'user' ? 'bg-blue-500/10 text-blue-400' :
                    activity.type === 'course' ? 'bg-emerald-500/10 text-emerald-400' :
                    activity.type === 'job' ? 'bg-purple-500/10 text-purple-400' :
                    activity.type === 'event' ? 'bg-pink-500/10 text-pink-400' :
                    activity.type === 'resource' ? 'bg-indigo-500/10 text-indigo-400' :
                    'bg-orange-500/10 text-orange-400'
                  }`}>
                    {getTypeIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground">{activity.action}</p>
                      {getStatusIcon(activity.status)}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{activity.name}</p>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Moderation */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Pending Moderation</CardTitle>
              <CardDescription>Items awaiting your review</CardDescription>
            </div>
            <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/20">
              {pendingItems.length} pending
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-accent/30 rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      item.type === 'event' ? 'bg-pink-500/10 text-pink-400' :
                      item.type === 'article' ? 'bg-orange-500/10 text-orange-400' :
                      item.type === 'job' ? 'bg-purple-500/10 text-purple-400' :
                      'bg-indigo-500/10 text-indigo-400'
                    }`}>
                      {getTypeIcon(item.type)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground line-clamp-1">{item.title}</p>
                      <p className="text-xs text-muted-foreground">Submitted {item.submitted}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`border ${getPriorityColor(item.priority)}`}>
                      {item.priority}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem className="text-emerald-400">Approve</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-400">Reject</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Page Views Today</p>
                <p className="text-2xl font-bold text-foreground">12,543</p>
                <p className="text-xs text-emerald-400">+23% from yesterday</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">New Users Today</p>
                <p className="text-2xl font-bold text-foreground">47</p>
                <p className="text-xs text-emerald-400">+12% from yesterday</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Course Enrollments</p>
                <p className="text-2xl font-bold text-foreground">234</p>
                <p className="text-xs text-emerald-400">+8% from yesterday</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
