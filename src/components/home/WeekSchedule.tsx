'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import type { DemoRide } from '@/lib/demo'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function dayKey(d: Date) {
  return d.toISOString().slice(0, 10)
}

export default function WeekSchedule({ rides }: { rides: DemoRide[] }) {
  const today = useMemo(() => {
    const d = new Date()
    d.setHours(12, 0, 0, 0)
    return d
  }, [])

  const week = useMemo(() => {
    const start = new Date(today)
    start.setDate(today.getDate() - today.getDay()) // Sunday start
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      return d
    })
  }, [today])

  const [selected, setSelected] = useState(dayKey(today))

  const byDay = useMemo(() => {
    const map: Record<string, DemoRide[]> = {}
    for (const ride of rides) {
      const k = ride.ride_date
      if (!map[k]) map[k] = []
      map[k].push(ride)
    }
    return map
  }, [rides])

  const selectedRides = byDay[selected] || []

  return (
    <div style={{ marginBottom: 8 }}>
      <div className="eyebrow" style={{ marginBottom: 12 }}>This week · schedule</div>
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', scrollbarWidth: 'none', marginBottom: 12 }}>
        {week.map(d => {
          const key = dayKey(d)
          const on = key === selected
          const has = (byDay[key] || []).length > 0
          const isToday = key === dayKey(today)
          return (
            <button
              key={key}
              type="button"
              onClick={() => setSelected(key)}
              style={{
                flex: '0 0 auto',
                minWidth: 48,
                padding: '10px 8px',
                borderRadius: 14,
                border: on ? '1px solid rgba(224,122,47,0.5)' : '1px solid var(--line)',
                background: on ? 'var(--accent-soft)' : 'var(--surface)',
                cursor: 'pointer',
                fontFamily: 'var(--font)',
                color: 'var(--ink)',
                position: 'relative',
              }}
            >
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)' }}>
                {DAYS[d.getDay()]}
              </div>
              <div style={{ fontSize: 16, fontWeight: 800, marginTop: 4 }}>{d.getDate()}</div>
              {isToday && (
                <div style={{ fontSize: 8, fontWeight: 800, color: 'var(--accent)', marginTop: 2 }}>NOW</div>
              )}
              {has && (
                <span
                  style={{
                    position: 'absolute',
                    top: 6,
                    right: 6,
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: 'var(--accent)',
                  }}
                />
              )}
            </button>
          )
        })}
      </div>

      {selectedRides.length === 0 ? (
        <div className="surface" style={{ padding: 14, fontSize: 13, color: 'var(--muted)' }}>
          Rest / free ride day. No club roll-out scheduled.
        </div>
      ) : (
        selectedRides.map(ride => (
          <Link
            key={ride.id}
            href={`/rides/${ride.id}`}
            className="surface"
            style={{
              display: 'block',
              padding: 14,
              marginBottom: 8,
              textDecoration: 'none',
              color: 'var(--ink)',
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 800 }}>{ride.route_label || ride.title}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
              {(ride.start_time || '').slice(0, 5)} · {ride.distance_km} km · {ride.start_location_name}
            </div>
          </Link>
        ))
      )}
    </div>
  )
}
