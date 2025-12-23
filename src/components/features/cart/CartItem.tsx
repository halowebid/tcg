"use client"

import React, { useState } from "react"
import Image from "next/image"
import { Trash2 } from "lucide-react"

import { Button } from "@/components/ui"
import { formatUSD } from "@/lib/utils/currency"

interface CartItemProps {
  id: string
  cardId: string
  name: string
  imageUrl: string | null
  rarity: string
  price: number
  onRemove: (cardId: string) => Promise<void>
}

export function CartItem({
  cardId,
  name,
  imageUrl,
  rarity,
  price,
  onRemove,
}: CartItemProps) {
  const [isRemoving, setIsRemoving] = useState(false)

  const handleRemove = async () => {
    setIsRemoving(true)
    try {
      await onRemove(cardId)
    } finally {
      setIsRemoving(false)
    }
  }

  return (
    <div className="border-border-dark bg-background-medium flex gap-3 rounded-lg border p-3">
      <div className="relative h-20 w-16 flex-shrink-0 overflow-hidden rounded">
        {imageUrl ? (
          <Image src={imageUrl} alt={name} fill className="object-cover" />
        ) : (
          <div className="bg-background-dark text-text-muted flex h-full w-full items-center justify-center text-xs">
            No Image
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <h3 className="font-rajdhani text-sm font-semibold">{name}</h3>
          <p className="text-text-muted text-xs capitalize">{rarity}</p>
        </div>
        <p className="font-rajdhani text-accent-primary text-sm font-bold">
          {formatUSD(price)}
        </p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleRemove}
        disabled={isRemoving}
        className="h-12 w-12 p-0 text-red-500 hover:bg-red-500/20 hover:text-red-400"
        title="Remove from cart"
      >
        <Trash2 className="h-6 w-6" />
      </Button>
    </div>
  )
}
