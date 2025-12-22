import { NextResponse, type NextRequest } from "next/server"

import { auth } from "@/lib/auth"

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  const protectedRoutes = [
    "/admin",
    "/profile",
    "/checkout",
    "/milestones",
    "/notifications",
  ]

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  )

  if (isProtectedRoute) {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session) {
      return NextResponse.redirect(new URL("/", request.url))
    }

    if (pathname.startsWith("/admin")) {
      if (
        !session.user.role ||
        !["admin", "staff"].includes(session.user.role)
      ) {
        return NextResponse.redirect(new URL("/", request.url))
      }
    }

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
