"use client"

import React, { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { trpc } from "@/lib/trpc/client"
import { DashboardHeader } from "@/components/Headers"

export default function AdminUserEditPage() {
  const params = useParams()
  const router = useRouter()
  const userId = params["id"] as string

  const [coinsChange, setCoinsChange] = useState("")
  const [gemsChange, setGemsChange] = useState("")
  const [reason, setReason] = useState("")

  const { data: user, isLoading, error } = trpc.admin.getUserById.useQuery({ userId })

  const updateWalletMutation = trpc.admin.updateUserWallet.useMutation({
    onSuccess: () => {
      alert("Wallet updated successfully!")
      setCoinsChange("")
      setGemsChange("")
      setReason("")
      window.location.reload()
    },
    onError: (error) => {
      alert(`Failed to update wallet: ${error.message}`)
    },
  })

  const banMutation = trpc.admin.banUser.useMutation({
    onSuccess: () => {
      alert(user?.isBanned ? "User unbanned successfully!" : "User banned successfully!")
      window.location.reload()
    },
    onError: (error) => {
      alert(`Failed to ban/unban user: ${error.message}`)
    },
  })

  const handleUpdateWallet = (type: "coins" | "gems") => {
    if (!reason.trim()) {
      alert("Please provide a reason for the wallet adjustment")
      return
    }

    const coins = type === "coins" ? parseInt(coinsChange) || 0 : 0
    const gems = type === "gems" ? parseInt(gemsChange) || 0 : 0

    if (coins === 0 && gems === 0) {
      alert("Please enter a valid amount")
      return
    }

    updateWalletMutation.mutate({
      userId,
      coinsChange: coins,
      gemsChange: gems,
      reason,
    })
  }

  const handleBanToggle = () => {
    if (!confirm(user?.isBanned ? "Are you sure you want to unban this user?" : "Are you sure you want to ban this user?")) {
      return
    }

    banMutation.mutate({
      userId,
      banned: !user?.isBanned,
    })
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block size-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-text-secondary">Loading user...</p>
        </div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-lg text-red-500">
            {error?.message || "User not found"}
          </p>
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
        title="User Management"
        breadcrumbs={["Dashboard", "Users", user.username || "User"]}
        actions={
          <div className="flex gap-2">
            <button
              onClick={handleBanToggle}
              disabled={banMutation.isPending}
              className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-bold ${
                user.isBanned
                  ? "border-green-500/20 bg-green-500/10 text-green-500 hover:bg-green-500/20"
                  : "border-red-500/20 bg-red-500/10 text-red-500 hover:bg-red-500/20"
              }`}
            >
              <span className="material-symbols-outlined text-sm">
                {user.isBanned ? "check_circle" : "block"}
              </span>
              {user.isBanned ? "Unban User" : "Ban User"}
            </button>
          </div>
        }
      />
      <div className="custom-scrollbar overflow-y-auto p-8">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 pb-10 lg:grid-cols-3">
          {/* User Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-surface-dark border-border-dark flex flex-col items-center rounded-xl border p-6 text-center">
              <div
                className="border-primary mb-4 size-24 rounded-full border-4 bg-cover bg-center"
                style={{
                  backgroundImage: 'url("https://api.dicebear.com/7.x/avataaars/svg?seed=' + user.userId + '")',
                }}
              ></div>
              <h2 className="text-xl font-bold text-white">{user.username || "Anonymous"}</h2>
              <p className="text-text-secondary text-sm">ID: {user.userId}</p>
              <div className="border-border-dark mt-4 grid w-full grid-cols-2 gap-2 border-t pt-4 text-center">
                <div>
                  <span className="block font-bold text-white">{user.level}</span>
                  <span className="text-text-secondary text-xs">Level</span>
                </div>
                <div>
                  <span className={`block font-bold ${user.isBanned ? "text-red-500" : "text-green-500"}`}>
                    {user.isBanned ? "Banned" : "Active"}
                  </span>
                  <span className="text-text-secondary text-xs">Status</span>
                </div>
              </div>
            </div>

            <div className="bg-surface-dark border-border-dark mt-6 rounded-xl border p-6">
              <h3 className="mb-4 font-bold text-white">Contact Info</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-text-secondary text-xs font-bold uppercase">
                    User ID
                  </label>
                  <p className="text-sm text-white">{user.userId}</p>
                </div>
                <div>
                  <label className="text-text-secondary text-xs font-bold uppercase">
                    Registration Date
                  </label>
                  <p className="text-sm text-white">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <label className="text-text-secondary text-xs font-bold uppercase">
                    Last Updated
                  </label>
                  <p className="text-sm text-white">
                    {new Date(user.updatedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            <div className="bg-surface-dark border-border-dark rounded-xl border p-6">
              <h3 className="mb-6 flex items-center gap-2 font-bold text-white">
                <span className="material-symbols-outlined text-primary">
                  account_balance_wallet
                </span>
                Wallet Management
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-background-dark border-border-dark rounded-xl border p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-text-secondary text-sm">Coins</span>
                    <span className="material-symbols-outlined text-yellow-500">
                      monetization_on
                    </span>
                  </div>
                  <p className="mb-4 text-2xl font-bold text-white">{user.coins.toLocaleString()}</p>
                  <div className="flex gap-2">
                    <input
                      className="bg-surface-dark border-border-dark focus:border-primary w-full rounded border px-2 text-sm text-white outline-none"
                      placeholder="+/- Amount"
                      type="number"
                      value={coinsChange}
                      onChange={(e) => setCoinsChange(e.target.value)}
                    />
                    <button
                      onClick={() => handleUpdateWallet("coins")}
                      disabled={updateWalletMutation.isPending}
                      className="bg-primary text-background-dark rounded px-3 text-sm font-bold disabled:opacity-50"
                    >
                      Update
                    </button>
                  </div>
                </div>
                <div className="bg-background-dark border-border-dark rounded-xl border p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-text-secondary text-sm">Gems</span>
                    <span className="material-symbols-outlined text-blue-400">
                      diamond
                    </span>
                  </div>
                  <p className="mb-4 text-2xl font-bold text-white">{user.gems.toLocaleString()}</p>
                  <div className="flex gap-2">
                    <input
                      className="bg-surface-dark border-border-dark focus:border-primary w-full rounded border px-2 text-sm text-white outline-none"
                      placeholder="+/- Amount"
                      type="number"
                      value={gemsChange}
                      onChange={(e) => setGemsChange(e.target.value)}
                    />
                    <button
                      onClick={() => handleUpdateWallet("gems")}
                      disabled={updateWalletMutation.isPending}
                      className="bg-primary text-background-dark rounded px-3 text-sm font-bold disabled:opacity-50"
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <label className="text-text-secondary mb-2 block text-xs font-bold uppercase">
                  Adjustment Reason (Required)
                </label>
                <input
                  className="bg-surface-dark border-border-dark focus:border-primary w-full rounded border px-3 py-2 text-sm text-white outline-none"
                  placeholder="e.g., Compensation for bug, Event reward, etc."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>
            </div>

            <div className="bg-surface-dark border-border-dark rounded-xl border p-6">
              <h3 className="mb-4 font-bold text-white">User Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-background-dark border-border-dark rounded-xl border p-4">
                  <p className="text-text-secondary text-xs uppercase">Level</p>
                  <p className="mt-1 text-2xl font-bold text-white">{user.level}</p>
                </div>
                <div className="bg-background-dark border-border-dark rounded-xl border p-4">
                  <p className="text-text-secondary text-xs uppercase">Experience</p>
                  <p className="mt-1 text-2xl font-bold text-white">{user.exp.toLocaleString()}</p>
                </div>
                <div className="bg-background-dark border-border-dark rounded-xl border p-4">
                  <p className="text-text-secondary text-xs uppercase">Total Coins</p>
                  <p className="mt-1 text-2xl font-bold text-white">{user.coins.toLocaleString()}</p>
                </div>
                <div className="bg-background-dark border-border-dark rounded-xl border p-4">
                  <p className="text-text-secondary text-xs uppercase">Total Gems</p>
                  <p className="mt-1 text-2xl font-bold text-white">{user.gems.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
