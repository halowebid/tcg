"use client"

import { useRouter } from "next/navigation"

import { DashboardHeader } from "@/components/Headers"
import { trpc } from "@/lib/trpc/client"

export default function AdminPage() {
  const router = useRouter()
  const { data: stats, isLoading } = trpc.admin.getDashboardStats.useQuery()

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="border-primary mb-4 inline-block size-8 animate-spin rounded-full border-4 border-t-transparent"></div>
          <p className="text-text-secondary">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col gap-8 overflow-y-auto p-8">
      <DashboardHeader
        title="Dashboard Overview"
        actions={
          <div className="bg-surface-dark border-border-dark text-text-secondary flex items-center gap-2 rounded-lg border px-4 py-2 text-xs font-semibold">
            <span className="size-2 animate-pulse rounded-full bg-green-500"></span>{" "}
            Server Status: Healthy
          </div>
        }
      />
      <div className="grid grid-cols-1 gap-4 px-2 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total Users",
            value: stats?.totalUsers.toLocaleString() ?? "0",
            change: "All time",
            icon: "person_add",
            color: "text-primary",
          },
          {
            label: "Total Pulls",
            value: stats?.totalPulls.toLocaleString() ?? "0",
            change: "All time",
            icon: "shopping_bag",
            color: "text-primary",
          },
          {
            label: "Total Revenue",
            value: `${stats?.totalRevenue.toLocaleString() ?? "0"} coins`,
            change: "From gacha",
            icon: "payments",
            color: "text-primary",
          },
          {
            label: "Active Events",
            value: "N/A",
            change: "Coming soon",
            icon: "casino",
            color: "text-primary",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="border-border-dark bg-surface-dark group relative flex flex-col gap-2 overflow-hidden rounded-xl border p-6"
          >
            <div className="absolute top-[-20px] right-[-20px] h-24 w-24 rounded-full bg-white opacity-5 blur-2xl transition-opacity group-hover:opacity-10"></div>
            <div className="flex items-start justify-between">
              <p className="text-text-secondary text-sm font-medium">
                {stat.label}
              </p>
              <span className={`material-symbols-outlined ${stat.color}`}>
                {stat.icon}
              </span>
            </div>
            <p className="text-3xl leading-tight font-bold text-white">
              {stat.value}
            </p>
            <div className="flex items-center gap-1">
              <p className="text-text-secondary text-sm font-medium">
                {stat.change}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 px-2 pb-8 lg:grid-cols-2">
        <div className="border-border-dark bg-surface-dark relative flex flex-col gap-6 overflow-hidden rounded-xl border p-6">
          <div className="bg-primary/5 pointer-events-none absolute top-0 right-0 h-64 w-64 rounded-full blur-3xl"></div>
          <div className="z-10 flex items-start justify-between">
            <div>
              <h3 className="flex items-center gap-2 text-xl font-bold text-white">
                <span className="material-symbols-outlined text-primary">
                  inventory_2
                </span>{" "}
                Card Management
              </h3>
              <p className="text-text-secondary mt-1 text-sm">
                Create, edit, and manage assets.
              </p>
            </div>
          </div>
          <div className="border-border-dark z-10 grid grid-cols-3 gap-4 border-y py-4">
            <div>
              <p className="text-2xl font-bold text-white">-</p>
              <p className="text-text-secondary text-xs uppercase">
                Total Cards
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-400">-</p>
              <p className="text-text-secondary text-xs uppercase">Rarities</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-500">-</p>
              <p className="text-text-secondary text-xs uppercase">Sets</p>
            </div>
          </div>
          <button
            onClick={() => router.push("/admin/cards/create")}
            className="bg-surface-highlight hover:border-primary/30 group flex w-full items-center justify-between rounded-lg border border-transparent p-4 transition-all hover:bg-[#4a3e33]"
          >
            <div className="flex items-center gap-3">
              <div className="bg-primary/20 text-primary rounded-lg p-2">
                <span className="material-symbols-outlined">add_circle</span>
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-white">Create New Card</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-text-secondary group-hover:text-white">
              chevron_right
            </span>
          </button>
        </div>

        <div className="border-border-dark bg-surface-dark relative flex flex-col gap-6 overflow-hidden rounded-xl border p-6">
          <div className="pointer-events-none absolute top-0 right-0 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl"></div>
          <div className="z-10 flex items-start justify-between">
            <div>
              <h3 className="flex items-center gap-2 text-xl font-bold text-white">
                <span className="material-symbols-outlined text-primary">
                  settings
                </span>{" "}
                Quick Actions
              </h3>
              <p className="text-text-secondary mt-1 text-sm">
                Manage users, settings, and more.
              </p>
            </div>
          </div>
          <div className="z-10 space-y-3">
            <button
              onClick={() => router.push("/admin/inventory")}
              className="bg-surface-highlight hover:border-primary/30 group flex w-full items-center justify-between rounded-lg border border-transparent p-4 transition-all hover:bg-[#4a3e33]"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">
                  inventory_2
                </span>
                <p className="text-sm font-bold text-white">Card Inventory</p>
              </div>
              <span className="material-symbols-outlined text-text-secondary group-hover:text-white">
                chevron_right
              </span>
            </button>
            <button
              onClick={() => router.push("/admin/milestones")}
              className="bg-surface-highlight hover:border-primary/30 group flex w-full items-center justify-between rounded-lg border border-transparent p-4 transition-all hover:bg-[#4a3e33]"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">
                  emoji_events
                </span>
                <p className="text-sm font-bold text-white">Milestones</p>
              </div>
              <span className="material-symbols-outlined text-text-secondary group-hover:text-white">
                chevron_right
              </span>
            </button>
            <button
              onClick={() => router.push("/admin/settings")}
              className="bg-surface-highlight hover:border-primary/30 group flex w-full items-center justify-between rounded-lg border border-transparent p-4 transition-all hover:bg-[#4a3e33]"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">
                  tune
                </span>
                <p className="text-sm font-bold text-white">System Settings</p>
              </div>
              <span className="material-symbols-outlined text-text-secondary group-hover:text-white">
                chevron_right
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
