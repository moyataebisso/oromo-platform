# CLAUDE.md - Oromo Platform Project Context

## Project Overview

**Oromo Platform** - A comprehensive community platform for the 40M+ Oromo diaspora worldwide, combining:
- **Academy**: Khan Academy-style educational content
- **Careers**: LinkedIn-style job listings and career resources
- **Wiki**: Wikipedia-style knowledge base for Oromo history and culture

This is an MVP build targeting launch in 8 weeks.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS 3.4 |
| Components | shadcn/ui (Radix primitives) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (email + OAuth) |
| Storage | Supabase Storage |
| Hosting | Vercel |
| Icons | Lucide React |
| Forms | React Hook Form + Zod |
| State | React Context + hooks |

---

## Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Auth routes group
│   │   ├── login/
│   │   ├── signup/
│   │   ├── forgot-password/
│   │   └── layout.tsx
│   ├── (main)/              # Main app with nav
│   │   └── layout.tsx
│   ├── academy/             # Academy module
│   ├── careers/             # Careers module
│   ├── wiki/                # Wiki module
│   ├── admin/               # Admin dashboard
│   ├── profile/             # User profiles
│   ├── api/                 # API routes
│   ├── layout.tsx           # Root layout
│   └── globals.css
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── layout/              # Header, Footer, Nav
│   ├── academy/             # Academy components
│   ├── careers/             # Careers components
│   ├── wiki/                # Wiki components
│   └── shared/              # Shared components
├── lib/
│   ├── supabase/            # Supabase clients
│   ├── utils.ts             # Utilities (cn function)
│   └── validations/         # Zod schemas
├── hooks/                   # Custom React hooks
├── types/                   # TypeScript types
├── contexts/                # React contexts
└── styles/                  # Additional styles
```

---

## Coding Conventions

### TypeScript
- Strict mode enabled
- Explicit types for function parameters and returns
- Use interfaces for object shapes
- Use type for unions and primitives

### Components
```tsx
// Pattern for components
'use client' // ONLY if client-side interactivity needed

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ComponentNameProps {
  title: string
  className?: string
  onAction?: () => void
}

export const ComponentName = ({ 
  title, 
  className,
  onAction 
}: ComponentNameProps) => {
  const [isOpen, setIsOpen] = useState(false)
  
  const handleClick = () => {
    setIsOpen(true)
    onAction?.()
  }
  
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <Button onClick={handleClick}>
        {title}
      </Button>
    </div>
  )
}
```

### Naming Conventions
- Components: PascalCase (`CourseCard.tsx`)
- Files: kebab-case (`course-card.tsx`)
- Functions: camelCase (`handleSubmit`)
- Event handlers: prefix with `handle` (`handleClick`, `handleSubmit`)
- Boolean state: prefix with `is/has/should` (`isLoading`, `hasError`)
- Constants: SCREAMING_SNAKE_CASE (`MAX_FILE_SIZE`)

### Imports Order
1. React/Next.js
2. Third-party libraries
3. Internal components (`@/components/...`)
4. Internal utilities (`@/lib/...`)
5. Types
6. Styles

### Styling Rules
- **Tailwind CSS only** - no CSS modules, no styled-components
- Mobile-first responsive design
- Use `cn()` utility for conditional classes
- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64
- Border radius: `rounded-md` (default), `rounded-lg` (cards), `rounded-full` (avatars)

---

## Component Guidelines

### Server vs Client Components
- **Default to Server Components** (no 'use client')
- Add 'use client' ONLY when using:
  - useState, useEffect, useContext
  - Event handlers (onClick, onChange)
  - Browser APIs (localStorage, window)
  - Third-party client libraries

### shadcn/ui Usage
Always use shadcn/ui for:
- Buttons, inputs, forms
- Cards, dialogs, modals
- Dropdowns, selects, tabs
- Toast notifications
- Loading skeletons

Install with: `npx shadcn@latest add [component]`

### Loading States
- Use `<Skeleton />` for content loading
- Use spinner for action loading (buttons)
- Always show loading state for data fetching

### Error Handling
- Use error boundaries for unexpected errors
- Show user-friendly error messages
- Log errors to console in development

---

## Database Schema Reference

### Key Tables

**profiles** - User profiles (extends Supabase auth.users)
```sql
id, email, username, display_name, bio, avatar_url, role, created_at
```

**courses** - Academy courses
```sql
id, title, slug, description, thumbnail_url, category_id, difficulty, is_published
```

**lessons** - Course lessons
```sql
id, course_id, title, content, video_url, order_index, is_published
```

**jobs** - Job listings
```sql
id, title, company_name, location, job_type, salary_min, salary_max, description, status
```

**wiki_articles** - Wiki articles
```sql
id, title, slug, content, category_id, author_id, status, is_featured
```

Full schema in `/supabase/schema.sql`

---

## API Patterns

### Server Actions (Preferred)
```tsx
// app/actions/courses.ts
'use server'

