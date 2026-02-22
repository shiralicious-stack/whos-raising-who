import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
})

export const metadata: Metadata = {
  title: {
    default: "Who's Raising Who",
    template: "%s | Who's Raising Who",
  },
  description:
    "A parenting and family coaching community for parents who are growing alongside their children. Courses, live coaching, and a supportive community.",
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: "Who's Raising Who",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
