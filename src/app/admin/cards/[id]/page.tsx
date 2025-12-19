"use client"

import { useParams, useRouter } from "next/navigation"
import { trpc } from "@/lib/trpc/client"
import { useState, useEffect } from "react"

export default function AdminEditCardPage() {
  const params = useParams()
  const router = useRouter()
  const cardId = params["id"] as string

  const { data: card, isLoading } = trpc.cards.getById.useQuery({ id: cardId })
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
    rarity: "common" as "common" | "rare" | "epic" | "legendary",
    attackPower: 0,
    defensePower: 0,
    marketValue: "",
  })

  useEffect(() => {
    if (card) {
      setFormData({
        name: card.name,
        description: card.description || "",
        imageUrl: card.imageUrl,
        rarity: card.rarity,
        attackPower: card.attackPower || 0,
        defensePower: card.defensePower || 0,
        marketValue: card.marketValue || "",
      })
    }
  }, [card])

  const updateMutation = trpc.cards.update.useMutation({
    onSuccess: () => {
      alert("Card updated successfully!")
      router.push("/admin/inventory")
    },
    onError: (error) => {
      alert(`Update failed: ${error.message}`)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateMutation.mutate({ id: cardId, ...formData })
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

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="border-border-dark flex items-center justify-between border-b bg-[#2d241b] px-8 py-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Edit Card</h1>
          <p className="text-text-secondary text-sm">Modify card details</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => router.push("/admin/inventory")}
            className="border-border-dark hover:bg-surface-highlight rounded-lg border px-4 py-2 text-sm font-bold text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={updateMutation.isPending}
            className="bg-primary text-background-dark shadow-primary/20 hover:bg-primary-hover flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold shadow-lg disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-sm">save</span>{" "}
            {updateMutation.isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="custom-scrollbar overflow-y-auto p-8">
        <form onSubmit={handleSubmit} className="mx-auto max-w-4xl space-y-6">
          {/* Same form fields as create page */}
          <div className="bg-surface-dark border-border-dark rounded-xl border p-6">
            <h3 className="mb-4 text-lg font-bold text-white">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-white">Card Name</label>
                <input
                  className="bg-background-dark border-border-dark focus:border-primary focus:ring-primary mt-1 w-full rounded-xl border px-4 py-3 text-white outline-none focus:ring-1"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium text-white">Image URL</label>
                <input
                  className="bg-background-dark border-border-dark focus:border-primary focus:ring-primary mt-1 w-full rounded-xl border px-4 py-3 text-white outline-none focus:ring-1"
                  value={formData.imageUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, imageUrl: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium text-white">Rarity</label>
                <select
                  className="bg-background-dark border-border-dark focus:border-primary mt-1 w-full rounded-xl border px-4 py-3 text-white outline-none"
                  value={formData.rarity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      rarity: e.target.value as
                        | "common"
                        | "rare"
                        | "epic"
                        | "legendary",
                    })
                  }
                >
                  <option value="common">Common</option>
                  <option value="rare">Rare</option>
                  <option value="epic">Epic</option>
                  <option value="legendary">Legendary</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-white">Description</label>
                <textarea
                  className="bg-background-dark border-border-dark focus:border-primary min-h-[120px] mt-1 w-full rounded-xl border p-4 text-white outline-none"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                ></textarea>
              </div>
            </div>
          </div>

          <div className="bg-surface-dark border-border-dark rounded-xl border p-6">
            <h3 className="mb-4 text-lg font-bold text-white">Stats & Value</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-white">Attack Power</label>
                <input
                  type="number"
                  className="bg-background-dark border-border-dark focus:border-primary mt-1 w-full rounded-xl border px-4 py-3 text-white outline-none"
                  value={formData.attackPower}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      attackPower: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium text-white">Defense Power</label>
                <input
                  type="number"
                  className="bg-background-dark border-border-dark focus:border-primary mt-1 w-full rounded-xl border px-4 py-3 text-white outline-none"
                  value={formData.defensePower}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      defensePower: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium text-white">Market Value (Coins)</label>
                <input
                  className="bg-background-dark border-border-dark focus:border-primary mt-1 w-full rounded-xl border px-4 py-3 text-white outline-none"
                  value={formData.marketValue}
                  onChange={(e) =>
                    setFormData({ ...formData, marketValue: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
