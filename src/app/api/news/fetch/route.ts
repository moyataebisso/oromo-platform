import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
// Note: rss-parser needs to be installed: npm install rss-parser
// import Parser from 'rss-parser'

// const parser = new Parser()

const RELEVANT_KEYWORDS = [
  'oromo', 'oromia', 'ethiopia', 'ethiopian', 'addis ababa',
  'abiy ahmed', 'horn of africa', 'east africa', 'irreecha', 'gadaa',
  'amhara', 'tigray', 'african union', 'omo', 'harar'
]

function isRelevant(title: string, content: string): boolean {
  const text = (title + ' ' + content).toLowerCase()
  return RELEVANT_KEYWORDS.some(keyword => text.includes(keyword))
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .substring(0, 80) + '-' + Date.now()
}

export async function POST(request: NextRequest) {
  // Verify API key
  const authHeader = request.headers.get('authorization')
  if (authHeader !== 'Bearer ' + process.env.NEWS_FETCH_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Use service role key for server-side operations
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Fetch active news sources
  const { data: sources } = await supabase
    .from('news_sources')
    .select('*')
    .eq('is_active', true)

  if (!sources || sources.length === 0) {
    return NextResponse.json({ error: 'No active sources' }, { status: 400 })
  }

  let totalFetched = 0
  const results: Array<{ source: string; fetched?: number; error?: string }> = []

  // Note: Full RSS parsing requires rss-parser package
  // For now, this is a placeholder that shows the structure
  // To enable: npm install rss-parser, then uncomment the Parser import and usage

  for (const source of sources) {
    const feedUrl = source.rss_url || source.url
    if (!feedUrl) {
      results.push({ source: source.name, error: 'No RSS URL configured' })
      continue
    }

    try {
      // Placeholder: In production, uncomment below and use actual RSS parsing
      /*
      const feed = await parser.parseURL(feedUrl)
      let articlesAdded = 0

      for (const item of feed.items.slice(0, 10)) {
        const title = item.title || ''
        const content = item.contentSnippet || item.content || ''

        if (!isRelevant(title, content)) continue

        // Check for duplicates
        const { data: existing } = await supabase
          .from('news_articles')
          .select('id')
          .ilike('title', '%' + title.substring(0, 50) + '%')
          .limit(1)

        if (existing && existing.length > 0) continue

        const { error } = await supabase.from('news_articles').insert({
          title: title,
          slug: generateSlug(title),
          summary: content.substring(0, 300),
          content: '# ' + title + '\n\n' + content + '\n\n*Source: [' + source.name + '](' + item.link + ')*',
          source: source.name,
          source_url: item.link,
          image_url: item.enclosure?.url || null,
          category: source.category || 'breaking',
          author: item.creator || source.name,
          published_at: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
          is_published: source.auto_publish || false,
          is_featured: false
        })

        if (!error) articlesAdded++
      }

      // Update last fetched timestamp
      await supabase
        .from('news_sources')
        .update({ last_fetched_at: new Date().toISOString() })
        .eq('id', source.id)

      // Log the fetch
      await supabase.from('news_fetch_logs').insert({
        source_id: source.id,
        articles_fetched: articlesAdded,
        status: 'success'
      })

      totalFetched += articlesAdded
      results.push({ source: source.name, fetched: articlesAdded })
      */

      // Temporary placeholder response
      results.push({
        source: source.name,
        error: 'RSS parsing not enabled. Install rss-parser: npm install rss-parser'
      })

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'

      // Log the error
      await supabase.from('news_fetch_logs').insert({
        source_id: source.id,
        articles_fetched: 0,
        status: 'error',
        error_message: errorMessage
      })

      results.push({ source: source.name, error: errorMessage })
    }
  }

  return NextResponse.json({
    success: true,
    totalFetched,
    results,
    note: 'To enable RSS fetching, install rss-parser: npm install rss-parser'
  })
}

// Keep these exports for reference - they show isRelevant and generateSlug are used
export { isRelevant, generateSlug }
