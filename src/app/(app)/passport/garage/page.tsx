'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Bike, Plus, Star, Trash2, Wrench } from 'lucide-react'
import TopBar from '@/components/layout/TopBar'
import {
  addBike,
  addBikeService,
  getBikeServices,
  getBikes,
  removeBike,
  setPrimaryBike,
  type BikeService,
  type GarageBike,
} from '@/lib/localStore'
import TirePsiGuide from '@/components/passport/TirePsiGuide'

const TYPES: GarageBike['type'][] = ['gravel', 'road', 'mtb', 'hybrid']
const SERVICE_KINDS: BikeService['kind'][] = ['tune', 'tires', 'chain', 'brake', 'other']

export default function GaragePage() {
  const [bikes, setBikes] = useState<GarageBike[]>([])
  const [services, setServices] = useState<BikeService[]>([])
  const [open, setOpen] = useState(false)
  const [serviceBike, setServiceBike] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [brand, setBrand] = useState('')
  const [type, setType] = useState<GarageBike['type']>('gravel')
  const [tireMm, setTireMm] = useState('40')
  const [kind, setKind] = useState<BikeService['kind']>('tune')
  const [note, setNote] = useState('')

  useEffect(() => {
    setBikes(getBikes())
    setServices(getBikeServices())
  }, [])

  function save() {
    if (!name.trim() || !brand.trim()) return
    const next = addBike({
      id: `bike_${Date.now()}`,
      name: name.trim(),
      brand: brand.trim(),
      type,
      tireMm: Number(tireMm) || undefined,
      isPrimary: bikes.length === 0,
    })
    setBikes(next)
    setName('')
    setBrand('')
    setOpen(false)
  }

  function logService() {
    if (!serviceBike || !note.trim()) return
    const next = addBikeService({
      id: `svc_${Date.now()}`,
      bikeId: serviceBike,
      kind,
      note: note.trim(),
      at: new Date().toISOString(),
    })
    setServices(getBikeServices())
    setNote('')
    setServiceBike(null)
    void next
  }

  return (
    <div>
      <TopBar showBack title="Bike garage" backHref="/passport" showNotifications={false} />
      <div className="page animate-fade-in">
        <div className="eyebrow" style={{ color: 'var(--accent)', marginBottom: 6 }}>Wave 15</div>
        <h1 style={{ margin: '0 0 8px', fontSize: 26, fontWeight: 800 }}>Your fleet</h1>
        <p style={{ margin: '0 0 16px', fontSize: 14, color: 'var(--muted)', lineHeight: 1.45 }}>
          Primary bike, service log, and PSI starting points for gravel.
        </p>

        <TirePsiGuide tireMm={bikes.find(b => b.isPrimary)?.tireMm || 40} />

        {bikes.map(b => {
          const logs = services.filter(s => s.bikeId === b.id).slice(0, 2)
          return (
            <div
              key={b.id}
              className="surface"
              style={{
                padding: 14,
                marginBottom: 10,
                border: b.isPrimary ? '1px solid rgba(254,199,46,0.45)' : '1px solid var(--line)',
                background: b.isPrimary ? 'var(--accent-soft)' : 'var(--surface)',
              }}
            >
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 14,
                    background: 'var(--charcoal)',
                    color: '#fff',
                    display: 'grid',
                    placeItems: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Bike size={18} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 800, fontSize: 15 }}>{b.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 3 }}>
                    {b.brand} · {b.type}
                    {b.tireMm ? ` · ${b.tireMm} mm` : ''}
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                    {!b.isPrimary && (
                      <button
                        type="button"
                        className="chip"
                        style={{ border: 'none', cursor: 'pointer' }}
                        onClick={() => setBikes(setPrimaryBike(b.id))}
                      >
                        <Star size={12} /> Make primary
                      </button>
                    )}
                    {b.isPrimary && (
                      <span className="chip accent" style={{ border: 'none' }}>
                        <Star size={12} /> Primary
                      </span>
                    )}
                    <button
                      type="button"
                      className="chip"
                      style={{ border: 'none', cursor: 'pointer' }}
                      onClick={() => setServiceBike(serviceBike === b.id ? null : b.id)}
                    >
                      <Wrench size={12} /> Service
                    </button>
                    <button
                      type="button"
                      className="chip"
                      style={{ border: 'none', cursor: 'pointer', color: 'var(--bad)' }}
                      onClick={() => {
                        setBikes(removeBike(b.id))
                        setServices(getBikeServices())
                      }}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                  {logs.map(s => (
                    <div key={s.id} style={{ fontSize: 11, color: 'var(--muted)', marginTop: 8 }}>
                      {s.kind} · {s.note} · {new Date(s.at).toLocaleDateString()}
                    </div>
                  ))}
                </div>
              </div>

              {serviceBike === b.id && (
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--line)' }}>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                    {SERVICE_KINDS.map(k => (
                      <button
                        key={k}
                        type="button"
                        className={kind === k ? 'chip accent' : 'chip'}
                        style={{ border: 'none', cursor: 'pointer', textTransform: 'capitalize' }}
                        onClick={() => setKind(k)}
                      >
                        {k}
                      </button>
                    ))}
                  </div>
                  <input
                    className="grc-input"
                    placeholder="e.g. Fresh GP5000s, 40 psi"
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    style={{ marginBottom: 8 }}
                  />
                  <button type="button" className="btn-primary" onClick={logService}>
                    Log service
                  </button>
                </div>
              )}
            </div>
          )
        })}

        {!open ? (
          <button type="button" className="btn-primary" onClick={() => setOpen(true)}>
            <Plus size={16} /> Add bike
          </button>
        ) : (
          <div className="surface" style={{ padding: 14 }}>
            <input
              className="grc-input"
              placeholder="Nickname — e.g. Magadi weapon"
              value={name}
              onChange={e => setName(e.target.value)}
              style={{ marginBottom: 8 }}
            />
            <input
              className="grc-input"
              placeholder="Brand / model"
              value={brand}
              onChange={e => setBrand(e.target.value)}
              style={{ marginBottom: 8 }}
            />
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
              {TYPES.map(t => (
                <button
                  key={t}
                  type="button"
                  className={type === t ? 'chip accent' : 'chip'}
                  style={{ border: 'none', cursor: 'pointer', textTransform: 'capitalize' }}
                  onClick={() => setType(t)}
                >
                  {t}
                </button>
              ))}
            </div>
            <input
              className="grc-input"
              type="number"
              placeholder="Tire width (mm)"
              value={tireMm}
              onChange={e => setTireMm(e.target.value)}
              style={{ marginBottom: 10 }}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="button" className="btn-primary" style={{ flex: 1 }} onClick={save}>
                Save bike
              </button>
              <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}

        <Link
          href="/passport"
          style={{
            display: 'block',
            textAlign: 'center',
            marginTop: 16,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--muted)',
            textDecoration: 'none',
          }}
        >
          Back to passport
        </Link>
      </div>
    </div>
  )
}
