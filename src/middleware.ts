import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Static and internal assets — always passthrough
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname === '/favicon.ico' ||
    pathname === '/logo.jpg'
  ) {
    return NextResponse.next();
  }

  const hasSession =
    req.cookies.has('authjs.session-token') ||
    req.cookies.has('__Secure-authjs.session-token') ||
    req.cookies.has('next-auth.session-token') ||
    req.cookies.has('__Secure-next-auth.session-token');

  // Completely public pages (no session required)
  const isPublicPage =
    pathname === '/home' ||
    pathname === '/login' ||
    pathname === '/register';

  // Allow public scan page: /assets/[id] (but NOT /assets, /assets/new, or /assets/[id]/edit)
  const isAssetScanPage = /^\/assets\/[^/]+$/.test(pathname);
  const isIncidentApi = /^\/api\/assets\/[^/]+\/incident$/.test(pathname);

  // Root redirect → always go to /home (public landing page)
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/home', req.url));
  }

  // Auth pages: redirect logged-in users to dashboard
  if ((pathname === '/login' || pathname === '/register') && hasSession) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Allow public pages and scan routes
  if (isPublicPage || isAssetScanPage || isIncidentApi) {
    return NextResponse.next();
  }

  // All other routes require authentication
  if (!hasSession) {
    const homeUrl = new URL('/home', req.url);
    homeUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|logo.jpg).*)'],
};
