import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createRoom, getRoom } from '@/lib/daily'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { eventId } = await request.json()

    // Check existing room
    const { data: event } = await supabase
      .from('events')
      .select('daily_room_name, daily_room_url')
      .eq('id', eventId)
      .single()

    if (event?.daily_room_name && event?.daily_room_url) {
      const existing = await getRoom(event.daily_room_name)
      if (existing) return NextResponse.json({ url: existing.url, name: existing.name })
    }

    // Create new room
    const name = `event-${eventId.slice(0, 8)}`
    const room = await createRoom({ name, privacy: 'private' })

    await supabase
      .from('events')
      .update({ daily_room_name: room.name, daily_room_url: room.url })
      .eq('id', eventId)

    return NextResponse.json({ url: room.url, name: room.name })
  } catch (err) {
    console.error('[daily/room]', err)
    return NextResponse.json({ error: 'Failed to create room' }, { status: 500 })
  }
}
