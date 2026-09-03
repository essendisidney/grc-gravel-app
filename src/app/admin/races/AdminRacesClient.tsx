'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatFullDate, formatKES } from '@/lib/utils'
import { Plus, X, Loader2, ChevronDown, ChevronUp } from 'lucide-react'

const RACE_STATUSES = ['draft', 'upcoming', 'registration_open', 'registration_closed', 'live', 'completed', 'cancelled']
const STATUS_COLORS: Record<string, string> = {
  draft: '#8892A4', upcoming: '#60A5FA', registration_open: '#22C55E',
  registration_closed: '#FB923C', live: '#EF4444', completed: '#8892A4', cancelled: '#EF4444',
}

const DEFAULT_CATEGORIES = [
  { id: 'cat_a', name: 'Cat A — Elite', description: 'Elite riders', max_slots: 40, fee_kes: 500 },
  { id: 'cat_b', name: 'Cat B — Sport', description: 'Competitive riders', max_slots: 50, fee_kes: 300 },
  { id: 'cat_c', name: 'Cat C — Social', description: 'All welcome', max_slots: 30, fee_kes: 200 },
]

export default function AdminRacesClient({ races: initial }: { races: any[] }) {
  const supabase = createClient()
  const [races, setRaces] = useState(initial)
  const [creating, setCreating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [expandedRace, setExpandedRace] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    edition_number: '',
    title: '',
    race_date: '',
    start_time: '',
    venue_name: '',
    venue_address: '',
    description: '',
    registration_opens_at: '',
    registration_closes_at: '',
  })

  function update(k: string, v: string) { setForm(f => ({ ...f, [k]: v })) }

  async function handleCreate() {
    if (!form.title || !form.race_date || !form.venue_name || !form.edition_number) return
    setSaving(true)

    const data = {
      id: `race-${Date.now()}`,
      series_name: 'Full Gas Criterium',
      edition_number: parseInt(form.edition_number),
      title: form.title,
      race_date: form.race_date,
      start_time: form.start_time || null,
      venue_name: form.venue_name,
      venue_address: form.venue_address || null,
      description: form.description || null,
      categories: DEFAULT_CATEGORIES,
      status: 'upcoming',
      total_registered: 0,
    }
    setRaces(prev => [data, ...prev])
    setCreating(false)
    setSaving(false)
    setForm({ edition_number: '', title: '', race_date: '', start_time: '', venue_name: '', venue_address: '', description: '', registration_opens_at: '', registration_closes_at: '' })
  }

  async function updateStatus(raceId: string, status: string) {
    setUpdatingId(raceId)
    setRaces(prev => prev.map(r => r.id === raceId ? { ...r, status } : r))
    setUpdatingId(null)
  }

  async function publishResults(raceId: string) {
    setRaces(prev => prev.map(r => r.id === raceId ? { ...r, results_published: true } : r))
  }

  const labelStyle = {
    fontSize: 11, color: '#8892A4', display: 'block' as const,
    marginBottom: 5, fontWeight: 500 as const,
    textTransform: 'uppercase' as const, letterSpacing: 0.8,
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 26, fontWeight: 800 }}>Races</div>
        <button
          onClick={() => setCreating(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: '#EF4444', color: '#fff', border: 'none',
            borderRadius: 10, padding: '9px 14px', fontSize: 13,
            fontWeight: 700, cursor: 'pointer', fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          <Plus size={15} /> New Race
        </button>
      </div>

      {/* Create form */}
      {creating && (
        <div style={{ background: '#1A1E2A', borderRadius: 16, border: '1px solid rgba(239,68,68,0.3)', padding: 20, marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 20, fontWeight: 700 }}>New Race Event</div>
            <button onClick={() => setCreating(false)} style={{ background: 'none', border: 'none', color: '#8892A4', cursor: 'pointer' }}><X size={18} /></button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 10, marginBottom: 12 }}>
            <div>
              <label style={labelStyle}>Edition #</label>
              <input className="grc-input" type="number" placeholder="15" value={form.edition_number} onChange={e => update('edition_number', e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Title *</label>
              <input className="grc-input" placeholder="Full Gas Criterium #15" value={form.title} onChange={e => update('title', e.target.value)} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
            <div><label style={labelStyle}>Race Date *</label><input className="grc-input" type="date" value={form.race_date} onChange={e => update('race_date', e.target.value)} /></div>
            <div><label style={labelStyle}>Start Time</label><input className="grc-input" type="time" value={form.start_time} onChange={e => update('start_time', e.target.value)} /></div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>Venue Name *</label>
            <input className="grc-input" placeholder="Karura Forest Circuit" value={form.venue_name} onChange={e => update('venue_name', e.target.value)} />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>Venue Address</label>
            <input className="grc-input" placeholder="Karura Forest, Nairobi" value={form.venue_address} onChange={e => update('venue_address', e.target.value)} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
            <div><label style={labelStyle}>Registration Opens</label><input className="grc-input" type="datetime-local" value={form.registration_opens_at} onChange={e => update('registration_opens_at', e.target.value)} /></div>
            <div><label style={labelStyle}>Registration Closes</label><input className="grc-input" type="datetime-local" value={form.registration_closes_at} onChange={e => update('registration_closes_at', e.target.value)} /></div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Description</label>
            <textarea className="grc-input" placeholder="Describe the race..." value={form.description} onChange={e => update('description', e.target.value)} rows={2} style={{ resize: 'none' }} />
          </div>

          {/* Default categories preview */}
          <div style={{ background: '#252B3B', borderRadius: 10, padding: 12, marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: '#8892A4', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.8 }}>Default Categories (auto-created)</div>
            {DEFAULT_CATEGORIES.map(cat => (
              <div key={cat.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#F0F2F5', marginBottom: 4 }}>
                <span>{cat.name}</span>
                <span style={{ color: '#8892A4' }}>{cat.max_slots} slots · {formatKES(cat.fee_kes)}</span>
              </div>
            ))}
          </div>

          <button className="btn-primary" onClick={handleCreate} disabled={saving || !form.title || !form.race_date || !form.venue_name || !form.edition_number} style={{ background: '#EF4444' }}>
            {saving && <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />}
            {saving ? 'Creating...' : 'Create Race Event'}
          </button>
        </div>
      )}

      {/* Race list */}
      {races.map((race: any) => {
        const isExpanded = expandedRace === race.id
        const cats: any[] = race.categories || []
        const statusColor = STATUS_COLORS[race.status] || '#8892A4'

        return (
          <div key={race.id} style={{ background: '#1A1E2A', borderRadius: 16, border: `1px solid ${statusColor}33`, marginBottom: 12, overflow: 'hidden' }}>
            {/* Race header */}
            <div
              style={{ padding: 16, cursor: 'pointer' }}
              onClick={() => setExpandedRace(isExpanded ? null : race.id)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, color: '#EF4444', fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 4 }}>
                    Full Gas Criterium · #{race.edition_number}
                  </div>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 20, fontWeight: 700, color: '#F0F2F5', marginBottom: 4 }}>
                    {race.title}
                  </div>
                  <div style={{ fontSize: 12, color: '#8892A4' }}>
                    {formatFullDate(race.race_date)}
                    {race.start_time && ` · ${race.start_time.slice(0, 5)}`}
                    {' · '}{race.venue_name}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                  <span style={{ fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 5, background: `${statusColor}18`, color: statusColor, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    {race.status.replace(/_/g, ' ')}
                  </span>
                  <span style={{ fontSize: 12, color: '#F5C518', fontWeight: 600 }}>
                    {race.total_registered} registered
                  </span>
                  {isExpanded ? <ChevronUp size={14} color="#8892A4" /> : <ChevronDown size={14} color="#8892A4" />}
                </div>
              </div>
            </div>

            {/* Expanded details */}
            {isExpanded && (
              <div style={{ borderTop: '1px solid #1E2436', padding: 16 }}>

                {/* Category breakdown */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 11, color: '#8892A4', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Categories</div>
                  {cats.map((cat: any) => (
                    <div key={cat.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #1E2436' }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#F0F2F5' }}>{cat.name}</div>
                        <div style={{ fontSize: 11, color: '#8892A4' }}>{cat.max_slots} slots · {formatKES(cat.fee_kes)}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Status controls */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 11, color: '#8892A4', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Change Status</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {RACE_STATUSES.filter(s => s !== race.status).map(s => (
                      <button
                        key={s}
                        onClick={() => updateStatus(race.id, s)}
                        disabled={updatingId === race.id}
                        style={{
                          fontSize: 11, fontWeight: 600, padding: '6px 12px',
                          background: `${STATUS_COLORS[s] || '#8892A4'}18`,
                          color: STATUS_COLORS[s] || '#8892A4',
                          border: `1px solid ${STATUS_COLORS[s] || '#8892A4'}44`,
                          borderRadius: 8, cursor: 'pointer',
                          fontFamily: "'Space Grotesk', sans-serif",
                          textTransform: 'capitalize',
                        }}
                      >
                        {updatingId === race.id
                          ? <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} />
                          : `→ ${s.replace(/_/g, ' ')}`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Publish results */}
                {race.status === 'completed' && !race.results_published && (
                  <button
                    onClick={() => publishResults(race.id)}
                    style={{
                      width: '100%', padding: '10px', background: 'rgba(34,197,94,0.12)',
                      border: '1px solid rgba(34,197,94,0.3)', borderRadius: 10,
                      color: '#22C55E', fontWeight: 700, fontSize: 13,
                      cursor: 'pointer', fontFamily: "'Space Grotesk', sans-serif",
                    }}
                  >
                    ✓ Publish Results
                  </button>
                )}
                {race.results_published && (
                  <div style={{ fontSize: 12, color: '#22C55E', textAlign: 'center' }}>
                    ✓ Results published
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}

      {races.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#8892A4' }}>
          No race events yet. Create the next Full Gas Criterium!
        </div>
      )}
    </div>
  )
}
