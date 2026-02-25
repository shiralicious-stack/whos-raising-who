export const dynamic = 'force-dynamic'

import { Users, Sparkles, Heart, MessageCircle, MessagesSquare } from 'lucide-react'
import Link from 'next/link'
import { JoinButton } from './join-button'

export const metadata = {
  title: 'Community - Who\'s Raising Who',
  description: 'A warm, judgment-free space for moms doing the inner work — together. Weekly gatherings, guided reflection, and real connection. $47/month.',
}

const included = [
  { icon: Users, text: 'One live weekly virtual gathering' },
  { icon: Sparkles, text: 'Guided reflection prompts' },
  { icon: Heart, text: 'A private, judgment-free space' },
  { icon: MessageCircle, text: 'Direct access to Shira' },
  { icon: MessagesSquare, text: 'A community forum to stay connected between sessions' },
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
              A warm, judgment-free space for moms doing the inner work — together.
              Real conversations, real growth, real connection.
            </p>
            <JoinButton size="lg" className="px-10">
              Join the Community
            </JoinButton>
            <p className="text-sm text-muted-foreground mt-3">
              Spots are intentionally limited to keep the group intimate.
            </p>
          </div>
        </section>

        {/* Why This Community Is Different */}
        <section className="pb-8 md:pb-10 bg-background">
          <div className="container max-w-2xl text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Why This Community Is Different
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              This space is intentionally kept small so every voice is heard and every
              woman receives real support. Growth doesn&apos;t happen in isolation — it
              happens in connection.
            </p>
          </div>
        </section>

        {/* What's Included */}
        <section className="py-8 md:py-10 bg-secondary/20 border-y border-border/50">
          <div className="container max-w-2xl">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-center mb-6">
              What&apos;s Included
            </h2>
            <div className="space-y-2">
              {included.map((item, i) => {
                const Icon = item.icon
                return (
                  <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl border bg-card">
                    <div className="w-8 h-8 rounded-lg bg-sage-100 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-4 w-4 text-sage-600" />
                    </div>
                    <p className="text-foreground">{item.text}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Membership */}
        <section className="py-10 md:py-12 bg-background">
          <div className="container text-center max-w-xl">
            <h2 className="font-serif text-2xl md:text-3xl font-bold mb-4 text-foreground">
              Membership
            </h2>
            <p className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-1">$47</p>
            <p className="text-muted-foreground text-lg mb-1">per month</p>
            <p className="text-sm text-muted-foreground mb-6">Cancel anytime.</p>
            <p className="text-sm text-muted-foreground mb-6">
              Spots are intentionally limited to keep the group intimate.
            </p>
            <JoinButton size="lg" className="px-10">
              Join the Community
            </JoinButton>
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
