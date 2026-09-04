'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import GrcLogo from '@/components/brand/GrcLogo'
import { setSession } from '@/lib/localStore'

export default function SignupPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('07')

  function join() {
    if (!fullName.trim() || phone.replace(/\D/g, '').length < 9) return
    setSession({
      id: `u_${Date.now()}`,
      fullName: fullName.trim(),
      phone: phone.trim(),
      title: 'New Member',
      isCaptain: false,
      signedInAt: new Date().toISOString(),
    })
    router.push('/')
    router.refresh()
  }

  return (
    <div className="animate-fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, padding: '0 18px' }}>
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <div style={{ display: 'inline-block', marginBottom: 12 }}>
          <GrcLogo size={56} rounded={14} />
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 8px' }}>Join the club</h1>
        <p style={{ margin: 0, fontSize: 14, color: 'var(--muted)', lineHeight: 1.5 }}>
          Create a demo profile on this phone. Membership payment comes later.
        </p>
      </div>

      <div className="section-label" style={{ marginBottom: 6 }}>Full name</div>
      <input
        className="grc-input"
        value={fullName}
        onChange={e => setFullName(e.target.value)}
        autoComplete="name"
        style={{ marginBottom: 12 }}
      />
      <div className="section-label" style={{ marginBottom: 6 }}>Phone</div>
      <input
        className="grc-input"
        value={phone}
        onChange={e => setPhone(e.target.value)}
        inputMode="tel"
        autoComplete="tel"
        style={{ marginBottom: 16 }}
      />

      <button className="btn-primary" onClick={join} style={{ marginTop: 'auto' }}>
        Enter as a rider
      </button>
      <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: 'var(--muted)' }}>
        Already riding?{' '}
        <Link href="/login" style={{ color: 'var(--ink)', fontWeight: 700, textDecoration: 'none' }}>
          Sign in
        </Link>
      </p>
    </div>
  )
}
