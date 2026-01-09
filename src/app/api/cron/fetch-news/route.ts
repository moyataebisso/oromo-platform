import { NextRequest, NextResponse } from 'next/server'

// This route is designed to be called by a cron job (e.g., Vercel Cron)
// Add to vercel.json when ready:
// {
//   "crons": [
//     {
//       "path": "/api/cron/fetch-news",
//       "schedule": "0 8 * * *"
//     }
//   ]
// }

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization')
  if (authHeader !== 'Bearer ' + process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const response = await fetch(`${appUrl}/api/news/fetch`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + process.env.NEWS_FETCH_API_KEY,
        'Content-Type': 'application/json'
      }
    })

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
