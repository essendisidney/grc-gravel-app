'use client'

import { useState } from 'react'
import { Lightbulb } from 'lucide-react'
import { getLightsReady, setLightsReady } from '@/lib/localStore'

export default function LightsCheck({ rideId }: { rideId: string }) {
  const [ok, setOk] = useState(() => getLightsReady(rideId))

  return (
    <div className="surface" style={{ padding: 14, marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <Lightbulb size={16} color="var(--accent)" />
        <div className="eyebrow" style={{ margin: 0 }}>Lights</div>
      </div>
      <p style={{ margin: '0 0 10px', fontSize: 12, color: 'var(--muted)', lineHeight: 1.4 }}>
        Pre-sunrise Magadi starts need charged front + rear. Mount them before you leave home.
      </p>
      <button
        type="button"
        className={ok ? 'btn-secondary' : 'btn-primary'}
        onClick={() => setOk(setLightsReady(rideId, !ok))}
      >
        {ok ? 'Lights ready ✓' : 'Mark lights ready'}
      </button>
    </div>
  )
}
