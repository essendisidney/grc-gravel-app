'use client'

import { useEffect, useMemo, useState } from 'react'
import RideCard from '@/components/rides/RideCard'
import { formatRideDate } from '@/lib/utils'
import { getSavedRideIds } from '@/lib/localStore'
import type { Ride } from '@/lib/types/database'

const TYPE_TABS = [
  { id: 'all', label: 'All' },
  { id: 'saved', label: 'Saved' },
  { id: 'gravel', label: 'Gravel' },
  { id: 'road', label: 'Road' },
  { id: 'social', label: 'Social' },
  { id: 'youth', label: 'Youth' },
  { id: 'criterium', label: 'Race' },
]

export default function RidesClient({ rides }: { rides: Ride[] }) {
  const [type, setType] = useState('all')
  const [savedIds, setSavedIds] = useState<string[]>([])

  useEffect(() => {
    setSavedIds(getSavedRideIds())
  }, [])

  const filtered = useMemo(() => {
    if (type === 'saved') return rides.filter(r => savedIds.includes(r.id))
    if (type === 'all') return rides
    return rides.filter(r => r.ride_type === type)
  }, [rides, type, savedIds])

  const groups = useMemo(() => {
    const map = new Map<string, Ride[]>()
    for (const ride of filtered) {
      map.set(ride.ride_date, [...(map.get(ride.ride_date) || []), ride])
    }
    return [...map.entries()]
  }, [filtered])

  return (
    <div>
      <p style={{ padding: '0 var(--page-x) 10px', fontSize: 13, color: 'var(--muted)', lineHeight: 1.45 }}>
        Clear ride list — save rides for later, filter by type like a club calendar.
      </p>
      <div style={{ display: 'flex', gap: 8, padding: '0 var(--page-x) 14px', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {TYPE_TABS.map(t => (
          <button
            key={t.id}
            type="button"
            className={type === t.id ? 'chip accent' : 'chip'}
            style={{ border: 'none', cursor: 'pointer', flexShrink: 0 }}
            onClick={() => setType(t.id)}
          >
            {t.label}
            {t.id === 'saved' && savedIds.length > 0 ? ` · ${savedIds.length}` : ''}
          </button>
        ))}
      </div>
      <div style={{ padding: '0 var(--page-x) 24px' }}>
        {groups.length === 0 && (
          <div className="surface" style={{ padding: 16, color: 'var(--muted)', fontSize: 13 }}>
            {type === 'saved' ? 'No saved rides yet — open a ride and tap Save.' : 'Hakuna rides for that filter.'}
          </div>
        )}
        {groups.map(([date, dayRides]) => (
          <div key={date} style={{ marginBottom: 16 }}>
            <div className="section-label" style={{ marginBottom: 8 }}>{formatRideDate(date)}</div>
            {dayRides.map(ride => (
              <RideCard key={ride.id} ride={ride as any} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
