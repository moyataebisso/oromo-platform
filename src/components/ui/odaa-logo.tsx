'use client'

import { cn } from '@/lib/utils'

interface OdaaLogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showText?: boolean
  variant?: 'full' | 'icon'
}

export function OdaaLogo({
  className = '',
  size = 'md',
  showText = true,
  variant = 'full'
}: OdaaLogoProps) {
  const sizes = {
    sm: { icon: 28, text: 'text-lg' },
    md: { icon: 36, text: 'text-xl' },
    lg: { icon: 48, text: 'text-2xl' },
    xl: { icon: 64, text: 'text-3xl' },
  }

  const { icon, text } = sizes[size]

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* Odaa Tree SVG - Sycamore tree sacred to Oromo people */}
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Tree trunk */}
        <rect x="28" y="42" width="8" height="18" rx="2" fill="#92400E" />

        {/* Trunk detail */}
        <rect x="30" y="44" width="2" height="14" fill="#78350F" opacity="0.5" />

        {/* Main canopy - green */}
        <ellipse cx="32" cy="24" rx="22" ry="20" fill="#10B981" />

        {/* Darker green depth - left */}
        <ellipse cx="22" cy="22" rx="12" ry="10" fill="#059669" />

        {/* Darker green depth - right */}
        <ellipse cx="42" cy="26" rx="10" ry="9" fill="#059669" />

        {/* Lighter green highlights */}
        <ellipse cx="32" cy="16" rx="10" ry="7" fill="#34D399" />
        <ellipse cx="20" cy="28" rx="7" ry="5" fill="#34D399" />
        <ellipse cx="44" cy="20" rx="6" ry="5" fill="#34D399" />

        {/* Gold accents - representing prosperity and the Gadaa system */}
        <circle cx="26" cy="18" r="2.5" fill="#F59E0B" />
        <circle cx="38" cy="14" r="2" fill="#FCD34D" />
        <circle cx="22" cy="26" r="2" fill="#F59E0B" />
        <circle cx="42" cy="22" r="2.5" fill="#FCD34D" />
        <circle cx="32" cy="22" r="1.5" fill="#F59E0B" />

        {/* Red accent at top - representing strength and bravery */}
        <circle cx="32" cy="10" r="2" fill="#EF4444" />

        {/* Small roots */}
        <path
          d="M24 60 Q27 52 28 46"
          stroke="#92400E"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M40 60 Q37 52 36 46"
          stroke="#92400E"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M32 60 L32 56"
          stroke="#92400E"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      {showText && variant === 'full' && (
        <span className={cn('font-bold', text)}>
          <span className="text-emerald-500">Oro</span>
          <span className="text-amber-500">mo</span>
        </span>
      )}
    </div>
  )
}

// Simple icon-only version for favicon-like uses
export function OdaaIcon({ size = 32, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Trunk */}
      <rect x="21" y="32" width="6" height="12" rx="1" fill="#B45309" />

      {/* Main canopy - green */}
      <circle cx="24" cy="18" r="16" fill="#10B981" />

      {/* Inner detail - darker green */}
      <circle cx="24" cy="16" r="10" fill="#059669" />

      {/* Gold ring - representing Gadaa cycle */}
      <circle cx="24" cy="16" r="6" stroke="#F59E0B" strokeWidth="2" fill="none" />

      {/* Red center - heart of the community */}
      <circle cx="24" cy="16" r="3" fill="#EF4444" />

      {/* Small roots */}
      <path d="M18 44 L21 36" stroke="#B45309" strokeWidth="2" strokeLinecap="round" />
      <path d="M30 44 L27 36" stroke="#B45309" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
