import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { mux } from '@/lib/mux'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Admin check
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { lessonId } = await request.json()

    // Create a direct upload URL
    const upload = await mux.video.uploads.create({
      cors_origin: process.env.NEXT_PUBLIC_APP_URL!,
      new_asset_settings: {
        playback_policy: ['public'],
        encoding_tier: 'baseline',
        passthrough: lessonId, // carry lessonId through webhook
      },
    })

    return NextResponse.json({
      uploadId: upload.id,
      uploadUrl: upload.url,
    })
  } catch (err) {
    console.error('[mux/upload]', err)
    return NextResponse.json({ error: 'Failed to create upload URL' }, { status: 500 })
  }
}
