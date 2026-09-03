'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, CheckCircle2 } from 'lucide-react'

export default function ProfileEditClient({ profile }: { profile: any }) {
  const router = useRouter()

  const [form, setForm] = useState({
    full_name: profile?.full_name || '',
    username: profile?.username || '',
    phone: profile?.phone || '',
    bio: profile?.bio || '',
    emergency_contact_name: profile?.emergency_contact_name || '',
    emergency_contact_phone: profile?.emergency_contact_phone || '',
    home_location_name: profile?.home_location_name || '',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  function update(k: string, v: string) { setForm(f => ({ ...f, [k]: v })) }

  async function handleSave() {
    setSaving(true)
    setError('')
    await new Promise(r => setTimeout(r, 400))
    setSaving(false)
    setSaved(true)
    setTimeout(() => { setSaved(false); router.push('/passport') }, 1200)
  }

  const labelStyle = {
    fontSize: 12, color: '#8892A4', display: 'block' as const,
    marginBottom: 6, fontWeight: 500 as const,
  }

  return (
    <div style={{ padding: '8px 16px 32px' }}>

      {saved && (
        <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 12, padding: '12px 16px', marginBottom: 16, display: 'flex', gap: 8, alignItems: 'center', color: '#22C55E', fontSize: 14, fontWeight: 600 }}>
          <CheckCircle2 size={16} /> Profile saved!
        </div>
      )}

      {error && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, padding: '12px 16px', marginBottom: 16, color: '#EF4444', fontSize: 13 }}>
          {error}
        </div>
      )}

      {/* Personal info */}
      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16, fontWeight: 700, color: '#8892A4', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 }}>
        Personal Info
      </div>

      <div style={{ background: '#1A1E2A', borderRadius: 16, border: '1px solid #1E2436', padding: 18, marginBottom: 16 }}>
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Full Name</label>
          <input className="grc-input" value={form.full_name} onChange={e => update('full_name', e.target.value)} placeholder="Your full name" />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Username</label>
          <input className="grc-input" value={form.username} onChange={e => update('username', e.target.value)} placeholder="@username" />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Phone (M-Pesa)</label>
          <input className="grc-input" type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="0712 345 678" />
        </div>
        <div>
          <label style={labelStyle}>Bio</label>
          <textarea className="grc-input" value={form.bio} onChange={e => update('bio', e.target.value)} placeholder="Tell the club about yourself — your riding style, favourite routes..." rows={3} style={{ resize: 'none' }} />
        </div>
      </div>

      {/* Home location */}
      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16, fontWeight: 700, color: '#8892A4', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 }}>
        Home Location
      </div>

      <div style={{ background: '#1A1E2A', borderRadius: 16, border: '1px solid #1E2436', padding: 18, marginBottom: 16 }}>
        <div>
          <label style={labelStyle}>Neighbourhood / Estate</label>
          <input className="grc-input" value={form.home_location_name} onChange={e => update('home_location_name', e.target.value)} placeholder="e.g. Karen, Westlands, Utawala..." />
        </div>
        <div style={{ fontSize: 11, color: '#8892A4', marginTop: 8 }}>
          Used to match you with nearby GRC mechanics for Wrench bookings
        </div>
      </div>

      {/* Emergency contact */}
      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16, fontWeight: 700, color: '#8892A4', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 }}>
        Emergency Contact
      </div>

      <div style={{ background: '#1A1E2A', borderRadius: 16, border: '1px solid #1E2436', padding: 18, marginBottom: 24 }}>
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Contact Name</label>
          <input className="grc-input" value={form.emergency_contact_name} onChange={e => update('emergency_contact_name', e.target.value)} placeholder="Full name" />
        </div>
        <div>
          <label style={labelStyle}>Contact Phone</label>
          <input className="grc-input" type="tel" value={form.emergency_contact_phone} onChange={e => update('emergency_contact_phone', e.target.value)} placeholder="0712 345 678" />
        </div>
        <div style={{ fontSize: 11, color: '#8892A4', marginTop: 8 }}>
          Only contacted in case of an emergency on a ride
        </div>
      </div>

      <button className="btn-primary" onClick={handleSave} disabled={saving || !form.full_name}>
        {saving && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />}
        {saving ? 'Saving...' : 'Save Profile'}
      </button>
    </div>
  )
}
