import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
import { createHash } from 'crypto'

export async function POST(req: NextRequest) {
  try {
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json({ skipped: true }, { status: 200 })
    }

    const userAgent = req.headers.get('user-agent') ?? ''
    if (!userAgent.includes('Mozilla')) {
      return NextResponse.json({ skipped: true }, { status: 200 })
    }

    const visitorId = req.cookies.get('visitor_id')?.value
    if (!visitorId) {
      return NextResponse.json({ error: 'No visitor ID' }, { status: 400 })
    }

    const { page } = await req.json()
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1'
    const ipHash = createHash('sha256').update(ip).digest('hex')
    const country = req.headers.get('x-vercel-ip-country') ?? null
    const region = req.headers.get('x-vercel-ip-country-region') ?? null
    const city = req.headers.get('x-vercel-ip-city')
      ? decodeURIComponent(req.headers.get('x-vercel-ip-city')!)
      : null

    const existing = await prisma.visitorSession.findUnique({
      where: { visitorId },
    })

    if (existing) {
      await prisma.visitorSession.update({
        where: { visitorId },
        data: {
          visitCount: { increment: 1 },
          lastPage: page ?? null,
        },
      })
    } else {
      await prisma.visitorSession.create({
        data: {
          visitorId,
          lastPage: page ?? null,
          ipHash,
          country,
          region,
          city,
        },
      })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err) {
    console.error('Session API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
