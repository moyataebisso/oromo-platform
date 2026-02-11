import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Parser from 'rss-parser'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'media:content', { keepArray: true }],
      ['media:thumbnail', 'media:thumbnail'],
      ['enclosure', 'enclosure'],
      ['content:encoded', 'content:encoded'],
      ['dc:creator', 'creator'],
      ['itunes:image', 'itunes:image'],
    ]
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

  // 1. Media content (most common)
  const mediaContent = item['media:content']
  if (mediaContent) {
    if (Array.isArray(mediaContent)) {
      const img = mediaContent.find((m: Record<string, unknown>) => {
        const attrs = m.$ as Record<string, string> | undefined
        return attrs?.medium === 'image' || attrs?.url
      })
      const imgAttrs = img?.$ as Record<string, string> | undefined
      if (imgAttrs?.url) return imgAttrs.url
    } else {
      const attrs = (mediaContent as Record<string, unknown>).$ as Record<string, string> | undefined
      if (attrs?.url) return attrs.url
    }
  }

  // 2. Media thumbnail
  const mediaThumbnail = item['media:thumbnail'] as Record<string, unknown> | undefined
  if (mediaThumbnail) {
    const attrs = mediaThumbnail.$ as Record<string, string> | undefined
    if (attrs?.url) return attrs.url
    if (typeof mediaThumbnail.url === 'string') return mediaThumbnail.url
  }

  // 3. Enclosure (podcasts and some news feeds)
  const enclosure = item.enclosure as { url?: string; type?: string } | undefined
  if (enclosure?.url) {
    if (enclosure.type?.startsWith('image')) return enclosure.url
  }

  // 4. Image field directly
  const imageField = item.image as { url?: string } | string | undefined
  if (imageField) {
    if (typeof imageField === 'string') return imageField
    if (imageField.url) return imageField.url
  }

  // 5. itunes:image (podcasts)
  const itunesImage = item['itunes:image'] as Record<string, unknown> | undefined
  if (itunesImage) {
    const attrs = itunesImage.$ as Record<string, string> | undefined
    if (attrs?.href) return attrs.href
  }

  // 6. Extract from content/description HTML
  const content = (item.content || item['content:encoded'] || item.description || '') as string

  // Look for img tags
  const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i)
  if (imgMatch && imgMatch[1]) {
    // Skip base64 images and tracking pixels
    if (!imgMatch[1].startsWith('data:') && !imgMatch[1].includes('tracking')) {
      return imgMatch[1]
    }
  }

  // Look for og:image in content
  const ogMatch = content.match(/og:image["'\s]+content=["']([^"']+)["']/i)
  if (ogMatch && ogMatch[1]) return ogMatch[1]

  // 7. For Google News, try to extract from the link
  const link = item.link as string | undefined
  if (link && link.includes('news.google.com')) {
    // Google News doesn't provide images directly in RSS
    return null
  }

  return null
}

function decodeHTMLEntities(text: string): string {
  if (!text) return ''

  const entities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&apos;': "'",
    '&#x27;': "'",
    '&nbsp;': ' ',
  }

  // Replace named entities
  let decoded = text
  for (const [entity, char] of Object.entries(entities)) {
    decoded = decoded.replace(new RegExp(entity, 'g'), char)
  }

  // Replace numeric entities like &#xFC; or &#252;
  decoded = decoded.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) =>
    String.fromCharCode(parseInt(hex, 16))
  )
  decoded = decoded.replace(/&#(\d+);/g, (_, dec) =>
    String.fromCharCode(parseInt(dec, 10))
  )

  return decoded
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
          const decodedTitle = decodeHTMLEntities(item.title)
          const rawSummary = item.contentSnippet || (item.content as string | undefined) || ''
          const rawContent = (item.content || itemAny['content:encoded'] || '') as string

          const article = {
            title: decodedTitle.substring(0, 255),
            slug,
            summary: decodeHTMLEntities(rawSummary).substring(0, 500) || null,
            content: decodeHTMLEntities(rawContent) || null,
            source: source.name,
            source_url: item.link || null,
            image_url: imageUrl,
            category: source.category || 'breaking',
            author: decodeHTMLEntities(item.creator || itemAny.author as string || source.name),
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
