export const dynamic = 'force-dynamic'

import { MarketingNav } from '@/components/marketing-nav'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <MarketingNav />
      {children}
    </>
  )
}
