'use client'

import { useMemo, useState, type CSSProperties, type ReactNode } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'
import TopBar from '@/components/layout/TopBar'
import { DEMO_MEMBERS, DEMO_RIDES, DEMO_ROUTES } from '@/lib/demo'

export default function SearchPage() {
  const [q, setQ] = useState('')

  const needle = q.trim().toLowerCase()

  const results = useMemo(() => {
    if (!needle) return { rides: [], routes: [], members: [] }
    return {
      rides: DEMO_RIDES.filter(
        r =>
          r.title.toLowerCase().includes(needle) ||
          (r.route_label || '').toLowerCase().includes(needle) ||
          (r.start_location_name || '').toLowerCase().includes(needle),
      ).slice(0, 6),
      routes: DEMO_ROUTES.filter(
        r =>
          r.name.toLowerCase().includes(needle) ||
          r.region_id.toLowerCase().includes(needle) ||
          r.signal.toLowerCase().includes(needle),
      ).slice(0, 6),
      members: DEMO_MEMBERS.filter(
        m =>
          m.full_name.toLowerCase().includes(needle) ||
          m.membership_number.toLowerCase().includes(needle) ||
          (m.title || '').toLowerCase().includes(needle),
      ).slice(0, 6),
    }
  }, [needle])

  const total = results.rides.length + results.routes.length + results.members.length

  return (
    <div>
      <TopBar showBack title="Search" backHref="/" showNotifications={false} />
      <div className="animate-fade-in" style={{ padding: '0 16px 28px' }}>
        <div className="eyebrow" style={{ color: 'var(--accent)', marginBottom: 6 }}>Wave 12</div>
        <h1 style={{ margin: '0 0 12px', fontSize: 26, fontWeight: 800 }}>Find it</h1>

        <div style={{ position: 'relative', marginBottom: 16 }}>
          <Search size={16} color="var(--muted)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            className="grc-input"
            autoFocus
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Rides, routes, members…"
            style={{ paddingLeft: 40 }}
          />
        </div>

        {!needle && (
          <div className="surface" style={{ padding: 14, color: 'var(--muted)', fontSize: 13, lineHeight: 1.45 }}>
            Try “Magadi”, “Amina”, “Full Gas”, or “Tena”.
          </div>
        )}

        {needle && total === 0 && (
          <div className="surface" style={{ padding: 14, color: 'var(--muted)', fontSize: 13 }}>
            Nothing matched “{q}”.
          </div>
        )}

        {results.rides.length > 0 && (
          <Section title={`Rides · ${results.rides.length}`}>
            {results.rides.map(r => (
              <Link key={r.id} href={`/rides/${r.id}`} className="surface" style={rowStyle}>
                <div style={{ fontWeight: 800, fontSize: 14 }}>{r.route_label || r.title}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 3 }}>
                  {r.distance_km} km · {r.ride_date}
                </div>
              </Link>
            ))}
          </Section>
        )}

        {results.routes.length > 0 && (
          <Section title={`Routes · ${results.routes.length}`}>
            {results.routes.map(r => (
              <Link key={r.id} href={`/discover/route/${r.id}`} className="surface" style={rowStyle}>
                <div style={{ fontWeight: 800, fontSize: 14 }}>{r.name}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 3 }}>
                  {r.distance_km} km · gravel {r.gravel_pct}% · {r.signal}
                </div>
              </Link>
            ))}
          </Section>
        )}

        {results.members.length > 0 && (
          <Section title={`Members · ${results.members.length}`}>
            {results.members.map(m => (
              <Link key={m.id} href="/club/members" className="surface" style={rowStyle}>
                <div style={{ fontWeight: 800, fontSize: 14 }}>{m.full_name}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 3 }}>
                  {m.title} · {m.membership_number}
                </div>
              </Link>
            ))}
          </Section>
        )}
      </div>
    </div>
  )
}

const rowStyle: CSSProperties = {
  display: 'block',
  padding: 12,
  marginBottom: 8,
  textDecoration: 'none',
  color: 'var(--ink)',
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div className="eyebrow" style={{ marginBottom: 10 }}>{title}</div>
      {children}
    </div>
  )
}
