'use client'

import { useState } from 'react'
import { Wrench, CheckCircle2, Loader2, MapPin } from 'lucide-react'
import { formatKES } from '@/lib/utils'

const TIME_SLOTS = [
  '7:00 AM – 9:00 AM', '9:00 AM – 11:00 AM',
  '11:00 AM – 1:00 PM', '2:00 PM – 4:00 PM',
  '4:00 PM – 6:00 PM',
]

const STATUS_STEPS = [
  { id: 'pending', label: 'Booking received' },
  { id: 'accepted', label: 'Mechanic assigned' },
  { id: 'mechanic_en_route', label: 'On the way' },
  { id: 'in_progress', label: 'In progress' },
  { id: 'completed', label: 'Completed' },
]

export default function WrenchClient({ services, activeBookings, pastBookings }: {
  services: any[], activeBookings: any[], pastBookings: any[]
}) {
  const [view, setView] = useState<'home' | 'book'>('home')
  const [selectedService, setSelectedService] = useState<any>(null)
  const [date, setDate] = useState('')
  const [timeSlot, setTimeSlot] = useState('')
  const [location, setLocation] = useState('')
  const [bikeInfo, setBikeInfo] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleBook() {
    if (!selectedService || !date || !timeSlot || !location) {
      setError('Please fill in all required fields')
      return
    }
    setLoading(true)
    setError('')

    const res = await fetch('/api/wrench/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        serviceType: selectedService.id,
        requestedDate: date,
        requestedTimeSlot: timeSlot,
        serviceLocationName: location,
        bikeType: bikeInfo,
        description: notes,
        quotedPriceKes: selectedService.price,
      }),
    })

    const data = await res.json()
    if (!res.ok) { setError(data.error || 'Booking failed'); setLoading(false); return }
    setSuccess(true)
    setLoading(false)
    setView('home')
  }

  function getStatusIndex(status: string) {
    return STATUS_STEPS.findIndex(s => s.id === status)
  }

  if (success) {
    return (
      <div className="animate-fade-in" style={{ padding: '40px 24px', textAlign: 'center' }}>
        <CheckCircle2 size={52} color="var(--good)" style={{ margin: '0 auto 16px' }} />
        <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.02em' }}>Booking confirmed</div>
        <div style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 24, lineHeight: 1.6 }}>
          A GRC mechanic will be assigned shortly. You’ll get a ping when they’re on the way.
        </div>
        <button className="btn-primary" onClick={() => setSuccess(false)}>View my bookings</button>
      </div>
    )
  }

  if (view === 'book') {
    return (
      <div className="animate-fade-in" style={{ padding: '0 16px 24px' }}>
        <button
          onClick={() => setView('home')}
          style={{
            background: 'none', border: 'none', color: 'var(--muted)', fontSize: 13,
            cursor: 'pointer', marginBottom: 16, fontFamily: 'var(--font)', fontWeight: 600,
          }}
        >
          ← Back
        </button>

        <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 4 }}>Book a mechanic</div>
        <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>Doorstep service — we come to you</div>

        <div style={{ marginBottom: 18 }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>Select service</div>
          {services.map(svc => {
            const on = selectedService?.id === svc.id
            return (
              <button
                key={svc.id}
                onClick={() => setSelectedService(svc)}
                className="pressable"
                style={{
                  width: '100%', textAlign: 'left',
                  background: on ? 'var(--accent-soft)' : 'var(--surface)',
                  borderRadius: 14,
                  border: `1px solid ${on ? 'rgba(224,122,47,0.45)' : 'var(--line)'}`,
                  padding: '13px 16px', marginBottom: 8, cursor: 'pointer',
                  fontFamily: 'var(--font)', color: 'var(--ink)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 3 }}>{svc.label}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>{svc.desc}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 3 }}>
                      ~{svc.duration}hr{svc.duration > 1 ? 's' : ''}
                    </div>
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: on ? 'var(--accent)' : 'var(--muted)', flexShrink: 0 }}>
                    {formatKES(svc.price)}
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        <div style={{ marginBottom: 14 }}>
          <label className="eyebrow" style={{ display: 'block', marginBottom: 6 }}>Preferred date *</label>
          <input
            className="grc-input"
            type="date"
            value={date}
            min={new Date().toISOString().split('T')[0]}
            onChange={e => setDate(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label className="eyebrow" style={{ display: 'block', marginBottom: 8 }}>Preferred time *</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {TIME_SLOTS.map(slot => {
              const on = timeSlot === slot
              return (
                <button
                  key={slot}
                  onClick={() => setTimeSlot(slot)}
                  style={{
                    padding: '10px 14px', borderRadius: 12, textAlign: 'left',
                    background: on ? 'var(--accent-soft)' : 'var(--surface)',
                    border: `1px solid ${on ? 'rgba(224,122,47,0.4)' : 'var(--line)'}`,
                    color: on ? '#9A4A12' : 'var(--ink)',
                    fontSize: 13, fontWeight: on ? 700 : 500,
                    cursor: 'pointer', fontFamily: 'var(--font)',
                  }}
                >
                  {slot}
                </button>
              )
            })}
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label className="eyebrow" style={{ display: 'block', marginBottom: 6 }}>Service location *</label>
          <div style={{ position: 'relative' }}>
            <MapPin size={15} color="var(--muted)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              className="grc-input"
              placeholder="Estate name, road or landmark"
              value={location}
              onChange={e => setLocation(e.target.value)}
              style={{ paddingLeft: 38 }}
            />
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label className="eyebrow" style={{ display: 'block', marginBottom: 6 }}>Bike (optional)</label>
          <input className="grc-input" placeholder="e.g. Trek Checkpoint gravel, 2022" value={bikeInfo} onChange={e => setBikeInfo(e.target.value)} />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label className="eyebrow" style={{ display: 'block', marginBottom: 6 }}>Notes</label>
          <textarea
            className="grc-input"
            placeholder="Describe the issue or any specific requests..."
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={3}
            style={{ resize: 'none' }}
          />
        </div>

        {error && (
          <div style={{ background: '#FFF5F5', border: '1px solid rgba(179,58,58,0.25)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: 'var(--bad)', marginBottom: 14 }}>
            {error}
          </div>
        )}

        {selectedService && (
          <div className="surface" style={{ padding: 14, marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>Estimated cost</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--accent)' }}>{formatKES(selectedService.price)}</div>
          </div>
        )}

        <button className="btn-primary" onClick={handleBook} disabled={loading}>
          {loading && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />}
          {loading ? 'Booking...' : 'Confirm booking'}
        </button>
        <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--muted)', marginTop: 10 }}>
          Payment collected by mechanic on completion
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in" style={{ padding: '0 16px 24px' }}>
      <div
        style={{
          background: 'linear-gradient(145deg, #1C1916 0%, #2E2924 100%)',
          borderRadius: 22,
          padding: 22,
          marginBottom: 20,
          textAlign: 'center',
          color: '#fff',
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background: 'rgba(224,122,47,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 14px',
          }}
        >
          <Wrench size={22} color="#E07A2F" />
        </div>
        <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 8, color: '#FFFFFF' }}>
          Doorstep Bike Repair
        </div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.72)', lineHeight: 1.6, marginBottom: 18, maxWidth: 280, marginLeft: 'auto', marginRight: 'auto' }}>
          GRC mechanics come to you — at home, at work, or at the trailhead. 100% hassle-free.
        </div>
        <button className="btn-primary" onClick={() => setView('book')}>
          <Wrench size={16} />
          Book a mechanic
        </button>
      </div>

      {activeBookings.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div className="eyebrow" style={{ marginBottom: 12 }}>Active bookings</div>
          {activeBookings.map((booking: any) => {
            const stepIdx = getStatusIndex(booking.status)
            return (
              <div key={booking.id} className="surface" style={{ padding: 16, marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginBottom: 14 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>
                      {services.find(s => s.id === booking.service_type)?.label || booking.service_type}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                      {booking.requested_date} · {booking.requested_time_slot}
                    </div>
                  </div>
                  <span className="chip accent">{booking.status.replace(/_/g, ' ')}</span>
                </div>
                <div style={{ display: 'flex', gap: 0 }}>
                  {STATUS_STEPS.filter(s => s.id !== 'cancelled').map((step, i) => {
                    const done = i <= stepIdx
                    return (
                      <div key={step.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, position: 'relative' }}>
                        {i < STATUS_STEPS.length - 1 && (
                          <div style={{ position: 'absolute', top: 9, left: '50%', width: '100%', height: 2, background: done && i < stepIdx ? 'var(--accent)' : 'var(--line)', zIndex: 0 }} />
                        )}
                        <div style={{
                          width: 20, height: 20, borderRadius: '50%',
                          background: done ? 'var(--accent)' : 'var(--bg)',
                          border: `2px solid ${done ? 'var(--accent)' : 'var(--line)'}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 9, color: '#fff', zIndex: 1, position: 'relative', fontWeight: 800,
                        }}>
                          {done ? '✓' : ''}
                        </div>
                        <div style={{ fontSize: 8, color: done ? 'var(--accent)' : 'var(--muted)', textAlign: 'center', lineHeight: 1.2, fontWeight: 700 }}>
                          {step.label.split(' ')[0]}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {pastBookings.length > 0 && (
        <div>
          <div className="eyebrow" style={{ marginBottom: 12 }}>Past bookings</div>
          {pastBookings.map((booking: any) => (
            <div key={booking.id} className="surface" style={{ padding: 14, marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>
                  {services.find(s => s.id === booking.service_type)?.label || booking.service_type}
                </div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>{booking.requested_date}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                {booking.final_price_kes && (
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)' }}>{formatKES(booking.final_price_kes)}</div>
                )}
                <div style={{ fontSize: 10, color: booking.status === 'completed' ? 'var(--good)' : 'var(--muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  {booking.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
