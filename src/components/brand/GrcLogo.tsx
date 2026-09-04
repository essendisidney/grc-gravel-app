'use client'

import Image from 'next/image'

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
    <Image
      src="/brand/logo.png"
      alt={alt}
      width={size}
      height={size}
      priority
      style={{
        width: size,
        height: size,
        borderRadius: rounded,
        objectFit: 'cover',
        display: 'block',
        flexShrink: 0,
        boxShadow: '0 0 0 1px rgba(10,10,10,0.06)',
      }}
    />
  )
}
