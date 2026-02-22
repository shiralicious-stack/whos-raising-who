import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Calendar, Clock, Users, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RegisterButton } from '@/components/register-button'
import type { Event } from '@/types'

export const metadata = { title: 'Events' }

const eventTypeLabel: Record<string, string> = {
  webinar: 'Webinar',
  group_call: 'Group Call',
  one_on_one: '1:1 Session',
  recurring: 'Recurring',
}

export default async function EventsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: events }, { data: subscription }, { data: registrations }] = await Promise.all([
    supabase
      .from('events')
      .select('*')
      .eq('published', true)
      .gte('scheduled_at', new Date().toISOString())
      .order('scheduled_at', { ascending: true }),
    supabase
      .from('subscriptions')
      .select('*, membership_tiers(tier_level)')
      .eq('user_id', user!.id)
      .in('status', ['active', 'trialing'])
      .maybeSingle(),
    supabase
      .from('event_registrations')
      .select('event_id')
      .eq('user_id', user!.id),
  ])

  const userTierLevel = (subscription as any)?.membership_tiers?.tier_level ?? 0
  const registeredIds = new Set((registrations ?? []).map((r: any) => r.event_id))

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold">Upcoming Events</h1>
        <p className="text-muted-foreground mt-1">Live sessions, webinars, and group calls with Shira</p>
      </div>

      {(!events || events.length === 0) && (
        <div className="text-center py-16 text-muted-foreground">
          <Calendar className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">No upcoming events</p>
          <p className="text-sm">Check back soon for new sessions.</p>
        </div>
      )}

      <div className="space-y-4">
        {(events as Event[])?.map(event => {
          const canAccess = userTierLevel >= event.min_tier_level
          const isRegistered = registeredIds.has(event.id)
          const scheduledAt = new Date(event.scheduled_at)

          return (
            <div key={event.id} className="rounded-2xl border bg-card p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Date / time */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-center min-w-[48px]">
                      <p className="text-xs text-muted-foreground uppercase font-medium">
                        {scheduledAt.toLocaleDateString('en-US', { month: 'short' })}
                      </p>
                      <p className="text-2xl font-bold leading-none">{scheduledAt.getDate()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {scheduledAt.toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true,
                          timeZoneName: 'short',
                        })}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {eventTypeLabel[event.type] ?? event.type}
                        </Badge>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {event.duration_minutes} min
                        </span>
                        {event.max_participants && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Users className="h-3 w-3" />
                            max {event.max_participants}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <h3 className="font-semibold text-lg mb-1">{event.title}</h3>
                  {event.description && (
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                  )}
                </div>

                {/* CTA */}
                <div className="flex-shrink-0">
                  {!canAccess ? (
                    <Button asChild variant="outline" size="sm">
                      <Link href="/pricing">
                        <Lock className="h-3.5 w-3.5 mr-1.5" />
                        Upgrade
                      </Link>
                    </Button>
                  ) : isRegistered ? (
                    <Button asChild variant="default" size="sm">
                      <Link href={`/events/${event.id}`}>
                        Join Room
                      </Link>
                    </Button>
                  ) : (
                    <RegisterButton eventId={event.id} userId={user!.id} />
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
