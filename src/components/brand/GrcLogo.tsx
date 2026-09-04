'use client'

/**
 * Official GRC hex mark — black GRC on brand gold.
 * Plain <img> (not next/image) so SW / optimizer caches don't stick on an old logo.
 */
export default function GrcLogo({
  size = 40,
  rounded = 11,
  alt = 'Gravel Riders Club',
}: {
  size?: number
  rounded?: number
  alt?: string
  /** @deprecated unused — logo is a raster mark */
  color?: string
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/brand/grc-hex.png?v=3"
      alt={alt}
      width={size}
      height={size}
      decoding="async"
      style={{
        width: size,
        height: size,
        borderRadius: rounded,
        objectFit: 'cover',
        display: 'block',
        flexShrink: 0,
        background: '#FEC72E',
        boxShadow: '0 0 0 1px rgba(10,10,10,0.08)',
      }}
    />
  )
}
