'use client'

import Link from 'next/link'
import { Shirt } from 'lucide-react'
import { DEMO_MERCH } from '@/lib/localStore'

export default function MerchTeaser() {
  return (
    <div className="surface" style={{ padding: 14, marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <Shirt size={16} color="var(--accent)" />
        <div style={{ fontWeight: 800, fontSize: 14 }}>Club kit</div>
      </div>
      <p style={{ margin: '0 0 12px', fontSize: 12, color: 'var(--muted)', lineHeight: 1.4 }}>
        Jersey, caps, bidons — pickup at Tena / Utawala. Checkout later with M-Pesa.
      </p>
      {DEMO_MERCH.map(m => (
        <div
          key={m.id}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 10,
            padding: '10px 0',
            borderTop: '1px solid var(--line)',
          }}
        >
          <div>
            <div style={{ fontWeight: 700, fontSize: 13 }}>{m.name}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{m.note}</div>
          </div>
          <div style={{ fontWeight: 800, fontSize: 13, flexShrink: 0 }}>KES {m.priceKes.toLocaleString()}</div>
        </div>
      ))}
      <Link
        href="/join"
        className="btn-secondary"
        style={{ marginTop: 12, textDecoration: 'none', display: 'flex' }}
      >
        Membership & kit · M-Pesa later
      </Link>
    </div>
  )
}
