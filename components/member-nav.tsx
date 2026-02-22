'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, BookOpen, Calendar, Clock, Settings, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/courses', icon: BookOpen, label: 'Courses' },
  { href: '/events', icon: Calendar, label: 'Events' },
  { href: '/bookings', icon: Clock, label: 'My Sessions' },
  { href: '/settings', icon: Settings, label: 'Settings' },
]

interface MemberNavProps {
  profile: Profile | null
}

export function MemberNav({ profile }: MemberNavProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-card border shadow-sm"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 bg-card border-r flex flex-col transition-transform duration-200 lg:static lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="p-6 border-b">
          <Link href="/" className="font-serif text-lg font-bold text-foreground leading-tight">
            Who&apos;s<br />Raising Who
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                pathname === href || pathname.startsWith(`${href}/`)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>

        {/* User footer */}
        <div className="p-4 border-t">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={profile?.avatar_url ?? undefined} />
              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{profile?.full_name ?? 'Member'}</p>
              <p className="text-xs text-muted-foreground capitalize">{profile?.role}</p>
            </div>
          </div>
          {profile?.role === 'admin' && (
            <Button asChild variant="outline" size="sm" className="w-full mb-2">
              <Link href="/admin">Admin Panel</Link>
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-muted-foreground"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  )
}
