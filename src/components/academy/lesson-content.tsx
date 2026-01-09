'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ArrowLeft, ArrowRight, CheckCircle, BookOpen, GraduationCap, Brain, Gamepad2, Menu, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { FlashcardViewer } from './flashcard-viewer'
import { LessonQuiz } from './lesson-quiz'
import { MatchGame } from './match-game'
import { ProgressBanner } from './progress-banner'
import { useLessonProgress } from '@/hooks/use-lesson-progress'

interface Flashcard {
  id: string
  term: string
  definition: string
  order_index: number
}

interface SidebarLesson {
  id: string
  title: string
  order_index: number
}

interface LessonContentProps {
  lesson: {
    id: string
    title: string
    content: string | null
    video_url: string | null
  }
  course: {
    id: string
    title: string
    slug: string
  }
  lessons: SidebarLesson[]
  flashcards: Flashcard[]
  prevLesson: SidebarLesson | null
  nextLesson: SidebarLesson | null
  currentLessonId: string
}

type Tab = 'learn' | 'flashcards' | 'quiz' | 'match'

export const LessonContent = ({
  lesson,
  course,
  lessons,
  flashcards,
  prevLesson,
  nextLesson,
  currentLessonId
}: LessonContentProps) => {
  const [activeTab, setActiveTab] = useState<Tab>('learn')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [justCompleted, setJustCompleted] = useState(false)

  const {
    user,
    isLoading,
    isCompleted,
    courseProgress,
    markComplete,
    updateLastAccessed,
  } = useLessonProgress(currentLessonId, course.id)

  // Update last accessed when lesson loads
  useEffect(() => {
    updateLastAccessed()
  }, [updateLastAccessed])

  // Debug logging in client component
  useEffect(() => {
    console.log('[LessonContent] Flashcards received:', flashcards?.length || 0)
    console.log('[LessonContent] Has flashcards:', flashcards && flashcards.length > 0)
  }, [flashcards])

  const hasFlashcards = flashcards && flashcards.length > 0
  const canQuiz = flashcards && flashcards.length >= 4
  const canMatch = flashcards && flashcards.length >= 2

  const tabs = [
    { id: 'learn' as Tab, label: 'Learn', icon: BookOpen, enabled: true },
    { id: 'flashcards' as Tab, label: 'Flashcards', icon: GraduationCap, enabled: hasFlashcards },
    { id: 'quiz' as Tab, label: 'Quiz', icon: Brain, enabled: canQuiz },
    { id: 'match' as Tab, label: 'Match', icon: Gamepad2, enabled: canMatch },
  ]

  const handleMarkComplete = async () => {
    await markComplete()
    setJustCompleted(true)
    setTimeout(() => setJustCompleted(false), 3000)
  }

  const handleQuizComplete = async (score: number, total: number) => {
    const percentage = Math.round((score / total) * 100)
    await markComplete(percentage)
    setJustCompleted(true)
  }

  const handleFlashcardsComplete = async () => {
    if (!isCompleted) {
      await markComplete()
      setJustCompleted(true)
    }
  }

  const handleMatchComplete = async () => {
    if (!isCompleted) {
      await markComplete()
      setJustCompleted(true)
    }
  }

  const isLessonCompleted = (lessonId: string) => {
    return courseProgress.get(lessonId)?.completed ?? false
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Guest banner */}
      {!isLoading && !user && <ProgressBanner variant="info" />}

      {/* Just completed banner */}
      {justCompleted && user && <ProgressBanner variant="success" />}

      <div className="flex gap-6">
        {/* Mobile sidebar toggle */}
        <Button
          variant="outline"
          size="icon"
          className="lg:hidden fixed bottom-4 left-4 z-50 shadow-lg"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Sidebar */}
        <aside className={cn(
          "w-64 flex-shrink-0",
          "lg:block",
          sidebarOpen
            ? "fixed inset-y-0 left-0 z-40 bg-background p-4 shadow-xl lg:relative lg:p-0 lg:shadow-none"
            : "hidden"
        )}>
          <Card className="sticky top-4 bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <h3 className="font-semibold text-foreground mb-4">Course Content</h3>
              <div className="space-y-1 max-h-[60vh] overflow-y-auto">
                {lessons.map((l, index) => {
                  const completed = isLessonCompleted(l.id)
                  const isCurrent = l.id === currentLessonId

                  return (
                    <Link
                      key={l.id}
                      href={`/academy/${course.slug}/lesson/${l.id}`}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        'flex items-center gap-3 p-2 rounded-md text-sm transition-colors',
                        isCurrent
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:bg-slate-700/50'
                      )}
                    >
                      <div className={cn(
                        'w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0',
                        isCurrent
                          ? 'bg-primary text-primary-foreground'
                          : completed
                            ? 'bg-green-500 text-white'
                            : 'bg-slate-700 text-slate-400'
                      )}>
                        {completed ? (
                          <Check className="w-3 h-3" />
                        ) : (
                          index + 1
                        )}
                      </div>
                      <span className="truncate">{l.title}</span>
                      {completed && !isCurrent && (
                        <CheckCircle className="w-3 h-3 text-green-500 ml-auto flex-shrink-0" />
                      )}
                    </Link>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-0">
              {/* Tabs */}
              <div className="border-b border-slate-700">
                <div className="flex overflow-x-auto">
                  {tabs.filter(tab => tab.enabled).map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors",
                        "border-b-2 -mb-px whitespace-nowrap",
                        "hover:text-foreground",
                        activeTab === tab.id
                          ? "border-primary text-primary"
                          : "border-transparent text-muted-foreground"
                      )}
                    >
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab content */}
              <div className="p-6 md:p-8">
                {activeTab === 'learn' && (
                  <div>
                    {/* Lesson Title */}
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                      {lesson.title}
                    </h1>

                    {/* Video embed if available */}
                    {lesson.video_url && (
                      <div className="aspect-video bg-slate-900 rounded-xl mb-8 overflow-hidden">
                        <iframe
                          src={lesson.video_url}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    )}

                    {/* Lesson Content with ReactMarkdown */}
                    {lesson.content && (
                      <article className="prose-academy max-w-none">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            table: ({ children, ...props }) => (
                              <div className="overflow-x-auto my-6">
                                <table className="min-w-full" {...props}>{children}</table>
                              </div>
                            ),
                            th: ({ children, ...props }) => (
                              <th className="bg-slate-700 text-white font-semibold" {...props}>{children}</th>
                            ),
                            td: ({ children, ...props }) => (
                              <td {...props}>{children}</td>
                            ),
                            h1: ({ children, ...props }) => (
                              <h1 className="text-3xl font-bold text-foreground mt-8 mb-4" {...props}>{children}</h1>
                            ),
                            h2: ({ children, ...props }) => (
                              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4" {...props}>{children}</h2>
                            ),
                            h3: ({ children, ...props }) => (
                              <h3 className="text-xl font-medium text-foreground mt-6 mb-3" {...props}>{children}</h3>
                            ),
                            p: ({ children, ...props }) => (
                              <p className="text-muted-foreground mb-4 leading-relaxed" {...props}>{children}</p>
                            ),
                            ul: ({ children, ...props }) => (
                              <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2" {...props}>{children}</ul>
                            ),
                            ol: ({ children, ...props }) => (
                              <ol className="list-decimal list-inside text-muted-foreground mb-4 space-y-2" {...props}>{children}</ol>
                            ),
                            li: ({ children, ...props }) => (
                              <li className="text-muted-foreground" {...props}>{children}</li>
                            ),
                            strong: ({ children, ...props }) => (
                              <strong className="text-foreground font-semibold" {...props}>{children}</strong>
                            ),
                            blockquote: ({ children, ...props }) => (
                              <blockquote className="border-l-4 border-primary pl-4 my-4 italic text-muted-foreground" {...props}>{children}</blockquote>
                            ),
                            code: ({ children, className, ...props }) => {
                              const isInline = !className
                              if (isInline) {
                                return (
                                  <code className="bg-slate-700 px-1.5 py-0.5 rounded text-sm text-slate-200" {...props}>{children}</code>
                                )
                              }
                              return (
                                <code className={className} {...props}>{children}</code>
                              )
                            },
                            pre: ({ children, ...props }) => (
                              <pre className="bg-slate-900 p-4 rounded-lg overflow-x-auto mb-4" {...props}>{children}</pre>
                            ),
                          }}
                        >
                          {lesson.content}
                        </ReactMarkdown>
                      </article>
                    )}

                    {/* Navigation */}
                    <div className="flex items-center justify-between flex-wrap gap-4 mt-8 pt-8 border-t border-slate-700">
                      {prevLesson ? (
                        <Button variant="outline" asChild className="border-slate-600 hover:bg-slate-700">
                          <Link href={`/academy/${course.slug}/lesson/${prevLesson.id}`}>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Previous
                          </Link>
                        </Button>
                      ) : (
                        <div />
                      )}

                      <Button
                        onClick={handleMarkComplete}
                        disabled={isCompleted}
                        className={cn(
                          isCompleted
                            ? "bg-green-600 hover:bg-green-600 cursor-default"
                            : "bg-green-600 hover:bg-green-700"
                        )}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {isCompleted ? 'Completed' : 'Mark Complete'}
                      </Button>

                      {nextLesson ? (
                        <Button asChild>
                          <Link href={`/academy/${course.slug}/lesson/${nextLesson.id}`}>
                            Next
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Link>
                        </Button>
                      ) : (
                        <Button asChild>
                          <Link href={`/academy/${course.slug}`}>
                            Finish Course
                            <CheckCircle className="w-4 h-4 ml-2" />
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'flashcards' && hasFlashcards && (
                  <FlashcardViewer
                    flashcards={flashcards}
                  />
                )}

                {activeTab === 'quiz' && canQuiz && (
                  <LessonQuiz
                    flashcards={flashcards}
                    onComplete={handleQuizComplete}
                  />
                )}

                {activeTab === 'match' && canMatch && (
                  <MatchGame
                    flashcards={flashcards}
                    onComplete={handleMatchComplete}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
