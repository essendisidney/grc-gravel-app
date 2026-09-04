import RaceDayClient from './RaceDayClient'

export default async function RaceDayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <RaceDayClient raceId={id} />
}
