import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createRoom } from '@/lib/daily'
import { resend, FROM_EMAIL } from '@/lib/resend'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Verify VIP
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*, membership_tiers(tier_level)')
      .eq('user_id', user.id)
      .in('status', ['active', 'trialing'])
      .maybeSingle()

    const tierLevel = (subscription as any)?.membership_tiers?.tier_level ?? 0
    if (tierLevel < 3) {
      return NextResponse.json({ error: '1:1 sessions require VIP membership' }, { status: 403 })
    }

    const { scheduledAt, notes } = await request.json()

    if (!scheduledAt) {
      return NextResponse.json({ error: 'scheduledAt is required' }, { status: 400 })
    }

    // Create Daily.co room
    const roomName = `booking-${user.id.slice(0, 8)}-${Date.now()}`
    const room = await createRoom({ name: roomName, privacy: 'private' })

    // Create booking
    const admin = createAdminClient()
    const { data: booking, error } = await admin
      .from('bookings')
      .insert({
        user_id: user.id,
        scheduled_at: scheduledAt,
        duration_minutes: 50,
        daily_room_name: room.name,
        daily_room_url: room.url,
        notes: notes ?? null,
        status: 'pending',
      })
      .select()
      .single()

    if (error) throw error

    // Send confirmation email to member
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single()

    await resend.emails.send({
      from: FROM_EMAIL,
      to: user.email!,
      subject: "Your session request has been received — Who's Raising Who",
      html: `
        <p>Hi ${profile?.full_name ?? 'there'},</p>
        <p>Thank you for requesting a 1:1 coaching session! Here's what you booked:</p>
        <p><strong>${new Date(scheduledAt).toLocaleString('en-US', {
          weekday: 'long', month: 'long', day: 'numeric',
          hour: 'numeric', minute: '2-digit', timeZoneName: 'short',
        })}</strong></p>
        <p>Shira will confirm your session within 24 hours. Once confirmed, your video room link will be sent to this email.</p>
        <p>Topics you'd like to focus on: <em>${notes ?? 'None specified'}</em></p>
        <br>
        <p>With warmth,<br>The Who's Raising Who Team</p>
      `,
    })

    // Notify Shira (admin)
    await resend.emails.send({
      from: FROM_EMAIL,
      to: process.env.RESEND_FROM_EMAIL ?? FROM_EMAIL,
      subject: `New 1:1 booking request from ${profile?.full_name}`,
      html: `
        <p>A new session has been requested:</p>
        <ul>
          <li><strong>Member:</strong> ${profile?.full_name} (${user.email})</li>
          <li><strong>Date:</strong> ${new Date(scheduledAt).toLocaleString()}</li>
          <li><strong>Focus:</strong> ${notes ?? 'Not specified'}</li>
          <li><strong>Room URL:</strong> <a href="${room.url}">${room.url}</a></li>
        </ul>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/bookings">Manage in Admin Panel →</a></p>
      `,
    })

    return NextResponse.json({ booking })
  } catch (err) {
    console.error('[bookings/POST]', err)
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { bookingId, status, adminNotes } = await request.json()
    const admin = createAdminClient()

    // Verify admin or owner
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const { data: booking } = await admin
      .from('bookings')
      .select('user_id, daily_room_url, scheduled_at')
      .eq('id', bookingId)
      .single()

    if (!booking) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (profile?.role !== 'admin' && booking.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const updateData: Record<string, unknown> = {
      status,
      updated_at: new Date().toISOString(),
    }
    if (adminNotes !== undefined) updateData.admin_notes = adminNotes

    await admin.from('bookings').update(updateData).eq('id', bookingId)

    // If admin confirms, send email with room link
    if (status === 'confirmed' && profile?.role === 'admin') {
      const { data: memberProfile } = await admin
        .from('profiles')
        .select('full_name')
        .eq('id', booking.user_id)
        .single()

      const { data: memberUser } = await admin.auth.admin.getUserById(booking.user_id)

      if (memberUser.user?.email) {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: memberUser.user.email,
          subject: "Your session is confirmed ✓ — Who's Raising Who",
          html: `
            <p>Hi ${memberProfile?.full_name ?? 'there'},</p>
            <p>Your 1:1 coaching session with Shira is <strong>confirmed!</strong></p>
            <p><strong>When:</strong> ${new Date(booking.scheduled_at).toLocaleString('en-US', {
              weekday: 'long', month: 'long', day: 'numeric',
              hour: 'numeric', minute: '2-digit', timeZoneName: 'short',
            })}</p>
            <p><strong>Join here:</strong> <a href="${booking.daily_room_url}">${booking.daily_room_url}</a></p>
            <p>See you soon!</p>
            <br>
            <p>Shira</p>
          `,
        })
      }
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[bookings/PATCH]', err)
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 })
  }
}
