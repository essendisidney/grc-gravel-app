'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { DEMO_RIDES } from '@/lib/demo'
import {
  addActivity,
  addClubStory,
  getActivities,
  getSession,
  markSaturdayRidden,
  setActivityFeel,
  type RideFeel,
} from '@/lib/localStore'
import RouteMap from '@/components/maps/RouteMap'
import ShareRideCard from '@/components/ride/ShareRideCard'
import PackPhotoReminder from '@/components/ride/PackPhotoReminder'
import RecoveryTipCard from '@/components/ride/RecoveryTipCard'
import StretchChecklist from '@/components/ride/StretchChecklist'
import ThanksCaptain from '@/components/ride/ThanksCaptain'
import NutritionTip from '@/components/ride/NutritionTip'
import FinishLineChecklist from '@/components/ride/FinishLineChecklist'
import DustRinseTip from '@/components/ride/DustRinseTip'
import ChainLubeTip from '@/components/ride/ChainLubeTip'
import SaddleBagTip from '@/components/ride/SaddleBagTip'
import BrakePadTip from '@/components/ride/BrakePadTip'
import KitWashTip from '@/components/ride/KitWashTip'
import ShoeCleanTip from '@/components/ride/ShoeCleanTip'
import SleepRecoveryTip from '@/components/ride/SleepRecoveryTip'
import FoamRollTip from '@/components/ride/FoamRollTip'
import ProteinTip from '@/components/ride/ProteinTip'

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
  const [shared, setShared] = useState(false)
  const [riderName, setRiderName] = useState('GRC rider')
  const [activityId, setActivityId] = useState<string | null>(null)
  const [feel, setFeel] = useState<RideFeel | null>(null)

  const distanceKm = Math.min(
    ride?.distance_km || 86,
    Math.max(0.5, Math.round((elapsed / 3600) * 21 * 10) / 10),
  )
  const elevationM = Math.round(
    (ride?.elevation_gain_m || 800) * Math.min(1, Math.max(0.08, elapsed / (3.5 * 3600))),
  )
  const title = ride?.route_label || ride?.title || 'Club ride'

  useEffect(() => {
    const s = getSession()
    if (s?.fullName) setRiderName(s.fullName)
  }, [])

  useEffect(() => {
    if (saved || elapsed < 5) return
    const already = getActivities().find(
      a => a.rideId === rideId && Math.abs(new Date(a.endedAt).getTime() - Date.now()) < 15000,
    )
    if (already) {
      setSaved(true)
      setActivityId(already.id)
      if (already.feel) setFeel(already.feel)
      return
    }
    const id = `act_${Date.now()}`
    addActivity({
      id,
      rideId,
      title,
      paceGroupName: pace,
      elapsedSec: elapsed,
      distanceKm,
      elevationM,
      endedAt: new Date().toISOString(),
    })
    markSaturdayRidden()
    setActivityId(id)
    setSaved(true)
  }, [saved, elapsed, rideId, pace, title, distanceKm, elevationM])

  function rate(v: RideFeel) {
    setFeel(v)
    if (activityId) setActivityFeel(activityId, v)
  }

  function shareToClub() {
    const session = getSession()
    addClubStory({
      id: `story_${Date.now()}`,
      content: `Rolled ${title} with the ${pace} pack — ${distanceKm} km · ${elevationM} m ↑ · ${formatElapsed(elapsed)}. Dust still in the teeth.`,
      rideTitle: title,
      distanceKm,
      createdAt: new Date().toISOString(),
      authorName: session?.fullName || 'You',
    })
    setShared(true)
  }

  return (
    <div className="page animate-fade-in page-top">
      <div className="eyebrow" style={{ color: 'var(--accent)', marginBottom: 6 }}>Wave 26 · Post-ride</div>
      <h1 style={{ margin: '0 0 6px', fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em' }}>
        Ride logged
      </h1>
      <p style={{ margin: '0 0 16px', fontSize: 14, color: 'var(--muted)' }}>
        {title} · {pace}
      </p>

      <PackPhotoReminder title={title} />

      <ShareRideCard
        title={title}
        pace={pace}
        distanceKm={distanceKm}
        elevationM={elevationM}
        elapsedLabel={formatElapsed(elapsed)}
        riderName={riderName}
      />

      <RouteMap routeId={rideId} height={160} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, margin: '14px 0' }}>
        <Stat label="Time" value={formatElapsed(elapsed)} />
        <Stat label="Distance" value={`${distanceKm} km`} />
        <Stat label="Climb" value={`${elevationM || '—'} m`} />
      </div>

      <div className="surface" style={{ padding: 14, marginBottom: 14 }}>
        <div style={{ fontWeight: 800, marginBottom: 8 }}>How did it feel?</div>
        <div style={{ display: 'flex', gap: 6 }}>
          {([1, 2, 3, 4, 5] as RideFeel[]).map(v => (
            <button
              key={v}
              type="button"
              className={feel === v ? 'chip accent' : 'chip'}
              style={{ border: 'none', cursor: 'pointer', flex: 1, justifyContent: 'center' }}
              onClick={() => rate(v)}
            >
              {v}
            </button>
          ))}
        </div>
        <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 8 }}>
          1 = cooked · 5 = flying
        </div>
      </div>

      <RecoveryTipCard feel={feel} />

      <NutritionTip feel={feel} distanceKm={distanceKm} />

      <StretchChecklist rideId={rideId} />

      <FinishLineChecklist rideId={rideId} />

      <DustRinseTip distanceKm={distanceKm} />

      <ChainLubeTip distanceKm={distanceKm} />

      <SaddleBagTip distanceKm={distanceKm} feel={feel} />

      <BrakePadTip distanceKm={distanceKm} />

      <KitWashTip distanceKm={distanceKm} />

      <ShoeCleanTip distanceKm={distanceKm} />

      <SleepRecoveryTip distanceKm={distanceKm} feel={feel} />

      <FoamRollTip distanceKm={distanceKm} feel={feel} />

      <ProteinTip distanceKm={distanceKm} feel={feel} />

      <ThanksCaptain
        rideId={rideId}
        captainName={
          ride?.pace_groups?.find(g => g.name === pace)?.captain ||
          ride?.pace_groups?.[1]?.captain ||
          'Amina Otieno'
        }
      />

      <div className="surface" style={{ padding: 14, marginBottom: 14 }}>
        <div style={{ fontWeight: 800, marginBottom: 6 }}>Dust report</div>
        <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>
          Demo summary from on-ride elapsed time. Share a quick story to Club news for the pack.
        </div>
      </div>

      {shared ? (
        <button type="button" className="btn-secondary" disabled style={{ marginBottom: 10 }}>
          Shared to Club news ✓
        </button>
      ) : (
        <button type="button" className="btn-primary" onClick={shareToClub} style={{ marginBottom: 10 }}>
          Share to Club news
        </button>
      )}

      <button type="button" className="btn-secondary" onClick={() => router.push(shared ? '/feed' : '/passport')}>
        {shared ? 'Open Club news' : 'See activity on You'}
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
