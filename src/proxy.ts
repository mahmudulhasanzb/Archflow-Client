import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { headers } from 'next/headers';
import { auth } from './lib/auth';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute =
    pathname.startsWith('/workspace') ||
    pathname.startsWith('/add-blueprint') ||
    pathname.startsWith('/manage-blueprints') ||
    (pathname.startsWith('/blueprints/') && pathname !== '/blueprints');

  const isAuthRoute = pathname === '/signin' || pathname === '/signup';

  let session: any = null;

  try {
    session = await auth.api.getSession({
      headers: await headers(),
    });
  } catch {
    const sessionCookie =
      request.cookies.get('better-auth.session_token') ||
      request.cookies.get('__Secure-better-auth.session_token');

    if (!sessionCookie && isProtectedRoute) {
      const loginUrl = new URL('/signin', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  const user = session?.user;

  // 1. Unauthenticated -> redirect to /signin
  if (isProtectedRoute && !user) {
    const sessionCookie =
      request.cookies.get('better-auth.session_token') ||
      request.cookies.get('__Secure-better-auth.session_token');

    if (!sessionCookie) {
      const loginUrl = new URL('/signin', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Already logged in -> redirect away from /signin & /signup
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/workspace', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/workspace',
    '/workspace/:path*',
    '/add-blueprint',
    '/manage-blueprints',
    '/blueprints/:id*',
    '/signin',
    '/signup',
  ],
};
