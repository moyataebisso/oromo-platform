import Link from 'next/link'
import { LayoutDashboard, Users, GraduationCap, Briefcase, BookOpen, Settings, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'

const sidebarLinks = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Courses', href: '/admin/courses', icon: GraduationCap },
  { name: 'Jobs', href: '/admin/jobs', icon: Briefcase },
  { name: 'Wiki Articles', href: '/admin/articles', icon: BookOpen },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-100">
      {/* Top Header */}
      <header className="sticky top-0 z-50 h-16 bg-slate-900 text-white flex items-center px-4">
        <div className="flex items-center gap-4 flex-1">
          <Link href="/admin" className="text-xl font-bold">
            Oromo Admin
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm text-slate-300 hover:text-white">
            View Site
          </Link>
          <button className="flex items-center gap-2 text-sm text-slate-300 hover:text-white">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r min-h-[calc(100vh-4rem)] sticky top-16">
          <nav className="p-4 space-y-1">
            {sidebarLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                )}
              >
                <link.icon className="w-5 h-5" />
                {link.name}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
