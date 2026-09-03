'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Bell } from 'lucide-react'
import { DEMO_NOTIFICATIONS } from '@/lib/demo'
import { getReadNotifIds } from '@/lib/localStore'

export default function NotifBell() {
  const [unread, setUnread] = useState(0)

  useEffect(() => {
    const read = new Set(getReadNotifIds())
    setUnread(DEMO_NOTIFICATIONS.filter(n => !n.is_read && !read.has(n.id)).length)
  }, [])

  return (
    <Link
      href="/notifications"
      style={{
        width: 36,
        height: 36,
        borderRadius: 10,
        background: 'var(--surface)',
        border: '1px solid var(--line)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--muted)',
        textDecoration: 'none',
        position: 'relative',
        flexShrink: 0,
      }}
    >
      <Bell size={16} />
      {unread > 0 && (
        <span
          style={{
            position: 'absolute',
            top: 6,
            right: 6,
            minWidth: 14,
            height: 14,
            padding: '0 3px',
            borderRadius: 999,
            background: 'var(--accent)',
            color: '#fff',
            fontSize: 9,
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1.5px solid var(--bg)',
          }}
        >
          {unread}
        </span>
      )}
    </Link>
  )
}
