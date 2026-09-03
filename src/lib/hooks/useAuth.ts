'use client'

export function useAuth() {
  return {
    user: { id: 'demo-user' } as any,
    profile: {
      id: 'demo-user',
      full_name: 'Amina Otieno',
      membership_tier: 'elite',
      role: 'member',
    } as any,
    loading: false,
    signOut: async () => {},
    refetchProfile: () => {},
  }
}
