import AdminRidesClient from './AdminRidesClient'
import { DEMO_RIDES } from '@/lib/demo'

export default function AdminRidesPage() {
  return <AdminRidesClient rides={DEMO_RIDES} />
}
