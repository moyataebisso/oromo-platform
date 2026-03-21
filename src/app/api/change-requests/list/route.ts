import { NextResponse } from 'next/server'
import { getArsiSupabase } from '@/lib/arsi-supabase'

export async function GET() {
  try {
    const arsiSupabase = getArsiSupabase()
    const { data, error } = await arsiSupabase
      .from('change_requests')
      .select('*')
      .eq('client_email', 'admin@oromoPlatform.com')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch change requests' },
      { status: 500 }
    )
  }
}
