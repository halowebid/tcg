import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/lib/auth"

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Define routes that require authentication
  const protectedRoutes = [
    "/admin",
    "/profile",
    "/checkout",
    "/milestones",
    "/notifications",
  ]

  // Check if current path requires authentication
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )

  if (isProtectedRoute) {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session) {
      // Redirect to login if not authenticated
      return NextResponse.redirect(new URL("/", request.url))
    }

    // For admin routes, the tRPC adminProcedure will handle the actual admin check
    return NextResponse.next()
  }

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
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
