import { Suspense } from "react"
import { redirect } from "next/navigation"

import { LoadingSpinner } from "@/components/ui"
import { getSession } from "@/lib/auth/session"
import MilestonesClient from "./MilestonesClient"

export default async function MilestonesPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <LoadingSpinner />
        </div>
      }
    >
      <MilestonesClient />
    </Suspense>
  )
}
