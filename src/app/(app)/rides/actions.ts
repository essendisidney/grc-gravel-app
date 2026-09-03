'use server'

export async function registerForRide(_rideId: string): Promise<{
  success: boolean
  status?: 'registered' | 'waitlisted'
  error?: string
}> {
  return { success: true, status: 'registered' }
}

export async function cancelRideRegistration(_rideId: string): Promise<{
  success: boolean
  error?: string
}> {
  return { success: true }
}
