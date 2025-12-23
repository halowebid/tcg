"use client"

import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      position="bottom-center"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-surface-dark group-[.toaster]:border-border-dark group-[.toaster]:text-white group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-text-secondary",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-background-dark",
          cancelButton:
            "group-[.toast]:bg-surface-highlight group-[.toast]:text-white",
          error:
            "group-[.toast]:border-red-500/20 group-[.toast]:bg-red-500/10",
          success:
            "group-[.toast]:border-green-500/20 group-[.toast]:bg-green-500/10",
          warning:
            "group-[.toast]:border-yellow-500/20 group-[.toast]:bg-yellow-500/10",
          info: "group-[.toast]:border-blue-500/20 group-[.toast]:bg-blue-500/10",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
