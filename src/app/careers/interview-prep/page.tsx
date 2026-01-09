import Link from 'next/link'
import { Search, ArrowLeft, Briefcase, Target, BookOpen } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Input } from '@/components/ui/input'
import { InterviewQuestionCard } from '@/components/careers/interview-question-card'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

const questionCategories = [
  { slug: 'all', name: 'All' },
  { slug: 'general', name: 'General' },
  { slug: 'technical', name: 'Technical' },
  { slug: 'behavioral', name: 'Behavioral' },
  { slug: 'clinical', name: 'Clinical' },
  { slug: 'case study', name: 'Case Study' },
]

const difficulties = [
  { slug: 'all', name: 'All Levels' },
  { slug: 'easy', name: 'Easy' },
  { slug: 'medium', name: 'Medium' },
  { slug: 'hard', name: 'Hard' },
]

interface InterviewPrepPageProps {
  searchParams: Promise<{ career?: string; category?: string; difficulty?: string; q?: string }>
}

interface Career {
  id: string
  title: string
  slug: string
}

interface Question {
  id: string
  question: string
  sample_answer?: string
  tips?: string
  category: string
  difficulty: string
  career_id?: string
  careers?: { title: string }
}

export default async function InterviewPrepPage({ searchParams }: InterviewPrepPageProps) {
  const params = await searchParams
  const supabase = await createClient()

  const selectedCareer = params.career || 'all'
  const selectedCategory = params.category || 'all'
  const selectedDifficulty = params.difficulty || 'all'
  const searchQuery = params.q || ''

  // Fetch all careers for the filter
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: careersData } = await (supabase as any)
    .from('careers')
    .select('id, title, slug')
    .order('title')

  const careers = (careersData || []) as Career[]

  // Build questions query
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query = (supabase as any)
    .from('interview_questions')
    .select('*, careers(title)')
    .order('difficulty')

  // Filter by career
  if (selectedCareer !== 'all') {
    const career = careers.find(c => c.slug === selectedCareer)
    if (career) {
      query = query.eq('career_id', career.id)
    }
  }

  // Filter by category
  if (selectedCategory !== 'all') {
    query = query.eq('category', selectedCategory)
  }

  // Filter by difficulty
  if (selectedDifficulty !== 'all') {
    query = query.eq('difficulty', selectedDifficulty)
  }

  // Search
  if (searchQuery) {
    query = query.ilike('question', `%${searchQuery}%`)
  }

  const { data: questionsData } = await query.limit(50)
  const questions = (questionsData || []) as Question[]

  // Fetch general questions (no career) first if no career filter
  let generalQuestions: Question[] = []
  if (selectedCareer === 'all') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase as any)
      .from('interview_questions')
      .select('*, careers(title)')
      .is('career_id', null)
      .order('difficulty')
      .limit(10)
    generalQuestions = (data || []) as Question[]
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-900">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-slate-800 to-slate-900 pt-24 pb-12">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <Link
              href="/careers"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Careers
            </Link>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Ace Your Interview
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Practice with real interview questions and expert tips to land your dream job.
            </p>
          </div>
        </section>

        {/* Quick Tips */}
        <section className="max-w-4xl mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mb-3">
                <Briefcase className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Research the Company</h3>
              <p className="text-sm text-slate-400">
                Understand the company&apos;s mission, values, and recent news before your interview.
              </p>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center mb-3">
                <Target className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Use the STAR Method</h3>
              <p className="text-sm text-slate-400">
                Structure answers with Situation, Task, Action, and Result for behavioral questions.
              </p>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mb-3">
                <BookOpen className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Practice Out Loud</h3>
              <p className="text-sm text-slate-400">
                Rehearse your answers out loud to build confidence and improve delivery.
              </p>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="bg-slate-800/50 border-y border-slate-700 sticky top-16 z-30 backdrop-blur-lg">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <form className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-2">
                {/* Career Filter */}
                <select
                  name="career"
                  defaultValue={selectedCareer}
                  className="px-4 py-2 rounded-lg bg-slate-700 text-white border border-slate-600 text-sm"
                >
                  <option value="all">All Careers</option>
                  {careers?.map((career) => (
                    <option key={career.id} value={career.slug}>
                      {career.title}
                    </option>
                  ))}
                </select>

                {/* Category Pills */}
                {questionCategories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/careers/interview-prep?career=${selectedCareer}&category=${cat.slug}&difficulty=${selectedDifficulty}${searchQuery ? `&q=${searchQuery}` : ''}`}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === cat.slug
                        ? 'bg-primary text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-4">
                {/* Difficulty Pills */}
                <div className="flex gap-2">
                  {difficulties.map((diff) => (
                    <Link
                      key={diff.slug}
                      href={`/careers/interview-prep?career=${selectedCareer}&category=${selectedCategory}&difficulty=${diff.slug}${searchQuery ? `&q=${searchQuery}` : ''}`}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        selectedDifficulty === diff.slug
                          ? 'bg-slate-600 text-white'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {diff.name}
                    </Link>
                  ))}
                </div>

                {/* Search */}
                <div className="relative flex-1 md:max-w-xs ml-auto">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    name="q"
                    placeholder="Search questions..."
                    defaultValue={searchQuery}
                    className="pl-10 bg-slate-700 border-slate-600"
                  />
                  <input type="hidden" name="career" value={selectedCareer} />
                  <input type="hidden" name="category" value={selectedCategory} />
                  <input type="hidden" name="difficulty" value={selectedDifficulty} />
                </div>
              </div>
            </form>
          </div>
        </section>

        {/* Questions List */}
        <section className="max-w-4xl mx-auto px-4 py-12">
          {/* General Questions Section */}
          {generalQuestions && generalQuestions.length > 0 && selectedCareer === 'all' && selectedCategory === 'all' && (
            <div className="mb-12">
              <h2 className="text-xl font-bold text-white mb-4">General Interview Questions</h2>
              <div className="space-y-4">
                {generalQuestions.map((question) => (
                  <InterviewQuestionCard key={question.id} question={question} />
                ))}
              </div>
            </div>
          )}

          {/* Filtered Questions */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">
              {selectedCareer !== 'all' || selectedCategory !== 'all' || selectedDifficulty !== 'all'
                ? 'Filtered Questions'
                : 'Career-Specific Questions'}
            </h2>
            {questions && questions.length > 0 ? (
              <div className="space-y-4">
                {questions.map((question) => (
                  <InterviewQuestionCard key={question.id} question={question} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-800 rounded-xl">
                <p className="text-slate-400 text-lg">No questions found matching your filters.</p>
                <Link href="/careers/interview-prep" className="text-primary hover:underline mt-2 inline-block">
                  Clear filters
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
