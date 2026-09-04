'use client'

import { useMemo } from 'react'
import { Users } from 'lucide-react'
import type { LocalRsvp, RollCallRider } from '@/lib/localStore'

export default function PaceBuddies({
  rsvp,
  roster,
}: {
  rsvp: LocalRsvp | null
  roster: RollCallRider[]
}) {
  const buddies = useMemo(() => {
    if (!rsvp) return []
    return roster.filter(
      r => r.paceGroup.toLowerCase() === rsvp.paceGroupName.toLowerCase() || r.paceGroup === rsvp.paceGroupName,
    )
  }, [rsvp, roster])

  if (!rsvp || buddies.length === 0) return null

  return (
    <div className="surface" style={{ padding: 14, marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div className="section-label" style={{ margin: 0 }}>
          <Users size={12} style={{ display: 'inline', verticalAlign: -1, marginRight: 4 }} />
          Your {rsvp.paceGroupName} pack
        </div>
        <span className="chip accent" style={{ border: 'none' }}>{buddies.length}</span>
      </div>
      <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 10, lineHeight: 1.4 }}>
        Gate mates in your pace — find them at roll-out.
      </div>
      {buddies.slice(0, 8).map(r => (
        <div
          key={r.id}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px 0',
            borderTop: '1px solid var(--line)',
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 700 }}>{r.name}</div>
          <span className={r.present ? 'chip accent' : 'chip'} style={{ border: 'none' }}>
            {r.present ? 'HERE' : 'OUT'}
          </span>
        </div>
      ))}
    </div>
  )
}
