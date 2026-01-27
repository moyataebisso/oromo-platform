'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, User, LogOut, Settings, LayoutDashboard, ChevronDown, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import { LanguageToggle } from '@/components/translation'
import { LinkPreviewTooltip } from '@/components/ui/LinkPreviewTooltip'
import { OdaaLogo } from '@/components/ui/odaa-logo'
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
    { name: 'Career Prep', href: '/teens/career-prep' },
    { name: 'News', href: '/news' },
    { name: 'Careers', href: '/careers' },
    { name: 'Events', href: '/events' },
  ],
  adults: [
    { name: 'Academy', href: '/academy' },
    { name: 'News', href: '/news' },
    { name: 'Careers', href: '/careers' },
    { name: 'Businesses', href: '/businesses' },
    { name: 'Wiki', href: '/wiki' },
    { name: 'Events', href: '/events' },
    { name: 'Resources', href: '/resources' },
  ],
  guest: [
    { name: 'Academy', href: '/academy' },
    { name: 'News', href: '/news' },
    { name: 'Careers', href: '/careers' },
    { name: 'Businesses', href: '/businesses' },
    { name: 'Wiki', href: '/wiki' },
    { name: 'Events', href: '/events' },
    { name: 'Resources', href: '/resources' },
  ],
}

// Mock user - in production, this would come from auth context/Supabase
const mockUser = {
  isLoggedIn: false,
  name: 'Bekele Abera',
  email: 'bekele@example.com',
  avatar_url: null,
  age_group: null as AgeGroup,
}

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user] = useState(mockUser)
  const [isScrolled, setIsScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  const isHomePage = pathname === '/'

  useEffect(() => {
    setMounted(true)

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
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
              <span className="text-2xl font-bold text-white">ODDA Kids</span>
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

  // Determine header styles based on scroll state and page
  const headerClasses = cn(
    'fixed top-0 z-50 w-full transition-all duration-300',
    {
      // On homepage: transparent when not scrolled, solid when scrolled
      'bg-transparent border-transparent': isHomePage && !isScrolled && mounted,
      'bg-background/80 backdrop-blur-lg border-b border-border/50 shadow-sm': isScrolled || !isHomePage,
    }
  )

  const navLinkClasses = cn(
    'relative text-sm font-medium transition-all duration-300 py-2',
    'after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300',
    'hover:after:w-full',
    {
      'text-white/80 hover:text-white': isHomePage && !isScrolled && mounted,
      'text-muted-foreground hover:text-foreground': isScrolled || !isHomePage,
    }
  )

  // Standard header for teens, adults, and guests
  return (
    <>
      <header className={headerClasses}>
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link
              href={user.isLoggedIn && user.age_group === 'teens' ? '/teens' : '/'}
              className="flex items-center gap-2"
            >
              <OdaaLogo size="md" showText={true} />
              {user.isLoggedIn && user.age_group === 'teens' && (
                <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-medium">
                  Teens
                </span>
              )}
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navigation.map((item) => (
                <LinkPreviewTooltip key={item.name} href={item.href}>
                  <Link
                    href={item.href}
                    className={navLinkClasses}
                  >
                    {item.name}
                  </Link>
                </LinkPreviewTooltip>
              ))}
            </nav>

            {/* Desktop Auth Buttons / User Menu */}
            <div className="hidden md:flex items-center gap-3">
              {/* Language Toggle */}
              <LanguageToggle />

              {/* Theme Toggle */}
              <ThemeToggle variant="simple" />

              {/* Kids Button - Always visible */}
              <Link
                href="/kids"
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all transform hover:scale-105",
                  "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/25",
                  "hover:shadow-emerald-500/40 hover:from-emerald-400 hover:to-cyan-400"
                )}
              >
                <span className="text-lg">🧒</span>
                <span className="text-sm">Kids</span>
              </Link>

              {user.isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        "flex items-center gap-2",
                        isHomePage && !isScrolled && mounted && "text-white hover:bg-white/10"
                      )}
                    >
                      <Avatar className="h-8 w-8 ring-2 ring-primary/20">
                        <AvatarImage src={user.avatar_url || undefined} />
                        <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-amber-500 text-white">
                          {user.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{user.name.split(' ')[0]}</span>
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-3 py-2">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
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
                    <DropdownMenuItem className="text-destructive focus:text-destructive">
                      <LogOut className="w-4 h-4 mr-2" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    asChild
                    className={cn(
                      isHomePage && !isScrolled && mounted && "text-white hover:bg-white/10"
                    )}
                  >
                    <Link href="/login">Log in</Link>
                  </Button>
                  <Button
                    asChild
                    className="bg-gradient-to-r from-emerald-500 to-amber-500 hover:from-emerald-600 hover:to-amber-600 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
                  >
                    <Link href="/signup">Sign up free</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-2">
              <LanguageToggle />
              <ThemeToggle variant="simple" />
              <button
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  isHomePage && !isScrolled && mounted
                    ? "text-white hover:bg-white/10"
                    : "text-foreground hover:bg-accent"
                )}
                onClick={handleToggleMenu}
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation - Full screen overlay */}
        <div
          className={cn(
            'md:hidden fixed inset-x-0 top-16 bottom-0 bg-background/95 backdrop-blur-lg transition-all duration-300',
            isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          )}
        >
          <nav className="flex flex-col p-6 gap-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-4 py-3 text-lg font-medium text-foreground hover:text-primary hover:bg-accent rounded-xl transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            {/* Kids Button - Mobile */}
            <Link
              href="/kids"
              className="flex items-center justify-center gap-2 px-4 py-3 mt-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold rounded-xl shadow-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="text-lg">🧒</span>
              <span>Kids Zone</span>
            </Link>

            <div className="flex flex-col gap-2 pt-4 border-t border-border mt-4">
              {user.isLoggedIn ? (
                <>
                  <Link
                    href="/dashboard"
                    className="px-4 py-3 text-lg font-medium text-foreground hover:text-primary hover:bg-accent rounded-xl transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className="px-4 py-3 text-lg font-medium text-foreground hover:text-primary hover:bg-accent rounded-xl transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Button variant="outline" className="justify-start text-destructive mt-2">
                    <LogOut className="w-4 h-4 mr-2" />
                    Log out
                  </Button>
                </>
              ) : (
                <div className="flex flex-col gap-3 mt-2">
                  <Button variant="outline" size="lg" asChild className="w-full">
                    <Link href="/login">Log in</Link>
                  </Button>
                  <Button
                    size="lg"
                    asChild
                    className="w-full bg-gradient-to-r from-emerald-500 to-amber-500"
                  >
                    <Link href="/signup">Sign up free</Link>
                  </Button>
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Spacer for fixed header on non-homepage */}
      {!isHomePage && <div className="h-16" />}
    </>
  )
}
