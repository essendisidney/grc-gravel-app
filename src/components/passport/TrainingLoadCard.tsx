'use client'

import { getWeeklyTrainingLoad } from '@/lib/localStore'

const BAND_LABEL = {
  rest: 'Rest week',
  easy: 'Easy load',
  build: 'Build week',
  peak: 'Peak load',
}

export default function TrainingLoadCard() {
  const t = getWeeklyTrainingLoad()

  return (
    <div className="surface" style={{ padding: 14, marginBottom: 14 }}>
      <div className="eyebrow" style={{ marginBottom: 6 }}>This week · training</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
        <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em' }}>{t.load}</div>
        <span className="chip accent" style={{ border: 'none' }}>
          {BAND_LABEL[t.band]}
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: t.seeded ? 8 : 0 }}>
        <Mini label="Km" value={String(t.km || '—')} />
        <Mini label="Climb" value={t.climb ? `${t.climb}` : '—'} />
        <Mini label="Rides" value={String(t.rides || (t.seeded ? '—' : 0))} />
      </div>
      {t.seeded && (
        <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 8, lineHeight: 1.4 }}>
          Demo baseline until you log rides — load updates from Passport activities.
        </div>
      )}
    </div>
  )
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '8px 4px', background: 'var(--bg)', borderRadius: 10 }}>
      <div style={{ fontWeight: 800, fontSize: 14 }}>{value}</div>
      <div className="eyebrow" style={{ fontSize: 9, marginTop: 4 }}>
        {label}
      </div>
    </div>
  )
}
