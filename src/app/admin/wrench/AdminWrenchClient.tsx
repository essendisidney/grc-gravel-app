'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatKES } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

const STATUS_OPTIONS = ['pending','accepted','mechanic_en_route','in_progress','completed','cancelled']
const STATUS_COLORS: Record<string, string> = {
  pending: '#F5C518', accepted: '#60A5FA', mechanic_en_route: '#A78BFA',
  in_progress: '#FB923C', completed: '#22C55E', cancelled: '#EF4444',
}

export default function AdminWrenchClient({ bookings: initial, mechanics }: { bookings: any[], mechanics: any[] }) {
  const supabase = createClient()
  const [bookings, setBookings] = useState(initial)
  const [updating, setUpdating] = useState<string | null>(null)
  const [filter, setFilter] = useState('pending')

  async function updateBooking(id: string, updates: any) {
    setUpdating(id)
    await supabase.from('repair_bookings').update(updates).eq('id', id)
    setBookings(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b))
    setUpdating(null)
  }

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter)

  return (
    <div>
      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 26, fontWeight: 800, marginBottom: 16 }}>Wrench Bookings</div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
        {['all', ...STATUS_OPTIONS].map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{
            padding: '6px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600,
            cursor: 'pointer', border: '1px solid transparent', fontFamily: "'Space Grotesk', sans-serif",
            background: filter === s ? (STATUS_COLORS[s] || '#F5C518') : '#1A1E2A',
            color: filter === s ? '#0D0F14' : '#8892A4',
            borderColor: filter === s ? 'transparent' : '#1E2436',
            textTransform: 'capitalize',
          }}>
            {s.replace(/_/g, ' ')} {s !== 'all' ? `(${bookings.filter(b => b.status === s).length})` : `(${bookings.length})`}
          </button>
        ))}
      </div>

      {filtered.map((b: any) => (
        <div key={b.id} style={{ background: '#1A1E2A', borderRadius: 16, border: `1px solid ${STATUS_COLORS[b.status] || '#1E2436'}33`, padding: 18, marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#F0F2F5', marginBottom: 3 }}>
                {b.profiles?.full_name || 'Unknown'}
              </div>
              <div style={{ fontSize: 12, color: '#8892A4' }}>{b.profiles?.phone}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#F5C518', marginTop: 4 }}>
                {b.service_type?.replace(/_/g, ' ')}
              </div>
              <div style={{ fontSize: 12, color: '#8892A4', marginTop: 2 }}>
                📍 {b.service_location_name} · {b.requested_date} · {b.requested_time_slot}
              </div>
              {b.description && <div style={{ fontSize: 12, color: '#8892A4', marginTop: 4, fontStyle: 'italic' }}>"{b.description}"</div>}
              {b.bike_type && <div style={{ fontSize: 12, color: '#8892A4', marginTop: 2 }}>🚲 {b.bike_type}</div>}
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 20, fontWeight: 700, color: '#F5C518' }}>
                {b.quoted_price_kes ? formatKES(b.quoted_price_kes) : '—'}
              </div>
              <div style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 5, background: `${STATUS_COLORS[b.status] || '#8892A4'}20`, color: STATUS_COLORS[b.status] || '#8892A4', textTransform: 'uppercase', marginTop: 4, letterSpacing: 0.5 }}>
                {b.status.replace(/_/g, ' ')}
              </div>
            </div>
          </div>

          {/* Assign mechanic */}
          {b.status === 'pending' && mechanics.length > 0 && (
            <div style={{ marginBottom: 10 }}>
              <label style={{ fontSize: 11, color: '#8892A4', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.8 }}>Assign Mechanic</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <select
                  className="grc-input"
                  style={{ flex: 1, appearance: 'none', fontSize: 13 }}
                  onChange={async e => {
                    if (!e.target.value) return
                    await updateBooking(b.id, { mechanic_id: e.target.value, status: 'accepted' })
                  }}
                  defaultValue=""
                >
                  <option value="">Select mechanic...</option>
                  {mechanics.map((m: any) => (
                    <option key={m.id} value={m.id}>{m.profiles?.full_name}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Status update */}
          {b.status !== 'completed' && b.status !== 'cancelled' && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {STATUS_OPTIONS.filter(s => s !== b.status && s !== 'pending').map(s => (
                <button
                  key={s}
                  onClick={() => updateBooking(b.id, { status: s, ...(s === 'completed' ? { completed_at: new Date().toISOString() } : {}) })}
                  disabled={updating === b.id}
                  style={{
                    fontSize: 11, fontWeight: 700, padding: '6px 12px',
                    background: `${STATUS_COLORS[s]}18`, color: STATUS_COLORS[s],
                    border: `1px solid ${STATUS_COLORS[s]}44`, borderRadius: 8,
                    cursor: 'pointer', fontFamily: "'Space Grotesk', sans-serif",
                    textTransform: 'capitalize',
                  }}
                >
                  {updating === b.id ? <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> : null}
                  → {s.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#8892A4' }}>No {filter} bookings</div>
      )}
    </div>
  )
}
