'use client'

import { useState } from 'react'
import { Facebook, Twitter, Linkedin, Link2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface SocialShareProps {
  title: string
  url?: string
}

export const SocialShare = ({ title, url }: SocialShareProps) => {
  const [copied, setCopied] = useState(false)

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '')
  const encodedUrl = encodeURIComponent(shareUrl)
  const encodedTitle = encodeURIComponent(title)

  const shareLinks = [
    {
      name: 'Facebook',
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: 'hover:bg-blue-600 hover:text-white',
    },
    {
      name: 'Twitter',
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      color: 'hover:bg-sky-500 hover:text-white',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
      color: 'hover:bg-blue-700 hover:text-white',
    },
  ]

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast.success('Link copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Failed to copy link')
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-slate-500 mr-2">Share:</span>
      {shareLinks.map((link) => (
        <Button
          key={link.name}
          variant="outline"
          size="icon"
          className={`h-9 w-9 transition-colors ${link.color}`}
          asChild
        >
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Share on ${link.name}`}
          >
            <link.icon className="h-4 w-4" />
          </a>
        </Button>
      ))}
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 transition-colors hover:bg-slate-900 hover:text-white"
        onClick={copyToClipboard}
        aria-label="Copy link"
      >
        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Link2 className="h-4 w-4" />}
      </Button>
    </div>
  )
}
