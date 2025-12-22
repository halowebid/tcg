"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { DashboardHeader } from "@/components/Headers"
import { ConfirmModal } from "@/components/ui"
import {
  gachaEventFormSchema,
  type GachaEventFormInput,
} from "@/lib/db/schema/validations"
import { trpc } from "@/lib/trpc/client"

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

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<GachaEventFormInput>({
    resolver: zodResolver(gachaEventFormSchema),
    defaultValues: {
      name: "",
      description: "",
      bannerUrl: "",
      startDate: "",
      endDate: "",
      singlePullPrice: 1.00,
      tenPullPrice: 10.00,
      commonRate: "0.7000",
      rareRate: "0.2000",
      epicRate: "0.0800",
      legendaryRate: "0.0200",
    },
  })

  const { data: events, isLoading, error } = trpc.admin.getAllEvents.useQuery()

  const createMutation = trpc.admin.createEvent.useMutation({
    onSuccess: () => {
      toast.success("Event created successfully!")
      setShowCreateForm(false)
      reset()
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

  const onSubmit = (data: GachaEventFormInput) => {
    createMutation.mutate({
      ...data,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
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
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="text-text-secondary mb-1 block text-xs font-bold uppercase">
                    Event Name
                  </label>
                  <input
                    {...register("name")}
                    className={`bg-background-dark border-border-dark focus:border-primary w-full rounded-lg border px-3 py-2 text-white outline-none ${
                      errors.name ? "border-red-500" : ""
                    }`}
                    placeholder="e.g., Summer Festival Banner"
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="text-text-secondary mb-1 block text-xs font-bold uppercase">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    {...register("description")}
                    className={`bg-background-dark border-border-dark focus:border-primary w-full rounded-lg border px-3 py-2 text-white outline-none ${
                      errors.description ? "border-red-500" : ""
                    }`}
                    placeholder="Event description..."
                  />
                  {errors.description && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.description.message}
                    </p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="text-text-secondary mb-1 block text-xs font-bold uppercase">
                    Banner URL
                  </label>
                  <input
                    type="url"
                    {...register("bannerUrl")}
                    className={`bg-background-dark border-border-dark focus:border-primary w-full rounded-lg border px-3 py-2 text-white outline-none ${
                      errors.bannerUrl ? "border-red-500" : ""
                    }`}
                    placeholder="https://example.com/banner.jpg"
                  />
                  {errors.bannerUrl && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.bannerUrl.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-text-secondary mb-1 block text-xs font-bold uppercase">
                    Start Date
                  </label>
                  <input
                    type="datetime-local"
                    {...register("startDate")}
                    className="bg-background-dark border-border-dark focus:border-primary w-full rounded-lg border px-3 py-2 text-white outline-none"
                  />
                  {errors.startDate && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.startDate.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-text-secondary mb-1 block text-xs font-bold uppercase">
                    End Date
                  </label>
                  <input
                    type="datetime-local"
                    {...register("endDate")}
                    className="bg-background-dark border-border-dark focus:border-primary w-full rounded-lg border px-3 py-2 text-white outline-none"
                  />
                  {errors.endDate && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.endDate.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-text-secondary mb-1 block text-xs font-bold uppercase">
                    Single Pull Price (USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("singlePullPrice", { valueAsNumber: true })}
                    className="bg-background-dark border-border-dark focus:border-primary w-full rounded-lg border px-3 py-2 text-white outline-none"
                  />
                  {errors.singlePullPrice && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.singlePullPrice.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-text-secondary mb-1 block text-xs font-bold uppercase">
                    10x Pull Price (USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("tenPullPrice", { valueAsNumber: true })}
                    className="bg-background-dark border-border-dark focus:border-primary w-full rounded-lg border px-3 py-2 text-white outline-none"
                  />
                  {errors.tenPullPrice && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.tenPullPrice.message}
                    </p>
                  )}
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
                      {...register("commonRate")}
                      className="bg-surface-dark border-border-dark w-full rounded border px-2 py-1 text-sm text-white"
                    />
                    {errors.commonRate && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.commonRate.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-text-secondary mb-1 block text-xs">
                      Rare
                    </label>
                    <input
                      {...register("rareRate")}
                      className="bg-surface-dark border-border-dark w-full rounded border px-2 py-1 text-sm text-white"
                    />
                    {errors.rareRate && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.rareRate.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-text-secondary mb-1 block text-xs">
                      Epic
                    </label>
                    <input
                      {...register("epicRate")}
                      className="bg-surface-dark border-border-dark w-full rounded border px-2 py-1 text-sm text-white"
                    />
                    {errors.epicRate && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.epicRate.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-text-secondary mb-1 block text-xs">
                      Legendary
                    </label>
                    <input
                      {...register("legendaryRate")}
                      className="bg-surface-dark border-border-dark w-full rounded border px-2 py-1 text-sm text-white"
                    />
                    {errors.legendaryRate && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.legendaryRate.message}
                      </p>
                    )}
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
                      <p className="text-text-secondary text-xs">Single Pull</p>
                      <p className="text-sm font-bold text-white">
                        ${parseFloat(event.singlePullPrice).toFixed(2)}
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
