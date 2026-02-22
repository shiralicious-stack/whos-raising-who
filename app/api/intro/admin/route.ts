import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// GET — list all slots (with booking info) for admin
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('intro_slots')
    .select('*, intro_bookings(name, email, notes)')
    .order('scheduled_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ slots: data })
}

// POST — add one slot or many slots at once
// Body: { scheduledAt, durationMinutes } OR { slots: [{ scheduledAt, durationMinutes }, ...] }
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const admin = createAdminClient()

  // Batch insert
  if (Array.isArray(body.slots)) {
    const rows = body.slots.map((s: { scheduledAt: string; durationMinutes?: number }) => ({
      scheduled_at: s.scheduledAt,
      duration_minutes: s.durationMinutes ?? 30,
    }))
    const { data, error } = await admin.from('intro_slots').insert(rows).select()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ slots: data, count: data.length })
  }

  // Single insert
  const { scheduledAt, durationMinutes = 30 } = body
  if (!scheduledAt) return NextResponse.json({ error: 'scheduledAt is required' }, { status: 400 })

  const { data, error } = await admin
    .from('intro_slots')
    .insert({ scheduled_at: scheduledAt, duration_minutes: durationMinutes })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ slot: data })
}

// DELETE — remove a slot
export async function DELETE(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await request.json()
  const admin = createAdminClient()
  const { error } = await admin.from('intro_slots').delete().eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
