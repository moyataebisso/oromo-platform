'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Menu,
  X,
  GraduationCap,
  BookOpen,
  Briefcase,
  Users,
  Trophy,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Sun,
  Moon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

const navigation = [
  { name: 'Home', href: '/teens', icon: GraduationCap },
  { name: 'Academy', href: '/academy', icon: BookOpen },
  { name: 'College Prep', href: '/teens/college-prep', icon: Trophy },
  { name: 'Careers', href: '/careers', icon: Briefcase },
  { name: 'Community', href: '/community/teens', icon: Users },
]

interface UserProfile {
  id: string
  email: string
  display_name: string | null
}

interface TeenProfile {
  grade_level: number | null
}

export default function TeensLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<UserProfile | null>(null)
  const [teenProfile, setTeenProfile] = useState<TeenProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()

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
              .select('grade_level')
              .eq('user_id', session.user.id)
              .single()

            if (teen) {
              setTeenProfile(teen)
            }
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null)
        setTeenProfile(null)
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

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/teens')
    router.refresh()
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    // In a real app, this would toggle a theme context/class
  }

  const displayName = user?.display_name || user?.email?.split('@')[0] || 'User'
  const initials = displayName.charAt(0).toUpperCase()

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/teens" className="flex items-center gap-2">
              <span className="text-xl font-bold">
                <span className="text-emerald-500">O</span>
                <span className="text-amber-500">DDA</span>
              </span>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                Teens
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>

            {/* Right side - Auth buttons or User menu */}
            <div className="hidden md:flex items-center gap-3">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDarkMode}
                className="text-slate-600"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>

              {isLoading ? (
                <div className="w-20 h-8 bg-slate-100 rounded animate-pulse" />
              ) : user ? (
                // Logged in user menu
                <>
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-900">{displayName}</p>
                    {teenProfile?.grade_level && (
                      <p className="text-xs text-slate-500">Grade {teenProfile.grade_level}</p>
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-blue-100 text-blue-700">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <div className="px-3 py-2">
                        <p className="font-medium text-slate-900">{displayName}</p>
                        <p className="text-sm text-slate-500">{user.email}</p>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/profile" className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/profile/edit" className="flex items-center gap-2">
                          <Settings className="w-4 h-4" />
                          Settings
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600 cursor-pointer"
                        onClick={handleLogout}
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                // Guest - Show login/signup buttons
                <>
                  <Button variant="ghost" asChild>
                    <Link href="/login?redirect=/teens">Log In</Link>
                  </Button>
                  <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Link href="/signup?redirect=/teens">Sign Up Free</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-slate-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          <div
            className={cn(
              'md:hidden overflow-hidden transition-all duration-200',
              isMenuOpen ? 'max-h-[500px] pb-4' : 'max-h-0'
            )}
          >
            <nav className="flex flex-col gap-1">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                )
              })}

              <div className="pt-2 border-t mt-2">
                {user ? (
                  <>
                    <div className="px-3 py-2 mb-2">
                      <p className="font-medium text-slate-900">{displayName}</p>
                      <p className="text-sm text-slate-500">{user.email}</p>
                    </div>
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="w-5 h-5" />
                      Profile
                    </Link>
                    <Button
                      variant="outline"
                      className="w-full mt-2 justify-start text-red-600"
                      onClick={() => {
                        setIsMenuOpen(false)
                        handleLogout()
                      }}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Log out
                    </Button>
                  </>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/login?redirect=/teens" onClick={() => setIsMenuOpen(false)}>
                        Log In
                      </Link>
                    </Button>
                    <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                      <Link href="/signup?redirect=/teens" onClick={() => setIsMenuOpen(false)}>
                        Sign Up Free
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-8">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold">
                <span className="text-emerald-500">O</span>
                <span className="text-amber-500">DDA</span>
              </span>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                Teens
              </span>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-600">
              <Link href="/about" className="hover:text-slate-900">About</Link>
              <Link href="/privacy" className="hover:text-slate-900">Privacy</Link>
              <Link href="/terms" className="hover:text-slate-900">Terms</Link>
              <Link href="/help" className="hover:text-slate-900">Help</Link>
            </div>
            <p className="text-sm text-slate-500">
              &copy; {new Date().getFullYear()} ODDA
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
