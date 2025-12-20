"use client"

import React, { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { DashboardHeader } from "@/components/Headers"
import { ConfirmModal } from "@/components/ui"
import {
  walletUpdateFormSchema,
  type WalletUpdateFormInput,
} from "@/lib/db/schema/validations"
import { trpc } from "@/lib/trpc/client"

export default function AdminUserEditPage() {
  const params = useParams()
  const router = useRouter()
  const userId = params["id"] as string

  const [banConfirm, setBanConfirm] = useState(false)
  const [roleChangeConfirm, setRoleChangeConfirm] = useState(false)
  const [selectedRole, setSelectedRole] = useState<"user" | "admin">("user")

  const {
    register,
    formState: { errors },
    reset,
    getValues,
  } = useForm<WalletUpdateFormInput>({
    resolver: zodResolver(walletUpdateFormSchema),
    defaultValues: {
      coinsChange: 0,
      gemsChange: 0,
      reason: "",
    },
  })

  const {
    data: user,
    isLoading,
    error,
  } = trpc.admin.getUserById.useQuery({ userId })
  const { data: transactions } = trpc.admin.getUserTransactions.useQuery({
    userId,
    limit: 20,
  })
  const { data: sessions } = trpc.admin.listUserSessions.useQuery({ userId })

  const updateWalletMutation = trpc.admin.updateUserWallet.useMutation({
    onSuccess: () => {
      toast.success("Wallet updated successfully!")
      reset()
      window.location.reload()
    },
    onError: (error) => {
      toast.error(`Failed to update wallet: ${error.message}`)
    },
  })

  const banMutation = trpc.admin.banUser.useMutation({
    onSuccess: () => {
      toast.success(
        user?.isBanned
          ? "User unbanned successfully!"
          : "User banned successfully!",
      )
      setBanConfirm(false)
      window.location.reload()
    },
    onError: (error) => {
      toast.error(`Failed to ban/unban user: ${error.message}`)
      setBanConfirm(false)
    },
  })

  const setRoleMutation = trpc.admin.setRole.useMutation({
    onSuccess: () => {
      toast.success("Role updated successfully!")
      setRoleChangeConfirm(false)
      window.location.reload()
    },
    onError: (error) => {
      toast.error(`Failed to update role: ${error.message}`)
      setRoleChangeConfirm(false)
    },
  })

  const revokeSessionMutation = trpc.admin.revokeUserSession.useMutation({
    onSuccess: () => {
      toast.success("Session revoked successfully!")
      window.location.reload()
    },
    onError: (error) => {
      toast.error(`Failed to revoke session: ${error.message}`)
    },
  })

  const handleUpdateWallet = (type: "coins" | "gems") => {
    const formValues = getValues()

    if (!formValues.reason.trim()) {
      toast.error("Please provide a reason for the wallet adjustment")
      return
    }

    const coins = type === "coins" ? formValues.coinsChange : 0
    const gems = type === "gems" ? formValues.gemsChange : 0

    if (coins === 0 && gems === 0) {
      toast.error("Please enter a valid amount")
      return
    }

    updateWalletMutation.mutate({
      userId,
      coinsChange: coins,
      gemsChange: gems,
      reason: formValues.reason,
    })
  }

  const handleBanToggle = () => {
    setBanConfirm(true)
  }

  const confirmBan = () => {
    banMutation.mutate({
      userId,
      banned: !user?.isBanned,
    })
  }

  const handleRoleChange = (role: "user" | "admin") => {
    setSelectedRole(role)
    setRoleChangeConfirm(true)
  }

  const confirmRoleChange = () => {
    setRoleMutation.mutate({
      userId,
      role: selectedRole,
    })
  }

  const handleRevokeSession = (sessionToken: string) => {
    if (confirm("Are you sure you want to revoke this session?")) {
      revokeSessionMutation.mutate({ sessionToken })
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="border-primary mb-4 inline-block size-8 animate-spin rounded-full border-4 border-t-transparent"></div>
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
            {error?.message ?? "User not found"}
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
        breadcrumbs={["Dashboard", "Users", user.username ?? "User"]}
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
                  backgroundImage:
                    'url("https://api.dicebear.com/7.x/avataaars/svg?seed=' +
                    user.userId +
                    '")',
                }}
              ></div>
              <h2 className="text-xl font-bold text-white">
                {user.username ?? "Anonymous"}
              </h2>
              <p className="text-text-secondary text-sm">ID: {user.userId}</p>
              <div className="border-border-dark mt-4 grid w-full grid-cols-2 gap-2 border-t pt-4 text-center">
                <div>
                  <span className="block font-bold text-white">
                    {user.level}
                  </span>
                  <span className="text-text-secondary text-xs">Level</span>
                </div>
                <div>
                  <span
                    className={`block font-bold ${user.isBanned ? "text-red-500" : "text-green-500"}`}
                  >
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

            <div className="bg-surface-dark border-border-dark mt-6 rounded-xl border p-6">
              <h3 className="mb-4 font-bold text-white">Role Management</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-text-secondary mb-2 block text-xs font-bold uppercase">
                    Current Role
                  </label>
                  <p className="text-sm font-bold text-white">
                    {user.role === "admin" ? "Administrator" : "User"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleRoleChange("user")}
                    disabled={user.role === "user" || setRoleMutation.isPending}
                    className="bg-surface-highlight border-border-dark hover:border-primary flex-1 rounded-lg border px-4 py-2 text-sm font-bold text-white transition-colors disabled:opacity-50"
                  >
                    Set as User
                  </button>
                  <button
                    onClick={() => handleRoleChange("admin")}
                    disabled={
                      user.role === "admin" || setRoleMutation.isPending
                    }
                    className="bg-primary/10 border-primary/20 hover:bg-primary/20 flex-1 rounded-lg border px-4 py-2 text-sm font-bold text-white transition-colors disabled:opacity-50"
                  >
                    Set as Admin
                  </button>
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
                  <p className="mb-4 text-2xl font-bold text-white">
                    {user.coins.toLocaleString()}
                  </p>
                  <div className="flex gap-2">
                    <input
                      {...register("coinsChange", { valueAsNumber: true })}
                      className="bg-surface-dark border-border-dark focus:border-primary w-full rounded border px-2 text-sm text-white outline-none"
                      placeholder="+/- Amount"
                      type="number"
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
                  <p className="mb-4 text-2xl font-bold text-white">
                    {user.gems.toLocaleString()}
                  </p>
                  <div className="flex gap-2">
                    <input
                      {...register("gemsChange", { valueAsNumber: true })}
                      className="bg-surface-dark border-border-dark focus:border-primary w-full rounded border px-2 text-sm text-white outline-none"
                      placeholder="+/- Amount"
                      type="number"
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
                  {...register("reason")}
                  className={`bg-surface-dark border-border-dark focus:border-primary w-full rounded border px-3 py-2 text-sm text-white outline-none ${
                    errors.reason ? "border-red-500" : ""
                  }`}
                  placeholder="e.g., Compensation for bug, Event reward, etc."
                />
                {errors.reason && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.reason.message}
                  </p>
                )}
              </div>
            </div>

            <div className="bg-surface-dark border-border-dark rounded-xl border p-6">
              <h3 className="mb-4 font-bold text-white">User Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-background-dark border-border-dark rounded-xl border p-4">
                  <p className="text-text-secondary text-xs uppercase">Level</p>
                  <p className="mt-1 text-2xl font-bold text-white">
                    {user.level}
                  </p>
                </div>
                <div className="bg-background-dark border-border-dark rounded-xl border p-4">
                  <p className="text-text-secondary text-xs uppercase">
                    Experience
                  </p>
                  <p className="mt-1 text-2xl font-bold text-white">
                    {user.exp.toLocaleString()}
                  </p>
                </div>
                <div className="bg-background-dark border-border-dark rounded-xl border p-4">
                  <p className="text-text-secondary text-xs uppercase">
                    Total Coins
                  </p>
                  <p className="mt-1 text-2xl font-bold text-white">
                    {user.coins.toLocaleString()}
                  </p>
                </div>
                <div className="bg-background-dark border-border-dark rounded-xl border p-4">
                  <p className="text-text-secondary text-xs uppercase">
                    Total Gems
                  </p>
                  <p className="mt-1 text-2xl font-bold text-white">
                    {user.gems.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-surface-dark border-border-dark rounded-xl border p-6">
              <h3 className="mb-4 flex items-center gap-2 font-bold text-white">
                <span className="material-symbols-outlined text-primary">
                  devices
                </span>
                Active Sessions
              </h3>
              {sessions?.sessions && sessions.sessions.length > 0 ? (
                <div className="space-y-2">
                  {sessions.sessions.map((session) => (
                    <div
                      key={session.id}
                      className="bg-background-dark border-border-dark flex items-start justify-between rounded-lg border p-3"
                    >
                      <div className="flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <span className="text-text-secondary text-xs">
                            {session.userAgent ?? "Unknown device"}
                          </span>
                        </div>
                        <p className="text-text-secondary text-xs">
                          IP: {session.ipAddress ?? "Unknown"}
                        </p>
                        <p className="text-text-secondary text-xs">
                          Created:{" "}
                          {new Date(session.createdAt).toLocaleString()}
                        </p>
                        {session.impersonatedBy && (
                          <p className="text-xs text-purple-400">
                            Impersonation Session
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleRevokeSession(session.id)}
                        disabled={revokeSessionMutation.isPending}
                        className="ml-4 rounded border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-bold text-red-500 hover:bg-red-500/20 disabled:opacity-50"
                      >
                        Revoke
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-text-secondary py-8 text-center">
                  No active sessions
                </p>
              )}
            </div>

            <div className="bg-surface-dark border-border-dark rounded-xl border p-6">
              <h3 className="mb-4 flex items-center gap-2 font-bold text-white">
                <span className="material-symbols-outlined text-primary">
                  history
                </span>
                Activity Log
              </h3>
              {transactions && transactions.length > 0 ? (
                <div className="space-y-2">
                  {transactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="bg-background-dark border-border-dark flex items-start justify-between rounded-lg border p-3"
                    >
                      <div className="flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <span
                            className={`text-xs font-bold uppercase ${
                              tx.type === "admin_adjustment"
                                ? "text-purple-400"
                                : tx.type === "gacha_pull"
                                  ? "text-blue-400"
                                  : tx.type === "card_purchase"
                                    ? "text-green-400"
                                    : tx.type === "milestone_reward"
                                      ? "text-yellow-400"
                                      : "text-gray-400"
                            }`}
                          >
                            {tx.type.replace(/_/g, " ")}
                          </span>
                          <span className="text-text-secondary text-xs">
                            {new Date(tx.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-text-secondary text-sm">
                          {tx.description ?? "No description"}
                        </p>
                      </div>
                      <div className="ml-4 text-right">
                        {tx.coinsChange !== 0 && (
                          <div
                            className={`text-sm font-bold ${
                              tx.coinsChange > 0
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            {tx.coinsChange > 0 ? "+" : ""}
                            {tx.coinsChange} Coins
                          </div>
                        )}
                        {tx.gemsChange !== 0 && (
                          <div
                            className={`text-sm font-bold ${
                              tx.gemsChange > 0
                                ? "text-green-400"
                                : "text-red-400"
                            }`}
                          >
                            {tx.gemsChange > 0 ? "+" : ""}
                            {tx.gemsChange} Gems
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-text-secondary py-8 text-center">
                  No activity yet
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={banConfirm}
        onClose={() => setBanConfirm(false)}
        onConfirm={confirmBan}
        title={user.isBanned ? "Unban User" : "Ban User"}
        message={
          user.isBanned
            ? "Are you sure you want to unban this user? They will regain access to the platform."
            : "Are you sure you want to ban this user? They will lose access to the platform."
        }
        confirmText={user.isBanned ? "Unban" : "Ban"}
        cancelText="Cancel"
      />

      <ConfirmModal
        isOpen={roleChangeConfirm}
        onClose={() => setRoleChangeConfirm(false)}
        onConfirm={confirmRoleChange}
        title="Change User Role"
        message={`Are you sure you want to change this user's role to ${selectedRole === "admin" ? "Administrator" : "User"}? This will ${selectedRole === "admin" ? "grant them full admin privileges" : "remove their admin privileges"}.`}
        confirmText="Change Role"
        cancelText="Cancel"
      />
    </div>
  )
}
