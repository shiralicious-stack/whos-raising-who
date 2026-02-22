import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { mux } from '@/lib/mux'

export async function POST(request: Request) {
  const body = await request.text()

  // Convert headers to a plain object for Mux's verifier
  const headers: Record<string, string> = {}
  request.headers.forEach((value, key) => { headers[key] = value })

  let event: ReturnType<typeof mux.webhooks.unwrap>
  try {
    event = mux.webhooks.unwrap(body, headers, process.env.MUX_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('[mux/webhook] signature verification failed', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'video.asset.ready') {
    const asset = event.data as {
      id: string
      passthrough?: string
      playback_ids?: { id: string }[]
      duration?: number
    }
    const lessonId = asset.passthrough

    if (lessonId && asset.playback_ids?.length) {
      const supabase = createAdminClient()
      const playbackId = asset.playback_ids[0].id

      await supabase
        .from('lessons')
        .update({
          mux_asset_id: asset.id,
          mux_playback_id: playbackId,
          duration_seconds: asset.duration ? Math.round(asset.duration) : null,
        })
        .eq('id', lessonId)

      console.log(`[mux/webhook] Asset ready for lesson ${lessonId}`)
    }
  }

  return NextResponse.json({ received: true })
}
