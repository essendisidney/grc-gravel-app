export default function GrcLogo({ size = 52, color = '#F4E8C8' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size * 1.08} viewBox="0 0 80 88" fill="none" aria-label="GRC">
      <path
        d="M40 5 L73 22.5 V61.5 L40 79 L7 61.5 V22.5 Z"
        stroke={color}
        strokeWidth="2.4"
        fill="none"
      />
      <text
        x="40"
        y="50"
        textAnchor="middle"
        fill={color}
        fontFamily="Outfit, sans-serif"
        fontWeight="700"
        fontSize="18"
        letterSpacing="1.5"
      >
        GRC
      </text>
    </svg>
  )
}
