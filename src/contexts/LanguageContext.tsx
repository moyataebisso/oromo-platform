'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react'

type Language = 'en' | 'om'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  toggleLanguage: () => void
  isOromo: boolean
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  toggleLanguage: () => {},
  isOromo: false,
})

export const useLanguage = () => useContext(LanguageContext)

interface LanguageProviderProps {
  children: ReactNode
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguageState] = useState<Language>('en')
  const [mounted, setMounted] = useState(false)

  // Initialize from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('odda-language') as Language | null
    if (stored && (stored === 'en' || stored === 'om')) {
      setLanguageState(stored)
    }
    setMounted(true)
  }, [])

  // Trigger Google Translate when language changes
  const triggerTranslation = useCallback((lang: Language) => {
    if (typeof window === 'undefined') return

    // Wait for Google Translate to initialize
    const attemptTranslation = () => {
      const selectElement = document.querySelector(
        '.goog-te-combo'
      ) as HTMLSelectElement | null

      if (selectElement) {
        if (lang === 'om') {
          selectElement.value = 'om'
        } else {
          selectElement.value = 'en'
        }
        selectElement.dispatchEvent(new Event('change', { bubbles: true }))
      }
    }

    // Try immediately, then with delays for slower loads
    attemptTranslation()
    setTimeout(attemptTranslation, 500)
    setTimeout(attemptTranslation, 1000)
  }, [])

  const setLanguage = useCallback(
    (lang: Language) => {
      setLanguageState(lang)
      localStorage.setItem('odda-language', lang)
      triggerTranslation(lang)
    },
    [triggerTranslation]
  )

  const toggleLanguage = useCallback(() => {
    const newLang = language === 'en' ? 'om' : 'en'
    setLanguage(newLang)
  }, [language, setLanguage])

  // Apply saved language on mount
  useEffect(() => {
    if (mounted && language === 'om') {
      // Small delay to ensure Google Translate is ready
      const timer = setTimeout(() => {
        triggerTranslation('om')
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [mounted, language, triggerTranslation])

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        isOromo: language === 'om',
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}
