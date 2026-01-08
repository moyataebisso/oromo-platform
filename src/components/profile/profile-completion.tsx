'use client'

import { Check, AlertCircle } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface ProfileCompletionProps {
  profile: {
    display_name?: string | null
    bio?: string | null
    avatar_url?: string | null
    location?: string | null
    phone?: string | null
    website?: string | null
    linkedin_url?: string | null
    skills?: string[] | null
  }
  showActions?: boolean
}

interface CompletionItem {
  key: string
  label: string
  completed: boolean
  priority: 'high' | 'medium' | 'low'
}

export const ProfileCompletion = ({ profile, showActions = true }: ProfileCompletionProps) => {
  const completionItems: CompletionItem[] = [
    { key: 'display_name', label: 'Add display name', completed: !!profile.display_name, priority: 'high' },
    { key: 'avatar', label: 'Upload profile photo', completed: !!profile.avatar_url, priority: 'high' },
    { key: 'bio', label: 'Write a bio', completed: !!profile.bio, priority: 'high' },
    { key: 'location', label: 'Add your location', completed: !!profile.location, priority: 'medium' },
    { key: 'phone', label: 'Add phone number', completed: !!profile.phone, priority: 'low' },
    { key: 'website', label: 'Add website or portfolio', completed: !!profile.website, priority: 'low' },
    { key: 'linkedin', label: 'Connect LinkedIn', completed: !!profile.linkedin_url, priority: 'medium' },
    { key: 'skills', label: 'Add your skills', completed: (profile.skills?.length ?? 0) > 0, priority: 'medium' },
  ]

  const completedCount = completionItems.filter(item => item.completed).length
  const totalCount = completionItems.length
  const percentage = Math.round((completedCount / totalCount) * 100)

  const incompleteItems = completionItems.filter(item => !item.completed)
  const highPriorityIncomplete = incompleteItems.filter(item => item.priority === 'high')

  const getProgressColor = () => {
    if (percentage < 40) return 'bg-red-500'
    if (percentage < 70) return 'bg-amber-500'
    return 'bg-emerald-500'
  }

  const getStatusMessage = () => {
    if (percentage === 100) return 'Your profile is complete!'
    if (percentage >= 70) return 'Almost there! A few more details to go.'
    if (percentage >= 40) return 'Good start! Keep adding details to stand out.'
    return 'Complete your profile to get the best experience.'
  }

  return (
    <Card className="overflow-hidden">
      <div className={`h-1 ${getProgressColor()}`} style={{ width: `${percentage}%` }} />
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Profile Completion</CardTitle>
          <span className={`text-2xl font-bold ${
            percentage < 40 ? 'text-red-600' :
            percentage < 70 ? 'text-amber-600' :
            'text-emerald-600'
          }`}>
            {percentage}%
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <Progress value={percentage} className="h-2 mb-4" />
        <p className="text-sm text-slate-600 mb-4">{getStatusMessage()}</p>

        {percentage < 100 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-700">
              {highPriorityIncomplete.length > 0 ? 'Priority items:' : 'Remaining items:'}
            </p>
            <ul className="space-y-2">
              {(highPriorityIncomplete.length > 0 ? highPriorityIncomplete : incompleteItems.slice(0, 3)).map((item) => (
                <li key={item.key} className="flex items-center gap-2 text-sm">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                    item.priority === 'high' ? 'bg-red-100' :
                    item.priority === 'medium' ? 'bg-amber-100' :
                    'bg-slate-100'
                  }`}>
                    <AlertCircle className={`w-3 h-3 ${
                      item.priority === 'high' ? 'text-red-600' :
                      item.priority === 'medium' ? 'text-amber-600' :
                      'text-slate-600'
                    }`} />
                  </div>
                  <span className="text-slate-600">{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {percentage === 100 && (
          <div className="flex items-center gap-2 text-emerald-600">
            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
              <Check className="w-4 h-4" />
            </div>
            <span className="font-medium">All sections completed!</span>
          </div>
        )}

        {showActions && percentage < 100 && (
          <Button className="w-full mt-4" asChild>
            <Link href="/profile/edit">Complete Profile</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
