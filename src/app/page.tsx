'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  GraduationCap,
  Briefcase,
  BookOpen,
  Users,
  Globe,
  ArrowRight,
  Play,
  Star,
  Clock,
  CheckCircle2,
  Sparkles,
  Target,
  Shield,
  TrendingUp,
  ChevronRight,
  Quote,
  Rocket,
  Heart
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { cn } from '@/lib/utils'

// Grade selector data
const gradeSelectors = [
  {
    title: 'Kids',
    ageRange: 'Ages 4-8',
    icon: '🌟',
    color: 'from-emerald-500 to-cyan-500',
    shadowColor: 'shadow-emerald-500/25',
    href: '/kids',
    features: ['Stories & Songs', 'Language Basics', 'Fun Activities', 'Safe Learning'],
  },
  {
    title: 'Middle School',
    ageRange: 'Ages 9-13',
    icon: '📚',
    color: 'from-blue-500 to-indigo-500',
    shadowColor: 'shadow-blue-500/25',
    href: '/academy',
    features: ['Oromo Language', 'History Basics', 'Cultural Studies', 'Math & Science'],
  },
  {
    title: 'High School',
    ageRange: 'Ages 14-18',
    icon: '🎓',
    color: 'from-purple-500 to-pink-500',
    shadowColor: 'shadow-purple-500/25',
    href: '/teens',
    features: ['Advanced Courses', 'College Prep', 'AP Resources', 'Career Exploration'],
  },
  {
    title: 'Adults',
    ageRange: 'Ages 18+',
    icon: '💼',
    color: 'from-amber-500 to-orange-500',
    shadowColor: 'shadow-amber-500/25',
    href: '/academy',
    features: ['Language Fluency', 'Professional Skills', 'Career Growth', 'Community'],
  },
]

// Featured courses data
const featuredCourses = [
  {
    id: '1',
    title: 'Introduction to Afaan Oromo',
    thumbnail: '/images/courses/oromo-language.jpg',
    category: 'Language',
    categoryColor: 'from-blue-500 to-blue-600',
    lessons: 12,
    hours: 10,
    difficulty: 'Beginner',
  },
  {
    id: '2',
    title: 'Oromo History & Heritage',
    thumbnail: '/images/courses/oromo-history.jpg',
    category: 'History',
    categoryColor: 'from-amber-500 to-amber-600',
    lessons: 10,
    hours: 8,
    difficulty: 'Beginner',
  },
  {
    id: '3',
    title: 'The Gadaa System',
    thumbnail: '/images/courses/gadaa.jpg',
    category: 'Culture',
    categoryColor: 'from-purple-500 to-purple-600',
    lessons: 8,
    hours: 6,
    difficulty: 'Intermediate',
  },
  {
    id: '4',
    title: 'Web Development Basics',
    thumbnail: '/images/courses/web-dev.jpg',
    category: 'Technology',
    categoryColor: 'from-emerald-500 to-emerald-600',
    lessons: 24,
    hours: 20,
    difficulty: 'Beginner',
  },
]

// Impact stats
const stats = [
  { value: 40, suffix: 'M+', label: 'Oromo People We Serve', icon: Users },
  { value: 500, suffix: '+', label: 'Educational Resources', icon: BookOpen },
  { value: 10, suffix: 'K+', label: 'Active Learners', icon: GraduationCap },
  { value: 50, suffix: '+', label: 'Countries Reached', icon: Globe },
]

// Why it works features
const whyItWorks = [
  {
    icon: Target,
    title: 'Personalized Learning',
    description: 'Learn at your own pace. Our adaptive system identifies gaps and accelerates your growth with customized content.',
  },
  {
    icon: Shield,
    title: 'Trusted Content',
    description: 'Expert-created courses covering language, culture, history, and career skills. All free and verified by the community.',
  },
  {
    icon: Users,
    title: 'Tools for Everyone',
    description: "Whether you're a student, parent, or teacher - we have specialized tools to help you succeed in your goals.",
  },
]

