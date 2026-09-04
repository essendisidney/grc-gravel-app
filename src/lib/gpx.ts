import { DEMO_ROUTES, DEMO_REGIONS } from '@/lib/demo'

/** Rough Nairobi / Magadi corridor waypoints for demo GPX */
const WAYPOINTS: Record<string, [number, number][]> = {
  'magadi-loop': [
    [-1.3521, 36.6662],
    [-1.4012, 36.5120],
    [-1.5204, 36.4218],
    [-1.7870, 36.2870],
    [-1.9012, 36.2650],
    [-1.7870, 36.2870],
    [-1.5204, 36.4218],
    [-1.4012, 36.5120],
    [-1.3521, 36.6662],
  ],
  'ngong-ridge': [
    [-1.3610, 36.6560],
    [-1.3820, 36.6400],
    [-1.4010, 36.6120],
    [-1.4180, 36.5980],
    [-1.4010, 36.6120],
    [-1.3610, 36.6560],
  ],
  'kona-baridi': [
    [-1.3521, 36.6662],
    [-1.3900, 36.5800],
    [-1.4500, 36.5200],
    [-1.3900, 36.5800],
    [-1.3521, 36.6662],
  ],
  'kiserian-classic': [
    [-1.4000, 36.6900],
    [-1.4300, 36.6500],
    [-1.4600, 36.6200],
    [-1.4300, 36.6500],
    [-1.4000, 36.6900],
  ],
  'hells-gate-loop': [
    [-0.7830, 36.4000],
    [-0.8200, 36.3600],
    [-0.8700, 36.3300],
    [-0.8200, 36.3600],
    [-0.7830, 36.4000],
  ],
}

/** Club ride IDs → route corridor for map/GPX */
const RIDE_ROUTE: Record<string, string> = {
  'ngong-magadi': 'magadi-loop',
  'kiserian-loop': 'kiserian-classic',
}

export function getWaypoints(routeOrRideId: string): [number, number][] {
  const id = RIDE_ROUTE[routeOrRideId] || routeOrRideId
  return WAYPOINTS[id] || WAYPOINTS['magadi-loop']
}

/** Project lat/lon path into an SVG polyline (viewBox 0 0 100 100) */
export function waypointsToSvgPath(routeOrRideId: string, pad = 8) {
  const pts = getWaypoints(routeOrRideId)
  const lats = pts.map(p => p[0])
  const lons = pts.map(p => p[1])
  const minLat = Math.min(...lats)
  const maxLat = Math.max(...lats)
  const minLon = Math.min(...lons)
  const maxLon = Math.max(...lons)
  const spanLat = Math.max(maxLat - minLat, 0.01)
  const spanLon = Math.max(maxLon - minLon, 0.01)
  const size = 100 - pad * 2

  const projected = pts.map(([lat, lon]) => {
    const x = pad + ((lon - minLon) / spanLon) * size
    const y = pad + ((maxLat - lat) / spanLat) * size
    return [x, y] as [number, number]
  })

  const d = projected.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(2)} ${p[1].toFixed(2)}`).join(' ')
  const start = projected[0]
  const end = projected[projected.length - 1]
  return { d, start, end, projected }
}

export function getRouteById(id: string) {
  return DEMO_ROUTES.find(r => r.id === id) || null
}

export function getRegionName(regionId: string) {
  return DEMO_REGIONS.find(r => r.id === regionId)?.name || regionId
}

export function buildGpx(routeId: string, name: string) {
  const pts = getWaypoints(routeId)
  const trkpts = pts
    .map(([lat, lon], i) => {
      const ele = 1600 + Math.round(Math.sin(i / 2) * 80)
      return `      <trkpt lat="${lat}" lon="${lon}"><ele>${ele}</ele><name>P${i + 1}</name></trkpt>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="GRC Gravel OS" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>${escapeXml(name)}</name>
    <desc>Demo GPX from Gravel Riders Club — African gravel OS</desc>
  </metadata>
  <trk>
    <name>${escapeXml(name)}</name>
    <trkseg>
${trkpts}
    </trkseg>
  </trk>
</gpx>
`
}

function escapeXml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
