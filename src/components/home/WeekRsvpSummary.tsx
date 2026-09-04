'use client'

import Link from 'next/link'
import { getWeekRsvpSummary } from '@/lib/localStore'
import type { DemoRide } from '@/lib/demo'

export default function WeekRsvpSummary({ rides }: { rides: DemoRide[] }) {
  const summary = getWeekRsvpSummary(
    rides.map(r => ({
      id: r.id,
      title: r.route_label || r.title,
      ride_date: r.ride_date,
      distance_km: r.distance_km,
    })),
  )

  return (
    <div className="surface" style={{ padding: 14, marginBottom: 14 }}>
      <div className="eyebrow" style={{ marginBottom: 6 }}>Your week</div>
      {summary.empty ? (
        <>
          <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 4 }}>No rides locked in</div>
          <p style={{ margin: '0 0 10px', fontSize: 13, color: 'var(--muted)', lineHeight: 1.45 }}>
            Tap Join on Magadi — Cruiser is a solid first group.
          </p>
          <Link href="/rides/ngong-magadi" style={{ fontSize: 12, fontWeight: 800, color: 'var(--accent)', textDecoration: 'none' }}>
            Open next adventure →
          </Link>
        </>
      ) : (
        <>
          <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 4 }}>
            {summary.count} ride{summary.count === 1 ? '' : 's'} · ~{summary.km} km
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.45 }}>
            {summary.titles.slice(0, 3).join(' · ')}
          </div>
        </>
      )}
    </div>
  )
}
