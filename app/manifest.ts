import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Who's Raising Who",
    short_name: 'WRW',
    description: 'A parenting and family coaching community',
    start_url: '/dashboard',
    display: 'standalone',
    background_color: '#fdf6f0',
    theme_color: '#c96830',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
