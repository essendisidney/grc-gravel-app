'use client'

import { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import GrcLogo from '@/components/brand/GrcLogo'

function LoginInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'

  return (
    <div className="animate-fade-in" style={{ width: '100%' }}>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{ display: 'inline-block', marginBottom: 14 }}>
          <GrcLogo size={72} rounded={18} />
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 8px' }}>Gravel Riders Club</h1>
        <p style={{ margin: 0, fontSize: 14, color: 'var(--muted)', lineHeight: 1.5 }}>
          Kenya’s club OS for rides, race, wrench and membership — clear communication, not WhatsApp chaos.
        </p>
      </div>

      <div className="surface" style={{ padding: 22 }}>
        <div className="section-label" style={{ marginBottom: 8 }}>Preview mode</div>
        <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.55, margin: '0 0 18px' }}>
          Walk in as a member. Accounts and M-Pesa land when we add a database.
        </p>
        <button className="btn-primary" onClick={() => router.push(redirect)}>
          Open club app
        </button>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ padding: 24, textAlign: 'center', color: 'var(--muted)' }}>Loading…</div>}>
      <LoginInner />
    </Suspense>
  )
}
