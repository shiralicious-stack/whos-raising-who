import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: 'image.mux.com' },
    ],
  },
}

export default nextConfig
