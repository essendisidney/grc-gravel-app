'use client'

function chain(): any {
  const resolved = Promise.resolve({ data: null, error: { message: 'No database yet' }, count: 0 })
  const handler: ProxyHandler<any> = {
    get(_target, prop) {
      if (prop === 'then') return resolved.then.bind(resolved)
      if (prop === 'catch') return resolved.catch.bind(resolved)
      return () => new Proxy({}, handler)
    },
  }
  return new Proxy({}, handler)
}

export function createClient() {
  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      getUser: async () => ({ data: { user: null }, error: null }),
      signInWithPassword: async () => ({ error: { message: 'Auth is not wired yet' } }),
      signUp: async () => ({ error: { message: 'Auth is not wired yet' } }),
      signOut: async () => ({ error: null }),
      exchangeCodeForSession: async () => ({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
    },
    from: () => chain(),
    rpc: async () => ({ data: null, error: null }),
    channel: () => ({
      on() { return this },
      subscribe() { return { unsubscribe() {} } },
    }),
    removeChannel() {},
  } as any
}
