import { type ComponentPropsWithoutRef, forwardRef } from "react"

interface ProgressProps extends Omit<ComponentPropsWithoutRef<"div">, "value"> {
  value: number
  max?: number
  showLabel?: boolean
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({ className = "", value, max = 100, showLabel = false, ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

    return (
      <div ref={ref} className={`w-full ${className}`} {...props}>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
        {showLabel && (
          <div className="mt-1 text-xs text-gray-600">
            {value} / {max}
          </div>
        )}
      </div>
    )
  },
)

Progress.displayName = "Progress"
