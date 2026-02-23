import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getResend } from '@/lib/resend'

export async function POST(request: NextRequest) {
  const { slotId, name, email, phone, meetingType, notes } = await request.json()

  if (!slotId || !name || !email) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
  }

  const supabase = createAdminClient()

  // Get the slot and verify it's still available
  const { data: slot, error: slotError } = await supabase
    .from('intro_slots')
    .select('*')
    .eq('id', slotId)
    .eq('is_booked', false)
    .single()

  if (slotError || !slot) {
    return NextResponse.json({ error: 'This time slot is no longer available.' }, { status: 409 })
  }

  // Mark slot as booked
  const { error: updateError } = await supabase
    .from('intro_slots')
    .update({ is_booked: true })
    .eq('id', slotId)

  if (updateError) return NextResponse.json({ error: 'Booking failed. Please try again.' }, { status: 500 })

  // Create booking record
  await supabase.from('intro_bookings').insert({ slot_id: slotId, name, email, phone: phone ?? null, meeting_type: meetingType ?? 'video', notes })

  // Format the date/time for emails
  const date = new Date(slot.scheduled_at)
  const formatted = date.toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit', hour12: true, timeZoneName: 'short',
  })

  const resend = getResend()
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'hello@whosraisingwho.com'

  // Email to Shira
  await resend.emails.send({
    from: fromEmail,
    to: 'shiralicious@gmail.com',
    subject: `New intro call booked — ${name}`,
    html: `
      <h2>New intro call booking</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
      <p><strong>Meeting type:</strong> ${meetingType === 'phone' ? '📞 Phone call' : '🎥 Video call'}</p>
      <p><strong>Time:</strong> ${formatted}</p>
      <p><strong>Duration:</strong> ${slot.duration_minutes} minutes</p>
      ${notes ? `<p><strong>What they'd like to discuss:</strong> ${notes}</p>` : ''}
    `,
  })

  // Confirmation email to visitor
  await resend.emails.send({
    from: fromEmail,
    to: email,
    subject: `You're booked — Intro call with Shira`,
    html: `
      <p>Hi ${name},</p>
      <p>Your free introductory call with Shira is confirmed!</p>
      <p><strong>${formatted}</strong></p>
      <p>${meetingType === 'phone' ? `Shira will call you at ${phone} at the scheduled time.` : 'Shira will send you a video room link before the call.'} If you need to reschedule, just reply to this email.</p>
      <p>Looking forward to connecting,<br/>Shira</p>
      <p style="color:#888;font-size:12px;">Who's Raising Who · hello@whosraisingwho.com</p>
    `,
  })

  return NextResponse.json({ success: true })
}
