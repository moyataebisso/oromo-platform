import Link from 'next/link'
import { 
  GraduationCap, 
  Briefcase, 
  BookOpen, 
  Users, 
  Globe, 
  Heart,
  ArrowRight,
  Play,
  Star,
  MapPin,
  Clock,
  TrendingUp,
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { NewsSection } from '@/components/news/news-section'
//import { createClient } from '@/lib/supabase/server'

// Featured content (will be replaced with real data)
const featuredCourses = [
  {
    id: '1',
    title: 'Introduction to Afaan Oromo',
    description: 'Learn the basics of the Oromo language, including alphabet, pronunciation, and common phrases.',
    thumbnail_url: '/images/courses/oromo-language.jpg',
    category: { name: 'Language', color: 'blue' },
    difficulty: 'beginner',
    estimated_hours: 10,
    lesson_count: 12,
  },
  {
    id: '2',
    title: 'Oromo History & Heritage',
    description: 'Explore the rich history of the Oromo people from ancient times to the present day.',
    thumbnail_url: '/images/courses/oromo-history.jpg',
    category: { name: 'History', color: 'amber' },
    difficulty: 'beginner',
    estimated_hours: 8,
    lesson_count: 10,
  },
  {
    id: '3',
    title: 'Web Development Fundamentals',
    description: 'Start your tech career with HTML, CSS, and JavaScript basics.',
    thumbnail_url: '/images/courses/web-dev.jpg',
    category: { name: 'Technology', color: 'green' },
    difficulty: 'beginner',
    estimated_hours: 20,
    lesson_count: 24,
  },
]

const featuredJobs = [
  {
    id: '1',
    title: 'Software Engineer',
    company_name: 'TechCorp',
    location: 'Minneapolis, MN',
    is_remote: true,
    job_type: 'full-time',
    salary_min: 80000,
    salary_max: 120000,
  },
  {
    id: '2',
    title: 'Marketing Manager',
    company_name: 'Global Solutions',
    location: 'Remote',
    is_remote: true,
    job_type: 'full-time',
    salary_min: 70000,
    salary_max: 90000,
  },
  {
    id: '3',
    title: 'Healthcare Administrator',
    company_name: 'Community Health',
    location: 'Washington, DC',
    is_remote: false,
    job_type: 'full-time',
    salary_min: 65000,
    salary_max: 85000,
  },
]

const recentArticles = [
  {
    id: '1',
    title: 'The Gadaa System: Ancient Democratic Governance',
    excerpt: 'Explore the sophisticated democratic system that governed Oromo society for centuries.',
    category: { name: 'History', color: 'amber' },
    read_time: 8,
  },
  {
    id: '2',
    title: 'Oromo Music: Traditional Instruments & Melodies',
    excerpt: 'Discover the rich musical heritage and traditional instruments of the Oromo people.',
    category: { name: 'Culture', color: 'purple' },
    read_time: 6,
  },
  {
    id: '3',
    title: 'Famous Oromo Athletes & Their Legacy',
    excerpt: 'From marathon champions to Olympic heroes, celebrating Oromo athletic excellence.',
    category: { name: 'People', color: 'green' },
    read_time: 5,
  },
]

const testimonials = [
  {
    name: 'Fatuma A.',
    role: 'Student',
    location: 'Minneapolis, USA',
    avatar: '/images/avatars/user1.jpg',
    content: 'This platform helped me reconnect with my roots. The Afaan Oromo course is amazing - I can finally speak with my grandmother in her native language!',
  },
  {
    name: 'Bekele T.',
    role: 'Software Engineer',
    location: 'London, UK',
    avatar: '/images/avatars/user2.jpg',
    content: 'Found my dream job through the careers section. The Oromo professional network here is incredible and supportive.',
  },
  {
    name: 'Chaltu M.',
    role: 'Teacher',
    location: 'Toronto, Canada',
    avatar: '/images/avatars/user3.jpg',
    content: 'The wiki has been an invaluable resource for teaching my students about Oromo history and culture. Thank you for preserving our heritage!',
  },
]

const features = [
  {
    icon: GraduationCap,
    title: 'Academy',
    description: 'Learn Oromo language, history, culture, and professional skills through expert-crafted courses.',
    href: '/academy',
    color: 'from-blue-500 to-blue-600',
    stats: '50+ Courses',
  },
  {
    icon: Briefcase,
    title: 'Careers',
    description: 'Connect with employers, find opportunities, and advance your professional journey.',
    href: '/careers',
    color: 'from-emerald-500 to-emerald-600',
    stats: '1000+ Jobs',
  },
  {
    icon: BookOpen,
    title: 'Wiki',
    description: 'Explore and contribute to our comprehensive knowledge base of Oromo heritage.',
    href: '/wiki',
    color: 'from-amber-500 to-amber-600',
    stats: '500+ Articles',
  },
]

const stats = [
  { value: '40M+', label: 'Oromo People Worldwide', icon: Users },
  { value: '500+', label: 'Educational Resources', icon: BookOpen },
  { value: '1000+', label: 'Job Opportunities', icon: Briefcase },
  { value: '50+', label: 'Countries Connected', icon: Globe },
]

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case 'beginner': return 'bg-green-100 text-green-700'
    case 'intermediate': return 'bg-amber-100 text-amber-700'
    case 'advanced': return 'bg-red-100 text-red-700'
    default: return 'bg-slate-100 text-slate-700'
  }
}

