import { NextResponse } from 'next/server'
import { getArsiSupabase } from '@/lib/arsi-supabase'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { request_type, priority, description } = body

    if (!request_type || !priority || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const arsiSupabase = getArsiSupabase()
    const { data, error } = await arsiSupabase
      .from('change_requests')
      .insert({
        client_email: 'admin@oromoPlatform.com',
        business_name: 'Oromo Platform',
        request_type,
        priority,
        description,
        status: 'pending',
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Send email notification via Resend
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL || 'noreply@arsitechgroup.com',
          to: 'admin@arsitechgroup.com',
          subject: '🔧 Oromo Platform Change Request',
          html: `
            <h2>New Change Request</h2>
            <p><strong>Business:</strong> Oromo Platform</p>
            <p><strong>Type:</strong> ${request_type}</p>
            <p><strong>Priority:</strong> ${priority}</p>
            <p><strong>Description:</strong></p>
            <p>${description}</p>
          `,
        }),
      })
    } catch {
      // Email failure should not block the request
    }

    return NextResponse.json({ success: true, data })
  } catch {
    return NextResponse.json(
      { error: 'Failed to submit change request' },
      { status: 500 }
    )
  }
}
