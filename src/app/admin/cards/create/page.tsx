"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { z } from "zod"

import { trpc } from "@/lib/trpc/client"

const cardSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  imageUrl: z.string().url("Must be a valid URL"),
  rarity: z.enum(["common", "rare", "epic", "legendary"]),
  attackPower: z.number().int().min(0, "Attack power must be 0 or greater"),
  defensePower: z.number().int().min(0, "Defense power must be 0 or greater"),
  marketValue: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Must be a valid number")
    .optional(),
})

export default function AdminCreateCardPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
    rarity: "common" as "common" | "rare" | "epic" | "legendary",
    attackPower: 0,
    defensePower: 0,
    marketValue: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const createMutation = trpc.cards.create.useMutation({
    onSuccess: () => {
      toast.success("Card created successfully!")
      router.push("/admin/inventory")
    },
    onError: (error) => {
      toast.error(`Create failed: ${error.message}`)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form data
    const result = cardSchema.safeParse(formData)

    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message
        }
      })
      setErrors(fieldErrors)
      toast.error("Please fix the validation errors")
      return
    }

    setErrors({})
    createMutation.mutate(formData)
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="border-border-dark flex items-center justify-between border-b bg-[#2d241b] px-8 py-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Create New Card</h1>
          <p className="text-text-secondary text-sm">
            Add a new card to inventory
          </p>
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
            disabled={createMutation.isPending}
            className="bg-primary text-background-dark shadow-primary/20 hover:bg-primary-hover flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold shadow-lg disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-sm">save</span>{" "}
            {createMutation.isPending ? "Saving..." : "Save Card"}
          </button>
        </div>
      </div>

      <div className="custom-scrollbar overflow-y-auto p-8">
        <form onSubmit={handleSubmit} className="mx-auto max-w-4xl space-y-6">
          {/* Basic Info */}
          <div className="bg-surface-dark border-border-dark rounded-xl border p-6">
            <h3 className="mb-4 text-lg font-bold text-white">
              Basic Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-white">
                  Card Name <span className="text-primary">*</span>
                </label>
                <input
                  className={`bg-background-dark border-border-dark focus:border-primary focus:ring-primary mt-1 w-full rounded-xl border px-4 py-3 text-white outline-none focus:ring-1 ${
                    errors["name"] ? "border-red-500" : ""
                  }`}
                  placeholder="e.g. Celestial Paladin"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
                {errors["name"] && (
                  <p className="mt-1 text-xs text-red-500">{errors["name"]}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-white">
                  Image URL <span className="text-primary">*</span>
                </label>
                <input
                  className={`bg-background-dark border-border-dark focus:border-primary focus:ring-primary mt-1 w-full rounded-xl border px-4 py-3 text-white outline-none focus:ring-1 ${
                    errors["imageUrl"] ? "border-red-500" : ""
                  }`}
                  placeholder="https://example.com/image.jpg"
                  value={formData.imageUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, imageUrl: e.target.value })
                  }
                />
                {errors["imageUrl"] && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors["imageUrl"]}
                  </p>
                )}
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
                <label className="text-sm font-medium text-white">
                  Description
                </label>
                <textarea
                  className="bg-background-dark border-border-dark focus:border-primary mt-1 min-h-[120px] w-full rounded-xl border p-4 text-white outline-none"
                  placeholder="Flavor text..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                ></textarea>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-surface-dark border-border-dark rounded-xl border p-6">
            <h3 className="mb-4 text-lg font-bold text-white">Stats & Value</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-white">
                  Attack Power
                </label>
                <input
                  type="number"
                  className="bg-background-dark border-border-dark focus:border-primary mt-1 w-full rounded-xl border px-4 py-3 text-white outline-none"
                  value={formData.attackPower}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      attackPower: parseInt(e.target.value) ?? 0,
                    })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium text-white">
                  Defense Power
                </label>
                <input
                  type="number"
                  className="bg-background-dark border-border-dark focus:border-primary mt-1 w-full rounded-xl border px-4 py-3 text-white outline-none"
                  value={formData.defensePower}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      defensePower: parseInt(e.target.value) ?? 0,
                    })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium text-white">
                  Market Value (Coins)
                </label>
                <input
                  className="bg-background-dark border-border-dark focus:border-primary mt-1 w-full rounded-xl border px-4 py-3 text-white outline-none"
                  placeholder="100"
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
