import { forwardRef, type ComponentPropsWithoutRef } from "react"

type CardProps = ComponentPropsWithoutRef<"div">

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`rounded-lg border border-gray-200 bg-white shadow-sm ${className}`}
        {...props}
      />
    )
  },
)

Card.displayName = "Card"

export const CardHeader = forwardRef<HTMLDivElement, CardProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`flex flex-col space-y-1.5 p-6 ${className}`}
        {...props}
      />
    )
  },
)

CardHeader.displayName = "CardHeader"

export const CardTitle = forwardRef<
  HTMLHeadingElement,
  ComponentPropsWithoutRef<"h3">
>(({ className = "", ...props }, ref) => {
  return (
    <h3
      ref={ref}
      className={`text-2xl leading-none font-semibold tracking-tight ${className}`}
      {...props}
    />
  )
})

CardTitle.displayName = "CardTitle"

export const CardDescription = forwardRef<
  HTMLParagraphElement,
  ComponentPropsWithoutRef<"p">
>(({ className = "", ...props }, ref) => {
  return (
    <p ref={ref} className={`text-sm text-gray-600 ${className}`} {...props} />
  )
})

CardDescription.displayName = "CardDescription"

export const CardContent = forwardRef<HTMLDivElement, CardProps>(
  ({ className = "", ...props }, ref) => {
    return <div ref={ref} className={`p-6 pt-0 ${className}`} {...props} />
  },
)

CardContent.displayName = "CardContent"

export const CardFooter = forwardRef<HTMLDivElement, CardProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`flex items-center p-6 pt-0 ${className}`}
        {...props}
      />
    )
  },
)

CardFooter.displayName = "CardFooter"
