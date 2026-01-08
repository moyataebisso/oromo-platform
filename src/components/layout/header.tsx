'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Menu, X, User, LogOut, Settings, LayoutDashboard, ChevronDown, Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

type AgeGroup = 'kids' | 'teens' | 'adults' | null

interface NavItem {
  name: string
  href: string
}

// Navigation configurations for different age groups
const navigationConfig: Record<string, NavItem[]> = {
  kids: [
    { name: 'Home', href: '/kids' },
    { name: 'Videos', href: '/kids' },
    { name: 'My Progress', href: '/kids/progress' },
  ],
  teens: [
    { name: 'Home', href: '/teens' },
    { name: 'Academy', href: '/academy' },
    { name: 'College Prep', href: '/teens/college-prep' },
    { name: 'Resources', href: '/resources' },
    { name: 'Careers', href: '/careers' },
  ],
  adults: [
    { name: 'Academy', href: '/academy' },
    { name: 'Careers', href: '/careers' },
    { name: 'Wiki', href: '/wiki' },
    { name: 'Resources', href: '/resources' },
    { name: 'Community', href: '/community' },
    { name: 'Businesses', href: '/businesses' },
  ],
  guest: [
    { name: 'Academy', href: '/academy' },
    { name: 'Careers', href: '/careers' },
    { name: 'Wiki', href: '/wiki' },
    { name: 'Resources', href: '/resources' },
    { name: 'Businesses', href: '/businesses' },
  ],
}

// Mock user - in production, this would come from auth context/Supabase
const mockUser = {
  isLoggedIn: false, // Toggle this to test logged in states
  name: 'Bekele Abera',
  email: 'bekele@example.com',
  avatar_url: null,
  age_group: null as AgeGroup, // 'kids' | 'teens' | 'adults' | null
}

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState(mockUser)
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Get navigation based on user status
  const getNavigation = (): NavItem[] => {
    if (!user.isLoggedIn) {
      return navigationConfig.guest
    }
    return navigationConfig[user.age_group || 'adults'] || navigationConfig.adults
  }

  const navigation = getNavigation()
  const isKids = user.isLoggedIn && user.age_group === 'kids'

  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  // Kids have a special simplified header
  if (isKids) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-green-400 to-blue-500">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <Link href="/kids" className="flex items-center gap-2">
              <span className="text-2xl">🌟</span>
              <span className="text-2xl font-bold text-white">Oromo Kids</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-lg font-semibold text-white hover:text-yellow-200 transition-colors px-4 py-2 rounded-full hover:bg-white/20"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Parent Login */}
            <div className="hidden md:flex items-center gap-4">
              <Button variant="secondary" size="lg" className="text-lg" asChild>
                <Link href="/parent-dashboard">
                  👨‍👩‍👧 Parent
                </Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-white"
              onClick={handleToggleMenu}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          <div
            className={cn(
              'md:hidden overflow-hidden transition-all duration-200',
              isMenuOpen ? 'max-h-80 pb-4' : 'max-h-0'
            )}
          >
            <nav className="flex flex-col gap-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-4 py-3 text-lg font-semibold text-white hover:bg-white/20 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-2 border-t border-white/30 mt-2">
                <Button variant="secondary" size="lg" className="w-full text-lg" asChild>
                  <Link href="/parent-dashboard">👨‍👩‍👧 Parent Login</Link>
                </Button>
              </div>
            </nav>
          </div>
        </div>
      </header>
    )
  }

  // Standard header for teens, adults, and guests
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-slate-900 dark:border-slate-800">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href={user.isLoggedIn && user.age_group === 'teens' ? '/teens' : '/'} className="flex items-center gap-2">
            <span className="text-xl font-bold text-slate-900 dark:text-white">Oromo</span>
            {user.isLoggedIn && user.age_group === 'teens' && (
              <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-2 py-0.5 rounded-full font-medium">
                Teens
              </span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth Buttons / User Menu */}
          <div className="hidden md:flex items-center gap-4">
            {/* Dark Mode Toggle */}
            <ThemeToggle variant="simple" />
            {/* Kids Button - Always visible */}
            <Link
              href="/kids"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-full shadow-md hover:shadow-lg transition-all transform hover:scale-105"
            >
              <span className="text-lg">🧒</span>
              <span>Kids</span>
            </Link>
            {user.isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar_url || undefined} />
                      <AvatarFallback className="bg-emerald-100 text-emerald-700">
                        {user.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{user.name.split(' ')[0]}</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2">
                    <p className="font-medium text-slate-900">{user.name}</p>
                    <p className="text-sm text-slate-500">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center gap-2">
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
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
                  <DropdownMenuItem className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">Log in</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Sign up</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            {/* Dark Mode Toggle - Mobile */}
            <ThemeToggle variant="simple" />
            <button
              className="p-2 text-slate-600 dark:text-slate-300"
              onClick={handleToggleMenu}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            'md:hidden overflow-hidden transition-all duration-200',
            isMenuOpen ? 'max-h-96 pb-4' : 'max-h-0'
          )}
        >
          <nav className="flex flex-col gap-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-2 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {/* Kids Button - Mobile */}
            <Link
              href="/kids"
              className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-full shadow-md"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="text-lg">🧒</span>
              <span>Kids Zone</span>
            </Link>

            <div className="flex flex-col gap-2 pt-2 border-t dark:border-slate-700 mt-2">
              {user.isLoggedIn ? (
                <>
                  <Link
                    href="/dashboard"
                    className="px-2 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className="px-2 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800 rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Button variant="outline" className="justify-start text-red-600 dark:text-red-400">
                    <LogOut className="w-4 h-4 mr-2" />
                    Log out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" asChild className="justify-start">
                    <Link href="/login">Log in</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/signup">Sign up</Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
