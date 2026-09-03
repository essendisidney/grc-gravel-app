'use client'

import { useState } from 'react'
import { Plus, X, Loader2, CheckCircle2 } from 'lucide-react'
import { formatRideDate, getRideTypeBg } from '@/lib/utils'

const RIDE_TYPES = ['gravel', 'road', 'mtb', 'social', 'youth', 'training', 'criterium']
const DIFFICULTIES = ['easy', 'moderate', 'hard', 'elite']
const CLUBHOUSES = [
  { id: 'tena', label: 'The Gravel — Tena Estate' },
  { id: 'utawala', label: 'The Gravel — Utawala' },
  { id: 'external', label: 'External location' },
]

export default function AdminRidesClient({ rides: initial }: { rides: any[] }) {
  const [rides, setRides] = useState(initial)
  const [creating, setCreating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    title: '', description: '', ride_type: 'gravel', difficulty: 'moderate',
    ride_date: '', start_time: '', estimated_end_time: '',
    start_location_name: '', start_location_address: '', clubhouse: 'tena',
    distance_km: '', elevation_gain_m: '', max_participants: '',
    status: 'published', tags: '',
  })

  function update(k: string, v: string) { setForm(f => ({ ...f, [k]: v })) }

  async function handleCreate() {
    if (!form.title || !form.ride_date || !form.start_time || !form.start_location_name) return
    setSaving(true)

    const ride = {
      id: `local-${Date.now()}`,
      ...form,
      distance_km: form.distance_km ? parseFloat(form.distance_km) : null,
      elevation_gain_m: form.elevation_gain_m ? parseInt(form.elevation_gain_m) : null,
      max_participants: form.max_participants ? parseInt(form.max_participants) : null,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()) : [],
    }
    setRides(prev => [ride, ...prev])
    setCreating(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
    setSaving(false)
  }

  async function handleCancel(rideId: string) {
    if (!confirm('Cancel this ride?')) return
    setRides(prev => prev.map(r => r.id === rideId ? { ...r, status: 'cancelled' } : r))
  }

  const labelStyle = { fontSize: 11, color: '#8892A4', display: 'block', marginBottom: 5, fontWeight: 500 as const, textTransform: 'uppercase' as const, letterSpacing: 0.8 }
  const inputStyle = { marginBottom: 12 }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 26, fontWeight: 800 }}>Rides</div>
        <button onClick={() => setCreating(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#F5C518', color: '#0D0F14', border: 'none', borderRadius: 10, padding: '9px 14px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: "'Space Grotesk', sans-serif" }}>
          <Plus size={15} /> New Ride
        </button>
      </div>

      {saved && (
        <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#22C55E', marginBottom: 14, display: 'flex', gap: 8, alignItems: 'center' }}>
          <CheckCircle2 size={15} /> Ride created successfully!
        </div>
      )}

      {/* Create form */}
      {creating && (
        <div style={{ background: '#1A1E2A', borderRadius: 16, border: '1px solid rgba(245,197,24,0.2)', padding: 20, marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 20, fontWeight: 700 }}>Create New Ride</div>
            <button onClick={() => setCreating(false)} style={{ background: 'none', border: 'none', color: '#8892A4', cursor: 'pointer' }}><X size={18} /></button>
          </div>

          <div style={inputStyle}><label style={labelStyle}>Title *</label><input className="grc-input" placeholder="Full Gas Criterium #15" value={form.title} onChange={e => update('title', e.target.value)} /></div>
          <div style={inputStyle}><label style={labelStyle}>Description</label><textarea className="grc-input" placeholder="Describe the ride..." value={form.description} onChange={e => update('description', e.target.value)} rows={2} style={{ resize: 'none' }} /></div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
            <div>
              <label style={labelStyle}>Ride Type *</label>
              <select className="grc-input" value={form.ride_type} onChange={e => update('ride_type', e.target.value)} style={{ appearance: 'none' }}>
                {RIDE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Difficulty</label>
              <select className="grc-input" value={form.difficulty} onChange={e => update('difficulty', e.target.value)} style={{ appearance: 'none' }}>
                {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
            <div><label style={labelStyle}>Date *</label><input className="grc-input" type="date" value={form.ride_date} onChange={e => update('ride_date', e.target.value)} /></div>
            <div><label style={labelStyle}>Start Time *</label><input className="grc-input" type="time" value={form.start_time} onChange={e => update('start_time', e.target.value)} /></div>
          </div>

          <div style={inputStyle}><label style={labelStyle}>Start Location *</label><input className="grc-input" placeholder="Karura Forest Main Gate" value={form.start_location_name} onChange={e => update('start_location_name', e.target.value)} /></div>

          <div style={inputStyle}>
            <label style={labelStyle}>Clubhouse</label>
            <select className="grc-input" value={form.clubhouse} onChange={e => update('clubhouse', e.target.value)} style={{ appearance: 'none' }}>
              {CLUBHOUSES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 12 }}>
            <div><label style={labelStyle}>Distance (km)</label><input className="grc-input" type="number" placeholder="42" value={form.distance_km} onChange={e => update('distance_km', e.target.value)} /></div>
            <div><label style={labelStyle}>Elevation (m)</label><input className="grc-input" type="number" placeholder="800" value={form.elevation_gain_m} onChange={e => update('elevation_gain_m', e.target.value)} /></div>
            <div><label style={labelStyle}>Max Riders</label><input className="grc-input" type="number" placeholder="100" value={form.max_participants} onChange={e => update('max_participants', e.target.value)} /></div>
          </div>

          <div style={inputStyle}>
            <label style={labelStyle}>Status</label>
            <select className="grc-input" value={form.status} onChange={e => update('status', e.target.value)} style={{ appearance: 'none' }}>
              <option value="published">Published (visible to members)</option>
              <option value="draft">Draft (hidden)</option>
            </select>
          </div>

          <button className="btn-primary" onClick={handleCreate} disabled={saving || !form.title || !form.ride_date || !form.start_time || !form.start_location_name}>
            {saving && <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />}
            {saving ? 'Creating...' : 'Create Ride'}
          </button>
        </div>
      )}

      {/* Rides list */}
      {rides.map((ride: any) => (
        <div key={ride.id} style={{ background: '#1A1E2A', borderRadius: 14, border: `1px solid ${ride.status === 'cancelled' ? 'rgba(239,68,68,0.2)' : '#1E2436'}`, padding: 14, marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
            <div style={{ flex: 1, marginRight: 10 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: ride.status === 'cancelled' ? '#8892A4' : '#F0F2F5', marginBottom: 3, textDecoration: ride.status === 'cancelled' ? 'line-through' : 'none' }}>
                {ride.title}
              </div>
              <div style={{ fontSize: 11, color: '#8892A4' }}>
                {ride.ride_date} · {ride.start_time?.slice(0,5)} · {ride.start_location_name}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
              <span className={getRideTypeBg(ride.ride_type)} style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 5, textTransform: 'uppercase' as const }}>
                {ride.ride_type}
              </span>
              {ride.status === 'published' && (
                <button onClick={() => handleCancel(ride.id)} style={{ fontSize: 10, fontWeight: 700, padding: '4px 9px', background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 6, cursor: 'pointer', fontFamily: "'Space Grotesk', sans-serif" }}>
                  Cancel
                </button>
              )}
              {ride.status === 'cancelled' && (
                <span style={{ fontSize: 10, color: '#EF4444', fontWeight: 600 }}>Cancelled</span>
              )}
            </div>
          </div>
        </div>
      ))}

      {rides.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#8892A4' }}>No rides yet. Create your first one!</div>
      )}
    </div>
  )
}
