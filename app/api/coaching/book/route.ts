import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getResend } from '@/lib/resend'

export async function POST(request: NextRequest) {
  const { slotId, name, email, notes } = await request.json()

  if (!slotId || !name || !email) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
  }

  const supabase = createAdminClient()

  const { data: slot, error: slotError } = await supabase
    .from('coaching_slots')
    .select('*')
    .eq('id', slotId)
    .eq('is_booked', false)
    .single()

  if (slotError || !slot) {
    return NextResponse.json({ error: 'This time slot is no longer available.' }, { status: 409 })
  }

  const { error: updateError } = await supabase
    .from('coaching_slots')
    .update({ is_booked: true })
    .eq('id', slotId)

  if (updateError) return NextResponse.json({ error: 'Booking failed. Please try again.' }, { status: 500 })

  await supabase.from('coaching_bookings').insert({ slot_id: slotId, name, email, notes })

  const date = new Date(slot.scheduled_at)
  const formatted = date.toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true, timeZoneName: 'short',
  })

  const resend = getResend()
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'hello@whosraisingwho.com'

  await resend.emails.send({
    from: fromEmail,
    to: 'shiralicious@gmail.com',
    subject: `New coaching session booked — ${name}`,
    html: `
      <h2>New coaching session booking</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Time:</strong> ${formatted}</p>
      <p><strong>Duration:</strong> ${slot.duration_minutes} minutes</p>
      ${notes ? `<p><strong>What they'd like to work on:</strong> ${notes}</p>` : ''}
    `,
  })

  await resend.emails.send({
    from: fromEmail,
    to: email,
    subject: `Your coaching session with Shira is confirmed`,
    html: `
      <p>Hi ${name},</p>
      <p>Your 50-minute coaching session with Shira is confirmed!</p>
      <p><strong>${formatted}</strong></p>
      <p>Shira will send you a video room link before the session. If you need to reschedule, just reply to this email.</p>
      <p>Looking forward to working together,<br/>Shira</p>
      <p style="color:#888;font-size:12px;">Who's Raising Who · hello@whosraisingwho.com</p>
    `,
  })

  return NextResponse.json({ success: true })
}
