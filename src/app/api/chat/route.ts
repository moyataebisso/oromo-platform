import { NextRequest, NextResponse } from 'next/server'
import { chatCompletion, Message, OROMO_ASSISTANT_PROMPT } from '@/lib/groq'

export async function POST(request: NextRequest) {
  try {
    const { messages } = (await request.json()) as { messages: Message[] }

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      )
    }

    // Limit message history to last 10 messages
    const recentMessages = messages.slice(-10)

    const response = await chatCompletion(
      recentMessages,
      OROMO_ASSISTANT_PROMPT,
      {
        maxTokens: 500,
        temperature: 0.7,
      }
    )

    return NextResponse.json({ response })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    )
  }
}
