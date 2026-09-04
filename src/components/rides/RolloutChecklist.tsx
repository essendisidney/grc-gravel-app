'use client'

import { useState } from 'react'
import { ShieldCheck } from 'lucide-react'
import { getRolloutChecks, isRolloutReady, setRolloutCheck, type RolloutChecks } from '@/lib/localStore'

const ITEMS: { key: keyof RolloutChecks; label: string }[] = [
  { key: 'lights', label: 'Front + rear lights on' },
  { key: 'helmet', label: 'Helmet clipped' },
  { key: 'bottles', label: 'Bottles filled' },
]

export default function RolloutChecklist({
  rideId,
  onChange,
}: {
  rideId: string
  onChange?: (ready: boolean) => void
}) {
  const [checks, setChecks] = useState<RolloutChecks>(() => getRolloutChecks(rideId))
  const ready = checks.lights && checks.helmet && checks.bottles

  function toggle(key: keyof RolloutChecks) {
    const next = setRolloutCheck(rideId, key, !checks[key])
    setChecks(next)
    onChange?.(isRolloutReady(rideId))
  }

  return (
    <div className="surface" style={{ padding: 14, marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <ShieldCheck size={16} color={ready ? 'var(--good)' : 'var(--accent)'} />
        <div className="section-label" style={{ margin: 0 }}>
          Pre-roll check
        </div>
      </div>
      <p style={{ margin: '0 0 10px', fontSize: 12, color: 'var(--muted)', lineHeight: 1.4 }}>
        Magadi dust needs lights. Confirm before Start ride.
      </p>
      {ITEMS.map(item => (
        <button
          key={item.key}
          type="button"
          onClick={() => toggle(item.key)}
          className="pressable"
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 0',
            borderTop: '1px solid var(--line)',
            background: 'transparent',
            borderLeft: 'none',
            borderRight: 'none',
            borderBottom: 'none',
            cursor: 'pointer',
            fontFamily: 'var(--font)',
            color: 'var(--ink)',
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          {item.label}
          <span className={checks[item.key] ? 'chip accent' : 'chip'} style={{ border: 'none' }}>
            {checks[item.key] ? 'OK' : 'Tap'}
          </span>
        </button>
      ))}
    </div>
  )
}
