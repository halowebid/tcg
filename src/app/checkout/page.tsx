"use client"

import { Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { trpc } from "@/lib/trpc/client"

function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const cardId = searchParams.get("cardId")

  const { data: card, isLoading } = trpc.cards.getById.useQuery(
    { id: cardId || "" },
    { enabled: !!cardId }
  )

  const purchaseMutation = trpc.marketplace.purchase.useMutation({
    onSuccess: () => {
      alert("Purchase completed successfully!")
      router.push("/collection")
    },
    onError: (error) => {
      alert(`Purchase failed: ${error.message}`)
    },
  })

  if (!cardId) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2 text-xl font-bold text-white">No Items in Cart</h2>
          <p className="text-text-secondary mb-4">
            Add items to your cart to checkout
          </p>
          <button
            onClick={() => router.push("/marketplace")}
            className="bg-primary text-background-dark rounded-lg px-4 py-2 font-bold"
          >
            Browse Marketplace
          </button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-text-secondary">Loading...</div>
      </div>
    )
  }

  if (!card) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-text-secondary">Card not found</div>
      </div>
    )
  }

  const price = card.marketValue ? parseFloat(card.marketValue) : 100
  const tax = price * 0.0 // No tax for now
  const total = price + tax

  const handleCheckout = () => {
    purchaseMutation.mutate({ cardId: card.id })
  }

  return (
    <div className="flex justify-center px-4 py-8">
      <div className="flex w-full max-w-[1200px] flex-col gap-12 lg:flex-row">
        <div className="flex-1">
          <h1 className="mb-8 text-3xl font-bold text-white">Checkout</h1>
          <div className="flex flex-col gap-6">
            <div className="bg-surface-dark border-border-dark rounded-xl border p-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
                <span className="material-symbols-outlined text-primary">
                  contact_mail
                </span>{" "}
                Contact Info
              </h3>
              <input
                className="bg-background-dark border-border-dark focus:border-primary focus:ring-primary w-full rounded-xl border px-4 py-3 text-white outline-none focus:ring-1"
                placeholder="Email Address"
                defaultValue="user@example.com"
              />
            </div>
            <div className="bg-surface-dark border-border-dark rounded-xl border p-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
                <span className="material-symbols-outlined text-primary">
                  account_balance_wallet
                </span>{" "}
                Payment Method
              </h3>
              <div className="mb-4 flex gap-2">
                <button className="bg-primary text-background-dark flex-1 rounded-lg py-2 font-bold">
                  Wallet
                </button>
                <button className="bg-background-dark text-text-secondary border-border-dark flex-1 rounded-lg border py-2">
                  Card (Mock)
                </button>
              </div>
              <p className="text-text-secondary text-sm">
                Payment will be deducted from your wallet balance
              </p>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[400px]">
          <div className="bg-surface-dark border-border-dark sticky top-24 rounded-xl border p-6">
            <h3 className="mb-4 text-lg font-bold text-white">Order Summary</h3>
            <div className="mb-6 flex flex-col gap-4">
              <div className="flex gap-3">
                <img
                  src={card.imageUrl || "https://via.placeholder.com/100"}
                  alt={card.name}
                  className="border-border-dark h-20 w-16 rounded-lg border object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm font-bold text-white">{card.name}</p>
                  <p className="text-text-secondary text-xs">{card.rarity}</p>
                  <p className="text-primary mt-1 font-bold">{price} Coins</p>
                </div>
              </div>
            </div>
            <div className="border-border-dark flex flex-col gap-2 border-t pt-4">
              <div className="text-text-secondary flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{price} Coins</span>
              </div>
              <div className="text-text-secondary flex justify-between text-sm">
                <span>Tax</span>
                <span>{tax} Coins</span>
              </div>
              <div className="mt-2 flex justify-between text-lg font-bold text-white">
                <span>Total</span>
                <span>{total} Coins</span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              disabled={purchaseMutation.isPending}
              className="bg-primary hover:bg-primary-hover text-background-dark mt-6 w-full rounded-xl py-3 font-bold disabled:opacity-50"
            >
              {purchaseMutation.isPending ? "Processing..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-text-secondary">Loading checkout...</div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  )
}
