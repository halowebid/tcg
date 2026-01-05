"use client"

import { Suspense } from "react"
import { useParams, useSearchParams } from "next/navigation"

import { LoadingSpinner } from "@/components/ui"
import { GachaPullScreen } from "@/screens/PublicScreens"

function GachaEventContent() {
  const params = useParams()
  const searchParams = useSearchParams()
  const eventId = params["id"] as string
  const triggerPull = searchParams.get("triggerPull") === "true"
  const pullType = searchParams.get("pullType") as "single" | "ten" | null

  return (
    <GachaPullScreen
      eventId={eventId}
      triggerPull={triggerPull}
      pullType={pullType}
    />
  )
}

export default function GachaEventPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <LoadingSpinner message="Loading..." />
        </div>
      }
    >
      <GachaEventContent />
    </Suspense>
  )
}
