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
  Sparkles
} from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = {
  title: 'Learning Resources | Oromo Platform',
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
  resources: Resource[]
}

const resourceCategories: ResourceCategory[] = [
  {
    title: 'All-in-One Learning Platforms',
    description: 'Comprehensive platforms covering multiple subjects and grade levels',
    icon: <GraduationCap className="w-6 h-6" />,
    resources: [
      {
        name: 'Khan Academy',
        description: 'Free world-class education covering math, science, computing, history, art, economics, and more. Personalized learning dashboard for all ages.',
        url: 'https://www.khanacademy.org',
        icon: <GraduationCap className="w-8 h-8 text-green-600" />,
        tags: ['Math', 'Science', 'All Ages', 'Video Lessons'],
        isFree: true,
        isRecommended: true
      },
      {
        name: 'IXL Learning',
        description: 'Personalized learning platform with comprehensive curriculum for K-12. Covers math, language arts, science, social studies, and Spanish.',
        url: 'https://www.ixl.com',
        icon: <Calculator className="w-8 h-8 text-blue-600" />,
        tags: ['K-12', 'Math', 'Language Arts', 'Adaptive'],
        isFree: false,
        isRecommended: true
      },
      {
        name: 'Coursera',
        description: 'Online courses from top universities and companies. Earn certificates and degrees in various fields.',
        url: 'https://www.coursera.org',
        icon: <BookOpen className="w-8 h-8 text-blue-700" />,
        tags: ['University Courses', 'Certificates', 'Professional'],
        isFree: false
      },
      {
        name: 'edX',
        description: 'Free online courses from Harvard, MIT, and more. Offers MicroMasters and professional certificates.',
        url: 'https://www.edx.org',
        icon: <GraduationCap className="w-8 h-8 text-red-600" />,
        tags: ['University Courses', 'Free Audit', 'Certificates'],
        isFree: true
      },
      {
        name: 'Udemy',
        description: 'Vast library of courses on every topic. Learn at your own pace with lifetime access to purchased courses.',
        url: 'https://www.udemy.com',
        icon: <Video className="w-8 h-8 text-purple-600" />,
        tags: ['All Topics', 'Self-Paced', 'Affordable'],
        isFree: false
      }
    ]
  },
  {
    title: 'Kids Learning (Ages 3-12)',
    description: 'Fun, engaging platforms designed specifically for young learners',
    icon: <Baby className="w-6 h-6" />,
    resources: [
      {
        name: 'ABCmouse',
        description: 'Award-winning early learning program for ages 2-8. Covers reading, math, science, and art through games and activities.',
        url: 'https://www.abcmouse.com',
        icon: <Baby className="w-8 h-8 text-yellow-500" />,
        tags: ['Ages 2-8', 'Reading', 'Math', 'Games'],
        isFree: false,
        isRecommended: true
      },
      {
        name: 'PBS Kids',
        description: 'Free educational games and videos featuring beloved PBS characters. Safe, ad-free environment for kids.',
        url: 'https://pbskids.org',
        icon: <Sparkles className="w-8 h-8 text-green-500" />,
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
        icon: <Globe className="w-8 h-8 text-yellow-600" />,
        tags: ['Science', 'Animals', 'Geography', 'Free'],
        isFree: true
      },
      {
        name: 'Prodigy Math',
        description: 'Game-based math learning platform. Kids practice math while playing an adventure game.',
        url: 'https://www.prodigygame.com',
        icon: <Calculator className="w-8 h-8 text-purple-500" />,
        tags: ['Math', 'Game-Based', 'Grades 1-8'],
        isFree: true
      },
      {
        name: 'Epic!',
        description: 'Digital library with 40,000+ books for kids 12 and under. Includes audiobooks and read-to-me features.',
        url: 'https://www.getepic.com',
        icon: <BookOpen className="w-8 h-8 text-red-500" />,
        tags: ['Books', 'Reading', 'Audiobooks'],
        isFree: false
      },
      {
        name: 'Scratch (MIT)',
        description: 'Free coding platform for kids. Create stories, games, and animations while learning programming concepts.',
        url: 'https://scratch.mit.edu',
        icon: <Code className="w-8 h-8 text-orange-500" />,
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
    resources: [
      {
        name: 'Brilliant',
        description: 'Interactive STEM learning through problem-solving. Covers math, science, and computer science.',
        url: 'https://brilliant.org',
        icon: <Brain className="w-8 h-8 text-green-600" />,
        tags: ['Math', 'Science', 'Problem-Solving', 'Interactive'],
        isFree: false,
        isRecommended: true
      },
      {
        name: 'Wolfram Alpha',
        description: 'Computational knowledge engine. Get answers to math problems, science questions, and more.',
        url: 'https://www.wolframalpha.com',
        icon: <Calculator className="w-8 h-8 text-orange-600" />,
        tags: ['Math', 'Science', 'Calculator', 'Research'],
        isFree: true
      },
      {
        name: 'Desmos',
        description: 'Free online graphing calculator. Explore math through interactive visualizations.',
        url: 'https://www.desmos.com',
        icon: <Calculator className="w-8 h-8 text-green-500" />,
        tags: ['Graphing', 'Calculator', 'Free', 'Visualizations'],
        isFree: true
      },
      {
        name: 'PhET Simulations',
        description: 'Free interactive math and science simulations from University of Colorado Boulder.',
        url: 'https://phet.colorado.edu',
        icon: <Sparkles className="w-8 h-8 text-blue-500" />,
        tags: ['Simulations', 'Physics', 'Chemistry', 'Free'],
        isFree: true,
        isRecommended: true
      },
      {
        name: 'CK-12',
        description: 'Free textbooks, flashcards, and adaptive practice for math and science.',
        url: 'https://www.ck12.org',
        icon: <BookOpen className="w-8 h-8 text-teal-600" />,
        tags: ['Textbooks', 'Free', 'Math', 'Science'],
        isFree: true
      }
    ]
  },
  {
    title: 'Language Learning',
    description: 'Learn new languages including Afaan Oromo',
    icon: <Languages className="w-6 h-6" />,
    resources: [
      {
        name: 'Duolingo',
        description: 'The world\'s most popular language learning app. Free, fun, and effective for 40+ languages.',
        url: 'https://www.duolingo.com',
        icon: <Languages className="w-8 h-8 text-green-500" />,
        tags: ['40+ Languages', 'Free', 'Mobile App', 'Gamified'],
        isFree: true,
        isRecommended: true
      },
      {
        name: 'Babbel',
        description: 'Language learning app with real-world conversations. Courses designed by linguistic experts.',
        url: 'https://www.babbel.com',
        icon: <Languages className="w-8 h-8 text-orange-500" />,
        tags: ['Conversational', '14 Languages', 'Expert-Designed'],
        isFree: false
      },
      {
        name: 'italki',
        description: 'Connect with native speakers and professional tutors for 1-on-1 language lessons.',
        url: 'https://www.italki.com',
        icon: <Headphones className="w-8 h-8 text-red-500" />,
        tags: ['Tutors', 'Native Speakers', '150+ Languages'],
        isFree: false
      },
      {
        name: 'Memrise',
        description: 'Learn vocabulary through spaced repetition and videos of native speakers.',
        url: 'https://www.memrise.com',
        icon: <Brain className="w-8 h-8 text-yellow-500" />,
        tags: ['Vocabulary', 'Videos', 'Spaced Repetition'],
        isFree: true
      },
      {
        name: 'HelloTalk',
        description: 'Language exchange app. Practice with native speakers around the world.',
        url: 'https://www.hellotalk.com',
        icon: <Globe className="w-8 h-8 text-blue-400" />,
        tags: ['Language Exchange', 'Native Speakers', 'Free'],
        isFree: true
      }
    ]
  },
  {
    title: 'Coding & Technology',
    description: 'Learn programming and computer science',
    icon: <Code className="w-6 h-6" />,
    resources: [
      {
        name: 'freeCodeCamp',
        description: 'Free coding bootcamp covering web development, data science, and more. Earn certificates.',
        url: 'https://www.freecodecamp.org',
        icon: <Code className="w-8 h-8 text-green-600" />,
        tags: ['Free', 'Web Dev', 'Certificates', 'Full Curriculum'],
        isFree: true,
        isRecommended: true
      },
      {
        name: 'Codecademy',
        description: 'Interactive coding courses in Python, JavaScript, SQL, and more. Learn by doing.',
        url: 'https://www.codecademy.com',
        icon: <Code className="w-8 h-8 text-blue-600" />,
        tags: ['Interactive', 'Many Languages', 'Projects'],
        isFree: false
      },
      {
        name: 'The Odin Project',
        description: 'Free full-stack curriculum. Learn web development through hands-on projects.',
        url: 'https://www.theodinproject.com',
        icon: <Code className="w-8 h-8 text-gray-700 dark:text-gray-300" />,
        tags: ['Free', 'Full-Stack', 'Projects', 'Community'],
        isFree: true,
        isRecommended: true
      },
      {
        name: 'LeetCode',
        description: 'Practice coding interview questions. Prepare for tech job interviews.',
        url: 'https://leetcode.com',
        icon: <Code className="w-8 h-8 text-orange-500" />,
        tags: ['Interview Prep', 'Algorithms', 'Practice'],
        isFree: true
      },
      {
        name: 'CS50 (Harvard)',
        description: 'Harvard\'s introduction to computer science. One of the most popular CS courses ever.',
        url: 'https://cs50.harvard.edu',
        icon: <GraduationCap className="w-8 h-8 text-red-700" />,
        tags: ['Free', 'Harvard', 'Comprehensive', 'Beginner'],
        isFree: true,
        isRecommended: true
      },
      {
        name: 'Code.org',
        description: 'Learn computer science basics. Great for beginners and K-12 students.',
        url: 'https://code.org',
        icon: <Code className="w-8 h-8 text-orange-400" />,
        tags: ['K-12', 'Beginners', 'Free', 'Hour of Code'],
        isFree: true
      }
    ]
  },
  {
    title: 'Test Prep & College Readiness',
    description: 'Prepare for standardized tests and college admissions',
    icon: <FileText className="w-6 h-6" />,
    resources: [
      {
        name: 'Khan Academy SAT Prep',
        description: 'Free, official SAT practice in partnership with College Board. Personalized study plans.',
        url: 'https://www.khanacademy.org/sat',
        icon: <FileText className="w-8 h-8 text-blue-600" />,
        tags: ['SAT', 'Free', 'Official', 'Personalized'],
        isFree: true,
        isRecommended: true
      },
      {
        name: 'College Board',
        description: 'Official SAT registration, practice tests, and college planning resources.',
        url: 'https://www.collegeboard.org',
        icon: <GraduationCap className="w-8 h-8 text-blue-700" />,
        tags: ['SAT', 'AP Exams', 'College Planning'],
        isFree: true
      },
      {
        name: 'ACT',
        description: 'Official ACT resources, registration, and practice materials.',
        url: 'https://www.act.org',
        icon: <FileText className="w-8 h-8 text-red-600" />,
        tags: ['ACT', 'Practice Tests', 'Official'],
        isFree: true
      },
      {
        name: 'Common App',
        description: 'Apply to 1,000+ colleges with one application. Essay prompts and application resources.',
        url: 'https://www.commonapp.org',
        icon: <FileText className="w-8 h-8 text-green-600" />,
        tags: ['College Apps', 'Essays', '1000+ Schools'],
        isFree: true
      },
      {
        name: 'Magoosh',
        description: 'Affordable test prep for GRE, GMAT, SAT, ACT, and more. Video lessons and practice questions.',
        url: 'https://magoosh.com',
        icon: <Video className="w-8 h-8 text-purple-500" />,
        tags: ['GRE', 'GMAT', 'SAT', 'ACT', 'Affordable'],
        isFree: false
      }
    ]
  },
  {
    title: 'Career & Professional Development',
    description: 'Build job skills and advance your career',
    icon: <Briefcase className="w-6 h-6" />,
    resources: [
      {
        name: 'LinkedIn Learning',
        description: 'Professional courses on business, technology, and creative skills. Often free through libraries.',
        url: 'https://www.linkedin.com/learning',
        icon: <Briefcase className="w-8 h-8 text-blue-600" />,
        tags: ['Professional', 'Business', 'Tech', 'Creative'],
        isFree: false,
        isRecommended: true
      },
      {
        name: 'Google Career Certificates',
        description: 'Professional certificates in Data Analytics, IT Support, UX Design, and more. No degree required.',
        url: 'https://grow.google/certificates',
        icon: <GraduationCap className="w-8 h-8 text-blue-500" />,
        tags: ['Google', 'Certificates', 'Career Change'],
        isFree: false,
        isRecommended: true
      },
      {
        name: 'Skillshare',
        description: 'Creative and business classes. Design, photography, marketing, entrepreneurship.',
        url: 'https://www.skillshare.com',
        icon: <Palette className="w-8 h-8 text-green-500" />,
        tags: ['Creative', 'Business', 'Design'],
        isFree: false
      },
      {
        name: 'HubSpot Academy',
        description: 'Free marketing, sales, and customer service courses with certifications.',
        url: 'https://academy.hubspot.com',
        icon: <Briefcase className="w-8 h-8 text-orange-500" />,
        tags: ['Marketing', 'Sales', 'Free', 'Certificates'],
        isFree: true
      },
      {
        name: 'Toastmasters',
        description: 'Improve public speaking and leadership skills through local clubs worldwide.',
        url: 'https://www.toastmasters.org',
        icon: <Headphones className="w-8 h-8 text-red-600" />,
        tags: ['Public Speaking', 'Leadership', 'In-Person'],
        isFree: false
      }
    ]
  },
  {
    title: 'Arts & Music',
    description: 'Explore creativity through art and music education',
    icon: <Music className="w-6 h-6" />,
    resources: [
      {
        name: 'Yousician',
        description: 'Learn guitar, piano, bass, ukulele, and singing with interactive lessons.',
        url: 'https://yousician.com',
        icon: <Music className="w-8 h-8 text-blue-500" />,
        tags: ['Music', 'Instruments', 'Interactive'],
        isFree: false
      },
      {
        name: 'Simply Piano',
        description: 'Learn piano with a fun, interactive app. Great for beginners.',
        url: 'https://www.joytunes.com/simply-piano',
        icon: <Music className="w-8 h-8 text-blue-400" />,
        tags: ['Piano', 'Beginners', 'App'],
        isFree: false
      },
      {
        name: 'Drawspace',
        description: 'Free and paid drawing lessons for all skill levels.',
        url: 'https://www.drawspace.com',
        icon: <Palette className="w-8 h-8 text-purple-500" />,
        tags: ['Drawing', 'Art', 'All Levels'],
        isFree: true
      },
      {
        name: 'Proko',
        description: 'Art tutorials from professional artists. Figure drawing, anatomy, and more.',
        url: 'https://www.proko.com',
        icon: <Palette className="w-8 h-8 text-orange-400" />,
        tags: ['Drawing', 'Anatomy', 'Professional'],
        isFree: false
      },
      {
        name: 'Musictheory.net',
        description: 'Free music theory lessons and exercises. Learn to read music and understand harmony.',
        url: 'https://www.musictheory.net',
        icon: <Music className="w-8 h-8 text-teal-500" />,
        tags: ['Music Theory', 'Free', 'Reading Music'],
        isFree: true
      }
    ]
  },
  {
    title: 'Oromo & Ethiopian Resources',
    description: 'Resources specifically for learning about Oromo culture and language',
    icon: <Globe className="w-6 h-6" />,
    resources: [
      {
        name: 'Oromo Platform Academy',
        description: 'Our own courses on Afaan Oromo, Oromo history, and culture. Made for our community.',
        url: '/academy',
        icon: <GraduationCap className="w-8 h-8 text-emerald-600" />,
        tags: ['Afaan Oromo', 'History', 'Culture', 'Free'],
        isFree: true,
        isRecommended: true
      },
      {
        name: 'Oromo Studies Association',
        description: 'Academic organization promoting Oromo studies. Research papers and resources.',
        url: 'https://oromostudies.org',
        icon: <BookOpen className="w-8 h-8 text-green-700" />,
        tags: ['Academic', 'Research', 'Oromo Studies'],
        isFree: true
      },
      {
        name: 'Voice of America - Afaan Oromoo',
        description: 'News and content in Afaan Oromo. Great for language practice and staying informed.',
        url: 'https://www.voaafaanoromoo.com',
        icon: <Globe className="w-8 h-8 text-blue-600" />,
        tags: ['News', 'Afaan Oromo', 'Listening Practice'],
        isFree: true
      },
      {
        name: 'BBC News Afaan Oromoo',
        description: 'BBC news service in Afaan Oromo. Quality journalism in your language.',
        url: 'https://www.bbc.com/afaanoromoo',
        icon: <Globe className="w-8 h-8 text-red-600" />,
        tags: ['News', 'Afaan Oromo', 'BBC'],
        isFree: true
      },
      {
        name: 'Oromo Wiki',
        description: 'Our comprehensive wiki on Oromo history, culture, notable people, and more.',
        url: '/wiki',
        icon: <BookOpen className="w-8 h-8 text-slate-600 dark:text-slate-300" />,
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
      className="group block p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-600 hover:shadow-lg transition-all"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 p-3 bg-slate-100 dark:bg-slate-700 rounded-lg group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/30 transition-colors">
          {resource.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              {resource.name}
            </h3>
            {isExternal && (
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-500" />
            )}
            {resource.isRecommended && (
              <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 text-xs">
                Recommended
              </Badge>
            )}
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-3 line-clamp-2">
            {resource.description}
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={resource.isFree ? 'default' : 'secondary'}
              className={resource.isFree ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : ''}
            >
              {resource.isFree ? 'Free' : 'Paid'}
            </Badge>
            {resource.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs dark:border-slate-600 dark:text-slate-300">
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
    <>
      <Header />
      <main className="min-h-screen bg-slate-50 dark:bg-slate-900">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 text-white py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-6">
              <BookOpen className="w-4 h-4" />
              Curated Learning Resources
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Learning Resources
            </h1>
            <p className="text-xl text-emerald-100 max-w-2xl mx-auto mb-8">
              Discover the best educational platforms and tools to support your learning journey.
              From Khan Academy to coding bootcamps, we've curated the best resources for all ages.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg">
                <Star className="w-5 h-5 text-yellow-300" />
                <span>50+ Resources</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg">
                <GraduationCap className="w-5 h-5" />
                <span>All Ages</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg">
                <Globe className="w-5 h-5" />
                <span>Free & Paid Options</span>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Navigation */}
        <section className="py-8 bg-white dark:bg-slate-800 border-b dark:border-slate-700 sticky top-16 z-40">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {resourceCategories.map((category) => (
                <a
                  key={category.title}
                  href={`#${category.title.toLowerCase().replace(/\s+/g, '-')}`}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded-full text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 whitespace-nowrap transition-colors"
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
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600 dark:text-emerald-400">
                    {category.icon}
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{category.title}</h2>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mb-6 ml-12">
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
        <section className="py-16 bg-gradient-to-r from-slate-800 to-slate-900 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Can't Find What You're Looking For?</h2>
            <p className="text-slate-300 mb-8">
              Check out our Academy for Oromo-specific courses or suggest a resource to add to this list.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/academy"
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-semibold transition-colors"
              >
                Explore Our Academy
              </Link>
              <Link
                href="/contact"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-semibold transition-colors"
              >
                Suggest a Resource
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
