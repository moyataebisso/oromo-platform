'use client'

import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'

// Default quick questions - these would ideally come from the database
const defaultQuickQuestions = [
  { id: '1', question_text: 'Teach me a greeting', category: 'language' },
  { id: '2', question_text: 'Tell me about Gadaa', category: 'culture' },
  { id: '3', question_text: 'Translate to Oromo', category: 'language' },
  { id: '4', question_text: 'Oromo history', category: 'history' },
]

interface QuickQuestionsProps {
  onQuestionClick: (question: string) => void
  disabled?: boolean
}

export const QuickQuestions = ({ onQuestionClick, disabled }: QuickQuestionsProps) => {
  return (
    <div className="px-3 py-2 border-t border-border bg-slate-50/50 dark:bg-slate-900/50">
      <div className="flex items-center gap-1.5 mb-2">
        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
        <span className="text-xs font-medium text-muted-foreground">Quick questions</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {defaultQuickQuestions.map((q) => (
          <Button
            key={q.id}
            variant="outline"
            size="sm"
            className="h-7 text-xs rounded-full px-3 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 dark:hover:bg-emerald-950 dark:hover:text-emerald-300"
            onClick={() => onQuestionClick(q.question_text)}
            disabled={disabled}
          >
            {q.question_text}
          </Button>
        ))}
      </div>
    </div>
  )
}
