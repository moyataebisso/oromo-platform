import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Parser from 'rss-parser'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const parser = new Parser({
  customFields: {
    item: ['media:content', 'media:thumbnail', 'enclosure']
  }
})

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .substring(0, 100)
}

function extractImageUrl(item: Record<string, unknown>): string | null {
  // Try various common RSS image fields
  const mediaContent = item['media:content'] as Record<string, Record<string, string>> | undefined
  const mediaThumbnail = item['media:thumbnail'] as Record<string, Record<string, string>> | undefined
  const enclosure = item.enclosure as { url?: string; type?: string } | undefined

  if (mediaContent?.$?.url) return mediaContent.$.url
  if (mediaThumbnail?.$?.url) return mediaThumbnail.$.url
  if (enclosure?.url && enclosure.type?.startsWith('image')) return enclosure.url

  // Try to extract from content
  const content = (item.content || item['content:encoded'] || '') as string
  const imgMatch = content.match(/<img[^>]+src="([^">]+)"/)
  if (imgMatch) return imgMatch[1]

  return null
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  // Verify cron secret for automated calls
  const { searchParams } = new URL(request.url)
  const isManual = searchParams.get('manual') === 'true'

  if (cronSecret && authHeader !== `Bearer ${cronSecret}` && !isManual) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const newsType = searchParams.get('type') || 'all' // 'world', 'oromo', or 'all'

  try {
    // Get active sources
    let query = supabase
      .from('news_sources')
      .select('*')
      .eq('is_active', true)
      .eq('auto_publish', true)

    if (newsType !== 'all') {
      query = query.eq('news_type', newsType)
    }

    const { data: sources, error: sourcesError } = await query

    if (sourcesError) throw sourcesError
    if (!sources || sources.length === 0) {
      return NextResponse.json({ message: 'No active sources found', fetched: 0 })
    }

    let totalFetched = 0
    let totalErrors = 0
    const results: Array<{ title?: string; source: string; error?: string }> = []

    for (const source of sources) {
      if (!source.rss_url) continue

      try {
        const feed = await parser.parseURL(source.rss_url)

        for (const item of feed.items.slice(0, 10)) { // Limit to 10 per source
          if (!item.title) continue

          const slug = generateSlug(item.title) + '-' + Date.now().toString(36)
          const imageUrl = extractImageUrl(item as unknown as Record<string, unknown>)

          // Check if article already exists (by source_url)
          if (item.link) {
            const { data: existing } = await supabase
              .from('news_articles')
              .select('id')
              .eq('source_url', item.link)
              .single()

            if (existing) continue // Skip duplicates
          }

          const itemAny = item as unknown as Record<string, unknown>
          const article = {
            title: item.title.substring(0, 255),
            slug,
            summary: item.contentSnippet?.substring(0, 500) || (item.content as string | undefined)?.substring(0, 500) || null,
            content: item.content || itemAny['content:encoded'] || null,
            source: source.name,
            source_url: item.link || null,
            image_url: imageUrl,
            category: source.category || 'breaking',
            author: item.creator || itemAny.author as string || source.name,
            published_at: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
            is_featured: false,
            is_published: true,
            news_type: source.news_type || 'oromo',
            view_count: 0
          }

          const { error: insertError } = await supabase
            .from('news_articles')
            .insert(article)

          if (!insertError) {
            totalFetched++
            results.push({ title: article.title, source: source.name })
          }
        }

        // Update last_fetched_at
        await supabase
          .from('news_sources')
          .update({ last_fetched_at: new Date().toISOString() })
          .eq('id', source.id)

      } catch (feedError) {
        console.error(`Error fetching ${source.name}:`, feedError)
        totalErrors++
        results.push({ source: source.name, error: feedError instanceof Error ? feedError.message : 'Unknown error' })
      }
    }

    // Log the fetch
    await supabase
      .from('news_fetch_logs')
      .insert({
        sources_count: sources.length,
        articles_fetched: totalFetched,
        errors_count: totalErrors,
        news_type: newsType
      })

    return NextResponse.json({
      success: true,
      message: `Fetched ${totalFetched} new articles from ${sources.length} sources`,
      fetched: totalFetched,
      errors: totalErrors,
      results
    })

  } catch (error) {
    console.error('News fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 })
  }
}

// Keep POST for backwards compatibility
export async function POST(request: NextRequest) {
  return GET(request)
}
