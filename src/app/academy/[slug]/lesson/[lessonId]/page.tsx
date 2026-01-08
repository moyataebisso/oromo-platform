import Link from 'next/link'
import { ArrowLeft, ArrowRight, CheckCircle, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { cn } from '@/lib/utils'

// Mock lesson data
const mockLesson = {
  id: '3',
  course_id: '1',
  title: 'Basic Greetings & Introductions',
  content: `
## Welcome to Lesson 3: Basic Greetings & Introductions

In this lesson, you'll learn essential greetings and how to introduce yourself in Afaan Oromoo.

### Common Greetings

| Afaan Oromoo | English |
|--------------|---------|
| Akkam | Hello (informal) |
| Nagaa | Peace / Hello |
| Akkam jirta? | How are you? (to one person) |
| Akkam jirtu? | How are you? (plural/formal) |
| Nagaatti | Goodbye |
| Galatoomaa | Thank you |

### Introducing Yourself

**Maqaan koo...** - My name is...

Example dialogue:
- A: Akkam! Maqaan koo Faaxumaa. Maqaan kee eenyu?
- B: Akkam! Maqaan koo Gammachuu. Nagaa!

### Practice Exercise

Try to greet someone and introduce yourself using the phrases above.

1. Say hello
2. Ask how they are
3. Tell them your name
4. Say goodbye

### Key Vocabulary

- **Maqaa** - Name
- **Koo** - My
- **Kee** - Your (informal)
- **Keessan** - Your (formal)
- **Eenyu** - Who

Next lesson, we'll learn numbers and counting!
  `,
  video_url: null,
  order_index: 3,
  is_published: true,
  created_at: '',
  duration_minutes: 20,
}

const mockCourse = {
  id: '1',
  title: 'Introduction to Afaan Oromoo',
  slug: 'intro-afaan-oromoo',
}

const mockLessons = [
  { id: '1', title: 'Welcome & Course Overview', order_index: 1 },
  { id: '2', title: 'The Oromo Alphabet (Qubee)', order_index: 2 },
  { id: '3', title: 'Basic Greetings & Introductions', order_index: 3 },
  { id: '4', title: 'Numbers and Counting', order_index: 4 },
  { id: '5', title: 'Common Nouns & Articles', order_index: 5 },
]

interface LessonPageProps {
  params: Promise<{ slug: string; lessonId: string }>
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { slug, lessonId } = await params
  const lesson = mockLesson
  const course = mockCourse
  const lessons = mockLessons

  const currentIndex = lessons.findIndex(l => l.id === lessonId)
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-8">
          {/* Breadcrumb */}
          <Link
            href={`/academy/${slug}`}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {course.title}
          </Link>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar - Lesson List */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-slate-900 mb-4">Course Content</h3>
                  <div className="space-y-1">
                    {lessons.map((l, index) => (
                      <Link
                        key={l.id}
                        href={`/academy/${slug}/lesson/${l.id}`}
                        className={cn(
                          'flex items-center gap-3 p-2 rounded-md text-sm transition-colors',
                          l.id === lessonId
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-slate-600 hover:bg-slate-50'
                        )}
                      >
                        <div className={cn(
                          'w-6 h-6 rounded-full flex items-center justify-center text-xs',
                          l.id === lessonId
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-200 text-slate-600'
                        )}>
                          {index + 1}
                        </div>
                        <span className="truncate">{l.title}</span>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 order-1 lg:order-2">
              <Card>
                <CardContent className="p-6 md:p-8">
                  {/* Video placeholder */}
                  {lesson.video_url ? (
                    <div className="aspect-video bg-slate-900 rounded-lg mb-8">
                      {/* Video player would go here */}
                    </div>
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg mb-8 flex items-center justify-center">
                      <div className="text-center text-white">
                        <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-80" />
                        <p className="text-lg font-medium">Text-based lesson</p>
                      </div>
                    </div>
                  )}

                  {/* Lesson Title */}
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
                    {lesson.title}
                  </h1>

                  {/* Lesson Content */}
                  <div className="prose prose-slate max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: formatMarkdown(lesson.content || '') }} />
                  </div>

                  <Separator className="my-8" />

                  {/* Navigation */}
                  <div className="flex items-center justify-between">
                    {prevLesson ? (
                      <Button variant="outline" asChild>
                        <Link href={`/academy/${slug}/lesson/${prevLesson.id}`}>
                          <ArrowLeft className="w-4 h-4 mr-2" />
                          Previous
                        </Link>
                      </Button>
                    ) : (
                      <div />
                    )}

                    <Button className="bg-green-600 hover:bg-green-700">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark Complete
                    </Button>

                    {nextLesson ? (
                      <Button asChild>
                        <Link href={`/academy/${slug}/lesson/${nextLesson.id}`}>
                          Next
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    ) : (
                      <Button asChild>
                        <Link href={`/academy/${slug}`}>
                          Finish Course
                          <CheckCircle className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

// Simple markdown to HTML converter
function formatMarkdown(content: string): string {
  return content
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-6 mb-3">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-8 mb-4">$1</h2>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n\n/g, '</p><p class="mb-4">')
    .replace(/\n- (.*)/g, '<li class="ml-4">$1</li>')
    .replace(/^\| (.*) \|$/gim, '<tr><td class="border px-3 py-2">$1</td></tr>')
    .replace(/\n/g, '<br />')
}
