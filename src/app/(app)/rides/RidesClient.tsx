'use client'

import { useMemo, useState } from 'react'
import RideCard from '@/components/rides/RideCard'
import { getPaceBand } from '@/lib/club'
import { formatRideDate } from '@/lib/utils'
import type { Ride } from '@/lib/types/database'

const TYPE_TABS = [
  { id: 'all', label: 'All' },
  { id: 'gravel', label: 'Gravel' },
  { id: 'road', label: 'Road' },
  { id: 'social', label: 'Social' },
  { id: 'youth', label: 'Youth' },
  { id: 'criterium', label: 'Race' },
]

export default function RidesClient({ rides }: { rides: Ride[] }) {
  const [type, setType] = useState('all')

  const filtered = useMemo(
    () => (type === 'all' ? rides : rides.filter(r => r.ride_type === type)),
    [rides, type]
  )

  const groups = useMemo(() => {
    const map = new Map<string, Ride[]>()
    for (const ride of filtered) {
      map.set(ride.ride_date, [...(map.get(ride.ride_date) || []), ride])
    }
    return [...map.entries()]
  }, [filtered])

  return (
    <div>
      <p style={{ padding: '0 16px 10px', fontSize: 13, color: 'var(--muted)', lineHeight: 1.45 }}>
        Clear ride list — distance, pace and start point up front, like a proper club calendar.
      </p>
      <div style={{ display: 'flex', gap: 8, padding: '0 16px 14px', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {TYPE_TABS.map(t => (
          <button key={t.id} className={`chip ${type === t.id ? 'on' : ''}`} onClick={() => setType(t.id)}>{t.label}</button>
        ))}
      </div>
      <div style={{ padding: '0 16px 24px' }}>
        {groups.map(([date, dayRides]) => (
          <div key={date} style={{ marginBottom: 16 }}>
            <div className="section-label" style={{ marginBottom: 8 }}>{formatRideDate(date)}</div>
            {dayRides.map(ride => <RideCard key={ride.id} ride={ride as any} />)}
          </div>
        ))}
      </div>
    </div>
  )
}