function getCategoryColor(color: string) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-700',
    amber: 'bg-amber-100 text-amber-700',
    green: 'bg-green-100 text-green-700',
    purple: 'bg-purple-100 text-purple-700',
    red: 'bg-red-100 text-red-700',
  }
  return colors[color] || 'bg-slate-100 text-slate-700'
}

export default async function HomePage() {
  // In production, fetch real data from Supabase
  // const supabase = createClient()
  // const { data: courses } = await supabase.from('courses').select('*').eq('is_featured', true).limit(3)
  // const { data: jobs } = await supabase.from('jobs').select('*').eq('status', 'approved').limit(3)
  // const { data: articles } = await supabase.from('wiki_articles').select('*').eq('status', 'published').limit(3)

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* Hero Section - Enhanced with mesh gradient */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50" />
          
          {/* Decorative elements */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-40 right-1/4 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl animate-pulse delay-500" />
          
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:14px_24px]" />
          
          <div className="relative mx-auto max-w-7xl px-4">
            <div className="text-center max-w-4xl mx-auto">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur border border-slate-200 shadow-sm mb-8">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-medium text-slate-700">
                  Empowering 40 Million+ Oromo Worldwide
                </span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                <span className="text-slate-900">Connect. Learn.</span>
                <br />
                <span className="bg-gradient-to-r from-emerald-600 via-blue-600 to-amber-600 bg-clip-text text-transparent">
                  Grow Together.
                </span>
              </h1>
              
              <p className="mt-8 text-xl md:text-2xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
                The unified platform for the global Oromo community — 
                <span className="text-slate-900 font-medium"> education</span>,
                <span className="text-slate-900 font-medium"> career opportunities</span>, and
                <span className="text-slate-900 font-medium"> cultural preservation</span> in one place.
              </p>
              
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="h-14 px-8 text-lg bg-slate-900 hover:bg-slate-800" asChild>
                  <Link href="/signup">
                    Get Started Free
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-2" asChild>
                  <Link href="/academy">
                    <Play className="mr-2 w-5 h-5" />
                    Explore Courses
                  </Link>
                </Button>
              </div>

              {/* Social proof */}
              <div className="mt-12 flex items-center justify-center gap-8 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 border-2 border-white" />
                    ))}
                  </div>
                  <span>Join <strong className="text-slate-700">10,000+</strong> members</span>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="ml-1"><strong className="text-slate-700">4.9</strong> rating</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section - Enhanced with icons and animation */}
        <section className="py-16 bg-slate-900 relative overflow-hidden">
          {/* Subtle pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px]" />
          
          <div className="relative mx-auto max-w-7xl px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              {stats.map((stat, index) => (
                <div 
                  key={stat.label} 
                  className="text-center group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 mb-4 group-hover:bg-white/20 transition-colors">
                    <stat.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-white">
                    {stat.value}
                  </div>
                  <div className="mt-2 text-slate-400 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section - Enhanced cards */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-4">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4 px-4 py-1">
                Our Platform
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900">
                Everything You Need to Thrive
              </h2>
              <p className="mt-6 text-xl text-slate-600 max-w-2xl mx-auto">
                Three powerful platforms designed to serve every aspect of the Oromo community growth.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature) => (
                <Link key={feature.title} href={feature.href} className="group">
                  <Card className="h-full border-2 hover:border-slate-300 hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <CardHeader className="pb-4">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        <feature.icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl">{feature.title}</CardTitle>
                        <Badge variant="secondary" className="font-semibold">
                          {feature.stats}
                        </Badge>
                      </div>
                      <CardDescription className="text-base mt-2">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center text-slate-900 font-semibold group-hover:text-blue-600 transition-colors">
                        Explore {feature.title}
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Courses Section */}
        <section className="py-20 bg-slate-50">
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex items-end justify-between mb-12">
              <div>
                <Badge variant="outline" className="mb-4 px-4 py-1">
                  <GraduationCap className="w-3 h-3 mr-1" />
                  Academy
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                  Featured Courses
                </h2>
                <p className="mt-2 text-lg text-slate-600">
                  Start your learning journey with our most popular courses
                </p>
              </div>
              <Button variant="outline" asChild className="hidden md:flex">
                <Link href="/academy">
                  View All Courses
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {featuredCourses.map((course) => (
                <Link key={course.id} href={`/academy/course/${course.id}`} className="group">
                  <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300">
                    {/* Thumbnail */}
                    <div className="aspect-video bg-gradient-to-br from-slate-200 to-slate-300 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <Badge className={`absolute top-3 left-3 ${getCategoryColor(course.category.color)}`}>
                        {course.category.name}
                      </Badge>
                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="flex items-center gap-2 text-white text-sm">
                          <Clock className="w-4 h-4" />
                          {course.estimated_hours} hours
                          <span className="mx-1">•</span>
                          {course.lesson_count} lessons
                        </div>
                      </div>
                    </div>
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className={getDifficultyColor(course.difficulty)}>
                          {course.difficulty}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl group-hover:text-blue-600 transition-colors line-clamp-2">
                        {course.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {course.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>

            <div className="mt-8 text-center md:hidden">
              <Button variant="outline" asChild>
                <Link href="/academy">
                  View All Courses
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Latest Jobs Section */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex items-end justify-between mb-12">
              <div>
                <Badge variant="outline" className="mb-4 px-4 py-1">
                  <Briefcase className="w-3 h-3 mr-1" />
                  Careers
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                  Latest Opportunities
                </h2>
                <p className="mt-2 text-lg text-slate-600">
                  Find your next career move in the Oromo professional network
                </p>
              </div>
              <Button variant="outline" asChild className="hidden md:flex">
                <Link href="/careers">
                  View All Jobs
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>

            <div className="space-y-4">
              {featuredJobs.map((job) => (
                <Link key={job.id} href={`/careers/jobs/${job.id}`} className="block group">
                  <Card className="hover:shadow-lg hover:border-slate-300 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          {/* Company logo placeholder */}
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center flex-shrink-0">
                            <Briefcase className="w-6 h-6 text-slate-400" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                              {job.title}
                            </h3>
                            <p className="text-slate-600 font-medium">{job.company_name}</p>
                            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-slate-500">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {job.location}
                              </span>
                              {job.is_remote && (
                                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                                  Remote
                                </Badge>
                              )}
                              <Badge variant="outline">{job.job_type}</Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-lg font-semibold text-slate-900">
                              ${(job.salary_min / 1000).toFixed(0)}k - ${(job.salary_max / 1000).toFixed(0)}k
                            </div>
                            <div className="text-sm text-slate-500">per year</div>
                          </div>
                          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            <div className="mt-8 text-center md:hidden">
              <Button variant="outline" asChild>
                <Link href="/careers">
                  View All Jobs
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Recent Wiki Articles */}
        <section className="py-20 bg-slate-50">
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex items-end justify-between mb-12">
              <div>
                <Badge variant="outline" className="mb-4 px-4 py-1">
                  <BookOpen className="w-3 h-3 mr-1" />
                  Wiki
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                  Explore Our Heritage
                </h2>
                <p className="mt-2 text-lg text-slate-600">
                  Discover the rich history and culture of the Oromo people
                </p>
              </div>
              <Button variant="outline" asChild className="hidden md:flex">
                <Link href="/wiki">
                  Browse Wiki
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {recentArticles.map((article) => (
                <Link key={article.id} href={`/wiki/article/${article.id}`} className="group">
                  <Card className="h-full hover:shadow-xl transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getCategoryColor(article.category.color)}>
                          {article.category.name}
                        </Badge>
                        <span className="text-sm text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {article.read_time} min read
                        </span>
                      </div>
                      <CardTitle className="text-xl group-hover:text-blue-600 transition-colors line-clamp-2">
                        {article.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-3">
                        {article.excerpt}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center text-slate-900 font-medium group-hover:text-blue-600 transition-colors">
                        Read Article
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            <div className="mt-8 text-center md:hidden">
              <Button variant="outline" asChild>
                <Link href="/wiki">
                  Browse Wiki
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* News Section */}
        <NewsSection />

        {/* Testimonials Section */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4 px-4 py-1">
                Community Voices
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                Loved by Our Community
              </h2>
              <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
                Hear from members who are learning, growing, and connecting on our platform.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="relative">
                  <CardContent className="pt-8 pb-6">
                    {/* Quote mark */}
                    <div className="absolute -top-4 left-6 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                      <span className="text-white text-2xl font-serif">"</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed mb-6">
                      {testimonial.content}
                    </p>
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={testimonial.avatar} />
                        <AvatarFallback className="bg-slate-200">
                          {testimonial.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-slate-900">{testimonial.name}</div>
                        <div className="text-sm text-slate-500">
                          {testimonial.role} • {testimonial.location}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section - Enhanced */}
        <section className="py-20 md:py-28 relative overflow-hidden">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
          
          {/* Decorative elements */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />
          
          <div className="relative mx-auto max-w-4xl px-4 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur border border-white/20 mb-8">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-medium text-white">
                Join the fastest-growing Oromo community platform
              </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
              Ready to Get Started?
            </h2>
            <p className="mt-6 text-xl text-slate-300 max-w-2xl mx-auto">
              Join thousands of Oromo worldwide who are learning, connecting, and growing together. 
              It is free to sign up.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="h-14 px-8 text-lg bg-white text-slate-900 hover:bg-slate-100" asChild>
                <Link href="/signup">
                  Create Free Account
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="h-14 px-8 text-lg bg-transparent text-white border-2 border-white/30 hover:bg-white/10 hover:border-white/50"
                asChild
              >
                <Link href="/about">Learn More About Us</Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Free forever for learners
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Cancel anytime
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}