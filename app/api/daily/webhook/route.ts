import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { resend, FROM_EMAIL } from '@/lib/resend'
import crypto from 'crypto'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function verifySignature(body: string, signature: string | null): boolean {
  const secret = process.env.DAILY_WEBHOOK_SECRET
  if (!secret) return true // skip verification if no secret configured
  if (!signature) return false
  const hmac = crypto.createHmac('sha256', secret).update(body).digest('hex')
  return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(signature))
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text()

  // Verify webhook signature if configured
  const signature = req.headers.get('x-webhook-signature')
  if (!verifySignature(rawBody, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  let payload: Record<string, unknown>
  try {
    payload = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const eventType = payload.type as string | undefined
  if (eventType !== 'recording.ready-to-download') {
    return NextResponse.json({ ok: true }) // ignore other events
  }

  const data = payload.payload as Record<string, unknown> | undefined
  if (!data) {
    return NextResponse.json({ error: 'Missing payload' }, { status: 400 })
  }

  const roomName = data.room_name as string | undefined
  const downloadLink = data.download_link as string | undefined

  if (!roomName || !downloadLink) {
    return NextResponse.json({ error: 'Missing room_name or download_link' }, { status: 400 })
  }

  // Try to find matching event
  let sessionContext = `Room: ${roomName}`
  const { data: event } = await supabase
    .from('events')
    .select('id, title, starts_at')
    .eq('daily_room_name', roomName)
    .single()

  if (event) {
    await supabase
      .from('events')
      .update({ recording_url: downloadLink })
      .eq('id', event.id)
    const date = new Date(event.starts_at).toLocaleDateString('en-US', {
      dateStyle: 'medium',
    })
    sessionContext = `Event: ${event.title} (${date})`
  } else {
    // Try bookings table
    const { data: booking } = await supabase
      .from('bookings')
      .select('id, scheduled_at, profiles(full_name)')
      .eq('daily_room_name', roomName)
      .single()

    if (booking) {
      await supabase
        .from('bookings')
        .update({ recording_url: downloadLink })
        .eq('id', booking.id)
      const date = new Date(booking.scheduled_at).toLocaleDateString('en-US', {
        dateStyle: 'medium',
      })
      const memberName =
        (booking.profiles as unknown as { full_name: string } | null)?.full_name ?? 'Unknown'
      sessionContext = `1:1 Booking with ${memberName} (${date})`
    }
  }

  // Send email to admin only
  const adminEmail = process.env.ADMIN_EMAIL || process.env.RESEND_FROM_EMAIL || 'shiralicious@gmail.com'
  // Strip display name if present (e.g. "Name <email>" → "email")
  const toEmail = adminEmail.includes('<')
    ? adminEmail.match(/<(.+)>/)?.[1] ?? adminEmail
    : adminEmail

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: [toEmail],
      subject: `Call Recording Ready — ${sessionContext}`,
      html: `
        <h2>Call Recording Ready</h2>
        <p><strong>${sessionContext}</strong></p>
        <p>Your call recording is ready to download:</p>
        <p><a href="${downloadLink}" style="display:inline-block;padding:10px 20px;background:#6366f1;color:#fff;border-radius:6px;text-decoration:none;">Download Recording</a></p>
        <p style="color:#888;font-size:13px;">This link is from Daily.co and may expire. Download it soon.</p>
      `,
    })
  } catch (emailError) {
    console.error('Failed to send recording email:', emailError)
  }

  return NextResponse.json({ ok: true })
}
