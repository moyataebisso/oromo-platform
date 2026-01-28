import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Routes restricted by age group
const kidsRestrictedRoutes = ['/careers', '/community', '/businesses', '/wiki']
const teensRestrictedRoutes = ['/businesses'] // Teens can access most things
const adultOnlyRoutes = ['/parent-dashboard'] // Only for parents of kids accounts

// Routes that require authentication
const authRequiredRoutes = ['/dashboard', '/profile', '/admin']

// Age group specific home pages
const ageGroupHomepages: Record<string, string> = {
  kids: '/kids',
  teens: '/teens',
  adults: '/',
}

export const updateSession = async (request: NextRequest) => {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Get current user and session
  const { data: { user } } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // Check if route requires authentication
  const requiresAuth = authRequiredRoutes.some(route => pathname.startsWith(route))

  if (requiresAuth && !user) {
    // Redirect to login if not authenticated
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If user is logged in, apply age-based restrictions
  if (user) {
    const ageGroup = user.user_metadata?.age_group as string | undefined

    // Kids restrictions
    if (ageGroup === 'kids') {
      const isRestricted = kidsRestrictedRoutes.some(route => pathname.startsWith(route))
      if (isRestricted) {
        // Redirect kids to their homepage with a message
        const kidsUrl = new URL('/kids', request.url)
        kidsUrl.searchParams.set('restricted', 'true')
        return NextResponse.redirect(kidsUrl)
      }

      // Redirect kids from main homepage to kids homepage
      if (pathname === '/') {
        return NextResponse.redirect(new URL('/kids', request.url))
      }
    }

    // Teens restrictions (lighter)
    if (ageGroup === 'teens') {
      const isRestricted = teensRestrictedRoutes.some(route => pathname.startsWith(route))
      if (isRestricted) {
        // Redirect teens to their homepage
        const teensUrl = new URL('/teens', request.url)
        teensUrl.searchParams.set('restricted', 'true')
        return NextResponse.redirect(teensUrl)
      }

      // Redirect teens from main homepage to teens homepage
      if (pathname === '/') {
        return NextResponse.redirect(new URL('/teens', request.url))
      }
    }

    // Parent dashboard - only accessible by adults who have linked kid accounts
    if (pathname.startsWith('/parent-dashboard')) {
      if (ageGroup !== 'adults') {
        return NextResponse.redirect(new URL('/', request.url))
      }
    }

    // Admin routes - check for admin role in profiles table and user_metadata
    if (pathname.startsWith('/admin')) {
      const metadataRole = user.user_metadata?.role as string | undefined

      // Also check the profiles table for the role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      const role = profile?.role || metadataRole
      if (role !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url))
      }
    }
  }

  return supabaseResponse
}

// Helper function to check if user can access a route (for client-side use)
export const canAccessRoute = (ageGroup: string | null, pathname: string): boolean => {
  if (!ageGroup) return true // Guests can access public routes

  if (ageGroup === 'kids') {
    return !kidsRestrictedRoutes.some(route => pathname.startsWith(route))
  }

  if (ageGroup === 'teens') {
    return !teensRestrictedRoutes.some(route => pathname.startsWith(route))
  }

  return true
}
