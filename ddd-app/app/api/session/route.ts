import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
import { createHash } from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const visitorId = req.cookies.get('visitor_id')?.value
    if (!visitorId) {
      return NextResponse.json({ error: 'No visitor ID' }, { status: 400 })
    }

    const { page } = await req.json()
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1'
    const ipHash = createHash('sha256').update(ip).digest('hex')

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
        },
      })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err) {
    console.error('Session API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
