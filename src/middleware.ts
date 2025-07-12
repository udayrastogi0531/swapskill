// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Root redirect to explore page
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/explore', request.url));
  }

  // Initialize project data on first visit to explore page
  if (pathname === '/explore') {
    const response = NextResponse.next();
    response.headers.set('x-init-required', 'true');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
