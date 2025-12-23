"use client"

import React from "react"

interface SheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  side?: "left" | "right"
  children: React.ReactNode
}

export function Sheet({
  open,
  onOpenChange,
  side = "right",
  children,
}: SheetProps) {
  if (!open) return null

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      <div
        className={`bg-background-dark fixed top-0 z-50 h-full w-full shadow-xl transition-transform duration-300 sm:w-96 ${
          side === "right" ? "right-0" : "left-0"
        } ${open ? "translate-x-0" : side === "right" ? "translate-x-full" : "-translate-x-full"}`}
      >
        {children}
      </div>
    </>
  )
}

interface SheetContentProps {
  children: React.ReactNode
}

export function SheetContent({ children }: SheetContentProps) {
  return <div className="flex h-full flex-col">{children}</div>
}

interface SheetHeaderProps {
  children: React.ReactNode
}

export function SheetHeader({ children }: SheetHeaderProps) {
  return <div className="border-border-dark border-b p-4">{children}</div>
}

interface SheetTitleProps {
  children: React.ReactNode
}

export function SheetTitle({ children }: SheetTitleProps) {
  return <h2 className="font-rajdhani text-2xl font-bold">{children}</h2>
}

interface SheetFooterProps {
  children: React.ReactNode
}

export function SheetFooter({ children }: SheetFooterProps) {
  return <div className="border-border-dark border-t p-4">{children}</div>
}
