"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  CalendarIcon,
  PiggyBankIcon,
  PlusCircleIcon,
  PlusIcon,
  ShoppingBagIcon,
  SparklesIcon,
  TrophyIcon,
  UsersIcon,
  XIcon,
} from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { DashboardHeader } from "@/components/Headers"
import {
  milestoneFormSchema,
  type MilestoneFormInput,
} from "@/lib/db/schema/validations"
import { trpc } from "@/lib/trpc/client"
import { getMaterialIcon } from "@/lib/utils/icon-mapping"

export default function AdminMilestonesPage() {
  const router = useRouter()
  const [showCreateForm, setShowCreateForm] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<MilestoneFormInput>({
    resolver: zodResolver(milestoneFormSchema),
    defaultValues: {
      title: "",
      description: "",
      icon: "",
      requirementType: "collection_size",
      requirementValue: 1,
      rewardType: "currency",
      rewardValue: "",
    },
  })

  const { data: milestones, isLoading, error } = trpc.milestones.list.useQuery()

  const createMutation = trpc.milestones.create.useMutation({
    onSuccess: () => {
      toast.success("Milestone created successfully!")
      setShowCreateForm(false)
      reset()
      window.location.reload()
    },
    onError: (error) => {
      toast.error(`Failed to create milestone: ${error.message}`)
    },
  })

  const updateMutation = trpc.milestones.update.useMutation({
    onSuccess: () => {
      toast.success("Milestone updated successfully!")
      window.location.reload()
    },
    onError: (error) => {
      toast.error(`Failed to update milestone: ${error.message}`)
    },
  })

  const handleToggleActive = (id: string, currentStatus: boolean) => {
    updateMutation.mutate({
      id,
      isActive: !currentStatus,
    })
  }

  const onSubmit = (data: MilestoneFormInput) => {
    createMutation.mutate(data)
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="border-primary mb-4 inline-block size-8 animate-spin rounded-full border-4 border-t-transparent"></div>
          <p className="text-text-secondary">Loading milestones...</p>
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
        title="Milestone Configuration"
        actions={
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-primary text-background-dark hover:bg-primary-hover flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold"
          >
            {showCreateForm ? (
              <XIcon className="size-4" />
            ) : (
              <PlusIcon className="size-4" />
            )}
            {showCreateForm ? "Cancel" : "Add New Milestone"}
          </button>
        }
      />
      <div className="custom-scrollbar overflow-y-auto p-8">
        {/* Create Form */}
        {showCreateForm && (
          <div className="bg-surface-dark border-border-dark mb-8 rounded-xl border p-6">
            <h3 className="mb-6 text-lg font-bold text-white">
              Create New Milestone
            </h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="text-text-secondary mb-1 block text-xs font-bold uppercase">
                    Title
                  </label>
                  <input
                    {...register("title")}
                    className={`bg-background-dark border-border-dark focus:border-primary w-full rounded-lg border px-3 py-2 text-white outline-none ${
                      errors.title ? "border-red-500" : ""
                    }`}
                    placeholder="e.g., Beginner Collector"
                  />
                  {errors.title && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.title.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-text-secondary mb-1 block text-xs font-bold uppercase">
                    Icon
                  </label>
                  <input
                    {...register("icon")}
                    className={`bg-background-dark border-border-dark focus:border-primary w-full rounded-lg border px-3 py-2 text-white outline-none ${
                      errors.icon ? "border-red-500" : ""
                    }`}
                    placeholder="e.g., style, emoji_events"
                  />
                  {errors.icon && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.icon.message}
                    </p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="text-text-secondary mb-1 block text-xs font-bold uppercase">
                    Description
                  </label>
                  <textarea
                    {...register("description")}
                    rows={2}
                    className={`bg-background-dark border-border-dark focus:border-primary w-full rounded-lg border px-3 py-2 text-white outline-none ${
                      errors.description ? "border-red-500" : ""
                    }`}
                    placeholder="e.g., Collect 10 unique cards"
                  />
                  {errors.description && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.description.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-text-secondary mb-1 block text-xs font-bold uppercase">
                    Requirement Type
                  </label>
                  <select
                    {...register("requirementType")}
                    className="bg-background-dark border-border-dark focus:border-primary w-full rounded-lg border px-3 py-2 text-white outline-none"
                  >
                    <option value="collection_size">Collection Size</option>
                    <option value="total_spend">Total Spend</option>
                    <option value="friend_count">Friend Count</option>
                    <option value="pulls_count">Pulls Count</option>
                    <option value="login_streak">Login Streak</option>
                  </select>
                </div>
                <div>
                  <label className="text-text-secondary mb-1 block text-xs font-bold uppercase">
                    Requirement Value
                  </label>
                  <input
                    {...register("requirementValue", { valueAsNumber: true })}
                    type="number"
                    min="1"
                    className={`bg-background-dark border-border-dark focus:border-primary w-full rounded-lg border px-3 py-2 text-white outline-none ${
                      errors.requirementValue ? "border-red-500" : ""
                    }`}
                    placeholder="e.g., 10"
                  />
                  {errors.requirementValue && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.requirementValue.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-text-secondary mb-1 block text-xs font-bold uppercase">
                    Reward Type
                  </label>
                  <select
                    {...register("rewardType")}
                    className="bg-background-dark border-border-dark focus:border-primary w-full rounded-lg border px-3 py-2 text-white outline-none"
                  >
                    <option value="currency">Currency (USD)</option>
                    <option value="badge">Badge</option>
                    <option value="frame">Frame</option>
                    <option value="title">Title</option>
                  </select>
                </div>
                <div>
                  <label className="text-text-secondary mb-1 block text-xs font-bold uppercase">
                    Reward Value
                  </label>
                  <input
                    {...register("rewardValue")}
                    className={`bg-background-dark border-border-dark focus:border-primary w-full rounded-lg border px-3 py-2 text-white outline-none ${
                      errors.rewardValue ? "border-red-500" : ""
                    }`}
                    placeholder="e.g., 100 or 'Dragon Badge'"
                  />
                  {errors.rewardValue && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.rewardValue.message}
                    </p>
                  )}
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
                  Create Milestone
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Milestones Grid */}
        <div className="grid grid-cols-1 gap-6 pb-10 md:grid-cols-2 lg:grid-cols-3">
          {milestones?.map((milestone) => (
            <div
              key={milestone.id}
              className="bg-surface-dark border-border-dark hover:border-primary/50 group rounded-xl border p-6 transition-colors"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="bg-background-dark border-border-dark flex size-12 items-center justify-center rounded-lg border">
                  {React.createElement(getMaterialIcon(milestone.icon), {
                    className: "text-primary size-6",
                  })}
                </div>
                <button
                  onClick={() =>
                    handleToggleActive(milestone.id, milestone.isActive)
                  }
                  disabled={updateMutation.isPending}
                  className={`h-3 w-3 rounded-full transition-colors ${
                    milestone.isActive ? "bg-green-500" : "bg-gray-600"
                  }`}
                  title={
                    milestone.isActive
                      ? "Active - Click to deactivate"
                      : "Inactive - Click to activate"
                  }
                ></button>
              </div>
              <h3 className="mb-1 text-lg font-bold text-white">
                {milestone.title}
              </h3>
              <p className="text-text-secondary mb-4 text-sm">
                {milestone.description}
              </p>
              <div className="mb-4 space-y-2">
                <div className="bg-background-dark flex items-center gap-3 rounded-lg p-3">
                  {milestone.requirementType === "collection_size" && (
                    <SparklesIcon className="size-4 text-blue-400" />
                  )}
                  {milestone.requirementType === "total_spend" && (
                    <PiggyBankIcon className="size-4 text-blue-400" />
                  )}
                  {milestone.requirementType === "friend_count" && (
                    <UsersIcon className="size-4 text-blue-400" />
                  )}
                  {milestone.requirementType === "pulls_count" && (
                    <ShoppingBagIcon className="size-4 text-blue-400" />
                  )}
                  {milestone.requirementType === "login_streak" && (
                    <CalendarIcon className="size-4 text-blue-400" />
                  )}
                  <span className="text-text-secondary text-xs font-medium">
                    {milestone.requirementType.replace("_", " ").toUpperCase()}:{" "}
                    {milestone.requirementValue}
                  </span>
                </div>
                <div className="bg-background-dark flex items-center gap-3 rounded-lg p-3">
                  <TrophyIcon className="size-4 text-yellow-500" />
                  <span className="text-sm font-bold text-white">
                    {milestone.rewardType === "currency"
                      ? `$${parseFloat(milestone.rewardValue).toFixed(2)}`
                      : milestone.rewardValue}
                  </span>
                </div>
              </div>
              <div className="text-text-secondary text-xs">
                Created: {new Date(milestone.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}

          {/* Add New Card Placeholder */}
          {!showCreateForm && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="border-border-dark hover:border-primary/50 hover:bg-surface-dark/50 flex min-h-[280px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-all"
            >
              <PlusCircleIcon className="text-text-secondary mb-2 size-10" />
              <p className="text-text-secondary font-bold">
                Create New Milestone
              </p>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
