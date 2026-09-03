import TopBar from '@/components/layout/TopBar'
import Link from 'next/link'
import { ChevronRight, Calendar, MapPin } from 'lucide-react'
import { formatFullDate } from '@/lib/utils'
import { DEMO_RACES } from '@/lib/demo'

export default function RacePage() {
  return (
    <div>
      <TopBar title="Race" showNotifications />
      <div style={{ padding: '0 16px 24px' }}>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16, lineHeight: 1.5 }}>
          Full Gas criterium — categories, start lists, M-Pesa entry when live.
        </p>
        {DEMO_RACES.map((race: any) => (
          <Link key={race.id} href={`/race/${race.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block', marginBottom: 12 }}>
            <div className="surface" style={{ overflow: 'hidden' }}>
              <div style={{ padding: 16 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--green)' }}>Registration open</span>
                <div className="section-label" style={{ margin: '8px 0 4px' }}>{race.series_name} · #{race.edition_number}</div>
                <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 10 }}>{race.title}</div>
                <div style={{ display: 'flex', gap: 12, fontSize: 13, color: 'var(--muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={13} />{formatFullDate(race.race_date)}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={13} />{race.venue_name}</span>
                </div>
              </div>
              <div style={{ padding: '10px 16px', borderTop: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  {race.categories.map((cat: any) => (
                    <span key={cat.id} className="chip" style={{ cursor: 'default', padding: '4px 8px' }}>{cat.name}</span>
                  ))}
                </div>
                <ChevronRight size={16} color="#9AA1B2" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
