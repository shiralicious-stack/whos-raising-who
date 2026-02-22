import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createRoom, createMeetingToken, getRoom } from '@/lib/daily'
import { DailyRoom } from '@/components/daily-room'
import type { Event } from '@/types'

interface PageProps {
  params: { id: string }
}

export async function generateMetadata({ params }: PageProps) {
  const supabase = await createClient()
  const { data: event } = await supabase.from('events').select('title').eq('id', params.id).single()
  return { title: event?.title ?? 'Live Event' }
}

export default async function EventRoomPage({ params }: PageProps) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: event, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !event) notFound()

  // Check registration
  const { data: registration } = await supabase
    .from('event_registrations')
    .select('registered_at')
    .eq('event_id', params.id)
    .eq('user_id', user!.id)
    .maybeSingle()

  if (!registration) redirect('/events')

  // Check tier access
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*, membership_tiers(tier_level)')
    .eq('user_id', user!.id)
    .in('status', ['active', 'trialing'])
    .maybeSingle()

  const userTierLevel = (subscription as any)?.membership_tiers?.tier_level ?? 0
  if (userTierLevel < event.min_tier_level) redirect('/events')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', user!.id)
    .single()

  const isAdmin = profile?.role === 'admin'

  // Ensure the Daily.co room exists
  let roomUrl = event.daily_room_url
  let roomName = event.daily_room_name

  if (!roomName || !roomUrl) {
    const roomRes = await fetch('/api/daily/room', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventId: event.id }),
    })
    // We can't call API routes from server components directly — use the lib directly
    const room = await (async () => {
      // create or get room
      const existing = roomName ? await getRoom(roomName) : null
      if (existing) return existing
      const name = `event-${event.id.slice(0, 8)}`
      const created = await createRoom({ name, privacy: 'private' })
      await supabase
        .from('events')
        .update({ daily_room_name: created.name, daily_room_url: created.url })
        .eq('id', event.id)
      return created
    })()
    roomUrl = room.url
    roomName = room.name
  }

  // Create a meeting token
  const { token } = await createMeetingToken({
    roomName: roomName!,
    isOwner: isAdmin,
    expiryMinutes: (event as Event).duration_minutes + 30,
    userName: profile?.full_name ?? 'Guest',
  })

  return (
    <div className="-m-6 lg:-m-8">
      <DailyRoom
        roomUrl={roomUrl!}
        token={token}
        userName={profile?.full_name ?? 'Guest'}
        eventTitle={(event as Event).title}
        isOwner={isAdmin}
      />
    </div>
  )
}
