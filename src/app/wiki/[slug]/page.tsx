import Link from 'next/link'
import { ArrowLeft, Clock, Eye, Edit, Bookmark, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { SocialShare } from '@/components/shared/social-share'
import { WikiArticle } from '@/types/wiki'

// Mock article data
const mockArticle: WikiArticle = {
  id: '1',
  title: 'The Gadaa System: Ancient Democratic Governance',
  slug: 'gadaa-system',
  content: `
## Introduction

The Gadaa system is an indigenous democratic socio-political system practiced by the Oromo people of Ethiopia and parts of Kenya. It is one of the oldest and most sophisticated systems of governance in Africa, predating many modern democratic systems by centuries.

## Historical Background

The origins of the Gadaa system date back over 500 years, though oral traditions suggest it may be even older. The system was developed as a way to organize society, maintain peace, and ensure the equitable distribution of resources among the Oromo people.

In 2016, UNESCO inscribed the Gadaa system on the Representative List of the Intangible Cultural Heritage of Humanity, recognizing its significance as a living cultural tradition.

## Structure and Organization

### The Gadaa Grades

The Gadaa system divides males into age sets (hiriya) that pass through five grades over a 40-year cycle:

1. **Dabballee** (0-8 years): Childhood stage
2. **Folle/Gamme** (8-16 years): Junior stage
3. **Qondaala** (16-24 years): Senior junior stage
4. **Kuusa** (24-32 years): Preparation for leadership
5. **Gadaa** (32-40 years): Active ruling class

### The Abba Gadaa

The Abba Gadaa is the democratically elected leader who presides over the Gadaa assembly (Gumi Gayo). He serves a non-renewable eight-year term and is responsible for:

- Presiding over the legislative assembly
- Administering justice
- Leading religious ceremonies
- Representing the Oromo people in external affairs

## Democratic Principles

The Gadaa system embodies several democratic principles that were revolutionary for its time:

- **Term limits**: Leaders serve fixed, non-renewable terms
- **Separation of powers**: Different bodies handle legislative, judicial, and executive functions
- **Peaceful transfer of power**: Transition ceremonies ensure smooth handovers
- **Checks and balances**: Multiple councils prevent concentration of power

## Laws and Legislation

The primary laws of the Gadaa system are called **Seera** (laws) and **Heera** (bylaws). These are:

- Reviewed and updated every eight years
- Codified through oral tradition
- Publicly announced at the Gumi Gayo assembly
- Binding on all members of society

## Modern Relevance

Today, the Gadaa system continues to be practiced in various Oromo communities, though its political influence has diminished under the Ethiopian state structure. However, it remains:

- A source of cultural identity
- A framework for conflict resolution
- An inspiration for democratic governance
- A subject of academic study worldwide

## Conclusion

The Gadaa system represents one of humanity's earliest experiments in democratic governance. Its sophisticated structure, emphasis on term limits, and systems of checks and balances demonstrate that complex democratic societies existed in Africa long before European colonization.
  `,
  category_id: '1',
  author_id: '1',
  status: 'published',
  is_featured: true,
  views_count: 1250,
  created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  category: { id: '1', name: 'History', slug: 'history', description: null },
  author: { id: '1', display_name: 'Bekele Abera', avatar_url: null },
}

const relatedArticles = [
  { title: 'Abba Gadaa: Leadership in Oromo Society', slug: 'abba-gadaa' },
  { title: 'Gumi Gayo: The Oromo Legislative Assembly', slug: 'gumi-gayo' },
  { title: 'Irreecha and the Gadaa Calendar', slug: 'irreecha-gadaa-calendar' },
]

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

interface ArticlePageProps {
  params: Promise<{ slug: string }>
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  void slug
  const article = mockArticle

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-white">
        {/* Breadcrumb */}
        <div className="border-b">
          <div className="mx-auto max-w-7xl px-4 py-3">
            <nav className="flex items-center gap-2 text-sm text-slate-600">
              <Link href="/wiki" className="hover:text-slate-900">Wiki</Link>
              <ChevronRight className="w-4 h-4" />
              {article.category && (
                <>
                  <Link href={`/wiki/category/${article.category.slug}`} className="hover:text-slate-900">
                    {article.category.name}
                  </Link>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
              <span className="text-slate-900 truncate">{article.title}</span>
            </nav>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <article className="lg:col-span-3">
              {/* Article Header */}
              <header className="mb-8">
                {article.category && (
                  <Badge variant="secondary" className="mb-4">
                    {article.category.name}
                  </Badge>
                )}
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                  {article.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                  {article.author && (
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={article.author.avatar_url || undefined} />
                        <AvatarFallback>
                          {article.author.display_name?.[0] || 'A'}
                        </AvatarFallback>
                      </Avatar>
                      <span>{article.author.display_name}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>Updated {formatDate(article.updated_at || article.created_at)}</span>
                  </div>
                  {article.views_count !== undefined && (
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{article.views_count.toLocaleString()} views</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 mt-4">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <Bookmark className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                  </div>
                  <SocialShare title={article.title} />
                </div>
              </header>

              <Separator className="mb-8" />

              {/* Article Content */}
              <div className="prose prose-slate max-w-none">
                <div dangerouslySetInnerHTML={{ __html: formatMarkdown(article.content) }} />
              </div>

              {/* Tags/Footer */}
              <Separator className="my-8" />

              <div className="flex items-center justify-between">
                <Button variant="outline" asChild>
                  <Link href="/wiki">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Wiki
                  </Link>
                </Button>
                <p className="text-sm text-slate-500">
                  Last updated: {formatDate(article.updated_at || article.created_at)}
                </p>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Table of Contents */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Table of Contents</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <nav className="space-y-1 text-sm">
                      <a href="#introduction" className="block text-slate-600 hover:text-blue-600">
                        Introduction
                      </a>
                      <a href="#historical-background" className="block text-slate-600 hover:text-blue-600">
                        Historical Background
                      </a>
                      <a href="#structure-and-organization" className="block text-slate-600 hover:text-blue-600">
                        Structure and Organization
                      </a>
                      <a href="#democratic-principles" className="block text-slate-600 hover:text-blue-600">
                        Democratic Principles
                      </a>
                      <a href="#laws-and-legislation" className="block text-slate-600 hover:text-blue-600">
                        Laws and Legislation
                      </a>
                      <a href="#modern-relevance" className="block text-slate-600 hover:text-blue-600">
                        Modern Relevance
                      </a>
                      <a href="#conclusion" className="block text-slate-600 hover:text-blue-600">
                        Conclusion
                      </a>
                    </nav>
                  </CardContent>
                </Card>

                {/* Related Articles */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Related Articles</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-2">
                      {relatedArticles.map((related) => (
                        <li key={related.slug}>
                          <Link
                            href={`/wiki/${related.slug}`}
                            className="text-sm text-slate-600 hover:text-blue-600 line-clamp-2"
                          >
                            {related.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </aside>
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
    .replace(/^### (.*$)/gim, '<h3 id="$1" class="text-lg font-semibold mt-6 mb-3 scroll-mt-24">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 id="$1" class="text-xl font-semibold mt-8 mb-4 scroll-mt-24">$1</h2>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/^\d+\. \*\*(.*?)\*\*: (.*$)/gim, '<li class="ml-4 mb-2"><strong>$1</strong>: $2</li>')
    .replace(/^- (.*$)/gim, '<li class="ml-4 mb-1">$1</li>')
    .replace(/\n\n/g, '</p><p class="mb-4">')
}
