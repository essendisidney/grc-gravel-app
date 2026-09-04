'use client'

import { useState } from 'react'
import { getStretchChecked, STRETCH_STEPS, toggleStretch } from '@/lib/localStore'

export default function StretchChecklist({ rideId }: { rideId: string }) {
  const [checked, setChecked] = useState(() => getStretchChecked(rideId))
  const done = checked.length
  const total = STRETCH_STEPS.length

  return (
    <div className="surface" style={{ padding: 14, marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ fontWeight: 800, fontSize: 14 }}>Post-ride stretch</div>
        <span className="chip accent" style={{ border: 'none' }}>
          {done}/{total}
        </span>
      </div>
      <p style={{ margin: '0 0 8px', fontSize: 12, color: 'var(--muted)', lineHeight: 1.4 }}>
        Five minutes before you sit in traffic home.
      </p>
      {STRETCH_STEPS.map(s => {
        const on = checked.includes(s.id)
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => setChecked(toggleStretch(rideId, s.id))}
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 0',
              borderTop: '1px solid var(--line)',
              borderLeft: 'none',
              borderRight: 'none',
              borderBottom: 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontFamily: 'var(--font)',
              color: 'var(--ink)',
              fontSize: 13,
              fontWeight: 700,
              textAlign: 'left',
            }}
          >
            {s.label}
            <span className={on ? 'chip accent' : 'chip'} style={{ border: 'none' }}>
              {on ? 'Done' : 'Tap'}
            </span>
          </button>
        )
      })}
    </div>
  )
}
