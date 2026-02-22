import { IntroBookingForm } from '@/components/intro-booking-form'
import { MarketingNav } from '@/components/marketing-nav'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'

export const metadata = { title: 'Book a Free Intro Call — Who\'s Raising Who' }

export default function BookCallPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <MarketingNav />

      <main className="flex-1 bg-gradient-to-br from-warm-50 via-background to-sage-50">
        <div className="container max-w-4xl py-16">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Left: context */}
            <div className="md:sticky md:top-24">
              <p className="text-sm font-medium text-primary mb-3 uppercase tracking-wider">Free · 30 minutes</p>
              <h1 className="font-serif text-4xl font-bold leading-tight mb-4">
                Let&apos;s talk about what&apos;s going on
              </h1>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Not sure if Who&apos;s Raising Who is the right fit? Book a free call with Shira.
                No pressure, no pitch — just a real conversation about where you are and where you want to go.
              </p>
              <ul className="space-y-3">
                {[
                  'Get clarity on your biggest parenting challenge right now',
                  'Find out which membership (if any) is the right fit',
                  'Ask Shira anything you\'re wondering about her approach',
                ].map(item => (
                  <li key={item} className="flex items-start gap-3 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: booking form */}
            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <IntroBookingForm />
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t py-8 bg-background">
        <div className="container text-center text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            ← Back to Who&apos;s Raising Who
          </Link>
        </div>
      </footer>
    </div>
  )
}
