import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC = [
  '/login',
  '/signup',
  '/manifest.json',
  '/sw.js',
  '/icons',
  '/brand',
  '/favicon.ico',
]

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    PUBLIC.some(p => pathname === p || pathname.startsWith(`${p}/`))
  ) {
    return NextResponse.next()
  }

  const authed = req.cookies.get('grc_session')?.value === '1'
  if (!authed) {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