import { createClient } from '@/lib/supabase/server'

export const getCourses = async () => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('is_published', true)
  
  if (error) throw error
  return data
}
```

### API Routes (When needed)
```tsx
// app/api/courses/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('courses')
    .select('*')
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json(data)
}
```

---

## Design System

### Colors
```css
/* Use Tailwind's default palette with these as primary */
--primary: slate-900 (text)
--secondary: slate-600 (muted text)
--accent: blue-600 (interactive)
--success: green-600
--warning: amber-600
--error: red-600
--background: white / slate-50
```

### Typography
- Headings: `font-semibold` or `font-bold`
- Body: `font-normal`
- Small: `text-sm text-slate-600`
- Use `tracking-tight` for large headings

### Spacing
- Section padding: `py-16` or `py-24`
- Card padding: `p-6`
- Gap between elements: `gap-4` (default), `gap-6`, `gap-8`
- Max content width: `max-w-7xl mx-auto`

### Shadows
- Cards: `shadow-sm` or `shadow-md`
- Hover: `hover:shadow-lg`
- Modals: `shadow-xl`

### Transitions
- Default: `transition-all duration-200`
- Hover scale: `hover:scale-105`
- Color change: `transition-colors`

---

## Commands

```bash
# Development
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Supabase
npx supabase login   # Login to Supabase
npx supabase link    # Link to project
npx supabase gen types typescript --linked > src/types/database.types.ts

# shadcn/ui
npx shadcn@latest add button   # Add component
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add dialog

# Git
git add .
git commit -m "feat: description"
git push
```

---

## Current MVP Scope

### Modules to Build
1. **Academy** - Course catalog, lessons, quizzes, progress
2. **Careers** - Job listings, posting, interview prep
3. **Wiki** - Articles, categories, search, submissions
4. **Admin** - Dashboard, moderation, user management
5. **Core** - Auth, profiles, landing page

### Pages Count
- Total: 32 pages
- Auth: 4
- Academy: 5
- Careers: 7
- Wiki: 6
- Admin: 5
- Profile: 2
- Static: 4

### NOT in MVP
- Video chat
- AI chatbot
- Mobile app
- Gamification
- Certificates
- Events calendar

---

## Quality Checklist

Before considering a feature complete:
- [ ] TypeScript - no `any` types
- [ ] Responsive - works on mobile
- [ ] Loading states - skeleton or spinner
- [ ] Error handling - user-friendly messages
- [ ] Accessibility - proper ARIA labels, keyboard nav
- [ ] Performance - no unnecessary re-renders
- [ ] Clean code - no commented-out code
- [ ] Tested - manually verify all flows

---

## Common Patterns

### Data Fetching (Server Component)
```tsx
// app/academy/page.tsx
import { createClient } from '@/lib/supabase/server'
import { CourseGrid } from '@/components/academy/course-grid'

export default async function AcademyPage() {
  const supabase = createClient()
  const { data: courses } = await supabase
    .from('courses')
    .select('*, category:categories(*)')
    .eq('is_published', true)
  
  return <CourseGrid courses={courses ?? []} />
}
```

### Form Handling
```tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

type FormData = z.infer<typeof schema>

export const LoginForm = () => {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
  })
  
  const onSubmit = async (data: FormData) => {
    // Handle submit
  }
  
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  )
}
```

### Protected Routes
```tsx
// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Check auth and redirect if needed
}

export const config = {
  matcher: ['/admin/:path*', '/profile/:path*'],
}
```

---

## Notes for Claude

1. **Always use TypeScript** - Strict types, no `any`
2. **Mobile-first** - Start with mobile styles, add `md:` and `lg:` for larger
3. **Server Components first** - Only add 'use client' when necessary
4. **shadcn/ui** - Use existing components, don't reinvent
5. **Commit often** - After each feature or fix
6. **Ask before major changes** - Especially for architecture decisions
7. **Keep it simple** - MVP means minimal viable, not maximum features
