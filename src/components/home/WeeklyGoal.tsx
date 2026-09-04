'use client'

import { useEffect, useState } from 'react'
import { Target } from 'lucide-react'
import { getWeekKm, getWeeklyGoalKm, setWeeklyGoalKm } from '@/lib/localStore'

export default function WeeklyGoal({ compact = false }: { compact?: boolean }) {
  const [goal, setGoal] = useState(80)
  const [weekKm, setWeekKm] = useState(0)

  useEffect(() => {
    setGoal(getWeeklyGoalKm())
    setWeekKm(getWeekKm())
  }, [])

  const pct = Math.min(100, Math.round((weekKm / goal) * 100))

  return (
    <div className="surface" style={{ padding: compact ? 12 : 14, marginBottom: compact ? 0 : 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
        <div>
          <div className="eyebrow" style={{ color: 'var(--accent)', marginBottom: 6 }}>This week</div>
          <div style={{ fontSize: compact ? 16 : 18, fontWeight: 800 }}>
            {weekKm} / {goal} km
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
            {pct >= 100 ? 'Goal smashed — roll easy or go long.' : `${Math.max(0, goal - weekKm)} km to weekly goal`}
          </div>
        </div>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: 'var(--accent-soft)',
            display: 'grid',
            placeItems: 'center',
            flexShrink: 0,
          }}
        >
          <Target size={18} color="var(--accent-ink)" />
        </div>
      </div>
      <div
        style={{
          height: 8,
          borderRadius: 999,
          background: 'rgba(28,25,22,0.08)',
          marginTop: 12,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #FEC72E, #E5A91A)',
            transition: 'width 0.35s ease',
          }}
        />
      </div>
      {!compact && (
        <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
          {[60, 80, 100, 120].map(g => (
            <button
              key={g}
              type="button"
              className={goal === g ? 'chip accent' : 'chip'}
              style={{ border: 'none', cursor: 'pointer' }}
              onClick={() => setGoal(setWeeklyGoalKm(g))}
            >
              {g} km
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
