import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Clock, Plus, Video } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Booking } from '@/types'

export const metadata = { title: 'My Sessions' }

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  cancelled: 'bg-gray-100 text-gray-600',
  completed: 'bg-blue-100 text-blue-800',
}

export default async function BookingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Check if user is VIP tier (can book 1:1)
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*, membership_tiers(tier_level, name)')
    .eq('user_id', user!.id)
    .in('status', ['active', 'trialing'])
    .maybeSingle()

  const tierLevel = (subscription as any)?.membership_tiers?.tier_level ?? 0
  const canBook = tierLevel >= 3 // VIP only

  const { data: bookings } = await supabase
    .from('bookings')
    .select('*')
    .eq('user_id', user!.id)
    .order('scheduled_at', { ascending: false })

  const upcoming = (bookings as Booking[])?.filter(
    b => new Date(b.scheduled_at) > new Date() && b.status !== 'cancelled'
  ) ?? []
  const past = (bookings as Booking[])?.filter(
    b => new Date(b.scheduled_at) <= new Date() || b.status === 'cancelled'
  ) ?? []

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold">My 1:1 Sessions</h1>
          <p className="text-muted-foreground mt-1">Private coaching sessions with Shira</p>
        </div>
        {canBook && (
          <Button asChild>
            <Link href="/bookings/new">
              <Plus className="h-4 w-4 mr-2" />
              Book Session
            </Link>
          </Button>
        )}
      </div>

      {!canBook && (
        <div className="rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 p-8 text-center">
          <Clock className="h-10 w-10 text-primary/40 mx-auto mb-3" />
          <h2 className="font-semibold text-lg mb-2">1:1 Sessions are a VIP benefit</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Upgrade to the VIP plan to get one 50-minute private coaching session with Shira each month.
          </p>
          <Button asChild>
            <Link href="/pricing">Upgrade to VIP</Link>
          </Button>
        </div>
      )}

      {upcoming.length > 0 && (
        <div>
          <h2 className="font-semibold text-lg mb-4">Upcoming</h2>
          <div className="space-y-3">
            {upcoming.map(booking => (
              <div key={booking.id} className="rounded-xl border bg-card p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium">
                      {new Date(booking.scheduled_at).toLocaleDateString('en-US', {
                        weekday: 'long', month: 'long', day: 'numeric',
                      })}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(booking.scheduled_at).toLocaleTimeString('en-US', {
                        hour: 'numeric', minute: '2-digit', hour12: true, timeZoneName: 'short',
                      })} · {booking.duration_minutes} min
                    </p>
                    {booking.notes && (
                      <p className="text-sm text-muted-foreground mt-2 italic">&ldquo;{booking.notes}&rdquo;</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusColors[booking.status]}`}>
                      {booking.status}
                    </span>
                    {booking.status === 'confirmed' && booking.daily_room_url && (
                      <Button asChild size="sm">
                        <a href={booking.daily_room_url} target="_blank" rel="noopener noreferrer">
                          <Video className="h-3.5 w-3.5 mr-1.5" />
                          Join
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {past.length > 0 && (
        <div>
          <h2 className="font-semibold text-lg mb-4 text-muted-foreground">Past Sessions</h2>
          <div className="space-y-3">
            {past.map(booking => (
              <div key={booking.id} className="rounded-xl border bg-card p-5 opacity-70">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium">
                      {new Date(booking.scheduled_at).toLocaleDateString('en-US', {
                        weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
                      })}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {booking.duration_minutes} min
                    </p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusColors[booking.status]}`}>
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {bookings?.length === 0 && canBook && (
        <div className="text-center py-12 text-muted-foreground">
          <Clock className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">No sessions yet</p>
          <p className="text-sm mb-6">Book your first 1:1 session with Shira.</p>
          <Button asChild>
            <Link href="/bookings/new">Book Now</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
