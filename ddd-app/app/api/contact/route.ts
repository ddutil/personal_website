import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'

const resend = new Resend(process.env.RESEND_API_KEY)

const contactSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50, 'First name must be 50 characters or fewer'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name must be 50 characters or fewer'),
  email: z.string().email('Invalid email address').max(254, 'Email must be 254 characters or fewer'),
  company: z.string().max(100, 'Company name must be 100 characters or fewer').optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000, 'Message must be 2000 characters or fewer'),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = contactSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid form data', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { firstName, lastName, email, company, message } = parsed.data

    const { error } = await resend.emails.send({
      from: process.env.SENDER_EMAIL!,
      to: process.env.RECEIVER_EMAIL!,
      subject: `Portfolio Contact: ${firstName} ${lastName}${company ? ` (${company})` : ''}`,
      text: `Name: ${firstName} ${lastName}\nEmail: ${email}${company ? `\nCompany: ${company}` : ''}\n\nMessage:\n${message}`.trim(),
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err) {
    console.error('Contact API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
