'use client'

import { useState } from 'react'
import { formatTimeAgo } from '@/lib/utils'
import { CheckCheck } from 'lucide-react'
import Link from 'next/link'

export default function NotificationsClient({ notifications: initial }: { notifications: any[], userId: string }) {
  const [notifs, setNotifs] = useState(initial)
  const unread = notifs.filter(n => !n.is_read).length

  return (
    <div style={{ padding: '0 16px 24px' }}>
      {unread > 0 && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
          <button
            onClick={() => setNotifs(prev => prev.map(n => ({ ...n, is_read: true })))}
            style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', color: 'var(--navy)', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font)' }}
          >
            <CheckCheck size={14} /> Mark all read
          </button>
        </div>
      )}
      {notifs.map((n: any) => (
        <Link key={n.id} href={n.link || '/'} style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="surface" style={{ padding: 14, marginBottom: 8, background: n.is_read ? '#fff' : '#FFF9E8' }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{n.title}</div>
            <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.45 }}>{n.body}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 8 }}>{formatTimeAgo(n.created_at)}</div>
          </div>
        </Link>
      ))}
    </div>
  )
}
