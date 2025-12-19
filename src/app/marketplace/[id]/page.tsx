"use client"

import { useParams, useRouter } from "next/navigation"
import { trpc } from "@/lib/trpc/client"

export default function MarketplaceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const cardId = params["id"] as string

  const { data: card, isLoading, error } = trpc.cards.getById.useQuery({ id: cardId })
  const purchaseMutation = trpc.marketplace.purchase.useMutation({
    onSuccess: () => {
      alert("Card purchased successfully!")
      router.push("/collection")
    },
    onError: (error) => {
      alert(`Purchase failed: ${error.message}`)
    },
  })

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-text-secondary">Loading card details...</div>
      </div>
    )
  }

  if (error || !card) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2 text-xl font-bold text-white">Card Not Found</h2>
          <p className="text-text-secondary mb-4">
            The card you're looking for doesn't exist.
          </p>
          <button
            onClick={() => router.push("/marketplace")}
            className="bg-primary text-background-dark rounded-lg px-4 py-2 font-bold"
          >
            Back to Marketplace
          </button>
        </div>
      </div>
    )
  }

  const price = card.marketValue ? parseFloat(card.marketValue) : 100

  return (
    <div className="flex w-full flex-col items-center px-4 py-8 md:px-10">
      <div className="grid w-full max-w-[1200px] grid-cols-1 gap-12 lg:grid-cols-12">
        {/* Left: Image */}
        <div className="flex flex-col gap-6 lg:col-span-7">
          <div className="bg-surface-dark border-border-dark from-primary/10 relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-2xl border bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] to-transparent">
            <div className="bg-primary/20 absolute inset-0 opacity-20 blur-[100px]"></div>
            <img
              src={card.imageUrl || "https://via.placeholder.com/400"}
              alt={card.name}
              className="z-10 h-[85%] object-contain shadow-2xl shadow-black/50"
            />
          </div>
        </div>

        {/* Right: Info */}
        <div className="flex flex-col lg:col-span-5">
          <div className="border-border-dark mb-6 border-b pb-6">
            <div className="mb-3 flex items-center gap-3">
              <span
                className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                  card.rarity === "legendary"
                    ? "bg-primary/20 text-primary border-primary/20"
                    : card.rarity === "epic"
                      ? "border-purple-500/20 bg-purple-500/20 text-purple-400"
                      : card.rarity === "rare"
                        ? "border-blue-500/20 bg-blue-500/20 text-blue-400"
                        : "border-gray-500/20 bg-gray-500/20 text-gray-400"
                }`}
              >
                {card.rarity}
              </span>
            </div>
            <h1 className="mb-2 text-4xl font-bold text-white">{card.name}</h1>
            {card.description && (
              <p className="text-text-secondary text-lg">{card.description}</p>
            )}
          </div>

          <div className="mb-8 flex flex-col gap-4">
            <div className="border-primary/30 relative flex items-center justify-between overflow-hidden rounded-xl border bg-gradient-to-br from-[#3d2c1e] to-[#2a221b] p-5">
              <span className="material-symbols-outlined text-primary absolute right-[-20px] top-[-20px] rotate-12 text-9xl opacity-10">
                monetization_on
              </span>
              <div className="relative z-10">
                <p className="text-primary mb-1 text-sm font-bold uppercase">
                  Direct Purchase
                </p>
                <span className="text-3xl font-bold text-white">
                  {price} Coins
                </span>
              </div>
              <button
                onClick={() => purchaseMutation.mutate({ cardId: card.id })}
                disabled={purchaseMutation.isPending}
                className="bg-primary hover:bg-primary-hover relative z-10 flex items-center gap-2 rounded-lg px-6 py-3 font-bold text-white shadow-lg disabled:opacity-50"
              >
                <span className="material-symbols-outlined">
                  {purchaseMutation.isPending ? "hourglass_empty" : "shopping_cart"}
                </span>
                {purchaseMutation.isPending ? "Purchasing..." : "Buy Now"}
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          {(card.attackPower !== null || card.defensePower !== null) && (
            <div className="mb-8 grid grid-cols-2 gap-3">
              {card.attackPower !== null && (
                <div className="bg-surface-dark border-border-dark rounded-lg border p-3">
                  <div className="text-text-secondary mb-1 flex items-center gap-1 text-xs font-bold uppercase">
                    <span className="material-symbols-outlined text-sm">
                      swords
                    </span>{" "}
                    Attack
                  </div>
                  <div className="font-mono text-lg text-white">
                    {card.attackPower}
                  </div>
                </div>
              )}
              {card.defensePower !== null && (
                <div className="bg-surface-dark border-border-dark rounded-lg border p-3">
                  <div className="text-text-secondary mb-1 flex items-center gap-1 text-xs font-bold uppercase">
                    <span className="material-symbols-outlined text-sm">
                      shield
                    </span>{" "}
                    Defense
                  </div>
                  <div className="font-mono text-lg text-white">
                    {card.defensePower}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
