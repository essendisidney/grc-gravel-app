'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Download, HardDriveDownload, MapPinned } from 'lucide-react'
import TopBar from '@/components/layout/TopBar'
import { buildGpx, getRegionName, getRouteById } from '@/lib/gpx'
import { isRouteSaved, removeOfflinePack, saveOfflinePack } from '@/lib/localStore'
import RouteMap from '@/components/maps/RouteMap'
import ElevationProfile from '@/components/maps/ElevationProfile'
import ConditionReports from '@/components/discover/ConditionReports'
import FuelPlanner from '@/components/discover/FuelPlanner'
import WaterRefills from '@/components/discover/WaterRefills'
import SignalDeadZones from '@/components/discover/SignalDeadZones'
import ClimbSegments from '@/components/discover/ClimbSegments'
import SurfaceMixBar from '@/components/discover/SurfaceMixBar'
import GateParkingTip from '@/components/discover/GateParkingTip'
import PhotoSpotTip from '@/components/discover/PhotoSpotTip'
import MatatuCautionTip from '@/components/discover/MatatuCautionTip'
import RegroupRuleTip from '@/components/discover/RegroupRuleTip'
import DescentCautionTip from '@/components/discover/DescentCautionTip'
import ChaiStopEtaTip from '@/components/discover/ChaiStopEtaTip'
import CattleCrossingTip from '@/components/discover/CattleCrossingTip'
import BlindCornerTip from '@/components/discover/BlindCornerTip'

export default function RouteDetailClient({ routeId }: { routeId: string }) {
  const route = useMemo(() => getRouteById(routeId), [routeId])
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (route) setSaved(isRouteSaved(route.id))
  }, [route])

  if (!route) {
    return (
      <div style={{ padding: 24 }}>
        <TopBar showBack title="Route" backHref="/discover" />
        <p style={{ color: 'var(--muted)' }}>Route not found.</p>
      </div>
    )
  }

  function downloadGpx() {
    const xml = buildGpx(route!.id, route!.name)
    const blob = new Blob([xml], { type: 'application/gpx+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${route!.id}.gpx`
    a.click()
    URL.revokeObjectURL(url)
  }

  function toggleOffline() {
    if (saved) {
      removeOfflinePack(route!.id)
      setSaved(false)
      return
    }
    saveOfflinePack({
      routeId: route!.id,
      name: route!.name,
      regionId: route!.region_id,
      distanceKm: route!.distance_km,
      elevationM: route!.elevation_m,
      gravelPct: route!.gravel_pct,
      signal: route!.signal,
      waterPoints: route!.water_points,
      savedAt: new Date().toISOString(),
      gpx: buildGpx(route!.id, route!.name),
    })
    setSaved(true)
  }

  return (
    <div>
      <TopBar showBack title="Route intel" showNotifications={false} backHref={`/discover/${route.region_id}`} />
      <div className="page animate-fade-in">
        <Link
          href={`/discover/${route.region_id}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--muted)',
            textDecoration: 'none',
            marginBottom: 12,
          }}
        >
          <ArrowLeft size={14} /> {getRegionName(route.region_id)}
        </Link>

        <div className="hero-media" style={{ height: 200, borderRadius: 20, marginBottom: 14 }}>
          {route.image && (
            <Image src={route.image} alt={route.name} fill sizes="400px" style={{ objectFit: 'cover' }} priority />
          )}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, rgba(14,12,10,0.82))' }} />
          <div style={{ position: 'absolute', left: 14, right: 14, bottom: 14, color: '#fff' }}>
            <div className="eyebrow" style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 4 }}>
              {getRegionName(route.region_id)}
            </div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>{route.name}</div>
            <div style={{ fontSize: 13, opacity: 0.9, marginTop: 4 }}>
              {route.distance_km} km · {route.elevation_m} m ↑ · {route.est_hours}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
          <Intel label="Gravel" value={`${route.gravel_pct}%`} />
          <Intel label="Tarmac" value={`${route.tarmac_pct}%`} />
          <Intel label="Roughness" value={`${route.roughness}/5`} />
          <Intel label="Condition" value={route.road_condition} />
          <Intel label="Signal" value={route.signal} />
          <Intel label="Water" value={`${route.water_points} pts`} />
        </div>

        <div style={{ marginBottom: 14 }}>
          <RouteMap routeId={route.id} height={170} />
        </div>
        <div style={{ marginBottom: 14 }}>
          <ElevationProfile routeId={route.id} />
        </div>

        <ConditionReports routeId={route.id} />

        <FuelPlanner
          distanceKm={route.distance_km}
          elevationM={route.elevation_m}
          estHours={route.est_hours}
        />

        <WaterRefills routeId={route.id} />

        <SignalDeadZones routeId={route.id} />

        <ClimbSegments routeId={route.id} />
        <SurfaceMixBar gravelPct={route.gravel_pct ?? 70} />
        <GateParkingTip routeId={route.id} />
        <PhotoSpotTip routeId={route.id} />
        <MatatuCautionTip routeId={route.id} />
        <RegroupRuleTip routeId={route.id} />
        <DescentCautionTip routeId={route.id} />
        <ChaiStopEtaTip routeId={route.id} />
        <CattleCrossingTip routeId={route.id} />
        <BlindCornerTip routeId={route.id} />

        <div className="surface" style={{ padding: 14, marginBottom: 14 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <MapPinned size={18} color="var(--accent)" style={{ marginTop: 2 }} />
            <div>
              <div style={{ fontWeight: 800, fontSize: 14 }}>Season window</div>
              <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4, lineHeight: 1.45 }}>
                Best {route.best_months}. Offline pack stores GPX + intel on this device for patchy signal.
              </div>
            </div>
          </div>
        </div>

        <button type="button" className="btn-primary" onClick={downloadGpx} style={{ marginBottom: 10 }}>
          <Download size={16} /> Download GPX
        </button>
        <button
          type="button"
          className={saved ? 'btn-secondary' : 'btn-primary'}
          onClick={toggleOffline}
          style={
            saved
              ? undefined
              : { background: 'var(--charcoal)', color: '#fff', boxShadow: 'none' }
          }
        >
          <HardDriveDownload size={16} /> {saved ? 'Saved offline · tap to remove' : 'Save offline pack'}
        </button>
        <Link
          href="/rides/ngong-magadi"
          style={{
            display: 'block',
            textAlign: 'center',
            marginTop: 12,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--muted)',
            textDecoration: 'none',
          }}
        >
          See club rides on this corridor
        </Link>
      </div>
    </div>
  )
}

function Intel({ label, value }: { label: string; value: string }) {
  return (
    <div className="surface" style={{ padding: '12px 12px' }}>
      <div className="eyebrow" style={{ fontSize: 9, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 800 }}>{value}</div>
    </div>
  )
}
