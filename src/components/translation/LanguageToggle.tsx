'use client'

import { useState } from 'react'
import { Check, ChevronDown, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/contexts/LanguageContext'

const languages = [
  {
    code: 'en' as const,
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    shortCode: 'EN',
  },
  {
    code: 'om' as const,
    name: 'Oromo',
    nativeName: 'Afaan Oromoo',
    flag: '🇪🇹',
    shortCode: 'OM',
  },
]

interface LanguageToggleProps {
  className?: string
  variant?: 'default' | 'mobile'
}

export const LanguageToggle = ({
  className,
  variant = 'default',
}: LanguageToggleProps) => {
  const { language, setLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const currentLang = languages.find((l) => l.code === language) || languages[0]

  if (variant === 'mobile') {
    return (
      <div className={cn('space-y-2', className)}>
        <p className="text-sm font-medium text-gray-400">Language</p>
        <div className="flex gap-2">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={cn(
                'flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition-colors',
                language === lang.code
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              )}
            >
              <span>{lang.flag}</span>
              <span>{lang.nativeName}</span>
              {language === lang.code && <Check className="h-4 w-4" />}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            'flex items-center gap-1.5 px-2 text-gray-300 hover:bg-gray-800 hover:text-white',
            className
          )}
        >
          <Globe className="h-4 w-4" />
          <span className="text-sm font-medium">{currentLang.shortCode}</span>
          <ChevronDown
            className={cn(
              'h-3 w-3 transition-transform duration-200',
              isOpen && 'rotate-180'
            )}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-48 border-gray-700 bg-gray-800"
      >
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => {
              setLanguage(lang.code)
              setIsOpen(false)
            }}
            className={cn(
              'flex cursor-pointer items-center justify-between',
              'text-gray-200 hover:bg-gray-700 hover:text-white focus:bg-gray-700 focus:text-white',
              language === lang.code && 'bg-gray-700/50'
            )}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{lang.flag}</span>
              <div>
                <p className="text-sm font-medium">{lang.nativeName}</p>
                {lang.code === 'om' && (
                  <p className="text-xs text-gray-400">{lang.name}</p>
                )}
              </div>
            </div>
            {language === lang.code && (
              <Check className="h-4 w-4 text-green-500" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
