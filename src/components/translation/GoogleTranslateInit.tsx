'use client'

import { useEffect } from 'react'
import Script from 'next/script'

declare global {
  interface Window {
    googleTranslateElementInit?: () => void
    google?: {
      translate?: {
        TranslateElement: new (
          options: {
            pageLanguage: string
            includedLanguages: string
            autoDisplay: boolean
            layout?: number
          },
          elementId: string
        ) => void
      }
    }
  }
}

export const GoogleTranslateInit = () => {
  useEffect(() => {
    // Define the init function globally
    window.googleTranslateElementInit = () => {
      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,om',
            autoDisplay: false,
          },
          'google_translate_element'
        )
      }
    }
  }, [])

  return (
    <>
      {/* Hidden container for Google Translate */}
      <div
        id="google_translate_element"
        className="hidden"
        style={{ display: 'none' }}
      />

      {/* Google Translate Script */}
      <Script
        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />

      {/* CSS to hide Google Translate UI elements */}
      <style jsx global>{`
        .goog-te-banner-frame,
        .goog-te-balloon-frame,
        #goog-gt-tt,
        .goog-te-balloon-frame,
        .goog-tooltip,
        .goog-tooltip:hover {
          display: none !important;
        }

        .goog-text-highlight {
          background: none !important;
          box-shadow: none !important;
        }

        .skiptranslate {
          display: none !important;
        }

        body {
          top: 0 !important;
        }

        .goog-te-gadget {
          display: none !important;
        }

        /* Keep the select element functional but hidden */
        .goog-te-combo {
          position: absolute;
          left: -9999px;
          top: -9999px;
        }

        /* Prevent Google Translate font changes */
        .translated-ltr,
        .translated-rtl {
          font: inherit !important;
        }
      `}</style>
    </>
  )
}
