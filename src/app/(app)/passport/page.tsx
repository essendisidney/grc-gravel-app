import TopBar from '@/components/layout/TopBar'
import PassportClient from './PassportClient'
import { DEMO_PROFILE, DEMO_BADGES, DEMO_RIDES } from '@/lib/demo'

export default function PassportPage() {
  return (
    <div>
      <TopBar title="You" showNotifications />
      <PassportClient
        profile={DEMO_PROFILE}
        badges={DEMO_BADGES}
        recentRides={[
          {
            id: '1',
            status: 'attended',
            rides: {
              title: DEMO_RIDES[1].title,
              ride_date: DEMO_RIDES[1].ride_date,
              ride_type: 'gravel',
              distance_km: DEMO_RIDES[1].distance_km,
            },
          },
          {
            id: '2',
            status: 'attended',
            rides: {
              title: 'Ngong Ridge Openers',
              ride_date: new Date(Date.now() - 86400000 * 4).toISOString().slice(0, 10),
              ride_type: 'gravel',
              distance_km: 48,
            },
          },
        ]}
        raceResults={[]}
      />
    </div>
  )
}