// Testimonials
const testimonials = [
  {
    name: 'Fatuma A.',
    role: 'Student',
    location: 'Minneapolis, USA',
    avatar: '/images/avatars/user1.jpg',
    content: 'I can finally speak with my grandmother in her native language! The Afaan Oromo course changed my life.',
    stat: 'Learned 500+ words in 3 months',
    rating: 5,
  },
  {
    name: 'Bekele T.',
    role: 'Software Engineer',
    location: 'London, UK',
    avatar: '/images/avatars/user2.jpg',
    content: 'Found my dream job through the careers section. The Oromo professional network here is incredible.',
    stat: 'Landed dream job in 2 weeks',
    rating: 5,
  },
  {
    name: 'Chaltu M.',
    role: 'Teacher',
    location: 'Toronto, Canada',
    avatar: '/images/avatars/user3.jpg',
    content: 'The wiki has been invaluable for teaching my students about Oromo history and culture. Thank you!',
    stat: 'Teaching 50+ students',
    rating: 5,
  },
]

// Platform features
const platformFeatures = [
  {
    title: 'Academy',
    description: 'Master language, culture & professional skills',
    icon: GraduationCap,
    color: 'from-blue-500 to-indigo-500',
    href: '/academy',
  },
  {
    title: 'Careers',
    description: 'Find jobs & grow professionally',
    icon: Briefcase,
    color: 'from-emerald-500 to-teal-500',
    href: '/careers',
  },
  {
    title: 'Community',
    description: 'Connect with Oromo worldwide',
    icon: Heart,
    color: 'from-pink-500 to-rose-500',
    href: '/community',
  },
]

// Animated counter hook
const useCountUp = (end: number, duration: number = 2000, shouldStart: boolean = false) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!shouldStart) return

    let startTime: number | null = null
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      setCount(Math.floor(progress * end))
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    requestAnimationFrame(animate)
  }, [end, duration, shouldStart])

  return count
}

// Intersection observer hook
const useInView = (threshold: number = 0.1) => {
  const [isInView, setIsInView] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold])

  return { ref, isInView }
}

