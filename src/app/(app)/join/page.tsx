'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, Loader2, Smartphone } from 'lucide-react'
import TopBar from '@/components/layout/TopBar'
import { DEMO_CLUB } from '@/lib/demo'
import { formatKES } from '@/lib/utils'
import { getMembership, setMembership } from '@/lib/localStore'

export default function JoinPage() {
  const [tier, setTier] = useState(DEMO_CLUB.membership[0])
  const [phone, setPhone] = useState('07')
  const [phase, setPhase] = useState<'pick' | 'stk' | 'done'>('pick')
  const [loading, setLoading] = useState(false)
  const [existing, setExisting] = useState<ReturnType<typeof getMembership>>(null)

  useEffect(() => {
    setExisting(getMembership())
  }, [])

  async function pay() {
    if (phone.replace(/\D/g, '').length < 9) return
    setLoading(true)
    setPhase('stk')
    await new Promise(r => setTimeout(r, 2200))
    const receipt = `QGR${Math.floor(100000 + Math.random() * 899999)}`
    const m = {
      tier: tier.name,
      priceKes: tier.price_kes,
      phone,
      paidAt: new Date().toISOString(),
      receipt,
    }
    setMembership(m)
    setExisting(m)
    setLoading(false)
    setPhase('done')
  }

  return (
    <div>
      <TopBar showBack title="Join GRC" showNotifications={false} backHref="/club" />
      <div className="animate-fade-in" style={{ padding: '0 16px 28px' }}>
        {phase === 'done' || existing ? (
          <div className="surface" style={{ padding: 22, textAlign: 'center' }}>
            <CheckCircle2 size={48} color="var(--good)" style={{ margin: '0 auto 12px' }} />
            <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>You’re in</div>
            <div style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.5, marginBottom: 16 }}>
              {(existing || { tier: tier.name, receipt: '—', priceKes: tier.price_kes }).tier} membership ·{' '}
              {formatKES((existing || { priceKes: tier.price_kes }).priceKes)}
              <br />
              M-Pesa receipt {(existing || { receipt: '—' }).receipt}
            </div>
            <Link href="/" className="btn-primary" style={{ textDecoration: 'none', display: 'flex' }}>
              Open club home
            </Link>
          </div>
        ) : (
          <>
            <div className="eyebrow" style={{ color: 'var(--accent)', marginBottom: 8 }}>Membership</div>
            <h1 style={{ margin: '0 0 8px', fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em' }}>
              Ride. Connect. Compete. Belong.
            </h1>
            <p style={{ margin: '0 0 18px', fontSize: 14, color: 'var(--muted)', lineHeight: 1.5 }}>
              Demo M-Pesa checkout — no real charge. Live STK lands when we wire Safaricom.
            </p>

            <div className="section-label" style={{ marginBottom: 10 }}>Pick a tier</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 18 }}>
              {DEMO_CLUB.membership.map(m => {
                const on = tier.name === m.name
                return (
                  <button
                    key={m.name}
                    type="button"
                    onClick={() => setTier(m)}
                    style={{
                      textAlign: 'left',
                      padding: 14,
                      borderRadius: 14,
                      border: `1px solid ${on ? 'rgba(224,122,47,0.5)' : 'var(--line)'}`,
                      background: on ? 'var(--accent-soft)' : 'var(--surface)',
                      cursor: 'pointer',
                      fontFamily: 'var(--font)',
                      color: 'var(--ink)',
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{m.name}</div>
                    <div style={{ fontSize: 18, fontWeight: 800, marginTop: 6 }}>
                      {formatKES(m.price_kes)}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>/{m.period}</div>
                  </button>
                )
              })}
            </div>

            <div className="section-label" style={{ marginBottom: 6 }}>M-Pesa number</div>
            <input
              className="grc-input"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="07XX XXX XXX"
              inputMode="tel"
              style={{ marginBottom: 14 }}
            />

            {phase === 'stk' ? (
              <div className="surface" style={{ padding: 20, textAlign: 'center', marginBottom: 12 }}>
                <Smartphone size={28} color="var(--accent)" style={{ margin: '0 auto 10px' }} />
                <div style={{ fontWeight: 800, marginBottom: 6 }}>STK push sent</div>
                <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.45 }}>
                  Enter your PIN on {phone} for {formatKES(tier.price_kes)} to GRC…
                </div>
                <Loader2 size={18} color="var(--accent)" style={{ marginTop: 14, animation: 'spin 1s linear infinite' }} />
              </div>
            ) : (
              <button type="button" className="btn-primary" onClick={pay} disabled={loading}>
                Pay {formatKES(tier.price_kes)} with M-Pesa
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}
