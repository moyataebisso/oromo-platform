'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Lightbulb } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { DifficultyBadge } from './difficulty-badge'

interface InterviewQuestionCardProps {
  question: {
    id: string
    question: string
    sample_answer?: string
    tips?: string
    category: string
    difficulty: string
  }
}

const categoryColors: Record<string, string> = {
  general: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  technical: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  behavioral: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  clinical: 'bg-green-500/20 text-green-400 border-green-500/30',
  'case study': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
}

export function InterviewQuestionCard({ question }: InterviewQuestionCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const colorClass = categoryColors[question.category?.toLowerCase()] || categoryColors.general

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
      {/* Header - Always Visible */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-start gap-4 p-5 text-left hover:bg-slate-700/50 transition-colors"
      >
        <div className="flex-1">
          <p className="font-medium text-white text-lg leading-relaxed">
            {question.question}
          </p>
          <div className="flex items-center gap-2 mt-3">
            <Badge variant="outline" className={`capitalize text-xs ${colorClass}`}>
              {question.category}
            </Badge>
            <DifficultyBadge difficulty={question.difficulty} />
          </div>
        </div>
        <div className="text-slate-400 mt-1">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {/* Expandable Content */}
      {isOpen && (
        <div className="px-5 pb-5 border-t border-slate-700 animate-in slide-in-from-top-2 duration-200">
          {question.sample_answer && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-primary mb-2">Sample Answer</h4>
              <div className="bg-slate-900 rounded-lg p-4">
                <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {question.sample_answer}
                </p>
              </div>
            </div>
          )}

          {question.tips && (
            <div className="mt-4">
              <h4 className="flex items-center gap-2 text-sm font-semibold text-amber-400 mb-2">
                <Lightbulb className="w-4 h-4" />
                Tips
              </h4>
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {question.tips}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
