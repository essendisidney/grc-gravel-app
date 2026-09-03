import { notFound } from 'next/navigation'
import TopBar from '@/components/layout/TopBar'
import RaceRegistrationClient from './RaceRegistrationClient'
import { formatFullDate, formatKES } from '@/lib/utils'
import { MapPin, Calendar } from 'lucide-react'
import { DEMO_RACES } from '@/lib/demo'

export default async function RaceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const race = DEMO_RACES.find(r => r.id === id)
  if (!race) notFound()

  const categories = race.categories
  const regCounts: Record<string, number> = { cat_a: 18, cat_b: 22, women: 9 }

  return (
    <div>
      <TopBar showBack title="Race details" showNotifications={false} />
      <div style={{ padding: '0 16px 28px' }}>
        <div className="section-label" style={{ marginBottom: 6 }}>{race.series_name} · #{race.edition_number}</div>
        <h1 style={{ fontSize: 26, fontWeight: 800, lineHeight: 1.15, margin: '0 0 16px' }}>{race.title}</h1>

        <div className="surface" style={{ padding: 16, marginBottom: 14 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12 }}>
            <Calendar size={16} color="var(--navy)" />
            <div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>Race day</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{formatFullDate(race.race_date)} · {race.start_time.slice(0, 5)}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <MapPin size={16} color="var(--navy)" />
            <div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>Venue</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{race.venue_name}</div>
            </div>
          </div>
        </div>

        <div className="section-label" style={{ marginBottom: 10 }}>Categories</div>
        {categories.map((cat: any) => {
          const count = regCounts[cat.id] || 0
          const spotsLeft = cat.max_slots - count
          return (
            <div key={cat.id} className="surface" style={{ padding: 14, marginBottom: 10, display: 'flex', justifyContent: 'space-between', gap: 12 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{cat.name}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>{cat.description}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 16, fontWeight: 800 }}>{formatKES(cat.fee_kes)}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>{spotsLeft} spots</div>
              </div>
            </div>
          )
        })}

        <div style={{ marginTop: 8 }}>
          <RaceRegistrationClient
            raceId={race.id}
            categories={categories}
            userRegistration={null}
            regCounts={regCounts}
          />
        </div>
      </div>
    </div>
  )
}
