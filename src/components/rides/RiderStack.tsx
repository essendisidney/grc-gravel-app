export default function RiderStack({
  riders,
  extra,
}: {
  riders?: { initials: string; color: string }[]
  extra?: number
}) {
  if (!riders?.length) return null
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {riders.map((r, i) => (
        <div
          key={r.initials + i}
          style={{
            width: 22, height: 22, borderRadius: '50%',
            background: r.color, marginLeft: i === 0 ? 0 : -7,
            border: '2px solid #1A1E2A',
            fontSize: 7, fontWeight: 800, color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          {r.initials}
        </div>
      ))}
      {extra && extra > 0 ? (
        <div
          style={{
            width: 22, height: 22, borderRadius: '50%', marginLeft: -7,
            background: '#252B3B', border: '2px solid #1A1E2A',
            fontSize: 8, fontWeight: 700, color: '#8892A4',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          +{extra}
        </div>
      ) : null}
    </div>
  )
}
