import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { CoursePlayer } from '@/components/course-player'
import type { Course, Module, Lesson, LessonProgress } from '@/types'

interface PageProps {
  params: { slug: string }
  searchParams: { lesson?: string }
}

export async function generateMetadata({ params }: PageProps) {
  const supabase = await createClient()
  const { data: course } = await supabase
    .from('courses')
    .select('title')
    .eq('slug', params.slug)
    .single()
  return { title: course?.title ?? 'Course' }
}

export default async function CoursePage({ params, searchParams }: PageProps) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: course, error } = await supabase
    .from('courses')
    .select(`
      *,
      modules(
        *,
        lessons(*)
      )
    `)
    .eq('slug', params.slug)
    .eq('published', true)
    .single()

  if (error || !course) notFound()

  // Sort modules and lessons
  const sortedCourse = {
    ...course,
    modules: (course.modules as Module[])
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(mod => ({
        ...mod,
        lessons: (mod.lessons as Lesson[]).sort((a, b) => a.sort_order - b.sort_order),
      })),
  }

  // Check access
  const [{ data: subscription }, { data: purchase }] = await Promise.all([
    supabase
      .from('subscriptions')
      .select('*, membership_tiers(tier_level)')
      .eq('user_id', user!.id)
      .in('status', ['active', 'trialing'])
      .maybeSingle(),
    supabase
      .from('course_purchases')
      .select('id')
      .eq('user_id', user!.id)
      .eq('course_id', course.id)
      .maybeSingle(),
  ])

  const userTierLevel = (subscription as any)?.membership_tiers?.tier_level ?? 0
  const hasPurchased = !!purchase
  const isPreviewLesson = !!searchParams.lesson // handle preview lessons separately

  const hasAccess =
    hasPurchased ||
    (course.price === null && userTierLevel >= (course.min_tier_level ?? 1))

  if (!hasAccess) redirect('/courses')

  // Get lesson progress
  const allLessonIds = sortedCourse.modules.flatMap((m: Module & { lessons: Lesson[] }) => m.lessons.map((l: Lesson) => l.id))
  const { data: progress } = await supabase
    .from('lesson_progress')
    .select('lesson_id, completed_at')
    .eq('user_id', user!.id)
    .in('lesson_id', allLessonIds)

  // Determine active lesson
  const firstLesson = sortedCourse.modules[0]?.lessons[0]
  const activeLessonId = searchParams.lesson ?? firstLesson?.id ?? null

  return (
    <CoursePlayer
      course={sortedCourse as Course & { modules: (Module & { lessons: Lesson[] })[] }}
      activeLessonId={activeLessonId}
      progress={(progress as LessonProgress[]) ?? []}
      userId={user!.id}
    />
  )
}
