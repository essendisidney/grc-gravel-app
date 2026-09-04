'use client'

import { useMemo, useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight, Heart, MapPinned, SlidersHorizontal } from 'lucide-react'
import { DEMO_REGIONS, DEMO_ROUTES } from '@/lib/demo'
import GrcLogo from '@/components/brand/GrcLogo'
import { getFavorites, toggleFavorite } from '@/lib/localStore'

type SortKey = 'featured' | 'distance' | 'gravel' | 'climb'

export default function DiscoverClient() {
  const [sort, setSort] = useState<SortKey>('featured')
  const [minGravel, setMinGravel] = useState(0)
  const [maxKm, setMaxKm] = useState(120)
  const [signal, setSignal] = useState<'Any' | 'Good' | 'Patchy' | 'Poor'>('Any')
  const [favOnly, setFavOnly] = useState(false)
  const [favorites, setFavorites] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    setFavorites(getFavorites())
  }, [])

  const routes = useMemo(() => {
    let list = DEMO_ROUTES.filter(r => r.gravel_pct >= minGravel && r.distance_km <= maxKm)
    if (signal !== 'Any') list = list.filter(r => r.signal === signal)
    if (favOnly) list = list.filter(r => favorites.includes(r.id))
    if (sort === 'distance') list = [...list].sort((a, b) => a.distance_km - b.distance_km)
    if (sort === 'gravel') list = [...list].sort((a, b) => b.gravel_pct - a.gravel_pct)
    if (sort === 'climb') list = [...list].sort((a, b) => b.elevation_m - a.elevation_m)
    return list
  }, [sort, minGravel, maxKm, signal, favOnly, favorites])

  function heart(routeId: string, e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setFavorites(toggleFavorite(routeId))
  }

  return (
    <div className="animate-fade-in" style={{ padding: '0 16px 24px' }}>
      <div className="stagger" style={{ padding: '4px 4px 18px' }}>
        <div className="eyebrow" style={{ color: 'var(--accent)', marginBottom: 8 }}>Wave 8 · Gravel near you</div>
        <h1 className="display-title" style={{ fontSize: 30 }}>Route intelligence</h1>
        <p style={{ margin: '12px 0 0', fontSize: 14, color: 'var(--muted)', lineHeight: 1.5, maxWidth: 300 }}>
          Filter by gravel, distance, signal — save favourites for patchy reception.
        </p>
      </div>

      <div
        style={{
          padding: 14,
          marginBottom: 16,
          borderRadius: 18,
          display: 'flex',
          gap: 12,
          alignItems: 'center',
          background: 'linear-gradient(135deg, #1C1916 0%, #2E2924 100%)',
          color: '#fff',
        }}
      >
        <GrcLogo size={42} rounded={13} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700 }}>Nairobi · Rift corridor</div>
          <div style={{ fontSize: 12, opacity: 0.7, marginTop: 2 }}>
            {routes.length} routes match · {favorites.length} favourites
          </div>
        </div>
        <ChevronRight size={18} color="rgba(255,255,255,0.45)" />
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
        <button
          type="button"
          className={showFilters ? 'chip accent' : 'chip'}
          style={{ border: 'none', cursor: 'pointer' }}
          onClick={() => setShowFilters(v => !v)}
        >
          <SlidersHorizontal size={12} /> Filters
        </button>
        <button
          type="button"
          className={favOnly ? 'chip accent' : 'chip'}
          style={{ border: 'none', cursor: 'pointer' }}
          onClick={() => setFavOnly(v => !v)}
        >
          <Heart size={12} /> Favourites
        </button>
        {(['featured', 'distance', 'gravel', 'climb'] as SortKey[]).map(s => (
          <button
            key={s}
            type="button"
            className={sort === s ? 'chip accent' : 'chip'}
            style={{ border: 'none', cursor: 'pointer', textTransform: 'capitalize' }}
            onClick={() => setSort(s)}
          >
            {s}
          </button>
        ))}
      </div>

      {showFilters && (
        <div className="surface" style={{ padding: 14, marginBottom: 16 }}>
          <div className="section-label" style={{ marginBottom: 8 }}>Min gravel % · {minGravel}</div>
          <input
            type="range"
            min={0}
            max={90}
            step={5}
            value={minGravel}
            onChange={e => setMinGravel(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--accent)', marginBottom: 14 }}
          />
          <div className="section-label" style={{ marginBottom: 8 }}>Max distance · {maxKm} km</div>
          <input
            type="range"
            min={30}
            max={120}
            step={5}
            value={maxKm}
            onChange={e => setMaxKm(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--accent)', marginBottom: 14 }}
          />
          <div className="section-label" style={{ marginBottom: 8 }}>Signal</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {(['Any', 'Good', 'Patchy', 'Poor'] as const).map(s => (
              <button
                key={s}
                type="button"
                className={signal === s ? 'chip accent' : 'chip'}
                style={{ border: 'none', cursor: 'pointer' }}
                onClick={() => setSignal(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

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
                minHeight: 100,
                background: i % 2 === 0 ? 'var(--surface)' : 'linear-gradient(160deg, #FFF8F1, #FFFCFA)',
              }}
            >
              <MapPinned size={16} color="var(--accent)" style={{ marginBottom: 10 }} />
              <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.02em' }}>{region.name}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>{region.route_count} routes</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="eyebrow" style={{ marginBottom: 10 }}>Intel · {routes.length}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {routes.length === 0 && (
          <div className="surface" style={{ padding: 16, color: 'var(--muted)', fontSize: 13 }}>
            No routes match those filters. Ease gravel % or distance.
          </div>
        )}
        {routes.map(route => {
          const loved = favorites.includes(route.id)
          return (
            <Link
              key={route.id}
              href={`/discover/route/${route.id}`}
              className="pressable"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div className="surface" style={{ overflow: 'hidden', position: 'relative' }}>
                <button
                  type="button"
                  onClick={e => heart(route.id, e)}
                  style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    zIndex: 2,
                    width: 36,
                    height: 36,
                    borderRadius: 12,
                    border: 'none',
                    background: 'rgba(14,12,10,0.55)',
                    display: 'grid',
                    placeItems: 'center',
                    cursor: 'pointer',
                  }}
                  aria-label="Favourite"
                >
                  <Heart size={16} fill={loved ? '#FEC72E' : 'none'} color={loved ? '#FEC72E' : '#fff'} />
                </button>
                <div className="hero-media" style={{ height: 148, borderRadius: 0 }}>
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
          )
        })}
      </div>
    </div>
  )
}
