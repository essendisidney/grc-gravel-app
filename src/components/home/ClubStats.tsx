interface ClubStatsProps {
  memberCount: number
  eliteCount: number
  clubhouseCount: number
}

export default function ClubStats({ memberCount, eliteCount, clubhouseCount }: ClubStatsProps) {
  const stats = [
    { value: memberCount, label: 'Members' },
    { value: eliteCount, label: 'Elite Team' },
    { value: clubhouseCount, label: 'Clubhouses' },
  ]

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: 8,
        padding: '0 16px 20px',
      }}
    >
      {stats.map(({ value, label }) => (
        <div
          key={label}
          style={{
            background: '#1A1E2A',
            borderRadius: 14,
            padding: '12px 8px',
            textAlign: 'center',
            border: '1px solid #1E2436',
          }}
        >
          <div
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 28,
              fontWeight: 700,
              color: '#F5C518',
              lineHeight: 1,
            }}
          >
            {value}
          </div>
          <div
            style={{
              fontSize: 9,
              color: '#8892A4',
              textTransform: 'uppercase',
              letterSpacing: 1,
              marginTop: 3,
            }}
          >
            {label}
          </div>
        </div>
      ))}
    </div>
  )
}
