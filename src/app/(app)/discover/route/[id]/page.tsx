import RouteDetailClient from './RouteDetailClient'

export default async function RoutePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <RouteDetailClient routeId={id} />
}
