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

export function getRouteById(id: string) {
  return DEMO_ROUTES.find(r => r.id === id) || null
}

export function getRegionName(regionId: string) {
  return DEMO_REGIONS.find(r => r.id === regionId)?.name || regionId
}

export function buildGpx(routeId: string, name: string) {
  const pts = WAYPOINTS[routeId] || WAYPOINTS['magadi-loop']
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
