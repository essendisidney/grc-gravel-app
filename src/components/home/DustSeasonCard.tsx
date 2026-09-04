'use client'

import { getDustSeasonStatus } from '@/lib/localStore'

export default function DustSeasonCard() {
  const status = getDustSeasonStatus()

  return (
    <div
      className="surface"
      style={{
        padding: 14,
        marginBottom: 14,
        border: status.inDust ? '1px solid rgba(196,122,18,0.35)' : '1px solid var(--line)',
        background: status.inDust ? 'rgba(196,122,18,0.08)' : 'var(--surface)',
      }}
    >
      <div className="eyebrow" style={{ marginBottom: 6, color: status.inDust ? 'var(--warn)' : 'var(--muted)' }}>
        {status.inDust ? 'Dust season' : 'Shoulder season'} · {status.monthLabel}
      </div>
      <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 6 }}>Nairobi–Magadi corridor</div>
      <p style={{ margin: '0 0 10px', fontSize: 13, color: 'var(--muted)', lineHeight: 1.45 }}>{status.tip}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => {
          const hot = status.months.includes(m)
          return (
            <span
              key={m}
              className="chip"
              style={{
                border: 'none',
                fontSize: 10,
                padding: '4px 7px',
                background: hot ? 'rgba(196,122,18,0.18)' : 'var(--bg)',
                color: hot ? 'var(--warn)' : 'var(--muted)',
                fontWeight: hot ? 800 : 600,
              }}
            >
              {m}
            </span>
          )
        })}
      </div>
    </div>
  )
}
