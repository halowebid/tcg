import React from "react"

interface LoadingSpinnerProps {
  message?: string
  size?: "sm" | "md" | "lg"
  className?: string
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message,
  size = "md",
  className = "",
}) => {
  const sizeClasses = {
    sm: "size-4 border-2",
    md: "size-8 border-4",
    lg: "size-12 border-4",
  }

  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 ${className}`}
    >
      <div
        className={`${sizeClasses[size]} border-primary animate-spin rounded-full border-t-transparent`}
      ></div>
      {message && <p className="text-text-secondary text-sm">{message}</p>}
    </div>
  )
}
