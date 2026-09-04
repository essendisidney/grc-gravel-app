import RiderSplash from '@/components/brand/RiderSplash'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="phone-shell topo-bg">
      <RiderSplash />
      <main
        className="scroll-content"
        style={{
          display: 'flex',
          flexDirection: 'column',
          paddingTop: 'max(12px, env(safe-area-inset-top))',
          paddingBottom: 'max(20px, env(safe-area-inset-bottom))',
        }}
      >
        {children}
      </main>
    </div>
  )
}
