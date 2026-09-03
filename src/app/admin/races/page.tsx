import AdminRacesClient from './AdminRacesClient'
import { DEMO_RACES } from '@/lib/demo'

export default function AdminRacesPage() {
  return <AdminRacesClient races={DEMO_RACES.map(r => ({ ...r, total_registered: 49 }))} />
}
