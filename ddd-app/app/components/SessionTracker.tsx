'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function SessionTracker() {
  const pathname = usePathname()

  useEffect(() => {
    fetch('/api/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: pathname }),
    }).catch(() => {
      // silently fail — tracking is non-critical
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // only fire once on initial mount

  return null
}
