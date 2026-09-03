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
      exchangeCodeForSession: async () => ({ error: null }),
    },
    from: () => chain(),
    rpc: async () => ({ data: null, error: null }),
  } as any
}
