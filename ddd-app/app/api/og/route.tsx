import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          backgroundColor: '#1e293b', // slate-800
          fontFamily: 'sans-serif',
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            backgroundColor: '#8b5cf6', // violet-500
          }}
        />

        {/* Name */}
        <div
          style={{
            fontSize: '96px',
            fontWeight: 800,
            color: '#c4b5fd', // violet-300
            letterSpacing: '-2px',
            lineHeight: 1.1,
            marginBottom: '24px',
          }}
        >
          Dan Dutil
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: '40px',
            fontWeight: 600,
            color: '#e2e8f0', // slate-200
            marginBottom: '48px',
          }}
        >
          QA &amp; Automation Engineer
        </div>

        {/* Bottom accent bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '6px',
            backgroundColor: '#8b5cf6',
          }}
        />
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
