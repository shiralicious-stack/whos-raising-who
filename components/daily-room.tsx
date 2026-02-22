'use client'

import { useEffect, useRef, useState } from 'react'
import DailyIframe from '@daily-co/daily-js'
import { Loader2 } from 'lucide-react'

interface DailyRoomProps {
  roomUrl: string
  token: string
  userName: string
  eventTitle: string
  isOwner?: boolean
}

export function DailyRoom({ roomUrl, token, userName, eventTitle, isOwner = false }: DailyRoomProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const callRef = useRef<ReturnType<typeof DailyIframe.createFrame> | null>(null)
  const [status, setStatus] = useState<'loading' | 'joined' | 'left' | 'error'>('loading')

  useEffect(() => {
    if (!containerRef.current) return

    const call = DailyIframe.createFrame(containerRef.current, {
      showLeaveButton: true,
      showFullscreenButton: true,
      iframeStyle: {
        width: '100%',
        height: '100%',
        border: 'none',
      },
    })
    callRef.current = call

    call.on('joined-meeting', () => setStatus('joined'))
    call.on('left-meeting', () => setStatus('left'))
    call.on('error', () => setStatus('error'))

    call.join({ url: roomUrl, token, userName })

    return () => {
      call.destroy()
    }
  }, [roomUrl, token, userName])

  if (status === 'left') {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="font-serif text-2xl font-bold mb-2">Session ended</h2>
          <p className="text-muted-foreground mb-6">Thanks for joining {eventTitle}!</p>
          <a href="/events" className="text-primary hover:underline">← Back to Events</a>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="font-serif text-2xl font-bold mb-2">Connection error</h2>
          <p className="text-muted-foreground mb-6">Could not connect to the room. Please try again.</p>
          <button onClick={() => window.location.reload()} className="text-primary hover:underline">
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-screen bg-black">
      {status === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-black">
          <div className="text-center text-white">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3" />
            <p className="text-sm opacity-70">Connecting to {eventTitle}...</p>
          </div>
        </div>
      )}
      <div ref={containerRef} className="w-full h-full" />
    </div>
  )
}
