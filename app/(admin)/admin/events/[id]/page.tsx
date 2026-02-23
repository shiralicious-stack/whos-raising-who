import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { EventEditor } from '@/components/admin/event-editor'

interface PageProps {
  params: Promise<{ id: string }>
}

export const metadata = { title: 'Admin — Edit Event' }

export default async function AdminEventEditorPage({ params }: PageProps) {
  const { id } = await params

  if (id === 'new') {
    return <EventEditor event={null} />
  }

  const supabase = await createClient()
  const { data: event, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !event) notFound()

  return <EventEditor event={event as any} />
}
