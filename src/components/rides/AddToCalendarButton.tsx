'use client'

import { CalendarPlus } from 'lucide-react'
import type { DemoRide } from '@/lib/demo'

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function toIcsDate(date: string, time: string) {
  const [y, m, d] = date.split('-').map(Number)
  const [hh, mm] = (time || '06:15:00').split(':').map(Number)
  return `${y}${pad(m)}${pad(d)}T${pad(hh)}${pad(mm)}00`
}

function addHoursIcs(date: string, time: string, hours: number) {
  const [y, m, d] = date.split('-').map(Number)
  const [hh, mm] = (time || '06:15:00').split(':').map(Number)
  const dt = new Date(y, m - 1, d, hh, mm)
  dt.setHours(dt.getHours() + hours)
  return `${dt.getFullYear()}${pad(dt.getMonth() + 1)}${pad(dt.getDate())}T${pad(dt.getHours())}${pad(dt.getMinutes())}00`
}

export function downloadRideIcs(ride: DemoRide) {
  const title = ride.route_label || ride.title
  const start = toIcsDate(ride.ride_date, ride.start_time)
  const end = addHoursIcs(ride.ride_date, ride.start_time, 5)
  const loc = ride.start_location_name || 'GRC gate'
  const desc = [
    `${ride.distance_km} km · ${ride.elevation_gain_m || 0} m ↑`,
    ride.description || '',
    'Gravel Riders Club — Ride beyond the tarmac',
  ]
    .filter(Boolean)
    .join('\\n')

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//GRC//Gravel Riders Club//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:grc-${ride.id}@gravelriders.club`,
    `DTSTAMP:${toIcsDate(new Date().toISOString().slice(0, 10), '12:00:00')}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:GRC · ${title}`,
    `DESCRIPTION:${desc}`,
    `LOCATION:${loc}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `grc-${ride.id}.ics`
  a.click()
  URL.revokeObjectURL(url)
}

export default function AddToCalendarButton({ ride }: { ride: DemoRide }) {
  return (
    <button type="button" className="btn-secondary" onClick={() => downloadRideIcs(ride)}>
      <CalendarPlus size={16} /> Add to calendar
    </button>
  )
}
