import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { EventEditor } from '@/components/admin/event-editor'

interface PageProps {
  params: { id: string }
}

export const metadata = { title: 'Admin — Edit Event' }

export default async function AdminEventEditorPage({ params }: PageProps) {
  if (params.id === 'new') {
    return <EventEditor event={null} />
  }

  const supabase = await createClient()
  const { data: event, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !event) notFound()

  return <EventEditor event={event as any} />
}
