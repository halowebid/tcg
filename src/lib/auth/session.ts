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

export const requireAdmin = async () => {
  const session = await requireAuth()

  if (session.user.role !== "admin") {
    throw new Error("Forbidden: Admin access required")
  }

  return session
}
