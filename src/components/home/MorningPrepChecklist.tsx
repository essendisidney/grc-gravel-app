'use client'

import { useState } from 'react'
import { getPrepChecked, PREP_STEPS, togglePrep } from '@/lib/localStore'

export default function MorningPrepChecklist({ rideId }: { rideId: string }) {
  const [checked, setChecked] = useState(() => getPrepChecked(rideId))
  const done = checked.length

  return (
    <div className="surface" style={{ padding: 14, marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div className="eyebrow" style={{ margin: 0 }}>
          Night-before prep
        </div>
        <span className="chip accent" style={{ border: 'none' }}>
          {done}/{PREP_STEPS.length}
        </span>
      </div>
      {PREP_STEPS.map(s => {
        const on = checked.includes(s.id)
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => setChecked(togglePrep(rideId, s.id))}
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '9px 0',
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
              {on ? 'OK' : 'Tap'}
            </span>
          </button>
        )
      })}
    </div>
  )
}
