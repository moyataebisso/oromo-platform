'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Loader2, Bot, User, Sparkles, MinusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const quickReplies = [
  'How do I enroll in a course?',
  'Where can I find job listings?',
  'Tell me about the Gadaa system',
  'How do I edit my profile?',
]

// Simulated AI responses based on keywords
const getAIResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes('course') || lowerMessage.includes('enroll') || lowerMessage.includes('learn')) {
    return "To enroll in a course, visit our Academy section. Browse through our catalog of courses covering Afaan Oromoo, history, culture, and more. Click on any course to see details, then click 'Enroll' to start learning. Your progress will be tracked automatically!"
  }

  if (lowerMessage.includes('job') || lowerMessage.includes('career') || lowerMessage.includes('work')) {
    return "You can find job opportunities in our Careers section. We list positions from Oromo-owned businesses and community organizations. You can filter by location, job type, and save jobs you're interested in. Don't forget to complete your profile to stand out to employers!"
  }

  if (lowerMessage.includes('gadaa') || lowerMessage.includes('governance') || lowerMessage.includes('democracy')) {
    return "The Gadaa system is an indigenous democratic socio-political system practiced by the Oromo people. It's one of the oldest democratic systems in Africa, featuring term limits, checks and balances, and peaceful transitions of power. You can learn more in our Wiki section or take our dedicated course on Gadaa governance!"
  }

  if (lowerMessage.includes('profile') || lowerMessage.includes('account') || lowerMessage.includes('settings')) {
    return "To edit your profile, click on your avatar in the top-right corner and select 'Profile'. From there, you can update your display name, bio, avatar, and other details. A complete profile helps you connect better with the community!"
  }

  if (lowerMessage.includes('wiki') || lowerMessage.includes('article') || lowerMessage.includes('read')) {
    return "Our Wiki section contains hundreds of articles about Oromo history, culture, language, and traditions. You can browse by category, search for specific topics, or explore featured articles. Anyone can contribute to the Wiki after creating an account!"
  }

  if (lowerMessage.includes('language') || lowerMessage.includes('afaan') || lowerMessage.includes('oromoo')) {
    return "Afaan Oromoo is one of the most widely spoken languages in Africa, with over 40 million speakers. We offer comprehensive courses from beginner to advanced levels. Start with 'Introduction to Afaan Oromoo' in our Academy to begin your language learning journey!"
  }

  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return "Akkam! (Hello!) Welcome to Oromo Platform. I'm here to help you navigate our Academy, Careers, and Wiki sections. What would you like to know about?"
  }

  if (lowerMessage.includes('thank')) {
    return "You're welcome! Galatoomaa! If you have any other questions, feel free to ask. Enjoy exploring the platform!"
  }

  return "I'd be happy to help with that! For detailed information, you can explore our Academy for courses, Careers for job opportunities, or Wiki for articles about Oromo culture and history. Is there something specific I can help you find?"
}

export const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Akkam! 👋 I'm your Oromo Platform assistant. I can help you find courses, jobs, wiki articles, or answer questions about Oromo culture. What would you like to know?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (messageText?: string) => {
    const text = messageText || input
    if (!text.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // Simulate AI thinking time
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000))

    const response = getAIResponse(text)
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    }

    setIsTyping(false)
    setMessages((prev) => [...prev, assistantMessage])
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-6 z-50 h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
          <Sparkles className="h-2.5 w-2.5 text-white" />
        </span>
      </Button>
    )
  }

  return (
    <Card className={cn(
      'fixed bottom-20 right-6 z-50 w-96 shadow-xl border-0 overflow-hidden transition-all duration-300',
      isMinimized ? 'h-14' : 'h-[500px]'
    )}>
      {/* Header */}
      <CardHeader className="p-4 bg-gradient-to-r from-blue-600 to-emerald-600 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Oromo Assistant</CardTitle>
              <p className="text-xs text-white/80">Always here to help</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              <MinusCircle className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {!isMinimized && (
        <>
          {/* Messages */}
          <CardContent className="p-4 h-[340px] overflow-y-auto bg-slate-50">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'flex gap-3',
                    message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  )}
                >
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback className={cn(
                      message.role === 'user'
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-emerald-100 text-emerald-600'
                    )}>
                      {message.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={cn(
                      'max-w-[80%] rounded-2xl px-4 py-2 text-sm',
                      message.role === 'user'
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-white shadow-sm rounded-tl-none'
                    )}
                  >
                    {message.content}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback className="bg-emerald-100 text-emerald-600">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-white shadow-sm rounded-2xl rounded-tl-none px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            {messages.length <= 2 && (
              <div className="mt-4">
                <p className="text-xs text-slate-500 mb-2">Quick questions:</p>
                <div className="flex flex-wrap gap-2">
                  {quickReplies.map((reply) => (
                    <Button
                      key={reply}
                      variant="outline"
                      size="sm"
                      className="text-xs h-auto py-1.5 px-3"
                      onClick={() => handleSend(reply)}
                    >
                      {reply}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>

          {/* Input */}
          <div className="p-4 border-t bg-white">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1"
                disabled={isTyping}
              />
              <Button
                onClick={() => handleSend()}
                disabled={!input.trim() || isTyping}
                className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700"
              >
                {isTyping ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </>
      )}
    </Card>
  )
}
