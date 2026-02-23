'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, Upload, Loader2, GripVertical, ChevronDown, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import { slugify } from '@/lib/utils'
import type { Course, Module, Lesson } from '@/types'

type CourseWithModules = Course & {
  modules: (Module & { lessons: Lesson[] })[]
}

interface CourseBuilderProps {
  course: CourseWithModules | null
}

export function CourseBuilder({ course: initialCourse }: CourseBuilderProps) {
  const router = useRouter()
  const supabase = createClient()
  const isNew = !initialCourse

  const [saving, setSaving] = useState(false)
  const [title, setTitle] = useState(initialCourse?.title ?? '')
  const [slug, setSlug] = useState(initialCourse?.slug ?? '')
  const [description, setDescription] = useState(initialCourse?.description ?? '')
  const [price, setPrice] = useState<string>(
    initialCourse?.price !== null && initialCourse?.price !== undefined
      ? String(initialCourse.price)
      : ''
  )
  const [minTierLevel, setMinTierLevel] = useState<number>(initialCourse?.min_tier_level ?? 1)
  const [published, setPublished] = useState(initialCourse?.published ?? false)
  const [modules, setModules] = useState<(Module & { lessons: Lesson[] })[]>(
    initialCourse?.modules ?? []
  )
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set(initialCourse?.modules?.map(m => m.id) ?? [])
  )
  const [uploadingLesson, setUploadingLesson] = useState<string | null>(null)

  function handleTitleChange(val: string) {
    setTitle(val)
    if (isNew) setSlug(slugify(val))
  }

  async function handleSave() {
    setSaving(true)
    try {
      const courseData = {
        title,
        slug,
        description: description || null,
        price: price !== '' ? parseFloat(price) : null,
        min_tier_level: minTierLevel,
        published,
        updated_at: new Date().toISOString(),
      }

      let courseId = initialCourse?.id
      if (isNew) {
        const { data, error } = await supabase
          .from('courses')
          .insert(courseData)
          .select('id')
          .single()
        if (error) throw error
        courseId = data.id
        router.push(`/admin/courses/${courseId}`)
      } else {
        const { error } = await supabase
          .from('courses')
          .update(courseData)
          .eq('id', courseId)
        if (error) throw error
      }

      alert('Course saved successfully!')
    } catch (err) {
      console.error(err)
      alert('Failed to save. Check console for details.')
    } finally {
      setSaving(false)
    }
  }

  async function addModule() {
    if (!initialCourse?.id) {
      alert('Save the course first before adding modules.')
      return
    }
    const { data, error } = await supabase
      .from('modules')
      .insert({
        course_id: initialCourse.id,
        title: 'New Module',
        sort_order: modules.length,
      })
      .select()
      .single()
    if (error) { alert('Failed to add module'); return }
    setModules(prev => [...prev, { ...data, lessons: [] }])
    setExpandedModules(prev => new Set([...prev, data.id]))
  }

  async function updateModuleTitle(moduleId: string, title: string) {
    setModules(prev => prev.map(m => m.id === moduleId ? { ...m, title } : m))
    await supabase.from('modules').update({ title }).eq('id', moduleId)
  }

  async function deleteModule(moduleId: string) {
    if (!confirm('Delete this module and all its lessons?')) return
    await supabase.from('modules').delete().eq('id', moduleId)
    setModules(prev => prev.filter(m => m.id !== moduleId))
  }

  async function addLesson(moduleId: string) {
    const mod = modules.find(m => m.id === moduleId)
    if (!mod) return
    const { data, error } = await supabase
      .from('lessons')
      .insert({
        module_id: moduleId,
        title: 'New Lesson',
        sort_order: mod.lessons.length,
      })
      .select()
      .single()
    if (error) { alert('Failed to add lesson'); return }
    setModules(prev => prev.map(m =>
      m.id === moduleId ? { ...m, lessons: [...m.lessons, data] } : m
    ))
  }

  async function updateLessonTitle(moduleId: string, lessonId: string, title: string) {
    setModules(prev => prev.map(m =>
      m.id === moduleId
        ? { ...m, lessons: m.lessons.map(l => l.id === lessonId ? { ...l, title } : l) }
        : m
    ))
    await supabase.from('lessons').update({ title }).eq('id', lessonId)
  }

  async function deleteLesson(moduleId: string, lessonId: string) {
    if (!confirm('Delete this lesson?')) return
    await supabase.from('lessons').delete().eq('id', lessonId)
    setModules(prev => prev.map(m =>
      m.id === moduleId ? { ...m, lessons: m.lessons.filter(l => l.id !== lessonId) } : m
    ))
  }

  async function handleVideoUpload(moduleId: string, lessonId: string, file: File) {
    setUploadingLesson(lessonId)
    try {
      // Get signed upload URL from our API
      const res = await fetch('/api/mux/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId }),
      })
      const { uploadUrl, uploadId } = await res.json()

      // Upload directly to Mux
      await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': 'video/*' },
      })

      alert('Video uploaded! It will be ready to play in a few minutes.')
    } catch (err) {
      console.error(err)
      alert('Upload failed. Please try again.')
    } finally {
      setUploadingLesson(null)
    }
  }

  function toggleModule(id: string) {
    setExpandedModules(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-bold">
          {isNew ? 'New Course' : 'Edit Course'}
        </h1>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Course'}
        </Button>
      </div>

      {/* Course Details */}
      <div className="rounded-xl border bg-card p-6 space-y-5">
        <h2 className="font-semibold">Course Details</h2>

        <div className="grid gap-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input value={title} onChange={e => handleTitleChange(e.target.value)} placeholder="e.g. Big Feelings: A Parent's Guide" />
          </div>
          <div className="space-y-2">
            <Label>Slug (URL)</Label>
            <Input value={slug} onChange={e => setSlug(e.target.value)} placeholder="big-feelings-guide" />
            <p className="text-xs text-muted-foreground">/courses/{slug}</p>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="What will parents learn?" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Price (leave blank for tier-included)</Label>
              <Input
                type="number"
                value={price}
                onChange={e => setPrice(e.target.value)}
                placeholder="49.00"
                min="0"
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <Label>Minimum Tier Level</Label>
              <select
                value={minTierLevel}
                onChange={e => setMinTierLevel(Number(e.target.value))}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value={1}>Tier 1 - Community</option>
                <option value={2}>Tier 2 - Growth</option>
                <option value={3}>Tier 3 - VIP</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Switch
              id="published"
              checked={published}
              onCheckedChange={setPublished}
            />
            <Label htmlFor="published">Published (visible to members)</Label>
          </div>
        </div>
      </div>

      {/* Modules & Lessons */}
      {!isNew && (
        <div className="rounded-xl border bg-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Modules & Lessons</h2>
            <Button variant="outline" size="sm" onClick={addModule}>
              <Plus className="h-4 w-4 mr-1.5" /> Add Module
            </Button>
          </div>

          {modules.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No modules yet. Add one to start building your course.
            </p>
          )}

          <div className="space-y-3">
            {modules.map((mod, modIdx) => (
              <div key={mod.id} className="border rounded-xl overflow-hidden">
                {/* Module header */}
                <div className="flex items-center gap-2 p-3 bg-muted/30">
                  <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                  <button onClick={() => toggleModule(mod.id)} className="p-0.5">
                    {expandedModules.has(mod.id)
                      ? <ChevronDown className="h-4 w-4" />
                      : <ChevronRight className="h-4 w-4" />}
                  </button>
                  <Input
                    value={mod.title}
                    onChange={e => updateModuleTitle(mod.id, e.target.value)}
                    className="flex-1 h-8 font-medium text-sm bg-transparent border-0 shadow-none focus-visible:ring-0 p-0"
                  />
                  <Badge variant="outline" className="text-xs">{mod.lessons.length} lessons</Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteModule(mod.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>

                {/* Lessons */}
                {expandedModules.has(mod.id) && (
                  <div className="p-3 space-y-2">
                    {mod.lessons.map(lesson => (
                      <div key={lesson.id} className="flex items-center gap-2 p-2 rounded-lg border bg-background">
                        <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab flex-shrink-0" />
                        <Input
                          value={lesson.title}
                          onChange={e => updateLessonTitle(mod.id, lesson.id, e.target.value)}
                          className="flex-1 h-8 text-sm border-0 shadow-none focus-visible:ring-0 p-0 bg-transparent"
                        />
                        {lesson.mux_playback_id ? (
                          <Badge variant="secondary" className="text-xs flex-shrink-0">
                            ✓ Video ready
                          </Badge>
                        ) : (
                          <label className="flex-shrink-0">
                            <input
                              type="file"
                              accept="video/*"
                              className="sr-only"
                              onChange={e => {
                                const file = e.target.files?.[0]
                                if (file) handleVideoUpload(mod.id, lesson.id, file)
                              }}
                            />
                            <Button
                              asChild
                              variant="outline"
                              size="sm"
                              disabled={uploadingLesson === lesson.id}
                            >
                              <span className="cursor-pointer">
                                {uploadingLesson === lesson.id
                                  ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  : <><Upload className="h-3.5 w-3.5 mr-1" />Upload</>}
                              </span>
                            </Button>
                          </label>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteLesson(mod.id, lesson.id)}
                          className="text-destructive hover:text-destructive flex-shrink-0"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => addLesson(mod.id)}
                      className="w-full border-dashed border"
                    >
                      <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Lesson
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
