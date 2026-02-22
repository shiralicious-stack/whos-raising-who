'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, BookOpen, Calendar, Clock, Users, CreditCard, ArrowLeft
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Overview', exact: true },
  { href: '/admin/courses', icon: BookOpen, label: 'Courses' },
  { href: '/admin/events', icon: Calendar, label: 'Events' },
  { href: '/admin/bookings', icon: Clock, label: 'Bookings' },
  { href: '/admin/users', icon: Users, label: 'Members' },
  { href: '/admin/tiers', icon: CreditCard, label: 'Tiers' },
]

export function AdminNav() {
  const pathname = usePathname()

  return (
    <aside className="w-60 bg-card border-r flex flex-col min-h-screen sticky top-0">
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
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>
    </aside>
  )
}
