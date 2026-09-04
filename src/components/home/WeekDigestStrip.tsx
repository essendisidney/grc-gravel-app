'use client'

import { getWeekDigest } from '@/lib/localStore'

export default function WeekDigestStrip() {
  const { lines } = getWeekDigest()

  return (
    <div className="surface" style={{ padding: 14, marginBottom: 14 }}>
      <div className="eyebrow" style={{ marginBottom: 8 }}>This week</div>
      {lines.map(line => (
        <div
          key={line}
          style={{
            fontSize: 13,
            lineHeight: 1.45,
            padding: '8px 0',
            borderTop: '1px solid var(--line)',
            color: 'var(--ink)',
            fontWeight: 600,
          }}
        >
          {line}
        </div>
      ))}
    </div>
  )
}
