'use client'

import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import { DEFAULT_KIT, getKitChecked, toggleKitItem } from '@/lib/localStore'

export default function KitChecklist({ rideId }: { rideId: string }) {
  const [checked, setChecked] = useState<string[]>([])

  useEffect(() => {
    setChecked(getKitChecked(rideId))
  }, [rideId])

  const done = checked.length
  const total = DEFAULT_KIT.length
  const pct = Math.round((done / total) * 100)

  return (
    <div className="surface" style={{ padding: 14, marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div className="section-label" style={{ margin: 0 }}>Pre-ride kit</div>
        <span className={done === total ? 'chip accent' : 'chip'} style={{ border: 'none' }}>
          {done}/{total} · {pct}%
        </span>
      </div>
      <div
        style={{
          height: 6,
          borderRadius: 999,
          background: 'var(--bg)',
          marginBottom: 12,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            background: done === total ? 'var(--good)' : 'var(--accent)',
            transition: 'width 0.25s ease',
          }}
        />
      </div>
      {DEFAULT_KIT.map(item => {
        const on = checked.includes(item.id)
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => setChecked(toggleKitItem(rideId, item.id))}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 0',
              borderTop: '1px solid var(--line)',
              borderLeft: 'none',
              borderRight: 'none',
              borderBottom: 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontFamily: 'var(--font)',
              color: 'var(--ink)',
              textAlign: 'left',
            }}
          >
            <span
              style={{
                width: 22,
                height: 22,
                borderRadius: 7,
                border: on ? 'none' : '1.5px solid var(--line)',
                background: on ? 'var(--accent)' : 'var(--bg)',
                display: 'grid',
                placeItems: 'center',
                flexShrink: 0,
              }}
            >
              {on && <Check size={13} color="#fff" strokeWidth={3} />}
            </span>
            <span style={{ fontSize: 13, fontWeight: on ? 700 : 500, opacity: on ? 1 : 0.85 }}>
              {item.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
