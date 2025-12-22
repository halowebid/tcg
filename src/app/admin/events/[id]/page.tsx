"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { DashboardHeader } from "@/components/Headers"
import {
  gachaEventFormSchema,
  type GachaEventFormInput,
} from "@/lib/db/schema/validations"
import { trpc } from "@/lib/trpc/client"

export default function EditEventPage({ params }: { params: { id: string } }) {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<GachaEventFormInput>({
    resolver: zodResolver(gachaEventFormSchema),
    defaultValues: {
      name: "",
      description: "",
      bannerUrl: "",
      startDate: "",
      endDate: "",
      singlePullPrice: 1.0,
      tenPullPrice: 10.0,
      commonRate: "0.7000",
      rareRate: "0.2000",
      epicRate: "0.0800",
      legendaryRate: "0.0200",
    },
  })

  const {
    data: event,
    isLoading,
    error,
  } = trpc.admin.getEventById.useQuery({ id: params.id })

  const updateMutation = trpc.admin.updateEvent.useMutation({
    onSuccess: () => {
      toast.success("Event updated successfully!")
      router.push("/admin/events")
    },
    onError: (error) => {
      toast.error(`Failed to update event: ${error.message}`)
    },
  })

  useEffect(() => {
    if (event) {
      reset({
        name: event.name,
        description: event.description ?? "",
        bannerUrl: event.bannerUrl ?? "",
        startDate: new Date(event.startDate).toISOString().slice(0, 16),
        endDate: new Date(event.endDate).toISOString().slice(0, 16),
        singlePullPrice: parseFloat(event.singlePullPrice),
        tenPullPrice: parseFloat(event.tenPullPrice),
        commonRate: event.commonRate,
        rareRate: event.rareRate,
        epicRate: event.epicRate,
        legendaryRate: event.legendaryRate,
      })
    }
  }, [event, reset])

  const onSubmit = (data: GachaEventFormInput) => {
    const total =
      parseFloat(data.commonRate) +
      parseFloat(data.rareRate) +
      parseFloat(data.epicRate) +
      parseFloat(data.legendaryRate)

    if (Math.abs(total - 1.0) > 0.0001) {
      toast.error(
        `Drop rates must sum to 1.0000 (currently: ${total.toFixed(4)})`,
      )
      return
    }

    updateMutation.mutate({
      id: params.id,
      ...data,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
    })
  }

  const formValues = watch()
  const currentRateSum =
    parseFloat(formValues.commonRate ?? "0") +
    parseFloat(formValues.rareRate ?? "0") +
    parseFloat(formValues.epicRate ?? "0") +
    parseFloat(formValues.legendaryRate ?? "0")

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="border-primary mb-4 inline-block size-8 animate-spin rounded-full border-4 border-t-transparent"></div>
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
            <span className="material-symbols-outlined text-sm">
              arrow_back
            </span>
            Back to Events
          </button>
        }
      />
      <div className="custom-scrollbar overflow-y-auto p-8">
        <div className="bg-surface-dark border-border-dark mx-auto max-w-4xl rounded-xl border p-6">
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
                  {...register("description")}
                  rows={3}
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
                  {...register("bannerUrl")}
                  type="url"
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
                  {...register("startDate")}
                  type="datetime-local"
                  className="bg-background-dark border-border-dark focus:border-primary w-full rounded-lg border px-3 py-2 text-white outline-none"
                />
              </div>
              <div>
                <label className="text-text-secondary mb-1 block text-xs font-bold uppercase">
                  End Date
                </label>
                <input
                  {...register("endDate")}
                  type="datetime-local"
                  className="bg-background-dark border-border-dark focus:border-primary w-full rounded-lg border px-3 py-2 text-white outline-none"
                />
              </div>
              <div>
                <label className="text-text-secondary mb-1 block text-xs font-bold uppercase">
                  Single Pull Price (USD)
                </label>
                <input
                  {...register("singlePullPrice", { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  className={`bg-background-dark border-border-dark focus:border-primary w-full rounded-lg border px-3 py-2 text-white outline-none ${
                    errors.singlePullPrice ? "border-red-500" : ""
                  }`}
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
                  {...register("tenPullPrice", { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  className={`bg-background-dark border-border-dark focus:border-primary w-full rounded-lg border px-3 py-2 text-white outline-none ${
                    errors.tenPullPrice ? "border-red-500" : ""
                  }`}
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
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div>
                  <label className="text-text-secondary mb-1 block text-xs">
                    Common
                  </label>
                  <input
                    {...register("commonRate")}
                    className={`bg-surface-dark border-border-dark w-full rounded border px-2 py-1 text-sm text-white ${
                      errors.commonRate ? "border-red-500" : ""
                    }`}
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
                    className={`bg-surface-dark border-border-dark w-full rounded border px-2 py-1 text-sm text-white ${
                      errors.rareRate ? "border-red-500" : ""
                    }`}
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
                    className={`bg-surface-dark border-border-dark w-full rounded border px-2 py-1 text-sm text-white ${
                      errors.epicRate ? "border-red-500" : ""
                    }`}
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
                    className={`bg-surface-dark border-border-dark w-full rounded border px-2 py-1 text-sm text-white ${
                      errors.legendaryRate ? "border-red-500" : ""
                    }`}
                  />
                  {errors.legendaryRate && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.legendaryRate.message}
                    </p>
                  )}
                </div>
              </div>
              <p className="text-text-secondary mt-2 text-xs">
                Current Sum: {currentRateSum.toFixed(4)}
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
