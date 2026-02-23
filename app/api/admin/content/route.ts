import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

async function getUser(request: NextRequest) {
  // Try Bearer token first (client-side fetch)
  const authHeader = request.headers.get('Authorization')
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null
  if (token) {
    const admin = createAdminClient()
    const { data: { user } } = await admin.auth.getUser(token)
    return user
  }
  // Fall back to cookie-based session (SSR)
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// GET ?page=home → { content: Record<string, string> }
export async function GET(request: NextRequest) {
  const user = await getUser(request)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const page = request.nextUrl.searchParams.get('page')
  if (!page) return NextResponse.json({ error: 'page param required' }, { status: 400 })

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('site_content')
    .select('key, value')
    .eq('page', page)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const content = Object.fromEntries((data ?? []).map(r => [r.key, r.value]))
  return NextResponse.json({ content })
}

// PUT body { page, updates: Record<string, string> } → upserts all keys
export async function PUT(request: NextRequest) {
  const user = await getUser(request)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { page, updates } = body as { page: string; updates: Record<string, string> }

  if (!page || !updates) {
    return NextResponse.json({ error: 'page and updates are required' }, { status: 400 })
  }

  const rows = Object.entries(updates).map(([key, value]) => ({
    page,
    key,
    value,
    updated_at: new Date().toISOString(),
  }))

  const admin = createAdminClient()
  const { error } = await admin
    .from('site_content')
    .upsert(rows, { onConflict: 'page,key' })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
