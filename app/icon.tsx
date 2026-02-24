import { ImageResponse } from 'next/og'

export const size = { width: 192, height: 192 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#4d9970',
          borderRadius: '32px',
        }}
      >
        <span
          style={{
            fontFamily: 'serif',
            fontSize: 120,
            fontWeight: 700,
            color: 'white',
            lineHeight: 1,
          }}
        >
          W
        </span>
      </div>
    ),
    { ...size }
  )
}
