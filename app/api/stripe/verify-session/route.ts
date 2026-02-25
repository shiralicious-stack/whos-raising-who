import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json({ verified: false, error: 'Missing session_id' }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status === 'paid') {
      return NextResponse.json({
        verified: true,
        email: session.customer_details?.email ?? null,
      })
    }

    return NextResponse.json({
      verified: false,
      error: 'Payment not completed',
    })
  } catch (err) {
    console.error('[stripe/verify-session]', err)
    return NextResponse.json(
      { verified: false, error: 'Could not verify session' },
      { status: 500 },
    )
  }
}
