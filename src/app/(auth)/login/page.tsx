'use client'

import { Suspense, useState } from 'react'
import Image from 'next/image'
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
    <div className="animate-fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative', height: '42dvh', minHeight: 240, margin: '0 14px', borderRadius: 22, overflow: 'hidden' }}>
        <Image
          src="/brand/hero-adventure.jpg"
          alt="GRC riders"
          fill
          priority
          sizes="430px"
          style={{ objectFit: 'cover', objectPosition: 'center 35%' }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(14,12,10,0.15) 20%, rgba(14,12,10,0.88) 100%)',
          }}
        />
        <div style={{ position: 'absolute', left: 16, right: 16, bottom: 18, color: '#fff' }}>
          <GrcLogo size={44} rounded={12} />
          <div className="eyebrow" style={{ color: 'rgba(255,255,255,0.7)', marginTop: 14, marginBottom: 6 }}>
            Gravel Riders Club
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.05 }}>
            Ride beyond the tarmac
          </div>
        </div>
      </div>

      <div style={{ padding: '20px 20px 0', flex: 1 }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>Welcome back</div>
        <h1 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em' }}>
          Sign in to ride
        </h1>
        <p style={{ margin: '0 0 18px', fontSize: 13, color: 'var(--muted)', lineHeight: 1.45 }}>
          Name + phone for this device. Demo auth — no password yet.
        </p>

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
          I’m a ride captain
        </label>

        <button className="btn-primary" onClick={enter} disabled={loading}>
          {loading ? 'Opening…' : 'Enter the club'}
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
