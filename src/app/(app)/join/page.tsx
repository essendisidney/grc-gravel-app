'use client'

import Link from 'next/link'
import TopBar from '@/components/layout/TopBar'
import { DEMO_CLUB } from '@/lib/demo'
import { formatKES } from '@/lib/utils'

export default function JoinPage() {
  return (
    <div>
      <TopBar showBack title="Join GRC" showNotifications={false} backHref="/club" />
      <div className="page animate-fade-in">
        <div className="eyebrow" style={{ color: 'var(--accent)', marginBottom: 8 }}>Membership</div>
        <h1 style={{ margin: '0 0 8px', fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em' }}>
          Ride. Connect. Compete. Belong.
        </h1>
        <p style={{ margin: '0 0 18px', fontSize: 14, color: 'var(--muted)', lineHeight: 1.5 }}>
          Wave 3 ships Auth, GPX, and captain tools first. <strong style={{ color: 'var(--ink)' }}>M-Pesa checkout comes last.</strong>
        </p>

        <div
          className="surface"
          style={{
            padding: 16,
            marginBottom: 18,
            background: 'linear-gradient(145deg, #1C1916, #2E2924)',
            border: 'none',
            color: '#fff',
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.7 }}>
            Coming soon
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, marginTop: 8 }}>Pay with M-Pesa</div>
          <div style={{ fontSize: 13, opacity: 0.75, marginTop: 6, lineHeight: 1.45 }}>
            Live STK for Regular / Gold / Family will land after captain ops + route intel are solid.
          </div>
        </div>

        <div className="section-label" style={{ marginBottom: 10 }}>Tiers (KES)</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 18 }}>
          {DEMO_CLUB.membership.map(m => (
            <div key={m.name} className="surface" style={{ padding: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{m.name}</div>
              <div style={{ fontSize: 18, fontWeight: 800, marginTop: 6 }}>{formatKES(m.price_kes)}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>/{m.period}</div>
            </div>
          ))}
        </div>

        <Link href="/login?redirect=/" className="btn-primary" style={{ textDecoration: 'none', display: 'flex' }}>
          Sign in to the club
        </Link>
        <Link
          href="/club"
          style={{
            display: 'block',
            textAlign: 'center',
            marginTop: 12,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--muted)',
            textDecoration: 'none',
          }}
        >
          Back to club
        </Link>
      </div>
    </div>
  )
}
