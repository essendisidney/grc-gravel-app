'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { RefreshCw } from 'lucide-react'

const THRESHOLD = 72

/**
 * Custom pull-to-refresh for the phone shell.
 * Native browser PTR is blocked (body is position:fixed) —
 * this restores swipe-down refresh on the scroll container.
 */
export default function PullToRefreshScroll({
  children,
  style,
}: {
  children: ReactNode
  style?: React.CSSProperties
}) {
  const ref = useRef<HTMLElement>(null)
  const startY = useRef(0)
  const pulling = useRef(false)
  const pullRef = useRef(0)
  const [pull, setPull] = useState(0)
  const [refreshing, setRefreshing] = useState(false)
  const refreshingRef = useRef(false)

  useEffect(() => {
    refreshingRef.current = refreshing
  }, [refreshing])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const onStart = (e: TouchEvent) => {
      if (refreshingRef.current) return
      if (el.scrollTop > 2) {
        pulling.current = false
        return
      }
      startY.current = e.touches[0].clientY
      pulling.current = true
    }

    const onMove = (e: TouchEvent) => {
      if (!pulling.current || refreshingRef.current) return
      if (el.scrollTop > 2) {
        pulling.current = false
        pullRef.current = 0
        setPull(0)
        return
      }
      const dy = e.touches[0].clientY - startY.current
      if (dy > 0) {
        const next = Math.min(120, dy * 0.45)
        pullRef.current = next
        setPull(next)
        if (next > 8) e.preventDefault()
      } else {
        pullRef.current = 0
        setPull(0)
      }
    }

    const onEnd = () => {
      if (!pulling.current) return
      pulling.current = false
      if (pullRef.current >= THRESHOLD && !refreshingRef.current) {
        setRefreshing(true)
        setPull(THRESHOLD)
        window.setTimeout(() => window.location.reload(), 280)
        return
      }
      pullRef.current = 0
      setPull(0)
    }

    el.addEventListener('touchstart', onStart, { passive: true })
    el.addEventListener('touchmove', onMove, { passive: false })
    el.addEventListener('touchend', onEnd)
    el.addEventListener('touchcancel', onEnd)
    return () => {
      el.removeEventListener('touchstart', onStart)
      el.removeEventListener('touchmove', onMove)
      el.removeEventListener('touchend', onEnd)
      el.removeEventListener('touchcancel', onEnd)
    }
  }, [])

  const progress = Math.min(1, pull / THRESHOLD)

  return (
    <main ref={ref} className="scroll-content" style={style}>
      <div
        aria-hidden
        style={{
          height: refreshing ? THRESHOLD : pull,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          overflow: 'hidden',
          transition: pulling.current ? 'none' : 'height 0.2s var(--ease-out)',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
            paddingBottom: 10,
            opacity: progress || refreshing ? 1 : 0,
            transform: `scale(${0.75 + progress * 0.25})`,
          }}
        >
          <RefreshCw
            size={18}
            color="var(--accent-ink)"
            style={{
              animation: refreshing ? 'spin 0.7s linear infinite' : undefined,
              transform: refreshing ? undefined : `rotate(${progress * 180}deg)`,
            }}
          />
          <span
            style={{
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--muted)',
            }}
          >
            {refreshing ? 'Refreshing…' : pull >= THRESHOLD ? 'Release' : 'Pull to refresh'}
          </span>
        </div>
      </div>
      {children}
    </main>
  )
}
