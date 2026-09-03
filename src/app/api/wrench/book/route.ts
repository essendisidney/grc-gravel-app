import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const { serviceType, requestedDate, requestedTimeSlot, serviceLocationName } = body
  if (!serviceType || !requestedDate || !requestedTimeSlot || !serviceLocationName) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }
  return NextResponse.json({
    id: `booking-${Date.now()}`,
    status: 'pending',
    message: 'Mechanic dispatch is preview-only until we add a database.',
  })
}
