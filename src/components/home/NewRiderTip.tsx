'use client'

import Link from 'next/link'
import { isNewRider } from '@/lib/localStore'

export default function NewRiderTip() {
  if (!isNewRider()) return null

  return (
    <div
      className="surface"
      style={{
        padding: 14,
        marginBottom: 14,
        border: '1px solid rgba(254,199,46,0.4)',
        background: 'var(--accent-soft)',
      }}
    >
      <div className="eyebrow" style={{ color: 'var(--accent)', marginBottom: 6 }}>New to the pack</div>
      <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 4 }}>Start with Cruiser</div>
      <p style={{ margin: '0 0 10px', fontSize: 13, color: 'var(--muted)', lineHeight: 1.45 }}>
        Join Saturday Magadi, check lights at the gate, and save an offline pack before you roll.
      </p>
      <Link
        href="/rides/ngong-magadi"
        style={{ fontSize: 12, fontWeight: 800, color: 'var(--accent-ink)', textDecoration: 'none' }}
      >
        Open Ngong → Magadi →
      </Link>
    </div>
  )
}
