import { Metadata } from 'next'
import Link from 'next/link'
import {
  GraduationCap,
  BookOpen,
  Globe,
  Baby,
  Briefcase,
  Code,
  Calculator,
  Languages,
  Music,
  Palette,
  Brain,
  FileText,
  Video,
  Headphones,
  ExternalLink,
  Star,
  Sparkles,
  Link2
} from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Learning Resources | Odda Academy',
  description: 'Curated educational resources including Khan Academy, IXL, Coursera, and more to support your learning journey.',
}

interface Resource {
  name: string
  description: string
  url: string
  icon: React.ReactNode
  tags: string[]
  isFree: boolean
  isRecommended?: boolean
}

interface ResourceCategory {
  title: string
  description: string
  icon: React.ReactNode
  color: string
  resources: Resource[]
}

const resourceCategories: ResourceCategory[] = [
  {
    title: 'All-in-One Learning Platforms',
    description: 'Comprehensive platforms covering multiple subjects and grade levels',
    icon: <GraduationCap className="w-6 h-6" />,
    color: 'from-blue-500 to-indigo-500',
    resources: [
      {
        name: 'Khan Academy',
        description: 'Free world-class education covering math, science, computing, history, art, economics, and more. Personalized learning dashboard for all ages.',
        url: 'https://www.khanacademy.org',
        icon: <GraduationCap className="w-8 h-8 text-emerald-400" />,
        tags: ['Math', 'Science', 'All Ages', 'Video Lessons'],
        isFree: true,
        isRecommended: true
      },
      {
        name: 'IXL Learning',
        description: 'Personalized learning platform with comprehensive curriculum for K-12. Covers math, language arts, science, social studies, and Spanish.',
        url: 'https://www.ixl.com',
        icon: <Calculator className="w-8 h-8 text-blue-400" />,
        tags: ['K-12', 'Math', 'Language Arts', 'Adaptive'],
        isFree: false,
        isRecommended: true
      },
      {
        name: 'Coursera',
        description: 'Online courses from top universities and companies. Earn certificates and degrees in various fields.',
        url: 'https://www.coursera.org',
        icon: <BookOpen className="w-8 h-8 text-blue-400" />,
        tags: ['University Courses', 'Certificates', 'Professional'],
        isFree: false
      },
      {
        name: 'edX',
        description: 'Free online courses from Harvard, MIT, and more. Offers MicroMasters and professional certificates.',
        url: 'https://www.edx.org',
        icon: <GraduationCap className="w-8 h-8 text-red-400" />,
        tags: ['University Courses', 'Free Audit', 'Certificates'],
        isFree: true
      },
      {
        name: 'Udemy',
        description: 'Vast library of courses on every topic. Learn at your own pace with lifetime access to purchased courses.',
        url: 'https://www.udemy.com',
        icon: <Video className="w-8 h-8 text-purple-400" />,
        tags: ['All Topics', 'Self-Paced', 'Affordable'],
        isFree: false
      }
    ]
  },
  {
    title: 'Kids Learning (Ages 3-12)',
    description: 'Fun, engaging platforms designed specifically for young learners',
    icon: <Baby className="w-6 h-6" />,
    color: 'from-pink-500 to-rose-500',
    resources: [
      {
        name: 'ABCmouse',
        description: 'Award-winning early learning program for ages 2-8. Covers reading, math, science, and art through games and activities.',
        url: 'https://www.abcmouse.com',
        icon: <Baby className="w-8 h-8 text-yellow-400" />,
        tags: ['Ages 2-8', 'Reading', 'Math', 'Games'],
        isFree: false,
        isRecommended: true
      },
      {
        name: 'PBS Kids',
        description: 'Free educational games and videos featuring beloved PBS characters. Safe, ad-free environment for kids.',
        url: 'https://pbskids.org',
        icon: <Sparkles className="w-8 h-8 text-emerald-400" />,
        tags: ['Free', 'Games', 'Videos', 'Safe'],
        isFree: true,
        isRecommended: true
      },
      {
        name: 'Starfall',
        description: 'Learn to read with phonics. Fun activities for pre-K through 3rd grade covering reading and math.',
        url: 'https://www.starfall.com',
        icon: <Star className="w-8 h-8 text-yellow-400" />,
        tags: ['Phonics', 'Reading', 'Pre-K to 3rd'],
        isFree: true
      },
      {
        name: 'National Geographic Kids',
        description: 'Explore the world through games, videos, and articles about animals, science, and geography.',
        url: 'https://kids.nationalgeographic.com',
        icon: <Globe className="w-8 h-8 text-yellow-400" />,
        tags: ['Science', 'Animals', 'Geography', 'Free'],
        isFree: true
      },
      {
        name: 'Scratch (MIT)',
        description: 'Free coding platform for kids. Create stories, games, and animations while learning programming concepts.',
        url: 'https://scratch.mit.edu',
        icon: <Code className="w-8 h-8 text-orange-400" />,
        tags: ['Coding', 'Free', 'Creative', 'Ages 8-16'],
        isFree: true,
        isRecommended: true
      }
    ]
  },
  {
    title: 'Math & Science',
    description: 'Specialized resources for STEM subjects',
    icon: <Calculator className="w-6 h-6" />,
    color: 'from-emerald-500 to-teal-500',
    resources: [
      {
        name: 'Brilliant',
        description: 'Interactive STEM learning through problem-solving. Covers math, science, and computer science.',
        url: 'https://brilliant.org',
        icon: <Brain className="w-8 h-8 text-emerald-400" />,
        tags: ['Math', 'Science', 'Problem-Solving', 'Interactive'],
        isFree: false,
        isRecommended: true
      },
      {
        name: 'Desmos',
        description: 'Free online graphing calculator. Explore math through interactive visualizations.',
        url: 'https://www.desmos.com',
        icon: <Calculator className="w-8 h-8 text-emerald-400" />,
        tags: ['Graphing', 'Calculator', 'Free', 'Visualizations'],
        isFree: true
      },
      {
        name: 'PhET Simulations',
        description: 'Free interactive math and science simulations from University of Colorado Boulder.',
        url: 'https://phet.colorado.edu',
        icon: <Sparkles className="w-8 h-8 text-blue-400" />,
        tags: ['Simulations', 'Physics', 'Chemistry', 'Free'],
        isFree: true,
        isRecommended: true
      }
    ]
  },
  {
    title: 'Language Learning',
    description: 'Learn new languages including Afaan Oromo',
    icon: <Languages className="w-6 h-6" />,
    color: 'from-purple-500 to-violet-500',
    resources: [
      {
        name: 'Duolingo',
        description: 'The world\'s most popular language learning app. Free, fun, and effective for 40+ languages.',
        url: 'https://www.duolingo.com',
        icon: <Languages className="w-8 h-8 text-emerald-400" />,
        tags: ['40+ Languages', 'Free', 'Mobile App', 'Gamified'],
        isFree: true,
        isRecommended: true
      },
      {
        name: 'Babbel',
        description: 'Language learning app with real-world conversations. Courses designed by linguistic experts.',
        url: 'https://www.babbel.com',
        icon: <Languages className="w-8 h-8 text-orange-400" />,
        tags: ['Conversational', '14 Languages', 'Expert-Designed'],
        isFree: false
      },
      {
        name: 'italki',
        description: 'Connect with native speakers and professional tutors for 1-on-1 language lessons.',
        url: 'https://www.italki.com',
        icon: <Headphones className="w-8 h-8 text-red-400" />,
        tags: ['Tutors', 'Native Speakers', '150+ Languages'],
        isFree: false
      }
    ]
  },
  {
    title: 'Coding & Technology',
    description: 'Learn programming and computer science',
    icon: <Code className="w-6 h-6" />,
    color: 'from-amber-500 to-orange-500',
    resources: [
      {
        name: 'freeCodeCamp',
        description: 'Free coding bootcamp covering web development, data science, and more. Earn certificates.',
        url: 'https://www.freecodecamp.org',
        icon: <Code className="w-8 h-8 text-emerald-400" />,
        tags: ['Free', 'Web Dev', 'Certificates', 'Full Curriculum'],
        isFree: true,
        isRecommended: true
      },
      {
        name: 'Codecademy',
        description: 'Interactive coding courses in Python, JavaScript, SQL, and more. Learn by doing.',
        url: 'https://www.codecademy.com',
        icon: <Code className="w-8 h-8 text-blue-400" />,
        tags: ['Interactive', 'Many Languages', 'Projects'],
        isFree: false
      },
      {
        name: 'The Odin Project',
        description: 'Free full-stack curriculum. Learn web development through hands-on projects.',
        url: 'https://www.theodinproject.com',
        icon: <Code className="w-8 h-8 text-slate-400" />,
        tags: ['Free', 'Full-Stack', 'Projects', 'Community'],
        isFree: true,
        isRecommended: true
      },
      {
        name: 'CS50 (Harvard)',
        description: 'Harvard\'s introduction to computer science. One of the most popular CS courses ever.',
        url: 'https://cs50.harvard.edu',
        icon: <GraduationCap className="w-8 h-8 text-red-400" />,
        tags: ['Free', 'Harvard', 'Comprehensive', 'Beginner'],
        isFree: true,
        isRecommended: true
      }
    ]
  },
  {
    title: 'Test Prep & College Readiness',
    description: 'Prepare for standardized tests and college admissions',
    icon: <FileText className="w-6 h-6" />,
    color: 'from-cyan-500 to-blue-500',
    resources: [
      {
        name: 'Khan Academy SAT Prep',
        description: 'Free, official SAT practice in partnership with College Board. Personalized study plans.',
        url: 'https://www.khanacademy.org/sat',
        icon: <FileText className="w-8 h-8 text-blue-400" />,
        tags: ['SAT', 'Free', 'Official', 'Personalized'],
        isFree: true,
        isRecommended: true
      },
      {
        name: 'College Board',
        description: 'Official SAT registration, practice tests, and college planning resources.',
        url: 'https://www.collegeboard.org',
        icon: <GraduationCap className="w-8 h-8 text-blue-400" />,
        tags: ['SAT', 'AP Exams', 'College Planning'],
        isFree: true
      },
      {
        name: 'Common App',
        description: 'Apply to 1,000+ colleges with one application. Essay prompts and application resources.',
        url: 'https://www.commonapp.org',
        icon: <FileText className="w-8 h-8 text-emerald-400" />,
        tags: ['College Apps', 'Essays', '1000+ Schools'],
        isFree: true
      }
    ]
  },
  {
    title: 'Career & Professional Development',
    description: 'Build job skills and advance your career',
    icon: <Briefcase className="w-6 h-6" />,
    color: 'from-indigo-500 to-purple-500',
    resources: [
      {
        name: 'LinkedIn Learning',
        description: 'Professional courses on business, technology, and creative skills. Often free through libraries.',
        url: 'https://www.linkedin.com/learning',
        icon: <Briefcase className="w-8 h-8 text-blue-400" />,
        tags: ['Professional', 'Business', 'Tech', 'Creative'],
        isFree: false,
        isRecommended: true
      },
      {
        name: 'Google Career Certificates',
        description: 'Professional certificates in Data Analytics, IT Support, UX Design, and more. No degree required.',
        url: 'https://grow.google/certificates',
        icon: <GraduationCap className="w-8 h-8 text-blue-400" />,
        tags: ['Google', 'Certificates', 'Career Change'],
        isFree: false,
        isRecommended: true
      },
      {
        name: 'HubSpot Academy',
        description: 'Free marketing, sales, and customer service courses with certifications.',
        url: 'https://academy.hubspot.com',
        icon: <Briefcase className="w-8 h-8 text-orange-400" />,
        tags: ['Marketing', 'Sales', 'Free', 'Certificates'],
        isFree: true
      }
    ]
  },
  {
    title: 'Arts & Music',
    description: 'Explore creativity through art and music education',
    icon: <Music className="w-6 h-6" />,
    color: 'from-pink-500 to-purple-500',
    resources: [
      {
        name: 'Yousician',
        description: 'Learn guitar, piano, bass, ukulele, and singing with interactive lessons.',
        url: 'https://yousician.com',
        icon: <Music className="w-8 h-8 text-blue-400" />,
        tags: ['Music', 'Instruments', 'Interactive'],
        isFree: false
      },
      {
        name: 'Drawspace',
        description: 'Free and paid drawing lessons for all skill levels.',
        url: 'https://www.drawspace.com',
        icon: <Palette className="w-8 h-8 text-purple-400" />,
        tags: ['Drawing', 'Art', 'All Levels'],
        isFree: true
      },
      {
        name: 'Musictheory.net',
        description: 'Free music theory lessons and exercises. Learn to read music and understand harmony.',
        url: 'https://www.musictheory.net',
        icon: <Music className="w-8 h-8 text-teal-400" />,
        tags: ['Music Theory', 'Free', 'Reading Music'],
        isFree: true
      }
    ]
  },
  {
    title: 'Oromo & Ethiopian Resources',
    description: 'Resources specifically for learning about Oromo culture and language',
    icon: <Globe className="w-6 h-6" />,
    color: 'from-emerald-500 to-cyan-500',
    resources: [
      {
        name: 'Odda Academy',
        description: 'Our own courses on Afaan Oromo, Oromo history, and culture. Made for our community.',
        url: '/academy',
        icon: <GraduationCap className="w-8 h-8 text-emerald-400" />,
        tags: ['Afaan Oromo', 'History', 'Culture', 'Free'],
        isFree: true,
        isRecommended: true
      },
      {
        name: 'Voice of America - Afaan Oromoo',
        description: 'News and content in Afaan Oromo. Great for language practice and staying informed.',
        url: 'https://www.voaafaanoromoo.com',
        icon: <Globe className="w-8 h-8 text-blue-400" />,
        tags: ['News', 'Afaan Oromo', 'Listening Practice'],
        isFree: true
      },
      {
        name: 'BBC News Afaan Oromoo',
        description: 'BBC news service in Afaan Oromo. Quality journalism in your language.',
        url: 'https://www.bbc.com/afaanoromoo',
        icon: <Globe className="w-8 h-8 text-red-400" />,
        tags: ['News', 'Afaan Oromo', 'BBC'],
        isFree: true
      },
      {
        name: 'Oromo Wiki',
        description: 'Our comprehensive wiki on Oromo history, culture, notable people, and more.',
        url: '/wiki',
        icon: <BookOpen className="w-8 h-8 text-slate-400" />,
        tags: ['Wiki', 'History', 'Culture', 'Free'],
        isFree: true,
        isRecommended: true
      }
    ]
  }
]

