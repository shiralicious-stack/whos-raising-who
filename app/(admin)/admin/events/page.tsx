import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Video } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Event } from '@/types'

export const metadata = { title: 'Admin — Events' }

export default async function AdminEventsPage() {
  const supabase = await createClient()
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .order('scheduled_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold">Events</h1>
          <p className="text-muted-foreground mt-1">{events?.length ?? 0} total</p>
        </div>
        <Button asChild>
          <Link href="/admin/events/new">
            <Plus className="h-4 w-4 mr-2" />
            New Event
          </Link>
        </Button>
      </div>

      <div className="rounded-xl border bg-card">
        {!events || events.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No events yet.
          </div>
        ) : (
          <table className="w-full">
            <thead className="border-b">
              <tr>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase p-4">Event</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase p-4">Type</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase p-4">Date</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase p-4">Tier</th>
                <th className="p-4" />
              </tr>
            </thead>
            <tbody>
              {(events as Event[]).map(event => (
                <tr key={event.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="p-4">
                    <p className="font-medium">{event.title}</p>
                    {event.daily_room_name && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Video className="h-3 w-3" />
                        {event.daily_room_name}
                      </p>
                    )}
                  </td>
                  <td className="p-4">
                    <Badge variant="outline" className="text-xs capitalize">
                      {event.type.replace('_', ' ')}
                    </Badge>
                  </td>
                  <td className="p-4 text-sm">
                    {new Date(event.scheduled_at).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric',
                    })}
                    <br />
                    <span className="text-muted-foreground text-xs">
                      {new Date(event.scheduled_at).toLocaleTimeString('en-US', {
                        hour: 'numeric', minute: '2-digit',
                      })}
                    </span>
                  </td>
                  <td className="p-4">
                    <Badge variant="secondary">Tier {event.min_tier_level}+</Badge>
                  </td>
                  <td className="p-4 text-right">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/admin/events/${event.id}`}>Edit</Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
