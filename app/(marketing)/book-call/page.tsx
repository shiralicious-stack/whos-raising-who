import { IntroBookingForm } from '@/components/intro-booking-form'
import { MarketingNav } from '@/components/marketing-nav'
import { CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Book a Free Consult Call — Who\'s Raising Who',
  description: 'Book a free 30-minute consult call with Shira. No pressure, no pitch — just a real conversation about where you are and where you want to go.',
}

export default function BookCallPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <MarketingNav />

      <main className="flex-1 bg-gradient-to-br from-warm-50 via-background to-sage-50">
        <div className="container max-w-4xl py-16">
          <div className="grid md:grid-cols-2 gap-12 items-start">

            {/* Left: context */}
            <div className="md:sticky md:top-24">
              <p className="text-sm font-medium text-primary mb-3 uppercase tracking-wider">Free · 30 minutes · With Shira</p>
              <h1 className="font-serif text-4xl font-bold leading-tight mb-4">
                Let&apos;s talk about what&apos;s going on
              </h1>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Not sure if Who&apos;s Raising Who is the right fit? Book a free consult call.
                No pitch, no pressure — just a real conversation about where you are, what you&apos;re
                navigating, and what support might actually help.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Get clarity on your biggest parenting challenge right now',
                  'Explore whether group coaching, 1:1, or courses are the right next step',
                  'Ask Shira anything about her approach to conscious parenting',
                  'Leave with something useful — even if we never work together',
                ].map(item => (
                  <li key={item} className="flex items-start gap-3 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="rounded-xl bg-secondary/50 border p-4 text-sm">
                <p className="font-medium mb-1">About Shira</p>
                <p className="text-muted-foreground">
                  Certified Conscious Parenting &amp; Life Coach, trained by Dr. Shefali Tsabary.
                  Single mom. Doing the work every day alongside you.
                </p>
              </div>
            </div>

            {/* Right: booking form */}
            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <h2 className="font-semibold mb-1">Pick a time that works</h2>
              <p className="text-sm text-muted-foreground mb-6">All times are shown in Eastern Time.</p>
              <IntroBookingForm />
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t py-8 bg-background">
        <div className="container text-center text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">← Back to Who&apos;s Raising Who</Link>
          <span className="mx-4">·</span>
          <a href="mailto:hello@whosraisingwho.com" className="hover:text-foreground transition-colors">hello@whosraisingwho.com</a>
        </div>
      </footer>
    </div>
  )
}
