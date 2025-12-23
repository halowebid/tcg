"use client"

/* eslint-disable @next/next/no-img-element */
import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { MailIcon, WalletIcon } from "lucide-react"
import { toast } from "sonner"

import { ConfirmModal } from "@/components/ui"
import { useCart } from "@/lib/hooks/useCart"
import { trpc } from "@/lib/trpc/client"
import { formatUSD } from "@/lib/utils/currency"

function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const source = searchParams.get("source")
  const cardId = searchParams.get("cardId")
  const amount = searchParams.get("amount")
  const pulls = searchParams.get("pulls")
  const eventId = searchParams.get("eventId")
  const errorMessage = searchParams.get("error")
  const [showOrderConfirm, setShowOrderConfirm] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"wallet" | "gateway">(
    "gateway",
  )
  const { cartData } = useCart()
  const utils = trpc.useUtils()

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage)
    }
  }, [errorMessage])

  const { data: card, isLoading: cardLoading } = trpc.cards.getById.useQuery(
    { id: cardId ?? "" },
    { enabled: source === "direct" && !!cardId },
  )
  const { data: wallet } = trpc.users.getWallet.useQuery()

  const purchaseMutation = trpc.marketplace.purchase.useMutation({
    onSuccess: async () => {
      setShowOrderConfirm(false)
      await utils.users.getWallet.invalidate()
      toast.success("Purchase completed successfully!")
      router.push("/collection")
    },
    onError: (error) => {
      setShowOrderConfirm(false)
      toast.error(`Purchase failed: ${error.message}`)
    },
  })

  const cartCheckoutMutation = trpc.cart.checkout.useMutation({
    onSuccess: async () => {
      setShowOrderConfirm(false)
      await utils.cart.getItems.invalidate()
      await utils.users.getWallet.invalidate()
      toast.success("Cart checkout completed successfully!")
      setTimeout(() => {
        router.push("/collection")
      }, 500)
    },
    onError: (error) => {
      setShowOrderConfirm(false)
      toast.error(`Checkout failed: ${error.message}`)
    },
  })

  const topUpMutation = trpc.users.topUp.useMutation({
    onSuccess: async (data) => {
      setShowOrderConfirm(false)
      await utils.users.getWallet.invalidate()
      toast.success("Funds added successfully!")
      setTimeout(() => {
        if (data.eventId && data.pullType) {
          router.push(
            `/gacha?triggerPull=true&eventId=${data.eventId}&pullType=${data.pullType}`,
          )
        } else {
          router.push("/profile")
        }
      }, 1500)
    },
    onError: (error) => {
      setShowOrderConfirm(false)
      toast.error(`Payment failed: ${error.message}`)
    },
  })

  const isCartCheckout = source === "cart"
  const isGachaCheckout = source === "gacha"
  const isTopUpCheckout = source === "topup"
  const isLoading = cardLoading

  if (!isCartCheckout && !isGachaCheckout && !isTopUpCheckout && !cardId) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2 text-xl font-bold text-white">
            No Items Selected
          </h2>
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

  if (isCartCheckout && (!cartData || cartData.itemCount === 0)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2 text-xl font-bold text-white">Cart is Empty</h2>
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

  if (!isCartCheckout && !isGachaCheckout && !isTopUpCheckout && !card) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2 text-xl font-bold text-white">Card Not Found</h2>
          <p className="text-text-secondary mb-4">
            The card you're looking for doesn't exist
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

  const subtotal =
    isCartCheckout && cartData
      ? cartData.totalPrice
      : isGachaCheckout && amount
        ? parseFloat(amount)
        : isTopUpCheckout && amount
          ? parseFloat(amount)
          : card
            ? card.marketValue
              ? parseFloat(card.marketValue)
              : 100
            : 0
  const tax = subtotal * 0.0
  const total = subtotal + tax
  const canAfford = (wallet?.balance ?? 0) >= total

  const handleCheckout = () => {
    setShowOrderConfirm(true)
  }

  const handleConfirmOrder = () => {
    if (isCartCheckout) {
      cartCheckoutMutation.mutate({ paymentMethod })
    } else if (isGachaCheckout && amount && eventId) {
      topUpMutation.mutate({
        amount: parseFloat(amount),
        paymentMethod: "gateway",
        eventId,
        pullType: pulls === "10" ? "ten" : "single",
      })
    } else if (isTopUpCheckout && amount) {
      topUpMutation.mutate({
        amount: parseFloat(amount),
        paymentMethod: "gateway",
      })
    } else if (card) {
      purchaseMutation.mutate({ cardId: card.id })
    }
  }

  return (
    <div className="flex justify-center px-4 py-8">
      <ConfirmModal
        isOpen={showOrderConfirm}
        onClose={() => setShowOrderConfirm(false)}
        onConfirm={handleConfirmOrder}
        title="Confirm Order"
        message={`${
          isGachaCheckout
            ? `Add ${formatUSD(total)} to your wallet for gacha pull?`
            : isTopUpCheckout
              ? `Add ${formatUSD(total)} to your wallet?`
              : `Place order for ${isCartCheckout ? `${cartData?.itemCount} item(s)` : `"${card?.name}"`}?`
        }\n\nTotal: ${formatUSD(total)}${!canAfford && !isGachaCheckout && !isTopUpCheckout ? "\n\nWarning: Insufficient wallet balance!" : ""}`}
        confirmText="Place Order"
        cancelText="Cancel"
        variant="primary"
        isLoading={
          purchaseMutation.isPending ||
          cartCheckoutMutation.isPending ||
          topUpMutation.isPending
        }
      />

      <div className="flex w-full max-w-[1200px] flex-col gap-12 lg:flex-row">
        <div className="flex-1">
          <h1 className="mb-8 text-3xl font-bold text-white">Checkout</h1>
          <div className="flex flex-col gap-6">
            <div className="bg-surface-dark border-border-dark rounded-xl border p-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
                <MailIcon className="text-primary size-5" /> Contact Info
              </h3>
              <input
                className="bg-background-dark border-border-dark focus:border-primary focus:ring-primary w-full rounded-xl border px-4 py-3 text-white outline-none focus:ring-1"
                placeholder="Email Address"
                defaultValue="user@example.com"
              />
            </div>
            <div className="bg-surface-dark border-border-dark rounded-xl border p-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
                <WalletIcon className="text-primary size-5" /> Payment Method
              </h3>
              <div className="mb-4 flex gap-2">
                {!isGachaCheckout && !isTopUpCheckout && (
                  <button
                    onClick={() => setPaymentMethod("wallet")}
                    disabled={!canAfford}
                    className={`flex-1 rounded-lg py-2 font-bold ${
                      paymentMethod === "wallet"
                        ? "bg-primary text-background-dark"
                        : "bg-background-dark text-text-secondary border-border-dark border"
                    } disabled:opacity-50`}
                  >
                    Wallet
                  </button>
                )}
                <button
                  onClick={() => setPaymentMethod("gateway")}
                  className={`${isGachaCheckout || isTopUpCheckout ? "w-full" : "flex-1"} rounded-lg py-2 font-bold ${
                    paymentMethod === "gateway"
                      ? "bg-primary text-background-dark"
                      : "bg-background-dark text-text-secondary border-border-dark border"
                  }`}
                >
                  Card (Mock)
                </button>
              </div>
              {paymentMethod === "wallet" && (
                <p className="text-text-secondary text-sm">
                  Current balance: {formatUSD(wallet?.balance ?? 0)}
                  {!canAfford && (
                    <span className="mt-2 block font-semibold text-red-400">
                      Insufficient balance!
                    </span>
                  )}
                </p>
              )}
              {paymentMethod === "gateway" && (
                <p className="text-text-secondary text-sm">
                  This is a mock payment gateway. No actual charges will be
                  made.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[400px]">
          <div className="bg-surface-dark border-border-dark sticky top-24 rounded-xl border p-6">
            <h3 className="mb-4 text-lg font-bold text-white">Order Summary</h3>
            <div className="mb-6 flex flex-col gap-4">
              {isCartCheckout && cartData ? (
                cartData.items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img
                      src={item.imageUrl ?? "https://via.placeholder.com/100"}
                      alt={item.name}
                      className="border-border-dark h-20 w-16 rounded-lg border object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-white">
                        {item.name}
                      </p>
                      <p className="text-text-secondary text-xs">
                        {item.rarity}
                      </p>
                      <p className="text-primary mt-1 font-bold">
                        {formatUSD(item.price)}
                      </p>
                    </div>
                  </div>
                ))
              ) : isGachaCheckout && pulls ? (
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-bold text-white">Gacha Pull</p>
                  <p className="text-text-secondary text-xs">
                    {pulls === "1" ? "Single Pull" : `${pulls}x Multi Pull`}
                  </p>
                  <p className="text-primary mt-1 font-bold">
                    {formatUSD(parseFloat(amount ?? "0"))}
                  </p>
                  <p className="text-text-secondary mt-2 text-xs">
                    Funds will be added to your wallet, then you'll be
                    redirected to complete your pull.
                  </p>
                </div>
              ) : isTopUpCheckout ? (
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-bold text-white">Wallet Top-Up</p>
                  <p className="text-text-secondary text-xs">
                    Add funds to your wallet
                  </p>
                  <p className="text-primary mt-1 font-bold">
                    {formatUSD(parseFloat(amount ?? "0"))}
                  </p>
                  <p className="text-text-secondary mt-2 text-xs">
                    Funds will be added to your wallet balance immediately after
                    payment.
                  </p>
                </div>
              ) : card ? (
                <div className="flex gap-3">
                  <img
                    src={card.imageUrl || "https://via.placeholder.com/100"}
                    alt={card.name}
                    className="border-border-dark h-20 w-16 rounded-lg border object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white">{card.name}</p>
                    <p className="text-text-secondary text-xs">{card.rarity}</p>
                    <p className="text-primary mt-1 font-bold">
                      {formatUSD(
                        card.marketValue ? parseFloat(card.marketValue) : 100,
                      )}
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
            <div className="border-border-dark flex flex-col gap-2 border-t pt-4">
              <div className="text-text-secondary flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatUSD(subtotal)}</span>
              </div>
              <div className="text-text-secondary flex justify-between text-sm">
                <span>Tax</span>
                <span>{formatUSD(tax)}</span>
              </div>
              <div className="mt-2 flex justify-between text-lg font-bold text-white">
                <span>Total</span>
                <span>{formatUSD(total)}</span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              disabled={
                purchaseMutation.isPending ||
                cartCheckoutMutation.isPending ||
                topUpMutation.isPending ||
                (paymentMethod === "wallet" && !canAfford) ||
                (isGachaCheckout && paymentMethod === "wallet")
              }
              className="bg-primary hover:bg-primary-hover text-background-dark mt-6 w-full rounded-xl py-3 font-bold disabled:opacity-50"
            >
              {purchaseMutation.isPending ||
              cartCheckoutMutation.isPending ||
              topUpMutation.isPending
                ? "Processing..."
                : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-text-secondary">Loading checkout...</div>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  )
}
