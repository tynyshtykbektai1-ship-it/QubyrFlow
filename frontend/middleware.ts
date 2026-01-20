import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/']

  // Check if the route is public
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // For protected routes, we rely on client-side auth context
  // since we're using localStorage for auth state
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - icon-*.png (icon files)
     * - apple-icon.png (apple icon)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|icon-.*\\.png|apple-icon.png|icon.svg).*)',
  ],
}
