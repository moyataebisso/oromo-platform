'use client'

import { useState } from 'react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import { BookOpen, Layers, HelpCircle, Shuffle, Clock, Eye, Share2, Bookmark, ChevronRight, ArrowLeft } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
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
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-emerald-900/20 via-slate-900 to-slate-900 pt-8 pb-4">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-slate-400 mb-6">
            <Link href="/wiki" className="hover:text-emerald-400 transition-colors">Wiki</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href={`/wiki/category/${categorySlug}`} className="hover:text-emerald-400 transition-colors">
              {categoryName}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-white truncate max-w-[200px]">{article.title}</span>
          </nav>

          {/* Article Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full text-sm bg-slate-800 text-slate-300 border border-slate-700">
                {categoryIcon} {categoryName}
              </span>
              {article.is_featured && (
                <span className="px-3 py-1 rounded-full text-sm bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  ⭐ Featured
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{article.title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Updated {new Date(article.updated_at || article.created_at).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {(article.view_count || 0).toLocaleString()} views
              </span>
              {article.author_name && (
                <span className="text-slate-500">
                  By {article.author_name}
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 mt-4">
              <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-sm text-slate-300 transition-colors">
                <Bookmark className="h-4 w-4" /> Save
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-sm text-slate-300 transition-colors">
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
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-4 sticky top-24">
              <h3 className="font-semibold text-white mb-4">Table of Contents</h3>
              <nav className="space-y-2">
                {headings.map((heading: string, index: number) => (
                  <a
                    key={index}
                    href={`#${heading.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}`}
                    className="block text-sm text-slate-400 hover:text-emerald-400 transition-colors py-1"
                  >
                    {heading}
                  </a>
                ))}
              </nav>

              {/* Related Articles */}
              {relatedArticles.length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-700">
                  <h3 className="font-semibold text-white mb-4">Related Articles</h3>
                  <div className="space-y-3">
                    {relatedArticles.map((related) => (
                      <Link
                        key={related.id}
                        href={`/wiki/${related.slug}`}
                        className="block text-sm text-slate-400 hover:text-emerald-400 transition-colors"
                      >
                        {related.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Back to Wiki */}
              <div className="mt-6 pt-6 border-t border-slate-700">
                <Link
                  href="/wiki"
                  className="flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
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
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
              <div className="flex overflow-x-auto border-b border-slate-700">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    disabled={tab.count === 0 && tab.id !== 'learn'}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'text-emerald-400 border-b-2 border-emerald-400 bg-slate-700/50'
                        : tab.count === 0 && tab.id !== 'learn'
                          ? 'text-slate-600 cursor-not-allowed'
                          : 'text-slate-400 hover:text-white hover:bg-slate-700/30'
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                    {tab.count !== null && tab.count > 0 && (
                      <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-slate-700">
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'learn' && (
                  <article className="prose prose-invert prose-lg max-w-none">
                    <ReactMarkdown
                      components={{
                        h2: ({ children }) => {
                          const id = String(children).toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
                          return (
                            <h2
                              id={id}
                              className="text-2xl font-bold text-white mt-8 mb-4 scroll-mt-24 pb-2 border-b border-slate-700"
                            >
                              {children}
                            </h2>
                          )
                        },
                        h3: ({ children }) => (
                          <h3 className="text-xl font-semibold text-white mt-6 mb-3">{children}</h3>
                        ),
                        p: ({ children }) => (
                          <p className="text-slate-300 leading-relaxed mb-4">{children}</p>
                        ),
                        ul: ({ children }) => (
                          <ul className="list-disc list-inside text-slate-300 space-y-2 mb-4 ml-4">{children}</ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="list-decimal list-inside text-slate-300 space-y-2 mb-4 ml-4">{children}</ol>
                        ),
                        li: ({ children }) => (
                          <li className="text-slate-300">{children}</li>
                        ),
                        strong: ({ children }) => (
                          <strong className="text-emerald-400 font-semibold">{children}</strong>
                        ),
                        blockquote: ({ children }) => (
                          <blockquote className="border-l-4 border-emerald-500 pl-4 italic text-slate-400 my-4 bg-slate-800/50 py-2 rounded-r">
                            {children}
                          </blockquote>
                        ),
                        table: ({ children }) => (
                          <div className="overflow-x-auto my-6">
                            <table className="w-full border-collapse bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
                              {children}
                            </table>
                          </div>
                        ),
                        thead: ({ children }) => (
                          <thead className="bg-slate-700">{children}</thead>
                        ),
                        th: ({ children }) => (
                          <th className="px-4 py-3 text-left text-white font-semibold border-b border-slate-600">{children}</th>
                        ),
                        td: ({ children }) => (
                          <td className="px-4 py-3 border-b border-slate-700 text-slate-300">{children}</td>
                        ),
                        code: ({ children }) => (
                          <code className="bg-slate-700 px-2 py-1 rounded text-emerald-300 text-sm">{children}</code>
                        ),
                        a: ({ href, children }) => (
                          <a href={href} className="text-emerald-400 hover:text-emerald-300 underline transition-colors">
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
