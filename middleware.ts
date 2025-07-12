// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';

// Routes that require authentication
const protectedRoutes = ['/admin', '/profile', '/requests', '/messages'];
const authRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userToken = request.cookies.get('session')?.value;

  // Check if user is on auth pages
  if (authRoutes.includes(pathname)) {
    // If user is already authenticated, redirect to explore
    if (userToken) {
      return NextResponse.redirect(new URL('/explore', request.url));
    }
    return NextResponse.next();
  }

  // Check if user is accessing protected routes
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    // If user is not authenticated, redirect to login
    if (!userToken) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Initialize project data on first visit to explore page
  if (pathname === '/explore') {
    const response = NextResponse.next();
    
    // Add headers to trigger initialization
    response.headers.set('x-init-required', 'true');
    
    return response;
  }

  // Root redirect to explore page
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/explore', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
