import { forwardRef, type ComponentPropsWithoutRef } from "react"

interface AvatarProps extends ComponentPropsWithoutRef<"div"> {
  src?: string
  alt?: string
  fallback?: string
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className = "", src, alt, fallback, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`relative inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gray-100 ${className}`}
        {...props}
      >
        {src ? (
          <img
            src={src}
            alt={alt ?? "Avatar"}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-sm font-medium text-gray-600">
            {fallback ?? alt?.charAt(0).toUpperCase() ?? "?"}
          </span>
        )}
      </div>
    )
  },
)

Avatar.displayName = "Avatar"
