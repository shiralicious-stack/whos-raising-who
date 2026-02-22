import { Resend } from 'resend'

export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? 'Shira Finkelstein <hello@whosraisingwho.com>'

// Lazy singleton — only instantiated when first used (not at build time)
let _resend: Resend | null = null
export function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY!)
  }
  return _resend
}

// Convenience alias used in routes
export const resend = {
  emails: {
    send: (...args: Parameters<Resend['emails']['send']>) =>
      getResend().emails.send(...args),
  },
}
