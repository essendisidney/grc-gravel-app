import BottomNav from '@/components/layout/BottomNav'
import PullToRefreshScroll from '@/components/layout/PullToRefreshScroll'
import RiderSplash from '@/components/brand/RiderSplash'
import Onboarding from '@/components/brand/Onboarding'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="phone-shell topo-bg">
      <RiderSplash />
      <Onboarding />
      <PullToRefreshScroll
        style={{
          flex: 1,
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'calc(var(--nav-h) + 6px)',
        }}
      >
        {children}
      </PullToRefreshScroll>
      <BottomNav />
    </div>
  )
}
