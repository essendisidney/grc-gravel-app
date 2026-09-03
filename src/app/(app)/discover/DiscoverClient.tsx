'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight, MapPinned } from 'lucide-react'
import { DEMO_REGIONS, DEMO_ROUTES } from '@/lib/demo'

export default function DiscoverClient() {
  const featured = DEMO_ROUTES.slice(0, 3)

  return (
    <div className="animate-fade-in" style={{ padding: '0 16px 24px' }}>
      <div className="stagger" style={{ padding: '4px 4px 18px' }}>
        <div className="eyebrow" style={{ color: 'var(--accent)', marginBottom: 8 }}>Gravel near you</div>
        <h1 className="display-title" style={{ fontSize: 30 }}>Route intelligence</h1>
        <p style={{ margin: '12px 0 0', fontSize: 14, color: 'var(--muted)', lineHeight: 1.5, maxWidth: 300 }}>
          Surfaces, signal, water, season — before you leave Nairobi.
        </p>
      </div>

      <div
        className="pressable"
        style={{
          padding: 14,
          marginBottom: 20,
          borderRadius: 18,
          display: 'flex',
          gap: 12,
          alignItems: 'center',
          background: 'linear-gradient(135deg, #1C1916 0%, #2E2924 100%)',
          color: '#fff',
        }}
      >
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 13,
            background: 'var(--accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            fontWeight: 800,
            fontSize: 11,
          }}
        >
          GRC
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700 }}>Nairobi · Rift corridor</div>
          <div style={{ fontSize: 12, opacity: 0.7, marginTop: 2 }}>
            {DEMO_ROUTES.length} mapped routes · live demo intel
          </div>
        </div>
        <ChevronRight size={18} color="rgba(255,255,255,0.45)" />
      </div>

      <div className="eyebrow" style={{ marginBottom: 10 }}>Regions</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 22 }}>
        {DEMO_REGIONS.map((region, i) => (
          <Link
            key={region.id}
            href={`/discover/${region.id}`}
            className="pressable"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div
              className="surface"
              style={{
                padding: 14,
                minHeight: 118,
                background: i % 2 === 0 ? 'var(--surface)' : 'linear-gradient(160deg, #FFF8F1, #FFFCFA)',
              }}
            >
              <MapPinned size={16} color="var(--accent)" style={{ marginBottom: 12 }} />
              <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: '-0.02em' }}>{region.name}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
                {region.route_count} routes
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="eyebrow" style={{ marginBottom: 10 }}>Featured intel</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {featured.map(route => (
          <Link
            key={route.id}
            href={`/discover/${route.region_id}`}
            className="pressable"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div className="surface" style={{ overflow: 'hidden' }}>
              <div className="hero-media" style={{ height: 156, borderRadius: 0 }}>
                {route.image && (
                  <Image src={route.image} alt={route.name} fill sizes="400px" style={{ objectFit: 'cover' }} />
                )}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, transparent 35%, rgba(14,12,10,0.82))',
                  }}
                />
                <div style={{ position: 'absolute', left: 14, right: 14, bottom: 12, color: '#fff' }}>
                  <div style={{ fontSize: 17, fontWeight: 800 }}>{route.name}</div>
                  <div style={{ fontSize: 12, opacity: 0.88, marginTop: 3 }}>
                    {route.distance_km} km · {route.elevation_m} m ↑ · gravel {route.gravel_pct}%
                  </div>
                </div>
              </div>
              <div style={{ padding: 12, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                <span className="chip accent">Rough {route.roughness}</span>
                <span className="chip">Signal {route.signal}</span>
                <span className="chip">{route.water_points} water</span>
                <span className="chip">{route.best_months}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
