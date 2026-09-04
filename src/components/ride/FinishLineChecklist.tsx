'use client'

import { useState } from 'react'
import { FINISH_LINE_STEPS, getFinishChecks, toggleFinishCheck } from '@/lib/localStore'

export default function FinishLineChecklist({ rideId }: { rideId: string }) {
  const [checked, setChecked] = useState(() => getFinishChecks(rideId))

  return (
    <div className="surface" style={{ padding: 14, marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ fontWeight: 800, fontSize: 14 }}>Finish-line ritual</div>
        <span className="chip accent" style={{ border: 'none' }}>
          {checked.length}/{FINISH_LINE_STEPS.length}
        </span>
      </div>
      <p style={{ margin: '0 0 8px', fontSize: 12, color: 'var(--muted)', lineHeight: 1.4 }}>
        Close the ride properly before you scatter.
      </p>
      {FINISH_LINE_STEPS.map(s => {
        const on = checked.includes(s.id)
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => setChecked(toggleFinishCheck(rideId, s.id))}
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
