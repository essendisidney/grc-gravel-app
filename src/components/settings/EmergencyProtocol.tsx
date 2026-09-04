'use client'

import { useState } from 'react'
import { ShieldAlert } from 'lucide-react'
import {
  EMERGENCY_PROTOCOL,
  getEmergencyProtoChecked,
  toggleEmergencyProto,
} from '@/lib/localStore'

export default function EmergencyProtocol() {
  const [checked, setChecked] = useState<string[]>(() => getEmergencyProtoChecked())

  return (
    <div className="surface" style={{ padding: 14, marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <ShieldAlert size={16} color="var(--bad)" />
        <div style={{ fontWeight: 800, fontSize: 14 }}>Emergency protocol</div>
      </div>
      <p style={{ margin: '0 0 10px', fontSize: 12, color: 'var(--muted)', lineHeight: 1.4 }}>
        Read once, check off so it sticks on this device. Use SOS on live ride for dialer.
      </p>
      {EMERGENCY_PROTOCOL.map(step => {
        const on = checked.includes(step.id)
        return (
          <button
            key={step.id}
            type="button"
            onClick={() => setChecked(toggleEmergencyProto(step.id))}
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
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
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            {step.label}
            <span className={on ? 'chip accent' : 'chip'} style={{ border: 'none', flexShrink: 0 }}>
              {on ? 'Done' : 'Tap'}
            </span>
          </button>
        )
      })}
    </div>
  )
}
