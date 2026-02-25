export const dynamic = 'force-dynamic'

import { Users, Heart, MessageCircle, BookOpen, Sparkles, ArrowRight, MessagesSquare } from 'lucide-react'
import Link from 'next/link'
import { JoinButton } from './join-button'

export const metadata = {
  title: 'Community - Who\'s Raising Who',
  description: 'A warm, judgment-free space for moms doing the inner work — together. Weekly gatherings, guided reflection, and real connection. $47/month.',
}

const included = [
  { icon: Users, text: 'One live weekly virtual gathering' },
  { icon: BookOpen, text: 'Curated topics around triggers, patterns, and conscious parenting' },
  { icon: Sparkles, text: 'Guided reflection prompts' },
  { icon: Heart, text: 'A private, judgment-free space for honest conversation' },
  { icon: MessageCircle, text: 'Direct access to Shira in an intimate group setting' },
  { icon: MessagesSquare, text: 'A community forum to share, ask questions, and stay connected between sessions' },
]

export default function CommunityPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">

        {/* Hero */}
        <section className="bg-gradient-to-br from-sage-50 via-background to-warm-50 py-16 md:py-24">
          <div className="container max-w-3xl text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-semibold leading-snug mb-5 text-foreground">
              You don&apos;t have to do this alone.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8">
              A warm, judgment-free space for moms doing the inner work — together.
              Real conversations, real growth, real connection.
            </p>
            <JoinButton size="lg" className="px-10">
              Join the Community <ArrowRight className="ml-2 h-4 w-4" />
            </JoinButton>
            <p className="text-sm text-muted-foreground mt-4">
              Spots are intentionally limited to keep the group intimate.
            </p>
          </div>
        </section>

        {/* What's Included */}
        <section className="py-12 md:py-16 bg-secondary/20 border-y border-border/50">
          <div className="container max-w-3xl">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-center mb-10">
              What&apos;s Included
            </h2>
            <div className="space-y-4">
              {included.map((item, i) => {
                const Icon = item.icon
                return (
                  <div key={i} className="flex items-center gap-4 p-5 rounded-2xl border bg-card">
                    <div className="w-10 h-10 rounded-xl bg-sage-100 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-5 w-5 text-sage-600" />
                    </div>
                    <p className="text-foreground leading-relaxed">{item.text}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Why This Community Is Different */}
        <section className="py-14 md:py-20 bg-background">
          <div className="container max-w-2xl text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
              Why This Community Is Different
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              This space is intentionally kept small so every voice is heard and every
              woman receives real support. Growth doesn&apos;t happen in isolation — it
              happens in connection.
            </p>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-14 md:py-20 bg-primary/80 text-primary-foreground">
          <div className="container text-center max-w-xl">
            <p className="font-serif text-5xl md:text-6xl font-bold mb-2">$47</p>
            <p className="text-primary-foreground/80 text-lg mb-8">per month · cancel anytime</p>
            <JoinButton size="lg" variant="secondary" className="px-10">
              Join the Community
            </JoinButton>
          </div>
        </section>

      </main>

      <footer className="border-t py-8 bg-background">
        <div className="container text-center text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">&larr; Back to Home</Link>
          <span className="mx-4">&middot;</span>
          <span>&copy; {new Date().getFullYear()} Shira Finkelstein &middot; Who&apos;s Raising Who</span>
        </div>
      </footer>
    </div>
  )
}
