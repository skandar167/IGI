import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Static and internal assets
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

  // Allow public scan page: /assets/[id] (but NOT /assets, /assets/new, or /assets/[id]/edit)
  const isAssetScanPage = /^\/assets\/[^/]+$/.test(pathname);
  const isIncidentApi = /^\/api\/assets\/[^/]+\/incident$/.test(pathname);
  const isLoginPage = pathname === '/login';

  if (isLoginPage) {
    if (hasSession) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    return NextResponse.next();
  }

  if (isAssetScanPage || isIncidentApi) {
    return NextResponse.next();
  }

  // Root redirect
  if (pathname === '/') {
    if (hasSession) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    } else {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  // All other protected routes require authentication
  if (!hasSession) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|logo.jpg).*)'],
};
