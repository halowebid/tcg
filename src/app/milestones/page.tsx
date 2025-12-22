"use client"

import React from "react"
import { MedalIcon } from "lucide-react"

import { trpc } from "@/lib/trpc/client"
import { getMaterialIcon } from "@/lib/utils/icon-mapping"

export default function MilestonesPage() {
  const { data: milestones, isLoading: milestonesLoading } =
    trpc.milestones.list.useQuery()
  const { data: userProgress, isLoading: progressLoading } =
    trpc.milestones.getUserProgress.useQuery()
  const claimReward = trpc.milestones.claimReward.useMutation({
    onSuccess: () => {
      // Invalidate queries to refetch data
      window.location.reload()
    },
  })

  const isLoading = milestonesLoading || progressLoading

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-text-secondary">Loading milestones...</div>
      </div>
    )
  }

  // Create a map of user progress by milestone ID
  const progressMap = new Map(
    userProgress?.map((p) => [p.milestoneId, p]) ?? [],
  )

  // Mock user level and XP for the header (this would come from user profile in real app)
  const userLevel = 12
  const userXP = 1550
  const maxXP = 2000

  return (
    <div className="flex flex-1 flex-col items-center px-4 py-8">
      <div className="w-full max-w-[1024px]">
        <h1 className="mb-2 text-3xl font-black text-white">
          Collector Status
        </h1>
        <div className="bg-surface-dark border-border-dark relative mb-8 flex flex-col items-center gap-8 overflow-hidden rounded-xl border p-8 md:flex-row">
          <div className="bg-primary pointer-events-none absolute top-0 right-0 h-full w-1/2 rounded-l-full opacity-10"></div>
          <div className="border-primary/20 bg-background-dark relative z-10 flex h-32 w-32 items-center justify-center rounded-full border-4">
            <MedalIcon className="text-primary size-24" />
          </div>
          <div className="z-10 flex-1">
            <h2 className="text-2xl font-bold text-white">Expert Collector</h2>
            <p className="text-text-secondary mb-4">
              Top 5% of collectors this season.
            </p>
            <div className="bg-background-dark h-3 w-full overflow-hidden rounded-full">
              <div
                className="bg-primary h-full"
                style={{ width: `${(userXP / maxXP) * 100}%` }}
              ></div>
            </div>
            <div className="text-text-secondary mt-1 flex justify-between text-xs">
              <span>Level {userLevel}</span>
              <span>
                {userXP} / {maxXP} XP
              </span>
            </div>
          </div>
        </div>

        <h2 className="mb-4 text-xl font-bold text-white">
          Available Milestones
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {milestones?.map((milestone) => {
            const progress = progressMap.get(milestone.id)
            const isCompleted = progress?.isCompleted ?? false
            const isClaimed = progress?.isClaimed ?? false
            const canClaim = isCompleted && !isClaimed

            return (
              <div
                key={milestone.id}
                className="dark:bg-surface-dark border-border-dark flex flex-col gap-4 rounded-xl border bg-white p-4"
              >
                <div className="bg-background-dark relative flex h-32 items-center justify-center overflow-hidden rounded-lg">
                  {React.createElement(getMaterialIcon(milestone.icon), {
                    className: "z-10 size-10 text-white",
                  })}
                  <div
                    className={`absolute inset-0 ${
                      milestone.rewardType === "currency"
                        ? "bg-primary/20"
                        : "bg-orange-500/20"
                    }`}
                  ></div>
                </div>
                <div>
                  <span
                    className={`rounded px-2 py-0.5 text-xs font-bold ${
                      milestone.rewardType === "currency"
                        ? "text-primary bg-primary/20"
                        : "rounded bg-orange-500/20 text-orange-400"
                    }`}
                  >
                    {milestone.requirementType.toUpperCase()}
                  </span>
                  <h3 className="mt-1 text-lg font-bold text-white">
                    {milestone.title}
                  </h3>
                  <p className="text-text-secondary text-sm">
                    {milestone.description}
                  </p>
                  <p className="text-text-secondary mt-2 text-xs">
                    Reward:{" "}
                    {milestone.rewardType === "currency"
                      ? `$${parseFloat(milestone.rewardValue).toFixed(2)}`
                      : milestone.rewardValue}
                  </p>
                </div>
                <button
                  className={`mt-auto w-full rounded-lg py-2 font-bold ${
                    canClaim
                      ? "bg-primary text-background-dark cursor-pointer"
                      : isClaimed
                        ? "bg-surface-highlight border-border-dark cursor-not-allowed border text-white"
                        : "bg-surface-dark border-border-dark text-text-secondary cursor-not-allowed border"
                  }`}
                  disabled={!canClaim || claimReward.isPending}
                  onClick={() => {
                    if (canClaim) {
                      claimReward.mutate({ milestoneId: milestone.id })
                    }
                  }}
                >
                  {claimReward.isPending
                    ? "Claiming..."
                    : isClaimed
                      ? "Claimed"
                      : canClaim
                        ? "Claim Reward"
                        : "Not Completed"}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
