import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('coaching_slots')
    .select('id, scheduled_at, duration_minutes')
    .eq('is_booked', false)
    .gt('scheduled_at', new Date().toISOString())
    .order('scheduled_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ slots: data })
}
