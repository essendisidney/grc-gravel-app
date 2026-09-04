'use client'

import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import TopBar from '@/components/layout/TopBar'
import { DEMO_MEMBERS } from '@/lib/demo'
import { getInitials } from '@/lib/utils'

export default function MembersClient() {
  const [q, setQ] = useState('')
  const [tier, setTier] = useState('All')
  const [house, setHouse] = useState('All')

  const tiers = ['All', 'elite', 'founding', 'gold', 'member', 'junior']
  const houses = ['All', 'tena', 'utawala']

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return DEMO_MEMBERS.filter(m => {
      if (tier !== 'All' && m.membership_tier !== tier) return false
      if (house !== 'All' && m.clubhouse !== house) return false
      if (!needle) return true
      return (
        m.full_name.toLowerCase().includes(needle) ||
        m.membership_number.toLowerCase().includes(needle) ||
        (m.title || '').toLowerCase().includes(needle)
      )
    })
  }, [q, tier, house])

  return (
    <div>
      <TopBar showBack title="Members" backHref="/club" showNotifications={false} />
      <div className="animate-fade-in" style={{ padding: '0 16px 28px' }}>
        <div className="eyebrow" style={{ color: 'var(--accent)', marginBottom: 6 }}>Wave 8</div>
        <h1 style={{ margin: '0 0 12px', fontSize: 24, fontWeight: 800 }}>Directory</h1>

        <div style={{ position: 'relative', marginBottom: 12 }}>
          <Search size={16} color="var(--muted)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            className="grc-input"
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search name, bib, title…"
            style={{ paddingLeft: 40 }}
          />
        </div>

        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', scrollbarWidth: 'none', marginBottom: 8 }}>
          {tiers.map(t => (
            <button
              key={t}
              type="button"
              className={tier === t ? 'chip accent' : 'chip'}
              style={{ border: 'none', cursor: 'pointer', flexShrink: 0, textTransform: 'capitalize' }}
              onClick={() => setTier(t)}
            >
              {t}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
          {houses.map(h => (
            <button
              key={h}
              type="button"
              className={house === h ? 'chip accent' : 'chip'}
              style={{ border: 'none', cursor: 'pointer', textTransform: 'capitalize' }}
              onClick={() => setHouse(h)}
            >
              {h === 'All' ? 'All houses' : h}
            </button>
          ))}
        </div>

        <div className="eyebrow" style={{ marginBottom: 10 }}>{list.length} riders</div>
        {list.map(m => (
          <div key={m.id} className="surface" style={{ padding: 12, marginBottom: 8, display: 'flex', gap: 12, alignItems: 'center' }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                background: m.is_elite_team ? 'var(--accent)' : 'var(--charcoal)',
                color: '#fff',
                display: 'grid',
                placeItems: 'center',
                fontWeight: 800,
                fontSize: 13,
                flexShrink: 0,
              }}
            >
              {getInitials(m.full_name)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 800, fontSize: 14 }}>{m.full_name}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                {m.title} · {m.membership_number}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              {m.is_elite_team && <span className="chip accent" style={{ border: 'none', marginBottom: 4 }}>Elite</span>}
              <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'capitalize' }}>{m.clubhouse}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
