'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, BookOpen, Calendar, Clock, Users, CreditCard, ArrowLeft, Menu, X, Phone, Heart, FileText
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Overview', exact: true },
  { href: '/admin/courses', icon: BookOpen, label: 'Courses' },
  { href: '/admin/events', icon: Calendar, label: 'Events' },
  { href: '/admin/bookings', icon: Clock, label: 'Bookings' },
  { href: '/admin/users', icon: Users, label: 'Members' },
  { href: '/admin/tiers', icon: CreditCard, label: 'Tiers' },
  { href: '/admin/availability', icon: Phone, label: 'Intro Calls' },
  { href: '/admin/coaching', icon: Heart, label: 'Coaching Sessions' },
  { href: '/admin/content', icon: FileText, label: 'Site Content' },
]

export function AdminNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const navContent = (
    <>
      <div className="p-5 border-b">
        <p className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-1">Admin</p>
        <p className="font-serif text-lg font-bold">Who&apos;s Raising Who</p>
      </div>

      <nav className="flex-1 p-3 space-y-0.5">
        {navItems.map(({ href, icon: Icon, label, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                active
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t">
        <Link
          href="/dashboard"
          onClick={() => setOpen(false)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-14 px-4 bg-card border-b">
        <p className="font-serif font-bold">Admin</p>
        <button
          onClick={() => setOpen(prev => !prev)}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside className={cn(
        'lg:hidden fixed top-14 left-0 bottom-0 z-50 w-64 bg-card border-r flex flex-col transition-transform duration-200',
        open ? 'translate-x-0' : '-translate-x-full'
      )}>
        {navContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-60 bg-card border-r flex-col min-h-screen sticky top-0">
        {navContent}
      </aside>
    </>
  )
}
