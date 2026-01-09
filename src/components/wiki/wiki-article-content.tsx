'use client'

import { useState } from 'react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { BookOpen, Layers, HelpCircle, Shuffle, Clock, Eye, Share2, Bookmark, ChevronRight, ArrowLeft } from 'lucide-react'
import { WikiFlashcardViewer } from './wiki-flashcard-viewer'
import { WikiQuizMode } from './wiki-quiz-mode'
import { WikiMatchGame } from './wiki-match-game'

interface WikiArticleContentProps {
  article: {
    id: string
    title: string
    slug: string
    content: string
    summary?: string
    category?: string
    is_featured?: boolean
    view_count?: number
    author_name?: string
    created_at: string
    updated_at?: string
    wiki_categories?: {
      name: string
      slug: string
      icon?: string
    }
  }
  flashcards: Array<{
    id: string
    term: string
    definition: string
  }>
  quizQuestions: Array<{
    id: string
    question: string
    correct_answer: string
    wrong_answers: string[]
    explanation?: string
  }>
  relatedArticles: Array<{
    id: string
    title: string
    slug: string
    summary?: string
    category?: string
  }>
}

type TabType = 'learn' | 'flashcards' | 'quiz' | 'match'

interface Tab {
  id: TabType
  label: string
  icon: typeof BookOpen
  count: number | null
}

export function WikiArticleContent({ article, flashcards, quizQuestions, relatedArticles }: WikiArticleContentProps) {
  const [activeTab, setActiveTab] = useState<TabType>('learn')

  const tabs: Tab[] = [
    { id: 'learn', label: 'Learn', icon: BookOpen, count: null },
    { id: 'flashcards', label: 'Flashcards', icon: Layers, count: flashcards.length },
    { id: 'quiz', label: 'Quiz', icon: HelpCircle, count: quizQuestions.length },
    { id: 'match', label: 'Match', icon: Shuffle, count: flashcards.length > 0 ? Math.min(flashcards.length, 8) : 0 },
  ]

  // Extract headings for table of contents
  const headings = article.content?.match(/^##\s+(.+)$/gm)?.map((h: string) => h.replace('## ', '')) || []

  const categoryName = article.wiki_categories?.name || article.category || 'Wiki'
  const categorySlug = article.wiki_categories?.slug || 'general'
  const categoryIcon = article.wiki_categories?.icon || '📚'

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-primary/10 via-background to-background pt-8 pb-4">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/wiki" className="hover:text-primary transition-colors">Wiki</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href={`/wiki/category/${categorySlug}`} className="hover:text-primary transition-colors">
              {categoryName}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground truncate max-w-[200px]">{article.title}</span>
          </nav>

          {/* Article Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full text-sm bg-secondary text-secondary-foreground border border-border">
                {categoryIcon} {categoryName}
              </span>
              {article.is_featured && (
                <span className="px-3 py-1 rounded-full text-sm bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                  ⭐ Featured
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{article.title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Updated {new Date(article.updated_at || article.created_at).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {(article.view_count || 0).toLocaleString()} views
              </span>
              {article.author_name && (
                <span>By {article.author_name}</span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 mt-4">
              <button className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 border border-border rounded-lg text-sm text-secondary-foreground transition-colors">
                <Bookmark className="h-4 w-4" /> Save
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 border border-border rounded-lg text-sm text-secondary-foreground transition-colors">
                <Share2 className="h-4 w-4" /> Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Left */}
          <aside className="lg:w-64 flex-shrink-0 order-2 lg:order-1">
            <div className="bg-card rounded-xl border border-border p-4 sticky top-24 shadow-sm">
              <h3 className="font-semibold text-foreground mb-4">Table of Contents</h3>
              <nav className="space-y-2">
                {headings.map((heading: string, index: number) => (
                  <a
                    key={index}
                    href={`#${heading.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}`}
                    className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1"
                  >
                    {heading}
                  </a>
                ))}
              </nav>

              {/* Related Articles */}
              {relatedArticles.length > 0 && (
                <div className="mt-6 pt-6 border-t border-border">
                  <h3 className="font-semibold text-foreground mb-4">Related Articles</h3>
                  <div className="space-y-3">
                    {relatedArticles.map((related) => (
                      <Link
                        key={related.id}
                        href={`/wiki/${related.slug}`}
                        className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {related.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Back to Wiki */}
              <div className="mt-6 pt-6 border-t border-border">
                <Link
                  href="/wiki"
                  className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Wiki
                </Link>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0 order-1 lg:order-2">
            {/* Tabs */}
            <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
              <div className="flex overflow-x-auto border-b border-border">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    disabled={tab.count === 0 && tab.id !== 'learn'}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'text-primary border-b-2 border-primary bg-primary/5'
                        : tab.count === 0 && tab.id !== 'learn'
                          ? 'text-muted-foreground/50 cursor-not-allowed'
                          : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                    {tab.count !== null && tab.count > 0 && (
                      <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-secondary text-secondary-foreground">
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'learn' && (
                  <article className="prose prose-slate dark:prose-invert prose-lg max-w-none">
                    <ReactMarkdown
                      components={{
                        h2: ({ children }) => {
                          const id = String(children).toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
                          return (
                            <h2
                              id={id}
                              className="text-2xl font-bold text-foreground mt-8 mb-4 scroll-mt-24 pb-2 border-b border-border"
                            >
                              {children}
                            </h2>
                          )
                        },
                        h3: ({ children }) => (
                          <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">{children}</h3>
                        ),
                        p: ({ children }) => (
                          <p className="text-muted-foreground leading-relaxed mb-4">{children}</p>
                        ),
                        ul: ({ children }) => (
                          <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4 ml-4">{children}</ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="list-decimal list-inside text-muted-foreground space-y-2 mb-4 ml-4">{children}</ol>
                        ),
                        li: ({ children }) => (
                          <li className="text-muted-foreground">{children}</li>
                        ),
                        strong: ({ children }) => (
                          <strong className="text-primary font-semibold">{children}</strong>
                        ),
                        blockquote: ({ children }) => (
                          <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-4 bg-secondary/50 py-2 rounded-r">
                            {children}
                          </blockquote>
                        ),
                        table: ({ children }) => (
                          <div className="overflow-x-auto my-6">
                            <table className="w-full border-collapse bg-card rounded-lg overflow-hidden border border-border">
                              {children}
                            </table>
                          </div>
                        ),
                        thead: ({ children }) => (
                          <thead className="bg-secondary">{children}</thead>
                        ),
                        th: ({ children }) => (
                          <th className="px-4 py-3 text-left text-foreground font-semibold border-b border-border">{children}</th>
                        ),
                        td: ({ children }) => (
                          <td className="px-4 py-3 border-b border-border text-muted-foreground">{children}</td>
                        ),
                        code: ({ children }) => (
                          <code className="bg-secondary px-2 py-1 rounded text-primary text-sm">{children}</code>
                        ),
                        a: ({ href, children }) => (
                          <a href={href} className="text-primary hover:text-primary/80 underline transition-colors">
                            {children}
                          </a>
                        ),
                      }}
                    >
                      {article.content}
                    </ReactMarkdown>
                  </article>
                )}

                {activeTab === 'flashcards' && (
                  <WikiFlashcardViewer flashcards={flashcards} />
                )}

                {activeTab === 'quiz' && (
                  <WikiQuizMode questions={quizQuestions} />
                )}

                {activeTab === 'match' && (
                  <WikiMatchGame flashcards={flashcards.slice(0, 8)} />
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
