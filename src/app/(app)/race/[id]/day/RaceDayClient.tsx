'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Flag, Check } from 'lucide-react'
import TopBar from '@/components/layout/TopBar'
import { DEMO_RACES } from '@/lib/demo'
import {
  getRaceCheckIns,
  getRaceEntry,
  toggleRaceCheckIn,
  type RaceCheckIn,
  type RaceEntry,
} from '@/lib/localStore'

const START_LIST = [
  { bib: 12, name: 'Victor Dawa', cat: 'Cat A' },
  { bib: 21, name: 'Amina Otieno', cat: 'Cat A' },
  { bib: 34, name: 'James Njoroge', cat: 'Cat B' },
  { bib: 45, name: 'Mercy Njeri', cat: 'Women' },
  { bib: 52, name: 'Sam Kariuki', cat: 'Cat B' },
  { bib: 63, name: 'Brian Kamau', cat: 'Junior' },
  { bib: 71, name: 'Faith Wanjiku', cat: 'Women' },
  { bib: 88, name: 'Leo Otieno', cat: 'Cat A' },
]

export default function RaceDayClient({ raceId }: { raceId: string }) {
  const race = useMemo(() => DEMO_RACES.find(r => r.id === raceId), [raceId])
  const [entry, setEntry] = useState<RaceEntry | null>(null)
  const [checkIns, setCheckIns] = useState<RaceCheckIn[]>([])
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    setEntry(getRaceEntry(raceId))
    setCheckIns(getRaceCheckIns(raceId))
  }, [raceId])

  if (!race) {
    return (
      <div>
        <TopBar showBack title="Race day" backHref="/race" />
        <p style={{ padding: 24, color: 'var(--muted)' }}>Race not found.</p>
      </div>
    )
  }

  const cats = ['All', ...race.categories.map(c => c.name)]
  const list = START_LIST.filter(r => filter === 'All' || r.cat === filter)
  const checked = new Set(checkIns.map(c => c.bib))

  function toggle(bib: number, name: string) {
    setCheckIns(toggleRaceCheckIn(raceId, bib, name))
  }

  return (
    <div>
      <TopBar showBack title="Race day" showNotifications={false} backHref={`/race/${raceId}`} />
      <div className="animate-fade-in" style={{ padding: '0 16px 28px' }}>
        <div className="eyebrow" style={{ color: 'var(--accent)', marginBottom: 6 }}>Wave 7 · Full Gas</div>
        <h1 style={{ margin: '0 0 6px', fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em' }}>
          {race.title}
        </h1>
        <p style={{ margin: '0 0 14px', fontSize: 13, color: 'var(--muted)' }}>
          {race.venue_name} · start list + gate check-in
        </p>

        {entry ? (
          <div
            className="surface"
            style={{
              padding: 14,
              marginBottom: 14,
              background: 'linear-gradient(165deg, #FFF8F1, #FFFCFA)',
              border: '1px solid rgba(224,122,47,0.35)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div className="eyebrow" style={{ marginBottom: 4 }}>Your bib</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--accent)' }}>#{entry.bib}</div>
                <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>{entry.categoryName}</div>
              </div>
              <Flag size={28} color="var(--accent)" />
            </div>
          </div>
        ) : (
          <Link
            href={`/race/${raceId}`}
            className="btn-secondary"
            style={{ textDecoration: 'none', display: 'flex', marginBottom: 14 }}
          >
            Register first · get a bib
          </Link>
        )}

        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', scrollbarWidth: 'none', marginBottom: 12 }}>
          {cats.map(c => (
            <button
              key={c}
              type="button"
              onClick={() => setFilter(c)}
              className={filter === c ? 'chip accent' : 'chip'}
              style={{ border: 'none', cursor: 'pointer', flexShrink: 0 }}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="eyebrow" style={{ marginBottom: 10 }}>
          Start list · {checked.size} checked in
        </div>
        {list.map(r => {
          const on = checked.has(r.bib)
          return (
            <button
              key={r.bib}
              type="button"
              onClick={() => toggle(r.bib, r.name)}
              className="surface"
              style={{
                width: '100%',
                padding: 12,
                marginBottom: 8,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 10,
                cursor: 'pointer',
                border: on ? '1px solid rgba(47,125,75,0.35)' : '1px solid var(--line)',
                background: on ? 'rgba(47,125,75,0.08)' : 'var(--surface)',
                fontFamily: 'var(--font)',
                color: 'var(--ink)',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    background: on ? 'var(--good)' : 'var(--charcoal)',
                    color: '#fff',
                    display: 'grid',
                    placeItems: 'center',
                    fontWeight: 800,
                    fontSize: 13,
                  }}
                >
                  {on ? <Check size={18} /> : r.bib}
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 14 }}>{r.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>{r.cat}</div>
                </div>
              </div>
              <span className={on ? 'chip accent' : 'chip'} style={{ border: 'none' }}>
                {on ? 'IN' : 'OUT'}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
