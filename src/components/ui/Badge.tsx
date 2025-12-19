import { type ComponentPropsWithoutRef, forwardRef } from "react"

type BadgeVariant = "default" | "legendary" | "epic" | "rare" | "common" | "success" | "warning" | "danger"

interface BadgeProps extends ComponentPropsWithoutRef<"span"> {
  variant?: BadgeVariant
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className = "", variant = "default", ...props }, ref) => {
    const variants: Record<BadgeVariant, string> = {
      default: "bg-gray-100 text-gray-800 border-gray-200",
      legendary: "bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-yellow-600 font-bold shadow-lg",
      epic: "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-600 font-semibold",
      rare: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-blue-600",
      common: "bg-gray-300 text-gray-700 border-gray-400",
      success: "bg-green-100 text-green-800 border-green-200",
      warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
      danger: "bg-red-100 text-red-800 border-red-200",
    }

    return (
      <span
        ref={ref}
        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors ${variants[variant]} ${className}`}
        {...props}
      />
    )
  },
)

Badge.displayName = "Badge"
