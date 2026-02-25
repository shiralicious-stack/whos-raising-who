const DAILY_BASE = 'https://api.daily.co/v1'

function getDailyKey(): string {
  const key = process.env.DAILY_API_KEY
  if (!key) throw new Error('DAILY_API_KEY environment variable is not set')
  return key
}

async function dailyFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${DAILY_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getDailyKey()}`,
      ...(options.headers as Record<string, string> | undefined),
    },
  })
  if (!res.ok) {
    const error = await res.text()
    throw new Error(`Daily.co API error ${res.status}: ${error}`)
  }
  return res.json()
}

export interface DailyRoom {
  id: string
  name: string
  url: string
  privacy: 'public' | 'private'
  created_at: number
  config: Record<string, unknown>
}

export async function createRoom(options: {
  name?: string
  privacy?: 'public' | 'private'
  expiryMinutes?: number
}): Promise<DailyRoom> {
  const { name, privacy = 'private', expiryMinutes } = options
  const body: Record<string, unknown> = { privacy }
  if (name) body.name = name
  if (expiryMinutes) {
    body.properties = {
      exp: Math.floor(Date.now() / 1000) + expiryMinutes * 60,
      enable_recording: 'cloud',
    }
  } else {
    body.properties = {
      enable_recording: 'cloud',
    }
  }
  return dailyFetch('/rooms', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function getRoom(name: string): Promise<DailyRoom | null> {
  try {
    return await dailyFetch(`/rooms/${name}`)
  } catch {
    return null
  }
}

export async function createMeetingToken(options: {
  roomName: string
  isOwner?: boolean
  expiryMinutes?: number
  userName?: string
}): Promise<{ token: string }> {
  const { roomName, isOwner = false, expiryMinutes = 120, userName } = options
  return dailyFetch('/meeting-tokens', {
    method: 'POST',
    body: JSON.stringify({
      properties: {
        room_name: roomName,
        is_owner: isOwner,
        exp: Math.floor(Date.now() / 1000) + expiryMinutes * 60,
        user_name: userName,
      },
    }),
  })
}
