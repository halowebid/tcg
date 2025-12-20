"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { z } from "zod"

import { DashboardHeader } from "@/components/Headers"
import { ConfirmModal } from "@/components/ui"
import { trpc } from "@/lib/trpc/client"

const eventSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().min(1, "Description is required"),
  bannerUrl: z.string().url("Must be a valid URL"),
  startDate: z.string(),
  endDate: z.string(),
  packPriceCoins: z.number().int().positive("Must be a positive number"),
  packPriceGems: z.number().int().positive().optional(),
  commonRate: z.string().regex(/^\d+(\.\d{1,4})?$/, "Must be a valid rate"),
  rareRate: z.string().regex(/^\d+(\.\d{1,4})?$/, "Must be a valid rate"),
  epicRate: z.string().regex(/^\d+(\.\d{1,4})?$/, "Must be a valid rate"),
  legendaryRate: z.string().regex(/^\d+(\.\d{1,4})?$/, "Must be a valid rate"),
})

export default function AdminEventsPage() {
  const router = useRouter()
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean
    eventId: string | null
  }>({
    isOpen: false,
    eventId: null,
  })
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
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { data: events, isLoading, error } = trpc.admin.getAllEvents.useQuery()

  const createMutation = trpc.admin.createEvent.useMutation({
    onSuccess: () => {
      toast.success("Event created successfully!")
      setShowCreateForm(false)
      setFormData({
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
      })
      window.location.reload()
    },
    onError: (error) => {
      toast.error(`Failed to create event: ${error.message}`)
    },
  })

  const deleteMutation = trpc.admin.deleteEvent.useMutation({
    onSuccess: () => {
      toast.success("Event deleted successfully!")
      setDeleteConfirm({ isOpen: false, eventId: null })
      window.location.reload()
    },
    onError: (error) => {
      toast.error(`Failed to delete event: ${error.message}`)
      setDeleteConfirm({ isOpen: false, eventId: null })
    },
  })

  const handleCreateSubmit = (e: React.FormEvent) => {
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

    setErrors({})
    createMutation.mutate({
      ...formData,
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
    })
  }

  const handleDelete = (id: string) => {
    setDeleteConfirm({ isOpen: true, eventId: id })
  }

  const confirmDelete = () => {
    if (deleteConfirm.eventId) {
      deleteMutation.mutate({ id: deleteConfirm.eventId })
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="border-primary mb-4 inline-block size-8 animate-spin rounded-full border-4 border-t-transparent"></div>
          <p className="text-text-secondary">Loading events...</p>
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
            onClick={() => router.push("/admin")}
            className="bg-primary text-background-dark rounded-lg px-4 py-2 font-bold"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <DashboardHeader
        title="Gacha Events"
        actions={
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-primary text-background-dark hover:bg-primary-hover flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold"
          >
            <span className="material-symbols-outlined text-sm">
              {showCreateForm ? "close" : "add"}
            </span>
            {showCreateForm ? "Cancel" : "Create Event"}
          </button>
        }
      />
      <div className="custom-scrollbar overflow-y-auto p-8">
        {showCreateForm && (
          <div className="bg-surface-dark border-border-dark mb-8 rounded-xl border p-6">
            <h3 className="mb-6 text-lg font-bold text-white">
              Create New Event
            </h3>
            <form onSubmit={handleCreateSubmit} className="space-y-6">
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
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g., Summer Festival Banner"
                  />
                  {errors["name"] && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors["name"]}
                    </p>
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
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Event description..."
                  />
                  {errors["description"] && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors["description"]}
                    </p>
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
                    onChange={(e) =>
                      setFormData({ ...formData, bannerUrl: e.target.value })
                    }
                    placeholder="https://example.com/banner.jpg"
                  />
                  {errors["bannerUrl"] && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors["bannerUrl"]}
                    </p>
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
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
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
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-text-secondary mb-1 block text-xs font-bold uppercase">
                    Pack Price (Coins)
                  </label>
                  <input
                    type="number"
                    className="bg-background-dark border-border-dark focus:border-primary w-full rounded-lg border px-3 py-2 text-white outline-none"
                    value={formData.packPriceCoins}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        packPriceCoins: parseInt(e.target.value) ?? 0,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-text-secondary mb-1 block text-xs font-bold uppercase">
                    Pack Price (Gems)
                  </label>
                  <input
                    type="number"
                    className="bg-background-dark border-border-dark focus:border-primary w-full rounded-lg border px-3 py-2 text-white outline-none"
                    value={formData.packPriceGems}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        packPriceGems: parseInt(e.target.value) ?? 0,
                      })
                    }
                  />
                </div>
              </div>

              <div className="bg-background-dark rounded-lg p-4">
                <h4 className="mb-4 text-sm font-bold text-white">
                  Drop Rates (must sum to 1.0000)
                </h4>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <label className="text-text-secondary mb-1 block text-xs">
                      Common
                    </label>
                    <input
                      className="bg-surface-dark border-border-dark w-full rounded border px-2 py-1 text-sm text-white"
                      value={formData.commonRate}
                      onChange={(e) =>
                        setFormData({ ...formData, commonRate: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-text-secondary mb-1 block text-xs">
                      Rare
                    </label>
                    <input
                      className="bg-surface-dark border-border-dark w-full rounded border px-2 py-1 text-sm text-white"
                      value={formData.rareRate}
                      onChange={(e) =>
                        setFormData({ ...formData, rareRate: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-text-secondary mb-1 block text-xs">
                      Epic
                    </label>
                    <input
                      className="bg-surface-dark border-border-dark w-full rounded border px-2 py-1 text-sm text-white"
                      value={formData.epicRate}
                      onChange={(e) =>
                        setFormData({ ...formData, epicRate: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-text-secondary mb-1 block text-xs">
                      Legendary
                    </label>
                    <input
                      className="bg-surface-dark border-border-dark w-full rounded border px-2 py-1 text-sm text-white"
                      value={formData.legendaryRate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          legendaryRate: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="bg-surface-highlight rounded-lg px-4 py-2 text-sm font-bold text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="bg-primary text-background-dark rounded-lg px-4 py-2 text-sm font-bold disabled:opacity-50"
                >
                  {createMutation.isPending ? "Creating..." : "Create Event"}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 pb-10">
          {events?.map((event) => (
            <div
              key={event.id}
              className="bg-surface-dark border-border-dark hover:border-primary/50 group rounded-xl border p-6 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <h3 className="text-xl font-bold text-white">
                      {event.name}
                    </h3>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                        event.isActive
                          ? "bg-green-500/20 text-green-400"
                          : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {event.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="text-text-secondary mb-4">
                    {event.description}
                  </p>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    <div>
                      <p className="text-text-secondary text-xs">Start Date</p>
                      <p className="text-sm font-bold text-white">
                        {new Date(event.startDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-text-secondary text-xs">End Date</p>
                      <p className="text-sm font-bold text-white">
                        {new Date(event.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-text-secondary text-xs">Pack Price</p>
                      <p className="text-sm font-bold text-white">
                        {event.packPriceCoins} Coins
                      </p>
                    </div>
                    <div>
                      <p className="text-text-secondary text-xs">
                        Legendary Rate
                      </p>
                      <p className="text-sm font-bold text-yellow-400">
                        {(parseFloat(event.legendaryRate) * 100).toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </div>
                <div className="ml-4 flex gap-2">
                  <button
                    onClick={() => router.push(`/admin/events/${event.id}`)}
                    className="rounded p-2 text-white hover:bg-white/10"
                    title="Edit event"
                  >
                    <span className="material-symbols-outlined text-lg">
                      edit
                    </span>
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    disabled={deleteMutation.isPending}
                    className="rounded p-2 text-red-400 hover:bg-red-500/20 disabled:opacity-50"
                    title="Delete event"
                  >
                    <span className="material-symbols-outlined text-lg">
                      delete
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, eventId: null })}
        onConfirm={confirmDelete}
        title="Delete Event"
        message="Are you sure you want to delete this event? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  )
}
