export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="phone-shell topo-bg" style={{ minHeight: '100dvh' }}>
      <main
        className="scroll-content"
        style={{
          flex: 1,
          minHeight: '100dvh',
          paddingTop: 'max(20px, env(safe-area-inset-top))',
          paddingBottom: 'max(24px, env(safe-area-inset-bottom))',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {children}
      </main>
    </div>
  )
}
