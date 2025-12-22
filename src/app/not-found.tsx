"use client"

import { useRouter } from "next/navigation"
import { FileQuestionIcon } from "lucide-react"

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="bg-surface-dark border-border-dark w-full max-w-md rounded-2xl border p-8 text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-orange-500/10 p-4">
            <FileQuestionIcon className="size-16 text-orange-500" />
          </div>
        </div>
        <h2 className="mb-2 text-2xl font-bold text-white">
          404 - Page Not Found
        </h2>
        <p className="text-text-secondary mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => router.back()}
            className="border-border-dark hover:bg-surface-highlight rounded-lg border px-6 py-3 font-bold text-white transition-colors"
          >
            Go Back
          </button>
          <button
            onClick={() => (window.location.href = "/")}
            className="bg-primary hover:bg-primary-hover rounded-lg px-6 py-3 font-bold text-white transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  )
}
