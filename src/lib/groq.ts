import Groq from 'groq-sdk'

let _groq: Groq | null = null

function getGroqClient(): Groq {
  if (!_groq) {
    _groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    })
  }
  return _groq
}

export interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface ChatCompletionOptions {
  maxTokens?: number
  temperature?: number
  stream?: boolean
}

/**
 * Generate a chat completion using Groq
 */
export async function chatCompletion(
  messages: Message[],
  systemPrompt: string,
  options: ChatCompletionOptions = {}
): Promise<string> {
  const { maxTokens = 500, temperature = 0.7 } = options

  try {
    const completion = await getGroqClient().chat.completions.create({
      model: 'llama-3.1-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      max_tokens: maxTokens,
      temperature,
    })

    return completion.choices[0]?.message?.content || 'I apologize, I could not generate a response.'
  } catch (error) {
    console.error('Groq API error:', error)
    throw new Error('Failed to generate response')
  }
}

/**
 * Generate a streaming chat completion using Groq
 */
export async function* streamChatCompletion(
  messages: Message[],
  systemPrompt: string,
  options: ChatCompletionOptions = {}
): AsyncGenerator<string> {
  const { maxTokens = 500, temperature = 0.7 } = options

  try {
    const stream = await getGroqClient().chat.completions.create({
      model: 'llama-3.1-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      max_tokens: maxTokens,
      temperature,
      stream: true,
    })

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content
      if (content) {
        yield content
      }
    }
  } catch (error) {
    console.error('Groq API streaming error:', error)
    throw new Error('Failed to generate streaming response')
  }
}

/**
 * The Odda Academy Oromo Assistant system prompt
 */
export const OROMO_ASSISTANT_PROMPT = `You are the Odda Academy Oromo Assistant, a helpful AI for the Oromo Digital Diaspora Association platform.

YOUR CAPABILITIES:
- Help users practice Oromo language (respond in Oromo when they write in Oromo)
- Translate between English and Oromo
- Answer questions about Oromo culture, history, and the Gadaa system
- Help navigate the Odda Academy platform (courses, jobs, wiki, etc.)
- Explain Oromo grammar and vocabulary

LANGUAGE RULES:
- If user writes in Oromo, respond primarily in Oromo with English translations in parentheses
- If user writes in English, respond in English but include Oromo words/phrases when teaching
- When teaching vocabulary, format as: Oromo word (pronunciation) = English meaning
- Be encouraging when users attempt to write in Oromo, even with mistakes

PERSONALITY:
- Friendly, patient, encouraging
- Culturally respectful and knowledgeable
- Educational but conversational
- Use Oromo greetings like "Akkam jirta?" (How are you?)

Keep responses concise (2-4 sentences) unless user asks for detailed explanation.`
