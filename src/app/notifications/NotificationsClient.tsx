'use client'

import { useEffect, useState } from 'react'
import { formatTimeAgo } from '@/lib/utils'
import { CheckCheck } from 'lucide-react'
import Link from 'next/link'
import { getReadNotifIds, markNotifsRead } from '@/lib/localStore'

export default function NotificationsClient({ notifications: initial }: { notifications: any[]; userId: string }) {
  const [notifs, setNotifs] = useState(initial)

  useEffect(() => {
    const read = new Set(getReadNotifIds())
    setNotifs(initial.map(n => ({ ...n, is_read: n.is_read || read.has(n.id) })))
  }, [initial])

  const unread = notifs.filter(n => !n.is_read).length

  function markAll() {
    markNotifsRead(notifs.map(n => n.id))
    setNotifs(prev => prev.map(n => ({ ...n, is_read: true })))
  }

  function openOne(id: string) {
    markNotifsRead([id])
    setNotifs(prev => prev.map(n => (n.id === id ? { ...n, is_read: true } : n)))
  }

  return (
    <div className="page" style={{ paddingBottom: 24 }}>
      {unread > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div className="chip accent">{unread} new</div>
          <button
            onClick={markAll}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              background: 'none',
              border: 'none',
              color: 'var(--ink)',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'var(--font)',
            }}
          >
            <CheckCheck size={14} /> Mark all read
          </button>
        </div>
      )}

      {notifs.map((n: any) => (
        <Link
          key={n.id}
          href={n.link || '/'}
          onClick={() => openOne(n.id)}
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <div
            className="surface pressable"
            style={{
              padding: 14,
              marginBottom: 8,
              background: n.is_read ? 'var(--surface)' : 'linear-gradient(165deg, #FFF8F1, #FFFCFA)',
              borderColor: n.is_read ? 'var(--line)' : 'rgba(254,199,46,0.28)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
              <div style={{ fontSize: 14, fontWeight: 800 }}>{n.title}</div>
              {!n.is_read && <span className="live-dot" style={{ marginTop: 5 }} />}
            </div>
            <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.45 }}>{n.body}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 8, fontWeight: 600 }}>
              {formatTimeAgo(n.created_at)}
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
