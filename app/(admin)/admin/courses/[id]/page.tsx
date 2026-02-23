import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { CourseBuilder } from '@/components/admin/course-builder'

interface PageProps {
  params: Promise<{ id: string }>
}

export const metadata = { title: 'Admin — Edit Course' }

export default async function AdminCourseEditorPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  if (id === 'new') {
    return <CourseBuilder course={null} />
  }

  const { data: course, error } = await supabase
    .from('courses')
    .select(`
      *,
      modules(
        *,
        lessons(*)
      )
    `)
    .eq('id', id)
    .single()

  if (error || !course) notFound()

  const sortedCourse = {
    ...course,
    modules: (course.modules ?? [])
      .sort((a: any, b: any) => a.sort_order - b.sort_order)
      .map((mod: any) => ({
        ...mod,
        lessons: (mod.lessons ?? []).sort((a: any, b: any) => a.sort_order - b.sort_order),
      })),
  }

  return <CourseBuilder course={sortedCourse as any} />
}
