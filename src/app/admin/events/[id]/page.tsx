"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { trpc } from "@/lib/trpc/client"
import { DashboardHeader } from "@/components/Headers"
import { toast } from "sonner"
import { z } from "zod"

const eventSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().min(1, "Description is required"),
  bannerUrl: z.string().url("Must be a valid URL"),
  startDate: z.string(),
  endDate: z.string(),
  packPriceCoins: z.number().int().positive("Must be a positive number"),
  packPriceGems: z.number().int().nonnegative("Must be zero or positive"),
  commonRate: z.string().regex(/^\d+(\.\d{1,4})?$/, "Must be a valid rate"),
  rareRate: z.string().regex(/^\d+(\.\d{1,4})?$/, "Must be a valid rate"),
  epicRate: z.string().regex(/^\d+(\.\d{1,4})?$/, "Must be a valid rate"),
  legendaryRate: z.string().regex(/^\d+(\.\d{1,4})?$/, "Must be a valid rate"),
})

export default function EditEventPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    bannerUrl: "",
    startDate: "",
    endDate: "",
    packPriceCoins: 100,
    packPriceGems: 0,
    commonRate: "0.7000",
    rareRate: "0.2000",
    epicRate: "0.0800",
    legendaryRate: "0.0200",
    isActive: true,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { data: event, isLoading, error } = trpc.admin.getEventById.useQuery({ id: params.id })

  const updateMutation = trpc.admin.updateEvent.useMutation({
    onSuccess: () => {
      toast.success("Event updated successfully!")
      router.push("/admin/events")
    },
    onError: (error) => {
      toast.error(`Failed to update event: ${error.message}`)
    },
  })

  // Load event data into form when available
  useEffect(() => {
    if (event) {
      setFormData({
        name: event.name,
        description: event.description || "",
        bannerUrl: event.bannerUrl || "",
        startDate: new Date(event.startDate).toISOString().slice(0, 16),
        endDate: new Date(event.endDate).toISOString().slice(0, 16),
        packPriceCoins: event.packPriceCoins,
        packPriceGems: event.packPriceGems || 0,
        commonRate: event.commonRate,
        rareRate: event.rareRate,
        epicRate: event.epicRate,
        legendaryRate: event.legendaryRate,
        isActive: event.isActive,
      })
    }
  }, [event])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const result = eventSchema.safeParse(formData)

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

    // Validate drop rates sum to 1.0000
    const total = 
      parseFloat(formData.commonRate) +
      parseFloat(formData.rareRate) +
      parseFloat(formData.epicRate) +
      parseFloat(formData.legendaryRate)

    if (Math.abs(total - 1.0) > 0.0001) {
      toast.error(`Drop rates must sum to 1.0000 (currently: ${total.toFixed(4)})`)
      return
    }

    setErrors({})
    updateMutation.mutate({
      id: params.id,
      ...formData,
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
    })
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block size-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-text-secondary">Loading event...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-lg text-red-500">{error.message}</p>
          <button
            onClick={() => router.push("/admin/events")}
            className="bg-primary text-background-dark rounded-lg px-4 py-2 font-bold"
          >
            Back to Events
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <DashboardHeader
        title="Edit Event"
        actions={
          <button
            onClick={() => router.push("/admin/events")}
            className="bg-surface-highlight hover:bg-surface-highlight/80 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold text-white"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Back to Events
          </button>
        }
      />
      <div className="custom-scrollbar overflow-y-auto p-8">
        <div className="bg-surface-dark border-border-dark mx-auto max-w-4xl rounded-xl border p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="text-text-secondary mb-1 block text-xs font-bold uppercase">
                  Event Name
                </label>
                <input
                  className={`bg-background-dark border-border-dark focus:border-primary w-full rounded-lg border px-3 py-2 text-white outline-none ${
                    errors["name"] ? "border-red-500" : ""
                  }`}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Summer Festival Banner"
                />
                {errors["name"] && (
                  <p className="mt-1 text-xs text-red-500">{errors["name"]}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="text-text-secondary mb-1 block text-xs font-bold uppercase">
                  Description
                </label>
                <textarea
                  rows={3}
                  className={`bg-background-dark border-border-dark focus:border-primary w-full rounded-lg border px-3 py-2 text-white outline-none ${
                    errors["description"] ? "border-red-500" : ""
                  }`}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Event description..."
                />
                {errors["description"] && (
                  <p className="mt-1 text-xs text-red-500">{errors["description"]}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="text-text-secondary mb-1 block text-xs font-bold uppercase">
                  Banner URL
                </label>
                <input
                  type="url"
                  className={`bg-background-dark border-border-dark focus:border-primary w-full rounded-lg border px-3 py-2 text-white outline-none ${
                    errors["bannerUrl"] ? "border-red-500" : ""
                  }`}
                  value={formData.bannerUrl}
                  onChange={(e) => setFormData({ ...formData, bannerUrl: e.target.value })}
                  placeholder="https://example.com/banner.jpg"
                />
                {errors["bannerUrl"] && (
                  <p className="mt-1 text-xs text-red-500">{errors["bannerUrl"]}</p>
                )}
              </div>
              <div>
                <label className="text-text-secondary mb-1 block text-xs font-bold uppercase">
                  Start Date
                </label>
                <input
                  type="datetime-local"
                  className="bg-background-dark border-border-dark focus:border-primary w-full rounded-lg border px-3 py-2 text-white outline-none"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div>
                <label className="text-text-secondary mb-1 block text-xs font-bold uppercase">
                  End Date
                </label>
                <input
                  type="datetime-local"
                  className="bg-background-dark border-border-dark focus:border-primary w-full rounded-lg border px-3 py-2 text-white outline-none"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
              <div>
                <label className="text-text-secondary mb-1 block text-xs font-bold uppercase">
                  Pack Price (Coins)
                </label>
                <input
                  type="number"
                  className={`bg-background-dark border-border-dark focus:border-primary w-full rounded-lg border px-3 py-2 text-white outline-none ${
                    errors["packPriceCoins"] ? "border-red-500" : ""
                  }`}
                  value={formData.packPriceCoins}
                  onChange={(e) => setFormData({ ...formData, packPriceCoins: parseInt(e.target.value) || 0 })}
                />
                {errors["packPriceCoins"] && (
                  <p className="mt-1 text-xs text-red-500">{errors["packPriceCoins"]}</p>
                )}
              </div>
              <div>
                <label className="text-text-secondary mb-1 block text-xs font-bold uppercase">
                  Pack Price (Gems)
                </label>
                <input
                  type="number"
                  className={`bg-background-dark border-border-dark focus:border-primary w-full rounded-lg border px-3 py-2 text-white outline-none ${
                    errors["packPriceGems"] ? "border-red-500" : ""
                  }`}
                  value={formData.packPriceGems}
                  onChange={(e) => setFormData({ ...formData, packPriceGems: parseInt(e.target.value) || 0 })}
                />
                {errors["packPriceGems"] && (
                  <p className="mt-1 text-xs text-red-500">{errors["packPriceGems"]}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 flex items-center gap-2 text-sm font-bold text-white">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="size-4 rounded"
                  />
                  Event is Active
                </label>
              </div>
            </div>

            <div className="bg-background-dark rounded-lg p-4">
              <h4 className="mb-4 text-sm font-bold text-white">Drop Rates (must sum to 1.0000)</h4>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div>
                  <label className="text-text-secondary mb-1 block text-xs">Common</label>
                  <input
                    className={`bg-surface-dark border-border-dark w-full rounded border px-2 py-1 text-sm text-white ${
                      errors["commonRate"] ? "border-red-500" : ""
                    }`}
                    value={formData.commonRate}
                    onChange={(e) => setFormData({ ...formData, commonRate: e.target.value })}
                  />
                  {errors["commonRate"] && (
                    <p className="mt-1 text-xs text-red-500">{errors["commonRate"]}</p>
                  )}
                </div>
                <div>
                  <label className="text-text-secondary mb-1 block text-xs">Rare</label>
                  <input
                    className={`bg-surface-dark border-border-dark w-full rounded border px-2 py-1 text-sm text-white ${
                      errors["rareRate"] ? "border-red-500" : ""
                    }`}
                    value={formData.rareRate}
                    onChange={(e) => setFormData({ ...formData, rareRate: e.target.value })}
                  />
                  {errors["rareRate"] && (
                    <p className="mt-1 text-xs text-red-500">{errors["rareRate"]}</p>
                  )}
                </div>
                <div>
                  <label className="text-text-secondary mb-1 block text-xs">Epic</label>
                  <input
                    className={`bg-surface-dark border-border-dark w-full rounded border px-2 py-1 text-sm text-white ${
                      errors["epicRate"] ? "border-red-500" : ""
                    }`}
                    value={formData.epicRate}
                    onChange={(e) => setFormData({ ...formData, epicRate: e.target.value })}
                  />
                  {errors["epicRate"] && (
                    <p className="mt-1 text-xs text-red-500">{errors["epicRate"]}</p>
                  )}
                </div>
                <div>
                  <label className="text-text-secondary mb-1 block text-xs">Legendary</label>
                  <input
                    className={`bg-surface-dark border-border-dark w-full rounded border px-2 py-1 text-sm text-white ${
                      errors["legendaryRate"] ? "border-red-500" : ""
                    }`}
                    value={formData.legendaryRate}
                    onChange={(e) => setFormData({ ...formData, legendaryRate: e.target.value })}
                  />
                  {errors["legendaryRate"] && (
                    <p className="mt-1 text-xs text-red-500">{errors["legendaryRate"]}</p>
                  )}
                </div>
              </div>
              <p className="text-text-secondary mt-2 text-xs">
                Current Sum: {(
                  parseFloat(formData.commonRate || "0") +
                  parseFloat(formData.rareRate || "0") +
                  parseFloat(formData.epicRate || "0") +
                  parseFloat(formData.legendaryRate || "0")
                ).toFixed(4)}
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={() => router.push("/admin/events")}
                className="bg-surface-highlight hover:bg-surface-highlight/80 rounded-lg px-6 py-2 text-sm font-bold text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="bg-primary text-background-dark hover:bg-primary-hover rounded-lg px-6 py-2 text-sm font-bold disabled:opacity-50"
              >
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
