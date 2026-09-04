'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, CheckCircle2 } from 'lucide-react'
import {
  getEmergencyContact,
  getSession,
  setEmergencyContact,
  setSession,
} from '@/lib/localStore'

export default function ProfileEditClient({ profile }: { profile: any }) {
  const router = useRouter()
  const emergency = typeof window !== 'undefined' ? getEmergencyContact() : null
  const session = typeof window !== 'undefined' ? getSession() : null

  const [form, setForm] = useState({
    full_name: session?.fullName || profile?.full_name || '',
    username: profile?.username || '',
    phone: session?.phone || profile?.phone || '',
    bio: profile?.bio || '',
    emergency_contact_name: emergency?.name || profile?.emergency_contact_name || '',
    emergency_contact_phone: emergency?.phone || profile?.emergency_contact_phone || '',
    home_location_name: profile?.home_location_name || '',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const e = getEmergencyContact()
    const s = getSession()
    setForm(f => ({
      ...f,
      full_name: s?.fullName || f.full_name,
      phone: s?.phone || f.phone,
      emergency_contact_name: e?.name || f.emergency_contact_name,
      emergency_contact_phone: e?.phone || f.emergency_contact_phone,
    }))
  }, [])

  function update(k: string, v: string) {
    setForm(f => ({ ...f, [k]: v }))
  }

  async function handleSave() {
    setSaving(true)
    const s = getSession()
    if (s) {
      setSession({
        ...s,
        fullName: form.full_name.trim() || s.fullName,
        phone: form.phone.trim() || s.phone,
      })
    }
    if (form.emergency_contact_name.trim() && form.emergency_contact_phone.trim()) {
      setEmergencyContact({
        name: form.emergency_contact_name.trim(),
        phone: form.emergency_contact_phone.trim(),
      })
    }
    await new Promise(r => setTimeout(r, 350))
    setSaving(false)
    setSaved(true)
    setTimeout(() => {
      setSaved(false)
      router.push('/passport')
    }, 900)
  }

  return (
    <div className="animate-fade-in" style={{ padding: '8px 16px 32px' }}>
      {saved && (
        <div
          style={{
            background: 'rgba(47,125,75,0.1)',
            border: '1px solid rgba(47,125,75,0.3)',
            borderRadius: 12,
            padding: '12px 16px',
            marginBottom: 16,
            display: 'flex',
            gap: 8,
            alignItems: 'center',
            color: 'var(--good)',
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          <CheckCircle2 size={16} /> Saved on this device
        </div>
      )}

      <div className="eyebrow" style={{ marginBottom: 10 }}>Personal</div>
      <div className="surface" style={{ padding: 16, marginBottom: 16 }}>
        <div className="section-label" style={{ marginBottom: 6 }}>Full name</div>
        <input className="grc-input" value={form.full_name} onChange={e => update('full_name', e.target.value)} style={{ marginBottom: 12 }} />
        <div className="section-label" style={{ marginBottom: 6 }}>Phone</div>
        <input className="grc-input" type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} style={{ marginBottom: 12 }} />
        <div className="section-label" style={{ marginBottom: 6 }}>Bio</div>
        <textarea className="grc-input" value={form.bio} onChange={e => update('bio', e.target.value)} rows={3} style={{ resize: 'none' }} />
      </div>

      <div className="eyebrow" style={{ marginBottom: 10 }}>Home</div>
      <div className="surface" style={{ padding: 16, marginBottom: 16 }}>
        <div className="section-label" style={{ marginBottom: 6 }}>Neighbourhood</div>
        <input
          className="grc-input"
          value={form.home_location_name}
          onChange={e => update('home_location_name', e.target.value)}
          placeholder="e.g. Karen, Utawala…"
        />
      </div>

      <div className="eyebrow" style={{ marginBottom: 10 }}>Emergency · Wave 6</div>
      <div className="surface" style={{ padding: 16, marginBottom: 20 }}>
        <p style={{ margin: '0 0 12px', fontSize: 12, color: 'var(--muted)', lineHeight: 1.45 }}>
          Used by on-ride SOS. Stored on this device only for now.
        </p>
        <div className="section-label" style={{ marginBottom: 6 }}>Contact name</div>
        <input
          className="grc-input"
          value={form.emergency_contact_name}
          onChange={e => update('emergency_contact_name', e.target.value)}
          style={{ marginBottom: 12 }}
        />
        <div className="section-label" style={{ marginBottom: 6 }}>Contact phone</div>
        <input
          className="grc-input"
          type="tel"
          value={form.emergency_contact_phone}
          onChange={e => update('emergency_contact_phone', e.target.value)}
        />
      </div>

      <button className="btn-primary" onClick={handleSave} disabled={saving || !form.full_name.trim()}>
        {saving && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />}
        {saving ? 'Saving…' : 'Save profile'}
      </button>
    </div>
  )
}
