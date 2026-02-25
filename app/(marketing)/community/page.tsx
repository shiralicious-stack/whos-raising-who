export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { JoinButton } from './join-button'

export const metadata = {
  title: 'Spring Cohort - Who\'s Raising Who',
  description: 'An intimate 8-week conscious parenting cohort for moms ready to do the real work — together. April 14 – June 2. Limited to 10 women.',
}

const topics = [
  'The myth of the perfect mom',
  'Understanding triggers and patterns',
  'Reaction vs. response',
  'Reparenting ourselves',
  'Projection and getting out of our own way',
  'Repair after we "mess up"',
  'Integration and growth noticing',
]

export default function CommunityPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">

        {/* Hero */}
        <section className="bg-gradient-to-br from-sage-50 via-background to-warm-50 py-12 md:py-16">
          <div className="container max-w-3xl text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-semibold leading-snug mb-4 text-foreground">
              You don&apos;t have to do this alone.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-6">
              An intimate 8-week conscious parenting cohort for moms ready to do the real work — together.
            </p>
            <div className="space-y-1 text-muted-foreground mb-6">
              <p className="font-medium text-foreground">April 14 – June 2</p>
              <p>Weekly at 8:30pm</p>
              <p>Limited to 10 women to keep the space intimate and supportive</p>
              <p className="mt-2 font-medium text-foreground">$297 one-time</p>
            </div>
            <JoinButton size="lg" className="px-10">
              Join the Cohort
            </JoinButton>
          </div>
        </section>

        {/* What We'll Explore */}
        <section className="py-10 md:py-12 bg-secondary/20 border-y border-border/50">
          <div className="container max-w-2xl">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-center mb-6">
              What We&apos;ll Explore
            </h2>
            <div className="space-y-2">
              {topics.map((topic, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl border bg-card">
                  <div className="w-2 h-2 rounded-full bg-sage-400 flex-shrink-0" />
                  <p className="text-foreground">{topic}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why This Cohort Is Different */}
        <section className="py-10 md:py-12 bg-background">
          <div className="container max-w-2xl">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-center mb-6">
              Why This Cohort Is Different
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed text-lg">
              <p>This isn&apos;t a space for quick fixes or parenting hacks.</p>
              <p>We&apos;re not here to fix our children — or ourselves.</p>
              <p>
                We&apos;re here to understand our triggers, patterns, and past conditioning
                so we can show up with more clarity, presence, and peace.
              </p>
              <p>
                Each week blends guided teaching, real conversation, and practical
                integration — so the work doesn&apos;t stay theoretical. It becomes lived.
              </p>
              <p>
                Spots are intentionally limited to 10 women so every voice is heard
                and the space remains intimate and supportive.
              </p>
              <p className="font-medium text-foreground">
                This is a space for depth, not perfection.
              </p>
            </div>
            <div className="text-center mt-8">
              <JoinButton size="lg" className="px-10">
                Join the Cohort
              </JoinButton>
            </div>
          </div>
        </section>

      </main>

      <footer className="border-t py-6 bg-background">
        <div className="container text-center text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">&larr; Back to Home</Link>
          <span className="mx-4">&middot;</span>
          <span>&copy; {new Date().getFullYear()} Shira Finkelstein &middot; Who&apos;s Raising Who</span>
        </div>
      </footer>
    </div>
  )
}
