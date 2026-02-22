'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import MuxPlayer from '@mux/mux-player-react'
import { CheckCircle2, Circle, ChevronRight, ChevronDown, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import type { Course, Module, Lesson, LessonProgress } from '@/types'

interface CoursePlayerProps {
  course: Course & { modules: (Module & { lessons: Lesson[] })[] }
  activeLessonId: string | null
  progress: LessonProgress[]
  userId: string
}

export function CoursePlayer({ course, activeLessonId, progress, userId }: CoursePlayerProps) {
  const router = useRouter()
  const supabase = createClient()
  const [isPending, startTransition] = useTransition()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [openModules, setOpenModules] = useState<Set<string>>(
    new Set(course.modules.map(m => m.id))
  )
  const [localProgress, setLocalProgress] = useState<Set<string>>(
    new Set(progress.map(p => p.lesson_id))
  )

  const allLessons: Lesson[] = course.modules.flatMap(m => m.lessons).filter((l): l is Lesson => !!l)
  const activeLesson = allLessons.find(l => l.id === activeLessonId) ?? allLessons[0] ?? null
  const completionPct = allLessons.length > 0
    ? Math.round((localProgress.size / allLessons.length) * 100)
    : 0

  function navigateToLesson(lessonId: string) {
    router.push(`/courses/${course.slug}?lesson=${lessonId}`, { scroll: false })
  }

  async function markComplete(lessonId: string) {
    if (localProgress.has(lessonId)) return
    setLocalProgress(prev => new Set([...prev, lessonId]))

    await supabase.from('lesson_progress').upsert({
      user_id: userId,
      lesson_id: lessonId,
      completed_at: new Date().toISOString(),
    })

    // Auto-advance to next lesson
    const currentIdx = allLessons.findIndex(l => l.id === lessonId)
    const nextLesson = allLessons[currentIdx + 1]
    if (nextLesson) {
      startTransition(() => navigateToLesson(nextLesson.id))
    }
  }

  function toggleModule(moduleId: string) {
    setOpenModules(prev => {
      const next = new Set(prev)
      if (next.has(moduleId)) next.delete(moduleId)
      else next.add(moduleId)
      return next
    })
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-0 -m-6 lg:-m-8 relative">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(prev => !prev)}
        className="lg:hidden absolute top-3 left-3 z-30 p-2 rounded-lg bg-card border shadow-sm"
        aria-label="Toggle course outline"
      >
        {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </button>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-20 bg-black/40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'border-r bg-card flex flex-col overflow-hidden transition-all duration-200',
        'lg:w-80 lg:static lg:translate-x-0',
        'fixed top-0 bottom-0 left-0 z-30 w-72',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        <div className="p-4 border-b">
          <h2 className="font-semibold text-sm truncate">{course.title}</h2>
          <div className="flex items-center gap-2 mt-2">
            <Progress value={completionPct} className="flex-1 h-1.5" />
            <span className="text-xs text-muted-foreground">{completionPct}%</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {course.modules.map(mod => (
            <div key={mod.id} className="mb-1">
              <button
                onClick={() => toggleModule(mod.id)}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg hover:bg-muted text-left"
              >
                {openModules.has(mod.id)
                  ? <ChevronDown className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
                  : <ChevronRight className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />}
                <span className="truncate">{mod.title}</span>
              </button>

              {openModules.has(mod.id) && (
                <div className="pl-2 space-y-0.5">
                  {(mod.lessons ?? []).map(lesson => {
                    const isActive = lesson.id === activeLesson?.id
                    const isCompleted = localProgress.has(lesson.id)
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => navigateToLesson(lesson.id)}
                        className={cn(
                          'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-sm transition-colors',
                          isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                        )}
                      >
                        {isCompleted
                          ? <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-sage-500" />
                          : <Circle className="h-4 w-4 flex-shrink-0 opacity-50" />}
                        <span className="truncate flex-1">{lesson.title}</span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </aside>

      {/* Video area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {activeLesson?.mux_playback_id ? (
          <>
            <div className="bg-black flex-shrink-0">
              <MuxPlayer
                playbackId={activeLesson.mux_playback_id}
                metadata={{ video_title: activeLesson.title }}
                onEnded={() => markComplete(activeLesson.id)}
                style={{ aspectRatio: '16/9', width: '100%' }}
              />
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-2xl">
                <h1 className="font-serif text-2xl font-bold mb-4">{activeLesson.title}</h1>
                <Button
                  onClick={() => markComplete(activeLesson.id)}
                  disabled={localProgress.has(activeLesson.id) || isPending}
                  variant={localProgress.has(activeLesson.id) ? 'secondary' : 'default'}
                >
                  {localProgress.has(activeLesson.id) ? (
                    <><CheckCircle2 className="h-4 w-4 mr-2" />Completed</>
                  ) : (
                    'Mark as Complete'
                  )}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <p className="text-lg font-medium mb-2">Video coming soon</p>
              <p className="text-sm">This lesson is being prepared.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
