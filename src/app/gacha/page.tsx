"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"

import { LoadingSpinner } from "@/components/ui"
import { GachaPullScreen } from "@/screens/PublicScreens"

function GachaContent() {
  const searchParams = useSearchParams()
  const triggerPull = searchParams.get("triggerPull") === "true"
  const eventId = searchParams.get("eventId")
  const pullType = searchParams.get("pullType") as "single" | "ten" | null

  return (
    <GachaPullScreen
      triggerPull={triggerPull}
      eventId={eventId}
      pullType={pullType}
    />
  )
}

export default function GachaPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <LoadingSpinner message="Loading..." />
        </div>
      }
    >
      <GachaContent />
    </Suspense>
  )
}
