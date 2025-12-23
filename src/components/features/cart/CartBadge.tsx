"use client"

import React from "react"

import { Badge } from "@/components/ui"

interface CartBadgeProps {
  itemCount: number
}

export function CartBadge({ itemCount }: CartBadgeProps) {
  if (itemCount === 0) return null

  return (
    <Badge className="bg-accent-primary absolute -top-2 -right-2 min-w-[20px] rounded-full px-1.5 py-0.5 text-xs font-bold">
      {itemCount}
    </Badge>
  )
}
