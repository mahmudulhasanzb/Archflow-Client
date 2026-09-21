import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from './lib/auth';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isWorkspaceRoute = pathname.startsWith('/workspace');
  const isAdminRoute = pathname.startsWith('/workspace/admin');
  const isAuthRoute = pathname === '/signin' || pathname === '/signup';

  const sessionCookie =
    request.cookies.get('better-auth.session_token') ||
    request.cookies.get('__Secure-better-auth.session_token');

  // Fast-path: unauthenticated visitors trying to access protected workspace routes
  if (isWorkspaceRoute && !sessionCookie) {
    const loginUrl = new URL('/signin', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Fast-path: visitors accessing signin/signup with no existing session cookie
  if (isAuthRoute && !sessionCookie) {
    return NextResponse.next();
  }

  let session: any = null;

  try {
    session = await auth.api.getSession({
      headers: request.headers,
    });
  } catch {
    if (!sessionCookie && isWorkspaceRoute) {
      const loginUrl = new URL('/signin', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  const user = session?.user;

  // 1. Unauthenticated -> redirect to /signin
  if (isWorkspaceRoute && !user && !sessionCookie) {
    const loginUrl = new URL('/signin', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Admin authorization -> verify user has admin role
  if (isAdminRoute && user) {
    const role = (user as any).role?.toLowerCase();
    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/workspace', request.url));
    }
  }

  // 3. Already logged in -> redirect away from /signin & /signup
  if (isAuthRoute && (user || sessionCookie)) {
    return NextResponse.redirect(new URL('/workspace', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/workspace',
    '/workspace/:path*',
    '/signin',
    '/signup',
  ],
};
