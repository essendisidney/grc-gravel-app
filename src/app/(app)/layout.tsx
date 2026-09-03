import BottomNav from '@/components/layout/BottomNav'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="phone-shell topo-bg">
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
