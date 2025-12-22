"use client"

import { useEffect } from "react"
import { AlertCircleIcon } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="bg-surface-dark border-border-dark w-full max-w-md rounded-2xl border p-8 text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-red-500/10 p-4">
            <AlertCircleIcon className="size-16 text-red-500" />
          </div>
        </div>
        <h2 className="mb-2 text-2xl font-bold text-white">
          Something went wrong!
        </h2>
        <p className="text-text-secondary mb-6">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="bg-primary hover:bg-primary-hover rounded-lg px-6 py-3 font-bold text-white transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => (window.location.href = "/")}
            className="border-border-dark hover:bg-surface-highlight rounded-lg border px-6 py-3 font-bold text-white transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  )
}
