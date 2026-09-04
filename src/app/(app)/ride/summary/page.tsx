'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { DEMO_RIDES } from '@/lib/demo'
import { addActivity, getActivities } from '@/lib/localStore'
import RouteMap from '@/components/maps/RouteMap'

function formatElapsed(sec: number) {
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = sec % 60
  if (h > 0) return `${h}h ${m}m`
  return `${m}m ${s}s`
}

function SummaryInner() {
  const router = useRouter()
  const params = useSearchParams()
  const rideId = params.get('ride') || 'ngong-magadi'
  const elapsed = Number(params.get('t') || '0')
  const pace = params.get('pace') || 'Cruiser'
  const ride = useMemo(() => DEMO_RIDES.find(r => r.id === rideId) || DEMO_RIDES[0], [rideId])
  const [saved, setSaved] = useState(false)

  const distanceKm = Math.min(
    ride?.distance_km || 86,
    Math.max(0.5, Math.round((elapsed / 3600) * 21 * 10) / 10),
  )
  const elevationM = Math.round(
    (ride?.elevation_gain_m || 800) * Math.min(1, Math.max(0.08, elapsed / (3.5 * 3600))),
  )

  useEffect(() => {
    if (saved || elapsed < 5) return
    const already = getActivities().some(
      a => a.rideId === rideId && Math.abs(new Date(a.endedAt).getTime() - Date.now()) < 15000,
    )
    if (already) {
      setSaved(true)
      return
    }
    addActivity({
      id: `act_${Date.now()}`,
      rideId,
      title: ride?.route_label || ride?.title || 'Club ride',
      paceGroupName: pace,
      elapsedSec: elapsed,
      distanceKm,
      elevationM,
      endedAt: new Date().toISOString(),
    })
    setSaved(true)
  }, [saved, elapsed, rideId, pace, ride, distanceKm, elevationM])

  return (
    <div className="animate-fade-in" style={{ padding: '16px 16px 28px' }}>
      <div className="eyebrow" style={{ color: 'var(--accent)', marginBottom: 6 }}>Wave 5 · Post-ride</div>
      <h1 style={{ margin: '0 0 6px', fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em' }}>
        Ride logged
      </h1>
      <p style={{ margin: '0 0 16px', fontSize: 14, color: 'var(--muted)' }}>
        {ride?.route_label || ride?.title} · {pace}
      </p>

      <RouteMap routeId={rideId} height={160} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, margin: '14px 0' }}>
        <Stat label="Time" value={formatElapsed(elapsed)} />
        <Stat label="Distance" value={`${distanceKm} km`} />
        <Stat label="Climb" value={`${elevationM || '—'} m`} />
      </div>

      <div className="surface" style={{ padding: 14, marginBottom: 14 }}>
        <div style={{ fontWeight: 800, marginBottom: 6 }}>Dust report</div>
        <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>
          Demo summary from on-ride elapsed time. Live GPS tracking comes later — this still builds your passport activity streak.
        </div>
      </div>

      <button type="button" className="btn-primary" onClick={() => router.push('/passport')}>
        See activity on You
      </button>
      <Link
        href="/"
        style={{
          display: 'block',
          textAlign: 'center',
          marginTop: 14,
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--muted)',
          textDecoration: 'none',
        }}
      >
        Back home
      </Link>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="surface" style={{ padding: '12px 10px', textAlign: 'center' }}>
      <div style={{ fontSize: 16, fontWeight: 800 }}>{value}</div>
      <div className="eyebrow" style={{ fontSize: 9, marginTop: 6 }}>{label}</div>
    </div>
  )
}

export default function RideSummaryPage() {
  return (
    <Suspense fallback={<div style={{ padding: 24, color: 'var(--muted)' }}>Logging ride…</div>}>
      <SummaryInner />
    </Suspense>
  )
}
