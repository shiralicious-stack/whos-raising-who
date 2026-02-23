'use client'

import { useEffect, useState, useCallback } from 'react'
import { Loader2, Plus, Trash2, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createClient } from '@/lib/supabase/client'

async function getAuthHeaders(): Promise<Record<string, string>> {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.access_token) return {}
  return { 'Authorization': `Bearer ${session.access_token}` }
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface Testimonial { name: string; tier: string; text: string }
interface IncludedItem  { title: string; description: string }
interface HowItWorksItem { step: string; title: string; body: string }

// ─── Small helpers ────────────────────────────────────────────────────────────

function Field({ label, id, value, onChange, long = false }: {
  label: string; id: string; value: string; onChange: (v: string) => void; long?: boolean
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm font-medium">{label}</Label>
      {long
        ? <Textarea id={id} value={value} onChange={e => onChange(e.target.value)} rows={3} className="resize-y" />
        : <Input    id={id} value={value} onChange={e => onChange(e.target.value)} />
      }
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-card p-6 space-y-4">
      <h3 className="font-semibold text-base">{title}</h3>
      {children}
    </div>
  )
}

// ─── Home tab ─────────────────────────────────────────────────────────────────

function HomeTab({ content, onSave, saving, saved, error }: {
  content: Record<string, string>
  onSave: (updates: Record<string, string>) => void
  saving: boolean
  saved: boolean
  error: string | null
}) {
  const [fields, setFields] = useState({
    hero_heading:     content.hero_heading     ?? '',
    hero_tagline:     content.hero_tagline     ?? '',
    hero_body:        content.hero_body        ?? '',
    anchor_line1:     content.anchor_line1     ?? '',
    anchor_line2:     content.anchor_line2     ?? '',
    about_heading:    content.about_heading    ?? '',
    about_para1:      content.about_para1      ?? '',
    about_para2:      content.about_para2      ?? '',
    free_call_heading: content.free_call_heading ?? '',
    free_call_body:   content.free_call_body   ?? '',
    cta_heading:      content.cta_heading      ?? '',
    cta_body:         content.cta_body         ?? '',
  })

  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    try { return JSON.parse(content.testimonials ?? '[]') } catch { return [] }
  })

  // Sync when content prop changes (initial load)
  useEffect(() => {
    setFields({
      hero_heading:     content.hero_heading     ?? '',
      hero_tagline:     content.hero_tagline     ?? '',
      hero_body:        content.hero_body        ?? '',
      anchor_line1:     content.anchor_line1     ?? '',
      anchor_line2:     content.anchor_line2     ?? '',
      about_heading:    content.about_heading    ?? '',
      about_para1:      content.about_para1      ?? '',
      about_para2:      content.about_para2      ?? '',
      free_call_heading: content.free_call_heading ?? '',
      free_call_body:   content.free_call_body   ?? '',
      cta_heading:      content.cta_heading      ?? '',
      cta_body:         content.cta_body         ?? '',
    })
    try { setTestimonials(JSON.parse(content.testimonials ?? '[]')) } catch { /* skip */ }
  }, [content])

  const set = (k: keyof typeof fields) => (v: string) => setFields(f => ({ ...f, [k]: v }))

  function updateTestimonial(i: number, k: keyof Testimonial, v: string) {
    setTestimonials(ts => ts.map((t, idx) => idx === i ? { ...t, [k]: v } : t))
  }
  function addTestimonial() {
    setTestimonials(ts => [...ts, { name: '', tier: '', text: '' }])
  }
  function removeTestimonial(i: number) {
    setTestimonials(ts => ts.filter((_, idx) => idx !== i))
  }

  function handleSave() {
    onSave({ ...fields, testimonials: JSON.stringify(testimonials) })
  }

  return (
    <div className="space-y-5">
      <Section title="Hero">
        <Field label="Heading"  id="hero_heading"  value={fields.hero_heading}  onChange={set('hero_heading')} />
        <Field label="Tagline"  id="hero_tagline"  value={fields.hero_tagline}  onChange={set('hero_tagline')} />
        <Field label="Body"     id="hero_body"     value={fields.hero_body}     onChange={set('hero_body')} long />
      </Section>

      <Section title="Emotional Anchor">
        <Field label="Line 1"   id="anchor_line1"  value={fields.anchor_line1}  onChange={set('anchor_line1')} />
        <Field label="Line 2"   id="anchor_line2"  value={fields.anchor_line2}  onChange={set('anchor_line2')} />
      </Section>

      <Section title="About Shira">
        <Field label="Heading"  id="about_heading" value={fields.about_heading} onChange={set('about_heading')} />
        <Field label="Paragraph 1" id="about_para1" value={fields.about_para1} onChange={set('about_para1')} long />
        <Field label="Paragraph 2" id="about_para2" value={fields.about_para2} onChange={set('about_para2')} long />
      </Section>

      <Section title="Free Call Banner">
        <Field label="Heading"  id="free_call_heading" value={fields.free_call_heading} onChange={set('free_call_heading')} />
        <Field label="Body"     id="free_call_body"    value={fields.free_call_body}    onChange={set('free_call_body')} />
      </Section>

      <Section title="Final CTA">
        <Field label="Heading"  id="cta_heading"   value={fields.cta_heading}   onChange={set('cta_heading')} />
        <Field label="Body"     id="cta_body"      value={fields.cta_body}      onChange={set('cta_body')} long />
      </Section>

      <Section title="Testimonials">
        <div className="space-y-6">
          {testimonials.map((t, i) => (
            <div key={i} className="rounded-lg border p-4 space-y-3 bg-background">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Testimonial {i + 1}</span>
                <Button variant="ghost" size="sm" onClick={() => removeTestimonial(i)}
                  className="h-7 px-2 text-destructive hover:text-destructive">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Name</Label>
                  <Input value={t.name} onChange={e => updateTestimonial(i, 'name', e.target.value)} placeholder="Rachel M." />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Tier / Role</Label>
                  <Input value={t.tier} onChange={e => updateTestimonial(i, 'tier', e.target.value)} placeholder="Community Member" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Quote text</Label>
                <Textarea value={t.text} onChange={e => updateTestimonial(i, 'text', e.target.value)} rows={3} className="resize-y" placeholder="Their testimonial..." />
              </div>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addTestimonial} className="gap-2">
            <Plus className="h-4 w-4" /> Add Testimonial
          </Button>
        </div>
      </Section>

      <SaveBar saving={saving} saved={saved} onSave={handleSave} error={error} />
    </div>
  )
}

// ─── Community tab ────────────────────────────────────────────────────────────

function CommunityTab({ content, onSave, saving, saved, error }: {
  content: Record<string, string>
  onSave: (updates: Record<string, string>) => void
  saving: boolean
  saved: boolean
  error: string | null
}) {
  const [fields, setFields] = useState({
    hero_heading:    content.hero_heading    ?? '',
    hero_subheading: content.hero_subheading ?? '',
    quote:           content.quote           ?? '',
    cta_heading:     content.cta_heading     ?? '',
    cta_body:        content.cta_body        ?? '',
  })

  const [included, setIncluded] = useState<IncludedItem[]>(() => {
    try { return JSON.parse(content.included ?? '[]') } catch { return [] }
  })

  const [howItWorks, setHowItWorks] = useState<HowItWorksItem[]>(() => {
    try { return JSON.parse(content.how_it_works ?? '[]') } catch { return [] }
  })

  useEffect(() => {
    setFields({
      hero_heading:    content.hero_heading    ?? '',
      hero_subheading: content.hero_subheading ?? '',
      quote:           content.quote           ?? '',
      cta_heading:     content.cta_heading     ?? '',
      cta_body:        content.cta_body        ?? '',
    })
    try { setIncluded(JSON.parse(content.included ?? '[]')) } catch { /* skip */ }
    try { setHowItWorks(JSON.parse(content.how_it_works ?? '[]')) } catch { /* skip */ }
  }, [content])

  const set = (k: keyof typeof fields) => (v: string) => setFields(f => ({ ...f, [k]: v }))

  // Included items
  function updateIncluded(i: number, k: keyof IncludedItem, v: string) {
    setIncluded(items => items.map((item, idx) => idx === i ? { ...item, [k]: v } : item))
  }
  function addIncluded() { setIncluded(items => [...items, { title: '', description: '' }]) }
  function removeIncluded(i: number) { setIncluded(items => items.filter((_, idx) => idx !== i)) }

  // How it works
  function updateHiw(i: number, k: keyof HowItWorksItem, v: string) {
    setHowItWorks(items => items.map((item, idx) => idx === i ? { ...item, [k]: v } : item))
  }
  function addHiw() { setHowItWorks(items => [...items, { step: String(items.length + 1).padStart(2, '0'), title: '', body: '' }]) }
  function removeHiw(i: number) { setHowItWorks(items => items.filter((_, idx) => idx !== i)) }

  function handleSave() {
    onSave({
      ...fields,
      included: JSON.stringify(included),
      how_it_works: JSON.stringify(howItWorks),
    })
  }

  return (
    <div className="space-y-5">
      <Section title="Hero">
        <Field label="Heading"    id="c_hero_heading"    value={fields.hero_heading}    onChange={set('hero_heading')} />
        <Field label="Subheading" id="c_hero_subheading" value={fields.hero_subheading} onChange={set('hero_subheading')} long />
      </Section>

      <Section title="Pull Quote">
        <Field label="Quote" id="c_quote" value={fields.quote} onChange={set('quote')} long />
      </Section>

      <Section title="What's Included (cards)">
        <div className="space-y-4">
          {included.map((item, i) => (
            <div key={i} className="rounded-lg border p-4 space-y-3 bg-background">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Item {i + 1}</span>
                <Button variant="ghost" size="sm" onClick={() => removeIncluded(i)}
                  className="h-7 px-2 text-destructive hover:text-destructive">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Title</Label>
                <Input value={item.title} onChange={e => updateIncluded(i, 'title', e.target.value)} placeholder="Weekly Virtual Meetups" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Description</Label>
                <Textarea value={item.description} onChange={e => updateIncluded(i, 'description', e.target.value)} rows={2} className="resize-y" />
              </div>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addIncluded} className="gap-2">
            <Plus className="h-4 w-4" /> Add Item
          </Button>
        </div>
      </Section>

      <Section title="How It Works (steps)">
        <div className="space-y-4">
          {howItWorks.map((item, i) => (
            <div key={i} className="rounded-lg border p-4 space-y-3 bg-background">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Step {i + 1}</span>
                <Button variant="ghost" size="sm" onClick={() => removeHiw(i)}
                  className="h-7 px-2 text-destructive hover:text-destructive">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
              <div className="grid sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Step label (e.g. 01)</Label>
                  <Input value={item.step} onChange={e => updateHiw(i, 'step', e.target.value)} placeholder="01" />
                </div>
                <div className="sm:col-span-2 space-y-1.5">
                  <Label className="text-xs">Title</Label>
                  <Input value={item.title} onChange={e => updateHiw(i, 'title', e.target.value)} placeholder="Choose your membership" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Body</Label>
                <Textarea value={item.body} onChange={e => updateHiw(i, 'body', e.target.value)} rows={2} className="resize-y" />
              </div>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addHiw} className="gap-2">
            <Plus className="h-4 w-4" /> Add Step
          </Button>
        </div>
      </Section>

      <Section title="Final CTA">
        <Field label="Heading" id="c_cta_heading" value={fields.cta_heading} onChange={set('cta_heading')} />
        <Field label="Body"    id="c_cta_body"    value={fields.cta_body}    onChange={set('cta_body')} long />
      </Section>

      <SaveBar saving={saving} saved={saved} onSave={handleSave} error={error} />
    </div>
  )
}

// ─── Save bar (sticky at bottom of viewport) ─────────────────────────────────

function SaveBar({ saving, saved, onSave, error }: {
  saving: boolean; saved: boolean; onSave: () => void; error: string | null
}) {
  return (
    <div className="sticky bottom-0 left-0 right-0 z-10 flex items-center justify-between gap-4 bg-background border-t px-4 py-3 shadow-[0_-2px_8px_rgba(0,0,0,0.06)]">
      <div>
        {saved && (
          <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
            <CheckCircle2 className="h-4 w-4" /> Changes saved
          </span>
        )}
        {error && (
          <span className="text-sm text-destructive font-medium">Error: {error}</span>
        )}
        {!saved && !error && (
          <span className="text-xs text-muted-foreground">Unsaved changes</span>
        )}
      </div>
      <Button onClick={onSave} disabled={saving} className="min-w-[140px]">
        {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving…</> : 'Save Changes'}
      </Button>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type TabId = 'home' | 'community'

export default function ContentEditorPage() {
  const [activeTab, setActiveTab] = useState<TabId>('home')
  const [homeContent, setHomeContent] = useState<Record<string, string>>({})
  const [communityContent, setCommunityContent] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState<TabId | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchContent = useCallback(async (page: TabId) => {
    const authHeaders = await getAuthHeaders()
    const res = await fetch(`/api/admin/content?page=${page}`, { headers: authHeaders })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error ?? 'Failed to load')
    return json.content as Record<string, string>
  }, [])

  useEffect(() => {
    setLoading(true)
    Promise.all([fetchContent('home'), fetchContent('community')])
      .then(([home, community]) => {
        setHomeContent(home)
        setCommunityContent(community)
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [fetchContent])

  async function handleSave(page: TabId, updates: Record<string, string>) {
    setSaving(true)
    setSaved(null)
    setError(null)
    try {
      const authHeaders = await getAuthHeaders()
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify({ page, updates }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Failed to save')
      setSaved(page)
      setTimeout(() => setSaved(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const tabs: { id: TabId; label: string }[] = [
    { id: 'home', label: 'Home Page' },
    { id: 'community', label: 'Community Page' },
  ]

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="font-serif text-3xl font-bold">Site Content</h1>
        <p className="text-muted-foreground mt-1">Edit the text on your marketing pages without touching code.</p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 mb-6 rounded-lg border bg-muted p-1 w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center gap-3 text-muted-foreground py-12">
          <Loader2 className="h-5 w-5 animate-spin" /> Loading content…
        </div>
      ) : (
        <>
          {activeTab === 'home' && (
            <HomeTab
              content={homeContent}
              onSave={updates => handleSave('home', updates)}
              saving={saving}
              saved={saved === 'home'}
              error={error}
            />
          )}
          {activeTab === 'community' && (
            <CommunityTab
              content={communityContent}
              onSave={updates => handleSave('community', updates)}
              saving={saving}
              saved={saved === 'community'}
              error={error}
            />
          )}
        </>
      )}
    </div>
  )
}
