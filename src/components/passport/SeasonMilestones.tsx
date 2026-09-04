'use client'

import { getSeasonMilestones } from '@/lib/localStore'

export default function SeasonMilestones() {
  const items = getSeasonMilestones()

  return (
    <div className="surface" style={{ padding: 14, marginBottom: 14 }}>
      <div className="eyebrow" style={{ marginBottom: 8 }}>Season milestones</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {items.map(m => (
          <div
            key={m.id}
            style={{
              padding: 10,
              borderRadius: 12,
              background: m.done ? 'var(--accent-soft)' : 'var(--bg)',
              border: `1px solid ${m.done ? 'rgba(254,199,46,0.45)' : 'var(--line)'}`,
            }}
          >
            <div style={{ fontWeight: 800, fontSize: 12 }}>{m.label}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>
              {m.done ? 'Unlocked' : m.hint}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
