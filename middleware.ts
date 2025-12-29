import { NextRequest, NextResponse } from 'next/server';

// Define public routes that don't require authentication
const publicRoutes = [
  '/',
  '/login',
  '/register',
  '/forgot-pin',
  '/forgot-pin/reset',
  '/loading-secure',
  '/api/send-otp',
  '/api/verify-otp',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/forgot-pin',
  '/api/registrations',
];

export function middleware(request: NextRequest) {
  // Allow public routes
  if (publicRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
    return NextResponse.next();
  }
  
  // For protected routes, you can add your authentication logic here
  // For now, we'll allow all routes for testing purposes
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
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};