import React from "react"

interface CardSkeletonProps {
  count?: number
  className?: string
}

export const CardSkeleton: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  return (
    <div
      className={`bg-surface-dark border-border-dark group relative flex flex-col overflow-hidden rounded-2xl border ${className}`}
    >
      <div className="relative aspect-[4/5] w-full animate-pulse overflow-hidden bg-gray-800"></div>
      <div className="flex flex-col gap-2 p-4">
        <div className="h-5 w-3/4 animate-pulse rounded bg-gray-700"></div>
        <div className="mt-2 flex items-center justify-between border-t border-gray-700 pt-4">
          <div className="h-4 w-16 animate-pulse rounded bg-gray-700"></div>
          <div className="h-8 w-16 animate-pulse rounded bg-gray-700"></div>
        </div>
      </div>
    </div>
  )
}

export const CardGridSkeleton: React.FC<CardSkeletonProps> = ({
  count = 8,
  className = "",
}) => {
  return (
    <div
      className={`grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 ${className}`}
    >
      {Array.from({ length: count }).map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  )
}
