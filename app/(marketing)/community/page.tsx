export const dynamic = 'force-dynamic'

import { Button } from '@/components/ui/button'
import { CheckCircle2, Users, Heart, MessageCircle, BookOpen, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { getPageContent } from '@/lib/site-content'

export const metadata = {
  title: 'Community - Who\'s Raising Who',
  description: 'A warm, judgment-free space for moms doing the inner work. Weekly meetups, journaling prompts, and real connection.',
}

const defaultIncluded = [
  { title: 'Weekly Virtual Meetups', description: 'Live gatherings with other moms to share, reflect, and grow together in a safe, guided space.' },
  { title: 'Journaling Prompts & Reflections', description: 'Weekly prompts and grounding practices from Shira to support your inner work between sessions.' },
  { title: 'Honest, Judgment-Free Sharing', description: 'A space where you can show up as you are - no performance, no perfection, just real.' },
  { title: 'Exclusive Resource Access', description: "Community members unlock access to select courses, teachings, and workshops from Shira's library." },
]

const defaultHowItWorks = [
  { step: '01', title: 'Choose your membership', body: "Select the tier that's right for you. Community access is included in all paid tiers." },
  { step: '02', title: 'Join the weekly gathering', body: 'Every week, Shira hosts a live virtual gathering for community members - a safe space to share and reflect.' },
  { step: '03', title: 'Integrate the Work', body: 'Use journaling prompts, mantras, and course materials to deepen your awareness between meetings.' },
  { step: '04', title: 'Grow alongside other moms', body: "The relationships formed here become part of the healing. You won't just participate - you'll belong." },
]

// Icons for included items in display order
const includedIcons = [Users, Heart, MessageCircle, BookOpen]

export default async function CommunityPage() {
  const content = await getPageContent('community')

  const heroHeading    = content.hero_heading    ?? "You don't have to do this alone."
  const heroSubheading = content.hero_subheading ?? 'A warm, judgment-free space for moms who are doing the inner work - together. Real conversations, real growth, real connection.'
  const quote          = content.quote           ?? "Healing doesn't happen in isolation. It happens in community."
  const ctaHeading     = content.cta_heading     ?? 'Ready to find your people?'
  const ctaBody        = content.cta_body        ?? 'Join a community of moms who are doing the real work - together.'

  let included = defaultIncluded
  try {
    const parsed = JSON.parse(content.included ?? 'null')
    if (Array.isArray(parsed) && parsed.length > 0) included = parsed
  } catch { /* use default */ }

  let howItWorks = defaultHowItWorks
  try {
    const parsed = JSON.parse(content.how_it_works ?? 'null')
    if (Array.isArray(parsed) && parsed.length > 0) howItWorks = parsed
  } catch { /* use default */ }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">

        {/* Hero */}
        <section className="bg-gradient-to-br from-sage-50 via-background to-warm-50 py-10 md:py-14">
          <div className="container max-w-3xl text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-semibold leading-snug mb-5 text-foreground">
              {heroHeading}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8">
              {heroSubheading}
            </p>
            <Button asChild size="lg" className="px-10">
              <Link href="/pricing">Join the Community <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </section>

        {/* What's included */}
        <section className="py-10 bg-secondary/20 border-y border-border/50">
          <div className="container max-w-4xl">
            <div className="text-center mb-10">
              <h2 className="font-serif text-4xl font-bold mb-3">What&apos;s included</h2>
              <p className="text-muted-foreground text-lg">Everything you need to feel supported and seen on this journey.</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              {included.map((item, i) => {
                const Icon = includedIcons[i % includedIcons.length]
                return (
                  <div key={i} className="flex gap-5 p-6 rounded-2xl border bg-card">
                    <div className="w-10 h-10 rounded-xl bg-sage-100 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-5 w-5 text-sage-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Quote / anchor */}
        <section className="py-16 bg-background">
          <div className="container max-w-2xl text-center">
            <blockquote className="font-serif text-2xl md:text-3xl font-semibold leading-relaxed mb-4">
              &ldquo;{quote}&rdquo;
            </blockquote>
            <p className="text-muted-foreground text-sm">- Shira Finkelstein</p>
          </div>
        </section>

        {/* How it works */}
        <section className="py-16 bg-secondary/20 border-y border-border/50">
          <div className="container max-w-3xl">
            <div className="text-center mb-10">
              <h2 className="font-serif text-4xl font-bold mb-4">How it works</h2>
            </div>
            <div className="space-y-6">
              {howItWorks.map((item, i) => (
                <div key={i} className="flex gap-6 items-start">
                  <span className="font-serif text-4xl font-bold text-primary/20 flex-shrink-0 w-12">{item.step}</span>
                  <div className="pt-1">
                    <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container text-center max-w-xl">
            <h2 className="font-serif text-4xl font-bold mb-5">{ctaHeading}</h2>
            <p className="text-primary-foreground/80 text-lg mb-8">
              {ctaBody}
            </p>
            <Button asChild size="lg" variant="secondary" className="px-10">
              <Link href="/pricing">See Membership Options</Link>
            </Button>
          </div>
        </section>

      </main>

      <footer className="border-t py-8 bg-background">
        <div className="container text-center text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">← Back to Home</Link>
          <span className="mx-4">·</span>
          <span>© {new Date().getFullYear()} Shira Finkelstein · Who&apos;s Raising Who</span>
        </div>
      </footer>
    </div>
  )
}
