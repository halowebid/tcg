import { forwardRef, type ComponentPropsWithoutRef } from "react"

interface IconProps extends ComponentPropsWithoutRef<"span"> {
  name: string
  filled?: boolean
}

export const Icon = forwardRef<HTMLSpanElement, IconProps>(
  ({ className = "", name, filled = false, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={`material-symbols-outlined ${filled ? "fill" : ""} ${className}`}
        {...props}
      >
        {name}
      </span>
    )
  },
)

Icon.displayName = "Icon"
