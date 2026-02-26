'use client'
import { useState } from 'react'
import { usePostHog } from 'posthog-js/react'

type FormState = {
  firstName: string
  lastName: string
  email: string
  company: string
  message: string
}

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error'

export default function ContactPage() {
  const [form, setForm] = useState<FormState>({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    message: '',
  })
  const [status, setStatus] = useState<SubmitStatus>('idle')
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [generalError, setGeneralError] = useState('')
  const posthog = usePostHog()

  const inputStyle = "w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
  const labelStyle = "block text-sm font-semibold text-slate-400 mb-1"
  const errorStyle = "text-red-400 text-xs mt-1"

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name } = e.target
    setForm(prev => ({ ...prev, [name]: e.target.value }))
    setFieldErrors(prev => ({ ...prev, [name]: undefined }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setFieldErrors({})
    setGeneralError('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (res.ok) {
        posthog.capture('contact_form_submitted', { had_company: !!form.company })
        setStatus('success')
        setForm({ firstName: '', lastName: '', email: '', company: '', message: '' })
      } else {
        const data = await res.json()
        if (data.details) {
          const mapped: Partial<Record<keyof FormState, string>> = {}
          for (const [key, msgs] of Object.entries(data.details)) {
            if (Array.isArray(msgs) && msgs.length > 0) {
              mapped[key as keyof FormState] = (msgs as string[])[0]
            }
          }
          setFieldErrors(mapped)
        } else {
          setGeneralError(data.error || 'Something went wrong. Please try again.')
        }
        setStatus('error')
      }
    } catch {
      setGeneralError('Network error. Please try again.')
      setStatus('error')
    }
  }

  const title = "Contact Me"

  return (
    <main className="max-w-2xl mx-auto min-h-screen text-slate-200 w-full">
      <h1 data-testid="contactTitle" className="pb-12 text-violet-300 text-6xl md:text-8xl font-bold text-center tracking-tight">
        {title}
      </h1>

      <div className="bg-slate-900/40 border border-slate-700/50 rounded-xl p-8">
        {status === 'success' ? (
          <div className="text-center">
            <p data-testid="messageSentTitle" className="text-3xl font-bold text-violet-300 mb-10">Message Sent</p>
            <p data-testid="messageSentBody" className="text-xl">Thanks for reaching out! I'll get back to you soon.</p>
            <button
              data-testid="messageSentBackButton"
              onClick={() => setStatus('idle')}
              className="mt-8 px-6 py-3 bg-violet-500 hover:bg-violet-600 font-bold rounded-full transition-colors"
            >
              Back
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label data-testid="label-firstName" className={labelStyle}>First Name</label>
                <input
                  data-testid="input-firstName"
                  name="firstName"
                  type="text"
                  value={form.firstName}
                  onChange={handleChange}
                  className={inputStyle}
                />
                {fieldErrors.firstName && <p className={errorStyle} data-testid="error-firstName">{fieldErrors.firstName}</p>}
              </div>
              <div>
                <label data-testid="label-lastName" className={labelStyle}>Last Name</label>
                <input
                  data-testid="input-lastName"
                  name="lastName"
                  type="text"
                  value={form.lastName}
                  onChange={handleChange}
                  className={inputStyle}
                />
                {fieldErrors.lastName && <p className={errorStyle} data-testid="error-lastName">{fieldErrors.lastName}</p>}
              </div>
            </div>

            {/* Email */}
            <div>
              <label data-testid="label-email" className={labelStyle}>Email</label>
              <input
                data-testid="input-email"
                name="email"
                type="text"
                value={form.email}
                onChange={handleChange}
                placeholder="test@example.com"
                className={inputStyle}
              />
              {fieldErrors.email && <p className={errorStyle} data-testid="error-email">{fieldErrors.email}</p>}
            </div>

            {/* Company (optional) */}
            <div>
              <label data-testid="label-company" className={labelStyle}>
                Company <span className="text-slate-600 font-normal">(optional)</span>
              </label>
              <input
                data-testid="input-company"
                name="company"
                type="text"
                value={form.company}
                onChange={handleChange}
                className={inputStyle}
              />
              {fieldErrors.company && <p className={errorStyle} data-testid="error-company">{fieldErrors.company}</p>}
            </div>

            {/* Message */}
            <div>
              <label data-testid="label-message" className={labelStyle}>Message</label>
              <textarea
                data-testid="input-message"
                name="message"
                rows={6}
                value={form.message}
                onChange={handleChange}
                placeholder="What's on your mind?"
                className={`${inputStyle} resize-none`}
              />
              {fieldErrors.message && <p className={errorStyle} data-testid="error-message">{fieldErrors.message}</p>}
            </div>

            {generalError && (
              <p className={errorStyle} data-testid="error-general">{generalError}</p>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              data-testid="submit-button"
              className="w-full py-4 bg-violet-500 hover:bg-violet-600 disabled:opacity-50 disabled:cursor-not-allowed font-bold rounded-lg transition-colors"
            >
              {status === 'loading' ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        )}
      </div>
    </main>
  )
}