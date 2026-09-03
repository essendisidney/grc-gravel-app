import ClubHome from '@/components/home/ClubHome'
import { DEMO_RIDES } from '@/lib/demo'

export default function HomePage() {
  return <ClubHome rides={DEMO_RIDES} />
}
