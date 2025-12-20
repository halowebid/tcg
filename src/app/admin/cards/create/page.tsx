"use client"

import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { cardFormSchema, type CardFormInput } from "@/lib/db/schema/validations"
import { trpc } from "@/lib/trpc/client"

export default function AdminCreateCardPage() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CardFormInput>({
    resolver: zodResolver(cardFormSchema),
    defaultValues: {
      rarity: "common",
      attackPower: 0,
      defensePower: 0,
    },
  })

  const createMutation = trpc.cards.create.useMutation({
    onSuccess: () => {
      toast.success("Card created successfully!")
      router.push("/admin/inventory")
    },
    onError: (error) => {
      toast.error(`Create failed: ${error.message}`)
    },
  })

  const onSubmit = (data: CardFormInput) => {
    createMutation.mutate(data)
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
            onClick={handleSubmit(onSubmit)}
            disabled={createMutation.isPending}
            className="bg-primary text-background-dark shadow-primary/20 hover:bg-primary-hover flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold shadow-lg disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-sm">save</span>{" "}
            {createMutation.isPending ? "Saving..." : "Save Card"}
          </button>
        </div>
      </div>

      <div className="custom-scrollbar overflow-y-auto p-8">
        <div className="mx-auto max-w-4xl space-y-6">
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
                  {...register("name")}
                  className={`bg-background-dark border-border-dark focus:border-primary focus:ring-primary mt-1 w-full rounded-xl border px-4 py-3 text-white outline-none focus:ring-1 ${
                    errors.name ? "border-red-500" : ""
                  }`}
                  placeholder="e.g. Celestial Paladin"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-white">
                  Image URL <span className="text-primary">*</span>
                </label>
                <input
                  {...register("imageUrl")}
                  className={`bg-background-dark border-border-dark focus:border-primary focus:ring-primary mt-1 w-full rounded-xl border px-4 py-3 text-white outline-none focus:ring-1 ${
                    errors.imageUrl ? "border-red-500" : ""
                  }`}
                  placeholder="https://example.com/image.jpg"
                />
                {errors.imageUrl && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.imageUrl.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-white">Rarity</label>
                <select
                  {...register("rarity")}
                  className="bg-background-dark border-border-dark focus:border-primary mt-1 w-full rounded-xl border px-4 py-3 text-white outline-none"
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
                  {...register("description")}
                  className="bg-background-dark border-border-dark focus:border-primary mt-1 min-h-[120px] w-full rounded-xl border p-4 text-white outline-none"
                  placeholder="Flavor text..."
                ></textarea>
                {errors.description && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-surface-dark border-border-dark rounded-xl border p-6">
            <h3 className="mb-4 text-lg font-bold text-white">Stats & Value</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-white">
                  Attack Power
                </label>
                <input
                  type="number"
                  {...register("attackPower", { valueAsNumber: true })}
                  className="bg-background-dark border-border-dark focus:border-primary mt-1 w-full rounded-xl border px-4 py-3 text-white outline-none"
                />
                {errors.attackPower && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.attackPower.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-white">
                  Defense Power
                </label>
                <input
                  type="number"
                  {...register("defensePower", { valueAsNumber: true })}
                  className="bg-background-dark border-border-dark focus:border-primary mt-1 w-full rounded-xl border px-4 py-3 text-white outline-none"
                />
                {errors.defensePower && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.defensePower.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-white">
                  Market Value (Coins)
                </label>
                <input
                  {...register("marketValue")}
                  className="bg-background-dark border-border-dark focus:border-primary mt-1 w-full rounded-xl border px-4 py-3 text-white outline-none"
                  placeholder="100"
                />
                {errors.marketValue && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.marketValue.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
