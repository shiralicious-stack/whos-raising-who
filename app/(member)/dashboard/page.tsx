import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { BookOpen, Calendar, Clock, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDuration } from '@/lib/utils'
import type { Course, Event, Booking, Subscription } from '@/types'

export const metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: profile }, { data: subscription }, { data: recentCourses }, { data: upcomingEvents }, { data: upcomingBookings }] =
    await Promise.all([
      supabase.from('profiles').select('*').eq('id', user!.id).single(),
      supabase
        .from('subscriptions')
        .select('*, membership_tiers(*)')
        .eq('user_id', user!.id)
        .eq('status', 'active')
        .maybeSingle(),
      supabase
        .from('courses')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(3),
      supabase
        .from('events')
        .select('*')
        .eq('published', true)
        .gte('scheduled_at', new Date().toISOString())
        .order('scheduled_at', { ascending: true })
        .limit(3),
      supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user!.id)
        .in('status', ['pending', 'confirmed'])
        .gte('scheduled_at', new Date().toISOString())
        .order('scheduled_at', { ascending: true })
        .limit(3),
    ])

  const sub = subscription as (Subscription & { membership_tiers: { name: string; tier_level: number } }) | null
  const firstName = profile?.full_name?.split(' ')[0] ?? 'there'

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold">
          Welcome back, {firstName}
        </h1>
        <p className="text-muted-foreground mt-1">
          {sub
            ? `You're on the ${sub.membership_tiers.name} plan`
            : 'You don\'t have an active membership yet'}
        </p>
      </div>

      {/* No subscription CTA */}
      {!sub && (
        <div className="rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 p-8 text-center">
          <h2 className="font-serif text-2xl font-bold mb-2">Start your journey</h2>
          <p className="text-muted-foreground mb-6">
            Choose a membership to unlock courses, live events, and coaching sessions.
          </p>
          <Button asChild>
            <Link href="/pricing">View Membership Options</Link>
          </Button>
        </div>
      )}

      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">Courses</span>
          </div>
          <p className="text-2xl font-bold">{recentCourses?.length ?? 0}</p>
          <p className="text-xs text-muted-foreground">available to you</p>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">Events</span>
          </div>
          <p className="text-2xl font-bold">{upcomingEvents?.length ?? 0}</p>
          <p className="text-xs text-muted-foreground">coming up</p>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">Sessions</span>
          </div>
          <p className="text-2xl font-bold">{upcomingBookings?.length ?? 0}</p>
          <p className="text-xs text-muted-foreground">upcoming</p>
        </div>
      </div>

      {/* Recent Courses */}
      {recentCourses && recentCourses.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">Recent Courses</h2>
            <Button asChild variant="ghost" size="sm">
              <Link href="/courses">
                View all <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="space-y-3">
            {(recentCourses as Course[]).map(course => (
              <Link
                key={course.id}
                href={`/courses/${course.slug}`}
                className="flex items-center gap-4 p-4 rounded-xl border bg-card hover:shadow-sm transition-shadow"
              >
                <div className="w-16 h-16 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
                  {course.thumbnail_url ? (
                    <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{course.title}</p>
                  <p className="text-sm text-muted-foreground truncate">{course.description}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Events */}
      {upcomingEvents && upcomingEvents.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">Upcoming Events</h2>
            <Button asChild variant="ghost" size="sm">
              <Link href="/events">
                View all <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="space-y-3">
            {(upcomingEvents as Event[]).map(event => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="flex items-start gap-4 p-4 rounded-xl border bg-card hover:shadow-sm transition-shadow"
              >
                <div className="text-center min-w-[52px]">
                  <p className="text-xs text-muted-foreground uppercase">
                    {new Date(event.scheduled_at).toLocaleDateString('en-US', { month: 'short' })}
                  </p>
                  <p className="text-2xl font-bold leading-none">
                    {new Date(event.scheduled_at).getDate()}
                  </p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{event.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs capitalize">
                      {event.type.replace('_', ' ')}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(event.scheduled_at).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true,
                      })}
                    </span>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
