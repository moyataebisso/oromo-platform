'use client'

import { Clock, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { BusinessHours } from '@/types/business'

interface HoursDisplayProps {
  hours: BusinessHours | null
}

const DAYS = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
] as const

const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':').map(Number)
  const period = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours % 12 || 12
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
}

const isOpenNow = (hours: BusinessHours | null): { open: boolean; closesAt?: string } => {
  if (!hours) return { open: false }

  const now = new Date()
  const dayIndex = now.getDay()
  const dayKeys = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  const todayKey = dayKeys[dayIndex] as keyof BusinessHours
  const todayHours = hours[todayKey]

  if (!todayHours) return { open: false }

  const currentMinutes = now.getHours() * 60 + now.getMinutes()
  const [openHours, openMinutes] = todayHours.open.split(':').map(Number)
  const [closeHours, closeMinutes] = todayHours.close.split(':').map(Number)
  const openTime = openHours * 60 + openMinutes
  const closeTime = closeHours * 60 + closeMinutes

  if (currentMinutes >= openTime && currentMinutes <= closeTime) {
    return { open: true, closesAt: formatTime(todayHours.close) }
  }

  return { open: false }
}

export const HoursDisplay = ({ hours }: HoursDisplayProps) => {
  const [expanded, setExpanded] = useState(false)

  if (!hours) {
    return (
      <div className="text-slate-500 text-sm">
        Hours not available
      </div>
    )
  }

  const { open, closesAt } = isOpenNow(hours)
  const now = new Date()
  const currentDayIndex = now.getDay()
  const dayKeys = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  const todayKey = dayKeys[currentDayIndex]

  return (
    <div className="space-y-3">
      {/* Current Status */}
      <div className="flex items-center gap-3">
        <Badge className={cn(open ? 'bg-green-500' : 'bg-slate-500')}>
          <Clock className="w-3 h-3 mr-1" />
          {open ? 'Open Now' : 'Closed'}
        </Badge>
        {open && closesAt && (
          <span className="text-sm text-slate-600">Closes at {closesAt}</span>
        )}
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
      >
        {expanded ? (
          <>
            <ChevronUp className="w-4 h-4" />
            Hide hours
          </>
        ) : (
          <>
            <ChevronDown className="w-4 h-4" />
            See all hours
          </>
        )}
      </button>

      {/* Full Schedule */}
      {expanded && (
        <div className="space-y-2 pt-2 border-t">
          {DAYS.map((day) => {
            const dayHours = hours[day.key]
            const isToday = day.key === todayKey

            return (
              <div
                key={day.key}
                className={cn(
                  'flex items-center justify-between py-1 px-2 rounded text-sm',
                  isToday && 'bg-emerald-50 font-medium'
                )}
              >
                <span className={cn(isToday ? 'text-emerald-700' : 'text-slate-600')}>
                  {day.label}
                  {isToday && ' (Today)'}
                </span>
                <span className={cn(isToday ? 'text-emerald-700' : 'text-slate-900')}>
                  {dayHours
                    ? `${formatTime(dayHours.open)} - ${formatTime(dayHours.close)}`
                    : 'Closed'}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