function ResourceCard({ resource }: { resource: Resource }) {
  const isExternal = resource.url.startsWith('http')

  return (
    <a
      href={resource.url}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className="group block p-6 bg-card/50 backdrop-blur rounded-xl border border-border/50 hover:border-primary/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 p-3 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-lg group-hover:from-primary/30 group-hover:to-purple-500/30 transition-colors">
          {resource.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {resource.name}
            </h3>
            {isExternal && (
              <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
            )}
            {resource.isRecommended && (
              <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 border text-xs">
                <Star className="w-3 h-3 mr-1 fill-amber-400" />
                Recommended
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {resource.description}
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge
              className={resource.isFree
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 border'
                : 'bg-slate-500/10 text-slate-400 border-slate-500/20 border'
              }
            >
              {resource.isFree ? 'Free' : 'Paid'}
            </Badge>
            {resource.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </a>
  )
}

export default function ResourcesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-purple-900/50 via-background to-background relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-[120px]" />

          <div className="relative max-w-7xl mx-auto px-4 text-center">
            <Badge className="mb-4 bg-purple-500/10 text-purple-400">
              <Link2 className="w-3 h-3 mr-1" />
              Curated Resources
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Learning Resources
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Discover the best educational platforms and tools to support your learning journey.
              From Khan Academy to coding bootcamps, we've curated the best resources for all ages.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-card/50 backdrop-blur rounded-lg border border-border/50">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                <span className="text-foreground">50+ Resources</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-card/50 backdrop-blur rounded-lg border border-border/50">
                <GraduationCap className="w-5 h-5 text-primary" />
                <span className="text-foreground">All Ages</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-card/50 backdrop-blur rounded-lg border border-border/50">
                <Globe className="w-5 h-5 text-emerald-400" />
                <span className="text-foreground">Free & Paid Options</span>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Navigation */}
        <section className="py-6 bg-card/30 border-b border-border/50 sticky top-16 z-40 backdrop-blur-lg">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {resourceCategories.map((category) => (
                <a
                  key={category.title}
                  href={`#${category.title.toLowerCase().replace(/\s+/g, '-')}`}
                  className="flex items-center gap-2 px-4 py-2 bg-card/50 hover:bg-primary/10 border border-border/50 hover:border-primary/50 rounded-full text-sm font-medium text-muted-foreground hover:text-primary whitespace-nowrap transition-all"
                >
                  {category.icon}
                  {category.title}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Resource Categories */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 space-y-16">
            {resourceCategories.map((category) => (
              <div
                key={category.title}
                id={category.title.toLowerCase().replace(/\s+/g, '-')}
                className="scroll-mt-40"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 bg-gradient-to-br ${category.color} rounded-lg text-white`}>
                    {category.icon}
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">{category.title}</h2>
                </div>
                <p className="text-muted-foreground mb-6 ml-12">
                  {category.description}
                </p>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.resources.map((resource) => (
                    <ResourceCard key={resource.name} resource={resource} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 via-purple-900/50 to-pink-900/50" />
          <div className="absolute inset-0 bg-background/50" />

          <div className="relative max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">Can't Find What You're Looking For?</h2>
            <p className="text-muted-foreground mb-8">
              Check out our Academy for Oromo-specific courses or suggest a resource to add to this list.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="gradient" size="lg" asChild>
                <Link href="/academy">
                  Explore Our Academy
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/contact">
                  Suggest a Resource
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
