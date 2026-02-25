'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/community', label: 'Spring Cohort' },
  { href: '/coaching', label: 'Coaching' },
  { href: '/courses', label: 'Courses' },
  { href: '/events', label: 'Events' },
  { href: '/about', label: 'About' },
  { href: '/pricing', label: 'Membership' },
]

export function MarketingNav() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <span className="font-serif text-xl font-bold text-foreground">
            Who&apos;s Raising Who
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-5 text-sm">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/login" className="hidden lg:block text-sm text-muted-foreground hover:text-foreground transition-colors">
            Sign In
          </Link>
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href="/pricing">Join Now</Link>
          </Button>
          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setOpen(prev => !prev)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t bg-background px-4 py-4 space-y-1">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 space-y-2">
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href="/login" onClick={() => setOpen(false)}>Sign In</Link>
            </Button>
            <Button asChild size="sm" className="w-full">
              <Link href="/pricing" onClick={() => setOpen(false)}>Join Now</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
