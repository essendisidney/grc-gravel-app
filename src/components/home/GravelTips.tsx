'use client'

import { useMemo, useState } from 'react'
import { Lightbulb } from 'lucide-react'

const TIPS = [
  {
    id: 't1',
    title: 'Dust after Kona Baridi',
    body: 'Lights on even mid-morning — Magadi haze eats depth perception.',
  },
  {
    id: 't2',
    title: 'Patchy Safaricom',
    body: 'Download the offline pack before Ngong. Captains still regroup at known pins.',
  },
  {
    id: 't3',
    title: 'Tubeless + plugs',
    body: 'Thorns love Utawala→Kitengela. Carry plugs and a CO₂ even on short loops.',
  },
  {
    id: 't4',
    title: 'Gate time is sacred',
    body: '06:15 means rolling. Late riders catch the next regroup — calendar is the start line.',
  },
  {
    id: 't5',
    title: 'Two bottles minimum',
    body: 'Rift heat + climb. One for the climb, one for the flats. Buy water only at known shops.',
  },
  {
    id: 't6',
    title: 'Wrench before race week',
    body: 'Book The Gravel mid-week — Full Gas Saturday is too late for a noisy drivetrain.',
  },
]

export default function GravelTips({ compact = false }: { compact?: boolean }) {
  const seed = useMemo(() => {
    const day = new Date().toISOString().slice(0, 10)
    return day.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  }, [])
  const [idx, setIdx] = useState(seed % TIPS.length)
  const tip = TIPS[idx]

  return (
    <div
      className="surface"
      style={{
        padding: compact ? 12 : 14,
        marginBottom: compact ? 0 : 14,
        background: 'linear-gradient(145deg, #FFF8F1 0%, #FFFCFA 100%)',
      }}
    >
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 12,
            background: 'var(--accent)',
            color: 'var(--accent-ink)',
            display: 'grid',
            placeItems: 'center',
            flexShrink: 0,
          }}
        >
          <Lightbulb size={16} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="eyebrow" style={{ color: 'var(--accent)', marginBottom: 4 }}>
            Gravel tip · {idx + 1}/{TIPS.length}
          </div>
          <div style={{ fontSize: 14, fontWeight: 800 }}>{tip.title}</div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4, lineHeight: 1.45 }}>{tip.body}</div>
          {!compact && (
            <button
              type="button"
              className="chip"
              style={{ border: 'none', cursor: 'pointer', marginTop: 10 }}
              onClick={() => setIdx(i => (i + 1) % TIPS.length)}
            >
              Next tip
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
