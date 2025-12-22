import { cache } from "react"
import { headers } from "next/headers"

import { auth } from "./index"

export const getSession = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  return session
})

export const requireAuth = async () => {
  const session = await getSession()
  if (!session) {
    throw new Error("Unauthorized")
  }
  return session
}

export const requireStaff = async () => {
  const session = await requireAuth()

  if (!session.user.role || !["admin", "staff"].includes(session.user.role)) {
    throw new Error("Forbidden: Staff access required")
  }

  return session
}

export const requireAdminOnly = async () => {
  const session = await requireAuth()

  if (session.user.role !== "admin") {
    throw new Error("Forbidden: Admin access required")
  }

  return session
}

// Alias for backward compatibility
export const requireAdmin = requireAdminOnly
