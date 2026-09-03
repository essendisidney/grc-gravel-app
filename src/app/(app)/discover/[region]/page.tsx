import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'
import TopBar from '@/components/layout/TopBar'
import { DEMO_REGIONS, DEMO_ROUTES } from '@/lib/demo'

export default async function RegionPage({
  params,
}: {
  params: Promise<{ region: string }>
}) {
  const { region: regionId } = await params
  const region = DEMO_REGIONS.find(r => r.id === regionId) || DEMO_REGIONS[0]
  const routes = DEMO_ROUTES.filter(r => r.region_id === region.id)

  return (
    <div>
      <TopBar title={region.name} showNotifications={false} />
      <div className="animate-fade-in" style={{ padding: '0 16px 28px' }}>
        <Link
          href="/discover"
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
            marginBottom: 14,
          }}
        >
          <ArrowLeft size={14} /> Discover
        </Link>

        <h1 style={{ margin: '0 0 6px', fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em' }}>
          {region.name}
        </h1>
        <p style={{ margin: '0 0 18px', fontSize: 14, color: 'var(--muted)', lineHeight: 1.5 }}>
          {region.blurb}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {routes.map(route => (
            <Link key={route.id} href={`/discover/route/${route.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="surface pressable" style={{ overflow: 'hidden' }}>
              <div style={{ position: 'relative', height: 160, background: 'var(--charcoal)' }}>
                {route.image && (
                  <Image src={route.image} alt={route.name} fill sizes="400px" style={{ objectFit: 'cover' }} />
                )}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, transparent 45%, rgba(20,18,16,0.8))',
                  }}
                />
                <div style={{ position: 'absolute', left: 14, right: 14, bottom: 12, color: '#fff' }}>
                  <div style={{ fontSize: 18, fontWeight: 800 }}>{route.name}</div>
                  <div style={{ fontSize: 12, marginTop: 3, opacity: 0.9 }}>
                    {route.distance_km} km · {route.elevation_m} m ↑ · {route.est_hours}
                  </div>
                </div>
              </div>
              <div style={{ padding: 14 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                  <Intel label="Gravel" value={`${route.gravel_pct}%`} />
                  <Intel label="Tarmac" value={`${route.tarmac_pct}%`} />
                  <Intel label="Roughness" value={`${route.roughness} / 5`} />
                  <Intel label="Condition" value={route.road_condition} />
                  <Intel label="Signal" value={route.signal} />
                  <Intel label="Water pts" value={`${route.water_points}`} />
                </div>
                <div className="chip accent">Best: {route.best_months} · Open GPX →</div>
              </div>
            </div>
            </Link>
          ))}
          {routes.length === 0 && (
            <div className="surface" style={{ padding: 24, textAlign: 'center', color: 'var(--muted)' }}>
              No demo routes in this region yet.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Intel({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: 'var(--bg)', borderRadius: 12, padding: '10px 12px' }}>
      <div className="eyebrow" style={{ fontSize: 9, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 700 }}>{value}</div>
    </div>
  )
}
