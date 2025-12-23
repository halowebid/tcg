"use client"

import React, { createContext, useEffect, useState } from "react"
import { toast } from "sonner"

import { useSession } from "@/lib/auth/client"
import { trpc } from "@/lib/trpc/client"

interface CartContextValue {
  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void
  cartData:
    | {
        items: {
          id: string
          cardId: string
          name: string
          imageUrl: string | null
          rarity: string
          price: number
          addedAt: Date
        }[]
        totalPrice: number
        itemCount: number
      }
    | undefined
    | null
  isLoading: boolean
  addToCart: (cardId: string) => Promise<void>
  removeFromCart: (cardId: string) => Promise<void>
  clearCart: () => Promise<void>
}

export const CartContext = createContext<CartContextValue | undefined>(
  undefined,
)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const utils = trpc.useUtils()
  const { data: session } = useSession()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const { data: cartData, isLoading } = trpc.cart.getItems.useQuery(undefined, {
    refetchOnWindowFocus: false,
    enabled: isMounted && !!session?.user,
  })

  const addMutation = trpc.cart.addItem.useMutation({
    onSuccess: (data) => {
      toast.success(data.message)
      void utils.cart.getItems.invalidate()
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const removeMutation = trpc.cart.removeItem.useMutation({
    onSuccess: () => {
      toast.success("Item removed from cart")
      void utils.cart.getItems.invalidate()
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const clearMutation = trpc.cart.clear.useMutation({
    onSuccess: () => {
      toast.success("Cart cleared")
      void utils.cart.getItems.invalidate()
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const addToCart = async (cardId: string) => {
    await addMutation.mutateAsync({ cardId })
  }

  const removeFromCart = async (cardId: string) => {
    await removeMutation.mutateAsync({ cardId })
  }

  const clearCart = async () => {
    await clearMutation.mutateAsync()
  }

  return (
    <CartContext.Provider
      value={{
        isCartOpen,
        setIsCartOpen,
        cartData: cartData as CartContextValue["cartData"],
        isLoading,
        addToCart,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
