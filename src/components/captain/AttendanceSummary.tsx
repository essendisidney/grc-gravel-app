'use client'

import { useState } from 'react'
import { Download, Users } from 'lucide-react'
import { attendanceCsv, getAttendanceSummary } from '@/lib/localStore'

export default function AttendanceSummary({
  rideId,
  title,
}: {
  rideId: string
  title: string
}) {
  const [copied, setCopied] = useState(false)
  const summary = getAttendanceSummary(rideId)

  function download() {
    const csv = attendanceCsv(rideId, title)
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `grc-attendance-${rideId}.csv`
    a.click()
    URL.revokeObjectURL(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="surface" style={{ padding: 14, marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <Users size={16} color="var(--accent)" />
        <div style={{ fontWeight: 800, fontSize: 14 }}>Attendance summary</div>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <span className="chip accent" style={{ border: 'none' }}>
          {summary.present} present
        </span>
        <span className="chip" style={{ border: 'none' }}>
          {summary.absent} absent
        </span>
        <span className="chip" style={{ border: 'none' }}>
          {summary.total} roster
        </span>
      </div>
      {summary.byPace.map(p => (
        <div
          key={p.pace}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 12,
            padding: '6px 0',
            borderTop: '1px solid var(--line)',
          }}
        >
          <span style={{ fontWeight: 700 }}>{p.pace}</span>
          <span style={{ color: 'var(--muted)' }}>
            {p.present}/{p.total}
          </span>
        </div>
      ))}
      <button type="button" className="btn-secondary" style={{ marginTop: 12 }} onClick={download}>
        <Download size={16} /> {copied ? 'Downloaded' : 'Export CSV'}
      </button>
    </div>
  )
}
