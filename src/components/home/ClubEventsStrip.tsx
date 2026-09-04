'use client'

import Link from 'next/link'
import { CalendarDays } from 'lucide-react'
import { DEMO_CLUB_EVENTS } from '@/lib/demo'
import { formatRideDate } from '@/lib/utils'

export default function ClubEventsStrip({ showMoreLink = true }: { showMoreLink?: boolean }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {showMoreLink && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <CalendarDays size={14} color="var(--accent)" />
          <div className="eyebrow" style={{ margin: 0 }}>
            Club calendar
          </div>
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {DEMO_CLUB_EVENTS.map(ev => (
          <div key={ev.id} className="surface" style={{ padding: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 14 }}>{ev.title}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 3, lineHeight: 1.4 }}>
                  {formatRideDate(ev.when)} · {ev.time} · {ev.place}
                </div>
              </div>
              <span className="chip accent" style={{ border: 'none', flexShrink: 0 }}>
                {ev.kind}
              </span>
            </div>
          </div>
        ))}
      </div>
      {showMoreLink && (
        <Link
          href="/club"
          style={{
            display: 'block',
            marginTop: 10,
            fontSize: 12,
            fontWeight: 700,
            color: 'var(--accent)',
            textDecoration: 'none',
          }}
        >
          More at Club →
        </Link>
      )}
    </div>
  )
}
