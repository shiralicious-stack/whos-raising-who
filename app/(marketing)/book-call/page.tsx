import { IntroBookingForm } from '@/components/intro-booking-form'
import { MarketingNav } from '@/components/marketing-nav'
import { Badge } from '@/components/ui/badge'
import { Clock, Video } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Book a Free Consult Call — Who\'s Raising Who',
  description: 'Book a free 30-minute consult call with Shira Finkelstein, Certified Conscious Parenting Coach.',
}

export default function BookCallPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-warm-50 via-background to-sage-50">
      <MarketingNav />

      <main className="flex-1 flex items-start justify-center py-12 px-4">
        <div className="w-full max-w-3xl">

          {/* Card */}
          <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">

            {/* Top: Shira info bar */}
            <div className="px-6 py-5 border-b bg-secondary/30">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/15 border-2 border-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="font-serif text-xl font-bold text-primary">S</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold">Shira Finkelstein</p>
                  <p className="text-xs text-muted-foreground">Certified Conscious Parenting &amp; Life Coach</p>
                </div>
                <div className="hidden sm:flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" /> 15 minutes
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Video className="h-3.5 w-3.5" /> Video call
                  </span>
                  <Badge variant="secondary" className="text-xs">Free</Badge>
                </div>
              </div>
            </div>

            {/* Calendar + slots */}
            <IntroBookingForm />
          </div>

          <p className="text-center text-xs text-muted-foreground mt-4">
            <Link href="/" className="hover:text-foreground transition-colors">← Back to Who&apos;s Raising Who</Link>
          </p>
        </div>
      </main>
    </div>
  )
}
