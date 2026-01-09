import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }

    const supabase = await createClient()

    // Check if already subscribed
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: existing } = await (supabase as any)
      .from('newsletter_subscribers')
      .select('id, is_active')
      .eq('email', email)
      .single()

    if (existing) {
      if (existing.is_active) {
        return NextResponse.json({ message: 'Already subscribed' })
      }
      // Reactivate subscription
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any)
        .from('newsletter_subscribers')
        .update({ is_active: true })
        .eq('id', existing.id)
      return NextResponse.json({ message: 'Subscription reactivated' })
    }

    // Create new subscription
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('newsletter_subscribers')
      .insert({ email, name, is_active: true })

    if (error) throw error

    return NextResponse.json({ message: 'Successfully subscribed' })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An error occurred'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
