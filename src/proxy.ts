// Next.js 16 proxy auth guard
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect dashboard/blueprint routes
  const isProtectedRoute =
    pathname.startsWith('/workspace') ||
    pathname.startsWith('/add-blueprint') ||
    pathname.startsWith('/manage-blueprints');

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  const sessionToken = request.cookies.get('better-auth.session_token')?.value;

  // Protect dashboard and blueprint management routes
  if (!sessionToken) {
    const loginUrl = new URL('/signin', request.url);
    // Optional: save current path to redirect back
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/workspace',
    '/workspace/:path*',
    '/add-blueprint',
    '/manage-blueprints',
  ],
};
