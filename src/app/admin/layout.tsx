'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Briefcase,
  BookOpen,
  Settings,
  LogOut,
  Calendar,
  Link2,
  BarChart3,
  Menu,
  X,
  ChevronRight,
  Bell,
  Search,
  Building2,
  MessageSquare,
  Newspaper,
  Mail,
  Rss,
  FileCheck
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const sidebarLinks = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Users, badge: '2.5k' },
  { name: 'Feedback', href: '/admin/feedback', icon: MessageSquare },
  { name: 'News', href: '/admin/news', icon: Newspaper, badge: '8' },
  { name: 'News Sources', href: '/admin/news/sources', icon: Rss },
  { name: 'Review Queue', href: '/admin/news/review', icon: FileCheck },
  { name: 'Newsletter', href: '/admin/newsletter', icon: Mail },
  { name: 'Courses', href: '/admin/courses', icon: GraduationCap, badge: '48' },
  { name: 'Careers', href: '/admin/careers', icon: Briefcase, badge: '24' },
  { name: 'Interview Prep', href: '/admin/interview-prep', icon: MessageSquare, badge: '85' },
  { name: 'Majors Guide', href: '/admin/majors', icon: GraduationCap, badge: '32' },
  { name: 'Jobs', href: '/admin/jobs', icon: Briefcase, badge: '156' },
  { name: 'Businesses', href: '/admin/businesses', icon: Building2, badge: '89' },
  { name: 'Wiki Articles', href: '/admin/articles', icon: BookOpen, badge: '312' },
  { name: 'Community', href: '/admin/community', icon: MessageSquare, badge: '45' },
  { name: 'Events', href: '/admin/events', icon: Calendar, badge: '24' },
  { name: 'Resources', href: '/admin/resources', icon: Link2, badge: '86' },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const isActiveLink = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin'
    }
    return pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Header */}
      <header className="sticky top-0 z-50 h-16 bg-card/80 backdrop-blur-lg border-b border-border flex items-center px-4">
        <div className="flex items-center gap-4 flex-1">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>

          <Link href="/admin" className="flex items-center gap-2">
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Oromo Admin
            </span>
          </Link>

          {/* Search */}
          <div className="hidden md:flex relative ml-8 flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search users, courses, jobs..."
              className="pl-10 bg-background/50"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </Button>

          <Link href="/">
            <Button variant="outline" size="sm">
              View Site
            </Button>
          </Link>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatars/admin.jpg" />
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
                    A
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline font-medium">Admin</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/admin/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={cn(
          'fixed lg:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 bg-card/50 backdrop-blur-lg border-r border-border transition-transform duration-300',
          'lg:translate-x-0',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}>
          <nav className="p-4 space-y-1">
            {sidebarLinks.map((link) => {
              const isActive = isActiveLink(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-primary border border-primary/20'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  )}
                >
                  <link.icon className={cn('w-5 h-5', isActive && 'text-primary')} />
                  <span className="flex-1">{link.name}</span>
                  {link.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {link.badge}
                    </Badge>
                  )}
                  {isActive && <ChevronRight className="w-4 h-4 text-primary" />}
                </Link>
              )
            })}
          </nav>

          {/* Quick Actions */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="p-4 rounded-lg bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-border">
              <h4 className="font-medium text-foreground mb-2">Need Help?</h4>
              <p className="text-xs text-muted-foreground mb-3">
                Check our admin documentation for guides and tutorials.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                View Docs
              </Button>
            </div>
          </div>
        </aside>

        {/* Mobile overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  )
}
