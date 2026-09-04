'use client'

import Link from 'next/link'
import { getPrimaryTireHint } from '@/lib/localStore'

export default function TireReminder() {
  const h = getPrimaryTireHint()

  return (
    <div className="surface" style={{ padding: 14, marginBottom: 14 }}>
      <div className="section-label" style={{ marginBottom: 6 }}>
        Tire & tube
      </div>
      <div style={{ fontWeight: 800, fontSize: 14 }}>{h.label}</div>
      <p style={{ margin: '4px 0 10px', fontSize: 12, color: 'var(--muted)', lineHeight: 1.4 }}>{h.tip}</p>
      <Link href={h.href} style={{ fontSize: 12, fontWeight: 800, color: 'var(--accent)', textDecoration: 'none' }}>
        Open garage →
      </Link>
    </div>
  )
}
