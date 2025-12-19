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
  
  // Check if user is admin from user_profiles
  const { db } = await import("@/lib/db")
  const { userProfiles } = await import("@/lib/db/schema")
  const { eq } = await import("drizzle-orm")
  
  const profile = await db.query.userProfiles.findFirst({
    where: eq(userProfiles.userId, session.user.id),
  })

  if (!profile?.isAdmin) {
    throw new Error("Forbidden: Admin access required")
  }

  return { session, profile }
}
