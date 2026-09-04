'use client'

import { useEffect, useState } from 'react'
import { Megaphone } from 'lucide-react'
import { getAnnouncements, type ClubAnnouncement } from '@/lib/localStore'

const SEED: ClubAnnouncement[] = [
  {
    id: 'seed-1',
    title: 'Saturday Magadi — dust advisory',
    body: 'Wind from the south. Lights on from Kona Baridi. Extra bottles recommended.',
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    authorName: 'Amina Otieno',
  },
]

export default function AnnouncementsStrip() {
  const [items, setItems] = useState<ClubAnnouncement[]>([])

  useEffect(() => {
    const stored = getAnnouncements()
    setItems(stored.length ? stored : SEED)
  }, [])

  if (items.length === 0) return null

  const top = items[0]

  return (
    <div style={{ padding: '14px 14px 0' }}>
      <div className="eyebrow" style={{ marginBottom: 10 }}>Captain board</div>
      <div
        className="surface"
        style={{
          padding: 14,
          background: 'linear-gradient(135deg, #1C1916 0%, #2A2420 100%)',
          color: '#fff',
          border: 'none',
        }}
      >
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 12,
              background: 'rgba(254,199,46,0.2)',
              display: 'grid',
              placeItems: 'center',
              flexShrink: 0,
            }}
          >
            <Megaphone size={16} color="#FEC72E" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: '-0.01em' }}>{top.title}</div>
            <div style={{ fontSize: 13, opacity: 0.78, marginTop: 6, lineHeight: 1.45 }}>{top.body}</div>
            <div style={{ fontSize: 11, opacity: 0.5, marginTop: 10 }}>
              {top.authorName} · {new Date(top.createdAt).toLocaleString(undefined, { hour: '2-digit', minute: '2-digit', weekday: 'short' })}
            </div>
          </div>
        </div>
        {items.length > 1 && (
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            {items.slice(1, 3).map(a => (
              <div key={a.id} style={{ fontSize: 12, opacity: 0.7, marginBottom: 6, lineHeight: 1.35 }}>
                <span style={{ color: '#FEC72E', fontWeight: 700 }}>{a.title}</span>
                {' — '}
                {a.body.slice(0, 60)}
                {a.body.length > 60 ? '…' : ''}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
