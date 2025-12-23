"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { ShoppingCart, Trash2, X } from "lucide-react"

import {
  Button,
  EmptyState,
  LoadingSpinner,
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui"
import { useCart } from "@/lib/hooks/useCart"
import { formatUSD } from "@/lib/utils/currency"
import { CartItem } from "./CartItem"

export function CartSidebar() {
  const router = useRouter()
  const {
    isCartOpen,
    setIsCartOpen,
    cartData,
    isLoading,
    removeFromCart,
    clearCart,
  } = useCart()

  const handleCheckout = () => {
    setIsCartOpen(false)
    router.push("/checkout?source=cart")
  }

  const handleClearCart = async () => {
    if (confirm("Are you sure you want to clear all items from your cart?")) {
      await clearCart()
    }
  }

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen} side="right">
      <SheetContent>
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle>Shopping Cart</SheetTitle>
            <div className="flex gap-2">
              {cartData && cartData.itemCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearCart}
                  className="h-8 px-2 text-red-500 hover:bg-red-500/20 hover:text-red-400"
                  title="Clear all items"
                >
                  <Trash2 className="mr-1 h-4 w-4" />
                  Clear All
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCartOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </SheetHeader>

        <div className="custom-scrollbar flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : !cartData || cartData.itemCount === 0 ? (
            <EmptyState
              icon={ShoppingCart}
              title="Your cart is empty"
              description="Add some cards to your cart to get started"
            />
          ) : (
            <div className="space-y-3">
              {cartData.items.map((item) => (
                <CartItem key={item.id} {...item} onRemove={removeFromCart} />
              ))}
            </div>
          )}
        </div>

        {cartData && cartData.itemCount > 0 && (
          <SheetFooter>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-rajdhani text-lg font-semibold">
                  Total:
                </span>
                <span className="font-rajdhani text-accent-primary text-xl font-bold">
                  {formatUSD(cartData.totalPrice)}
                </span>
              </div>
              <Button
                onClick={handleCheckout}
                className="bg-primary hover:bg-primary-hover w-full text-white"
                size="lg"
              >
                Checkout ({cartData.itemCount}{" "}
                {cartData.itemCount === 1 ? "item" : "items"})
              </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}
