import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { prisma } from '../../../lib/prisma'
import { createHash } from 'crypto'

const resend = new Resend(process.env.RESEND_API_KEY)

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '10 m'),
  analytics: true,
})

const contactSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50, 'First name must be 50 characters or fewer'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name must be 50 characters or fewer'),
  email: z.string()
    .trim()
    .min(1, 'Email is required')
    .max(254, 'Email must be 254 characters or fewer')
    .refine((value) => z.email().safeParse(value).success, 'Invalid email address'),
  company: z.string().max(100, 'Company name must be 100 characters or fewer').optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000, 'Message must be 2000 characters or fewer'),
})

export async function POST(req: NextRequest) {
  try {
    const isAutomatedTest =
      process.env.TEST_API_KEY && req.headers.get('x-test-key') === process.env.TEST_API_KEY

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1'
    const { success } = isAutomatedTest ? { success: true } : await ratelimit.limit(ip)

    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a few minutes before trying again.' },
        { status: 429 }
      )
    }

    const body = await req.json()
    const parsed = contactSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid form data', details: z.flattenError(parsed.error).fieldErrors },
        { status: 400 }
      )
    }

    const { firstName, lastName, email, company, message } = parsed.data

    if (!isAutomatedTest) {
      const { error } = await resend.emails.send({
        from: process.env.SENDER_EMAIL!,
        to: process.env.RECEIVER_EMAIL!,
        replyTo: email,
        subject: `Portfolio Contact: ${firstName} ${lastName}${company ? ` (${company})` : ''}`,
        text: `Name: ${firstName} ${lastName}\nEmail: ${email}${company ? `\nCompany: ${company}` : ''}\n\nMessage:\n${message}`.trim(),
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#f9f9f9;border-radius:8px">
            <h2 style="margin:0 0 16px;font-size:18px;color:#111">New message from ddutil.dev</h2>
            <table style="width:100%;border-collapse:collapse;margin-bottom:16px">
              <tr><td style="padding:6px 0;color:#555;width:80px">Name</td><td style="padding:6px 0;color:#111">${firstName} ${lastName}</td></tr>
              <tr><td style="padding:6px 0;color:#555">Email</td><td style="padding:6px 0;color:#111"><a href="mailto:${email}" style="color:#6d28d9">${email}</a></td></tr>
              ${company ? `<tr><td style="padding:6px 0;color:#555">Company</td><td style="padding:6px 0;color:#111">${company}</td></tr>` : ''}
            </table>
            <div style="background:#fff;border:1px solid #e5e7eb;border-radius:6px;padding:16px;color:#111;white-space:pre-wrap;line-height:1.6">${message}</div>
          </div>
        `.trim(),
      })

      if (error) {
        console.error('Resend error:', error)
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
      }
    }

    await prisma.contactSubmission.create({
      data: {
        firstName,
        lastName,
        email,
        company: company ?? null,
        message,
        ipHash: createHash('sha256').update(ip).digest('hex'),
      },
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err) {
    console.error('Contact API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