// Stat Card Component
const StatCard = ({ stat, index }: { stat: typeof stats[0]; index: number }) => {
  const { ref, isInView } = useInView(0.3)
  const count = useCountUp(stat.value, 2000, isInView)

  return (
    <div
      ref={ref}
      className={cn(
        "text-center group transition-all duration-500",
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 mb-4 group-hover:bg-white/20 group-hover:scale-110 transition-all duration-300">
        <stat.icon className="w-8 h-8 text-white" />
      </div>
      <div className="text-4xl md:text-5xl font-bold text-white mb-2">
        {count}{stat.suffix}
      </div>
      <div className="text-slate-400 font-medium">
        {stat.label}
      </div>
    </div>
  )
}

export default function HomePage() {
  const heroRef = useInView(0.1)
  const gradesRef = useInView(0.1)
  const whyRef = useInView(0.1)
  const coursesRef = useInView(0.1)
  const testimonialsRef = useInView(0.1)
  const parentRef = useInView(0.1)
  const platformRef = useInView(0.1)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0f0f1a] via-[#1a1a2e] to-[#0f0f1a]" />

          {/* Animated gradient orbs - Oromo colors */}
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-emerald-600/30 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-amber-600/30 rounded-full blur-[120px] animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-red-600/20 rounded-full blur-[100px] animate-pulse delay-500" />

          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

          {/* Floating geometric shapes */}
          <div className="absolute top-20 left-[10%] w-20 h-20 border border-emerald-500/20 rotate-45 animate-float" />
          <div className="absolute bottom-32 right-[15%] w-16 h-16 border border-amber-500/20 rounded-full animate-float delay-700" />
          <div className="absolute top-40 right-[20%] w-12 h-12 bg-gradient-to-br from-emerald-500/10 to-amber-500/10 rotate-12 animate-float delay-300" />

          <div
            ref={heroRef.ref}
            className={cn(
              "relative z-10 mx-auto max-w-5xl px-4 py-32 text-center transition-all duration-1000",
              heroRef.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            )}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur border border-white/10 mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-medium text-white/80">
                Trusted by 10,000+ Oromo learners worldwide
              </span>
            </div>

            {/* Main headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
              <span className="text-white">Learn Anything.</span>
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-amber-400 to-red-400 bg-clip-text text-transparent">
                Achieve Everything.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="mt-8 text-xl md:text-2xl text-slate-400 leading-relaxed max-w-3xl mx-auto">
              Free, world-class education for the Oromo community.
              <span className="text-white"> Master your language, culture, and career skills.</span>
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="h-14 px-8 text-lg bg-gradient-to-r from-emerald-500 to-amber-500 hover:from-emerald-600 hover:to-amber-600 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300"
                asChild
              >
                <Link href="/signup">
                  Start Learning Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-lg border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all duration-300"
                asChild
              >
                <Link href="/parent-dashboard">
                  I'm a Parent/Teacher
                </Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Free forever</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Safe for kids</span>
              </div>
            </div>

            {/* Social proof */}
            <div className="mt-12 flex items-center justify-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-amber-500 border-2 border-background flex items-center justify-center text-white text-xs font-bold"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="ml-2 text-white font-semibold">4.9</span>
                </div>
                <p className="text-sm text-slate-400">from 2,000+ reviews</p>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
              <div className="w-1 h-2 bg-white/40 rounded-full animate-pulse" />
            </div>
          </div>
        </section>

        {/* Grade Selector Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f1a] via-[#16162a] to-[#0f0f1a]" />

          <div
            ref={gradesRef.ref}
            className={cn(
              "relative z-10 mx-auto max-w-7xl px-4 transition-all duration-1000",
              gradesRef.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            )}
          >
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
                Choose Your Path
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Learning for Every Age
              </h2>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                Select your age group to find personalized courses, activities, and resources designed just for you.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {gradeSelectors.map((grade, index) => (
                <Link
                  key={grade.title}
                  href={grade.href}
                  className={cn(
                    "group transition-all duration-500",
                    gradesRef.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  )}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <Card className={cn(
                    "h-full bg-card/50 backdrop-blur border-border/50 overflow-hidden",
                    "hover:border-primary/50 hover:shadow-xl hover:-translate-y-2 transition-all duration-300",
                    grade.shadowColor
                  )}>
                    <CardHeader className="text-center pb-4">
                      <div className={cn(
                        "w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br flex items-center justify-center mb-4",
                        "group-hover:scale-110 transition-transform duration-300",
                        grade.color
                      )}>
                        <span className="text-4xl">{grade.icon}</span>
                      </div>
                      <CardTitle className="text-2xl text-white">{grade.title}</CardTitle>
                      <CardDescription className="text-primary font-medium">
                        {grade.ageRange}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 mb-6">
                        {grade.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-2 text-slate-400">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="flex items-center justify-center text-primary font-semibold group-hover:gap-2 transition-all">
                        Explore
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Why It Works Section */}
        <section className="py-24 relative">
          <div className="absolute inset-0 bg-[#0f0f1a]" />

          <div
            ref={whyRef.ref}
            className={cn(
              "relative z-10 mx-auto max-w-7xl px-4 transition-all duration-1000",
              whyRef.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            )}
          >
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20">
                Why Choose Us
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Why ODDA Works
              </h2>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                Our platform is designed with proven learning methods and community feedback.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {whyItWorks.map((item, index) => (
                <div
                  key={item.title}
                  className={cn(
                    "text-center p-8 rounded-2xl bg-card/30 border border-border/50",
                    "hover:bg-card/50 hover:border-primary/30 transition-all duration-300",
                    whyRef.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  )}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-emerald-500/20 to-amber-500/20 flex items-center justify-center mb-6">
                    <item.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Impact Stats Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/50 via-amber-900/50 to-red-900/50" />
          <div className="absolute inset-0 bg-[#0f0f1a]/80" />

          {/* Gradient border effect */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />

          <div className="relative z-10 mx-auto max-w-7xl px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white">Our Impact</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              {stats.map((stat, index) => (
                <StatCard key={stat.label} stat={stat} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Featured Courses Section */}
        <section className="py-24 relative">
          <div className="absolute inset-0 bg-[#0f0f1a]" />

          <div
            ref={coursesRef.ref}
            className={cn(
              "relative z-10 mx-auto max-w-7xl px-4 transition-all duration-1000",
              coursesRef.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            )}
          >
            <div className="flex items-end justify-between mb-12">
              <div>
                <Badge className="mb-4 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20">
                  <GraduationCap className="w-3 h-3 mr-1" />
                  Academy
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Start Learning Today
                </h2>
                <p className="mt-2 text-lg text-slate-400">
                  Our most popular courses to get you started
                </p>
              </div>
              <Button variant="outline" asChild className="hidden md:flex border-border/50 hover:bg-card">
                <Link href="/academy">
                  View All Courses
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredCourses.map((course, index) => (
                <Link
                  key={course.id}
                  href={`/academy/course/${course.id}`}
                  className={cn(
                    "group transition-all duration-500",
                    coursesRef.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  )}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <Card className="h-full bg-card/50 backdrop-blur border-border/50 overflow-hidden hover:border-primary/50 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                    {/* Thumbnail */}
                    <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                      {/* Play button overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                          <Play className="w-6 h-6 text-white fill-white" />
                        </div>
                      </div>

                      {/* Category badge */}
                      <Badge className={cn("absolute top-3 left-3 bg-gradient-to-r text-white", course.categoryColor)}>
                        {course.category}
                      </Badge>

                      {/* Course info */}
                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="flex items-center gap-3 text-white/80 text-sm">
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-3 h-3" />
                            {course.lessons} lessons
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {course.hours}h
                          </span>
                        </div>
                      </div>
                    </div>

                    <CardHeader className="pb-4">
                      <Badge variant="outline" className="w-fit text-xs mb-2">
                        {course.difficulty}
                      </Badge>
                      <CardTitle className="text-lg text-white group-hover:text-primary transition-colors line-clamp-2">
                        {course.title}
                      </CardTitle>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>

            <div className="mt-8 text-center md:hidden">
              <Button variant="outline" asChild className="border-border/50">
                <Link href="/academy">
                  View All Courses
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f1a] via-[#16162a] to-[#0f0f1a]" />

          <div
            ref={testimonialsRef.ref}
            className={cn(
              "relative z-10 mx-auto max-w-7xl px-4 transition-all duration-1000",
              testimonialsRef.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            )}
          >
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-pink-500/10 text-pink-400 hover:bg-pink-500/20">
                Community Voices
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Real Results from Real Learners
              </h2>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                Hear from our community members who are learning, growing, and achieving their goals.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card
                  key={index}
                  className={cn(
                    "bg-card/50 backdrop-blur border-border/50 hover:border-primary/30 transition-all duration-300",
                    testimonialsRef.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  )}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <CardContent className="pt-8 pb-6 relative">
                    {/* Quote icon */}
                    <div className="absolute -top-4 left-6 w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-amber-500 flex items-center justify-center">
                      <Quote className="w-5 h-5 text-white" />
                    </div>

                    {/* Rating */}
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>

                    <p className="text-slate-300 leading-relaxed mb-4">
                      &ldquo;{testimonial.content}&rdquo;
                    </p>

                    {/* Impact stat */}
                    <div className="text-sm text-emerald-400 font-medium mb-6">
                      {testimonial.stat}
                    </div>

                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12 ring-2 ring-primary/20">
                        <AvatarImage src={testimonial.avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-amber-500 text-white">
                          {testimonial.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-white">{testimonial.name}</div>
                        <div className="text-sm text-slate-500">
                          {testimonial.role} &bull; {testimonial.location}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* For Parents & Teachers Section */}
        <section className="py-24 relative">
          <div className="absolute inset-0 bg-[#0f0f1a]" />

          <div
            ref={parentRef.ref}
            className={cn(
              "relative z-10 mx-auto max-w-7xl px-4 transition-all duration-1000",
              parentRef.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            )}
          >
            <div className="grid md:grid-cols-2 gap-8">
              {/* For Parents */}
              <Card className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300">
                <CardHeader>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center mb-4">
                    <span className="text-2xl">👨‍👩‍👧</span>
                  </div>
                  <CardTitle className="text-2xl text-white">For Parents</CardTitle>
                  <CardDescription className="text-slate-400 text-base">
                    Keep your children safe and track their progress
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {["Track your child's progress", "Set screen time limits", "Safe, ad-free learning", "Get weekly reports"].map((item) => (
                      <li key={item} className="flex items-center gap-3 text-slate-300">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600" asChild>
                    <Link href="/parent-dashboard">
                      Parent Dashboard
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* For Teachers */}
              <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
                <CardHeader>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
                    <span className="text-2xl">👩‍🏫</span>
                  </div>
                  <CardTitle className="text-2xl text-white">For Teachers & Schools</CardTitle>
                  <CardDescription className="text-slate-400 text-base">
                    Powerful tools to enhance your classroom
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {["Classroom management tools", "Student progress tracking", "Curriculum-aligned content", "Assign coursework easily"].map((item) => (
                      <li key={item} className="flex items-center gap-3 text-slate-300">
                        <CheckCircle2 className="w-5 h-5 text-purple-400 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600" asChild>
                    <Link href="/teachers">
                      Teacher Resources
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Platform Features Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f1a] via-[#16162a] to-[#0f0f1a]" />

          <div
            ref={platformRef.ref}
            className={cn(
              "relative z-10 mx-auto max-w-7xl px-4 transition-all duration-1000",
              platformRef.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            )}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Explore Our Platform
              </h2>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                Three powerful modules designed for every aspect of Oromo community growth
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {platformFeatures.map((feature, index) => (
                <Link
                  key={feature.title}
                  href={feature.href}
                  className={cn(
                    "group transition-all duration-500",
                    platformRef.isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  )}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <Card className="h-full bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                    <CardContent className="p-8 text-center">
                      <div className={cn(
                        "w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br flex items-center justify-center mb-6",
                        "group-hover:scale-110 transition-transform duration-300",
                        feature.color
                      )}>
                        <feature.icon className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                      <p className="text-slate-400 mb-6">{feature.description}</p>
                      <div className="flex items-center justify-center text-primary font-semibold group-hover:gap-2 transition-all">
                        Explore {feature.title}
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-32 relative overflow-hidden">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-amber-900 to-red-900" />
          <div className="absolute inset-0 bg-[#0f0f1a]/50" />

          {/* Decorative orbs */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/30 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/30 rounded-full blur-[120px]" />

          <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur border border-white/20 mb-8">
              <Rocket className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-medium text-white">
                Join the fastest-growing Oromo learning platform
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Ready to Start Your <br />
              <span className="bg-gradient-to-r from-emerald-400 via-amber-400 to-red-400 bg-clip-text text-transparent">
                Learning Journey?
              </span>
            </h2>

            <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
              Join thousands of Oromo learners worldwide. It&apos;s free forever.
            </p>

            <Button
              size="lg"
              className="h-16 px-12 text-xl bg-white text-slate-900 hover:bg-slate-100 shadow-2xl shadow-white/20 hover:shadow-white/30 transition-all duration-300"
              asChild
            >
              <Link href="/signup">
                Create Free Account
                <ArrowRight className="ml-3 w-6 h-6" />
              </Link>
            </Button>

            {/* Trust badges */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-8 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>No credit card</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Free forever</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Safe for kids</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
