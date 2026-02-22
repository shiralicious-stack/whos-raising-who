export const dynamic = 'force-dynamic'

import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-50 via-background to-sage-50 flex flex-col">
      <header className="p-6">
        <Link href="/" className="font-serif text-xl font-bold text-foreground">
          Who&apos;s Raising Who
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center p-6">
        {children}
      </main>
    </div>
  )
}
