import React from "react"
import { AlertCircleIcon, RefreshCwIcon } from "lucide-react"

import { Button } from "./Button"

interface ErrorDisplayProps {
  title?: string
  message?: string
  onRetry?: () => void
  className?: string
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  title = "Something went wrong",
  message = "We encountered an error while loading this content.",
  onRetry,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 text-center ${className}`}
    >
      <div className="bg-surface-dark border-border-dark rounded-xl border p-8">
        <AlertCircleIcon className="mx-auto mb-4 size-16 text-red-500" />
        <h2 className="mb-2 text-xl font-bold text-white">{title}</h2>
        <p className="text-text-secondary mb-4 max-w-md">{message}</p>
        {onRetry && (
          <Button
            onClick={onRetry}
            className="bg-primary hover:bg-primary-dark flex items-center gap-2"
          >
            <RefreshCwIcon className="size-4" />
            Try Again
          </Button>
        )}
      </div>
    </div>
  )
}
