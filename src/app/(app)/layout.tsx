import BottomNav from '@/components/layout/BottomNav'
import RiderSplash from '@/components/brand/RiderSplash'
import Onboarding from '@/components/brand/Onboarding'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="phone-shell topo-bg">
      <RiderSplash />
      <Onboarding />
      <main
        className="scroll-content"
        style={{
          flex: 1,
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'calc(var(--nav-h) + env(safe-area-inset-bottom) + 8px)',
        }}
      >
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
