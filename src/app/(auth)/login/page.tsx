'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import GrcLogo from '@/components/brand/GrcLogo'
import { setSession } from '@/lib/localStore'

function LoginInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'
  const [fullName, setFullName] = useState('Amina Otieno')
  const [phone, setPhone] = useState('0712 000 412')
  const [asCaptain, setAsCaptain] = useState(false)
  const [loading, setLoading] = useState(false)

  async function enter() {
    if (!fullName.trim() || phone.replace(/\D/g, '').length < 9) return
    setLoading(true)
    setSession({
      id: `u_${Date.now()}`,
      fullName: fullName.trim(),
      phone: phone.trim(),
      title: asCaptain ? 'Ride Captain' : 'Rift Valley Rider',
      isCaptain: asCaptain,
      signedInAt: new Date().toISOString(),
    })
    await new Promise(r => setTimeout(r, 350))
    router.replace(redirect)
    router.refresh()
  }

  return (
    <div className="animate-fade-in" style={{ width: '100%' }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ display: 'inline-block', marginBottom: 14 }}>
          <GrcLogo size={72} rounded={18} />
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 8px' }}>Gravel Riders Club</h1>
        <p style={{ margin: 0, fontSize: 14, color: 'var(--muted)', lineHeight: 1.5 }}>
          Sign in with your name + phone. Demo session stays on this device — M-Pesa comes last.
        </p>
      </div>

      <div className="surface" style={{ padding: 20 }}>
        <div className="section-label" style={{ marginBottom: 6 }}>Full name</div>
        <input
          className="grc-input"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
          placeholder="Your name"
          style={{ marginBottom: 12 }}
        />
        <div className="section-label" style={{ marginBottom: 6 }}>Phone</div>
        <input
          className="grc-input"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          placeholder="07XX XXX XXX"
          inputMode="tel"
          style={{ marginBottom: 14 }}
        />
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 18,
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--ink)',
            cursor: 'pointer',
          }}
        >
          <input
            type="checkbox"
            checked={asCaptain}
            onChange={e => setAsCaptain(e.target.checked)}
            style={{ width: 16, height: 16, accentColor: 'var(--accent)' }}
          />
          I’m a ride captain (unlock captain tools)
        </label>
        <button className="btn-primary" onClick={enter} disabled={loading}>
          {loading ? 'Signing in…' : 'Enter the club'}
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
