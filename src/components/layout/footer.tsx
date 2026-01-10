'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Send, Loader2, Facebook, Twitter, Instagram, Youtube, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { OdaaLogo } from '@/components/ui/odaa-logo'

const footerLinks = {
  platform: [
    { name: 'Academy', href: '/academy' },
    { name: 'Careers', href: '/careers' },
    { name: 'Wiki', href: '/wiki' },
    { name: 'Community', href: '/community' },
    { name: 'Businesses', href: '/businesses' },
  ],
  ageGroups: [
    { name: 'Kids Zone', href: '/kids' },
    { name: 'Teens', href: '/teens' },
    { name: 'Parents', href: '/parent-dashboard' },
    { name: 'Teachers', href: '/teachers' },
  ],
  company: [
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Privacy', href: '/privacy' },
    { name: 'Terms', href: '/terms' },
  ],
  social: [
    { name: 'Facebook', href: '#', icon: Facebook },
    { name: 'Twitter', href: '#', icon: Twitter },
    { name: 'Instagram', href: '#', icon: Instagram },
    { name: 'YouTube', href: '#', icon: Youtube },
  ],
}

export const Footer = () => {
  const currentYear = new Date().getFullYear()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    try {
      // Simulate API call - replace with actual Supabase insert
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Subscribed successfully!', {
        description: 'Thank you for joining our newsletter.',
      })
      setEmail('')
    } catch {
      toast.error('Something went wrong', {
        description: 'Please try again later.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <footer className="bg-[#0a0a14] text-white relative overflow-hidden">
      {/* Gradient decoration */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 py-16">
        {/* Newsletter Section */}
        <div className="mb-12 pb-12 border-b border-white/10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold">Stay Connected</h3>
              <p className="mt-2 text-slate-400">
                Get the latest updates on courses, job opportunities, and community news.
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-primary"
                required
              />
              <Button
                type="submit"
                disabled={isLoading}
                variant="gradient-secondary"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Subscribe
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block">
              <OdaaLogo size="md" showText={true} />
            </Link>
            <p className="mt-4 text-sm text-slate-400 max-w-xs">
              ODDA - Empowering the global Oromo community through education, careers, and cultural preservation.
            </p>
            {/* Social Links */}
            <div className="flex gap-3 mt-6">
              {footerLinks.social.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-primary/50 transition-all"
                  aria-label={social.name}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Platform</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-slate-300 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Age Groups */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">For You</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.ageGroups.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-slate-300 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Company</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-slate-300 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Contact</h3>
            <ul className="mt-4 space-y-3 text-slate-300 text-sm">
              <li>support@odda.org</li>
              <li>Minneapolis, MN</li>
              <li>United States</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-400 flex items-center gap-2">
            &copy; {currentYear} ODDA - Oromo Digital Diaspora Association. Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> for the Oromo community.
          </p>
          <div className="flex gap-6 text-sm text-slate-400">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
