import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { decrypt, updateSession } from "@/lib/auth"

export async function middleware(request: NextRequest) {
    const session = request.cookies.get("session")?.value
    // Decrypt session to get user details
    const payload = session ? await decrypt(session) : null

    const isAuth = !!payload
    const isAdmin = payload?.role === "admin"
    const isUser = payload?.role === "user"

    // Route definitions
    const isAdminRoute = request.nextUrl.pathname.startsWith("/admin")
    const isDashboardRoute = request.nextUrl.pathname.startsWith("/dashboard")
    const isLoginRoute = request.nextUrl.pathname.startsWith("/login")
    const isRoot = request.nextUrl.pathname === "/"

    // 1. Protect Admin Routes
    if (isAdminRoute && !isAdmin) {
        // If trying to access admin login page, allow it
        if (request.nextUrl.pathname === "/admin/login") {
            // If already logged in as admin, redirect to admin dashboard
            if (isAdmin) {
                return NextResponse.redirect(new URL("/admin", request.url))
            }
            return NextResponse.next()
        }
        // Redirect unauthenticated or non-admin users to admin login
        return NextResponse.redirect(new URL("/admin/login", request.url))
    }

    // 2. Protect User Dashboard Routes
    if (isDashboardRoute && !isUser) {
        return NextResponse.redirect(new URL("/login", request.url))
    }

    // 3. Authenticated users shouldn't see login pages (unless switching accounts, but standard flow prevents it)
    if (isLoginRoute && isUser && request.nextUrl.pathname !== "/login/otp") {
        // If user is logged in, send them to dashboard
        // Exception: verify-otp page (might be needed if session is partial) - but here we assume full session
        return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    return await updateSession(request)
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (images, etc)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
