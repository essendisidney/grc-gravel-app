'use client'

import { useEffect, useState } from 'react'
import {
  addCondition,
  getConditions,
  getSession,
  type ConditionTag,
  type TrailCondition,
} from '@/lib/localStore'

const TAGS: { id: ConditionTag; label: string }[] = [
  { id: 'dust', label: 'Dust' },
  { id: 'mud', label: 'Mud' },
  { id: 'wind', label: 'Wind' },
  { id: 'signal', label: 'Signal' },
  { id: 'heat', label: 'Heat' },
  { id: 'clear', label: 'Clear' },
]

export default function ConditionReports({ routeId }: { routeId: string }) {
  const [items, setItems] = useState<TrailCondition[]>([])
  const [open, setOpen] = useState(false)
  const [tags, setTags] = useState<ConditionTag[]>([])
  const [note, setNote] = useState('')

  useEffect(() => {
    setItems(getConditions(routeId))
  }, [routeId])

  function toggleTag(t: ConditionTag) {
    setTags(prev => (prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t].slice(0, 3)))
  }

  function post() {
    if (!note.trim() || tags.length === 0) return
    const session = getSession()
    const next = addCondition({
      id: `cond_${Date.now()}`,
      routeId,
      tags,
      note: note.trim(),
      authorName: session?.fullName || 'GRC rider',
      createdAt: new Date().toISOString(),
    })
    setItems(next)
    setNote('')
    setTags([])
    setOpen(false)
  }

  return (
    <div className="surface" style={{ padding: 14, marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div className="section-label" style={{ margin: 0 }}>Trail conditions</div>
        <button
          type="button"
          className="chip accent"
          style={{ border: 'none', cursor: 'pointer' }}
          onClick={() => setOpen(v => !v)}
        >
          Report
        </button>
      </div>

      {open && (
        <div style={{ marginBottom: 12, padding: 12, background: 'var(--bg)', borderRadius: 12 }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
            {TAGS.map(t => (
              <button
                key={t.id}
                type="button"
                className={tags.includes(t.id) ? 'chip accent' : 'chip'}
                style={{ border: 'none', cursor: 'pointer' }}
                onClick={() => toggleTag(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
          <textarea
            className="grc-input"
            rows={2}
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="What should the next group know?"
            style={{ marginBottom: 8, resize: 'none' }}
          />
          <button type="button" className="btn-primary" onClick={post}>
            Post condition
          </button>
        </div>
      )}

      {items.length === 0 && (
        <div style={{ fontSize: 13, color: 'var(--muted)' }}>No reports yet. Be first after you roll.</div>
      )}
      {items.slice(0, 5).map(c => (
        <div key={c.id} style={{ padding: '10px 0', borderTop: '1px solid var(--line)' }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
            {c.tags.map(t => (
              <span key={t} className="chip accent" style={{ border: 'none', textTransform: 'capitalize' }}>
                {t}
              </span>
            ))}
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.45 }}>{c.note}</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6 }}>
            {c.authorName} · {new Date(c.createdAt).toLocaleString(undefined, { weekday: 'short', hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      ))}
    </div>
  )
}
