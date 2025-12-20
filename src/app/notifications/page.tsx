"use client"

/* eslint-disable @next/next/no-img-element */
import { useState } from "react"

import { trpc } from "@/lib/trpc/client"

export default function NotificationsPage() {
  const [typeFilter, setTypeFilter] = useState<
    "all" | "gacha" | "order" | "system" | "milestone"
  >("all")

  const { data: notifications, isLoading } = trpc.notifications.list.useQuery({
    type: typeFilter,
    limit: 50,
  })

  const markAsReadMutation = trpc.notifications.markAsRead.useMutation({
    onSuccess: () => {
      window.location.reload()
    },
  })

  const markAllAsReadMutation = trpc.notifications.markAllAsRead.useMutation({
    onSuccess: () => {
      window.location.reload()
    },
  })

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
    if (seconds < 60) return `${seconds} seconds ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`
    const days = Math.floor(hours / 24)
    return `${days} day${days > 1 ? "s" : ""} ago`
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-text-secondary">Loading notifications...</div>
      </div>
    )
  }

  return (
    <div className="flex justify-center px-4 py-8">
      <div className="w-full max-w-[960px]">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-black text-white">Notifications</h1>
            <p className="text-text-secondary">
              Stay updated with your latest pulls.
            </p>
          </div>
          <button
            onClick={() => markAllAsReadMutation.mutate()}
            disabled={markAllAsReadMutation.isPending}
            className="bg-surface-dark border-border-dark flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-sm">done_all</span>{" "}
            Mark all read
          </button>
        </div>
        <div className="mb-4 flex gap-2">
          <button
            onClick={() => setTypeFilter("all")}
            className={`rounded-lg px-4 py-1.5 text-sm font-bold ${
              typeFilter === "all"
                ? "bg-primary text-white"
                : "bg-surface-dark text-text-secondary"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setTypeFilter("gacha")}
            className={`rounded-lg px-4 py-1.5 text-sm ${
              typeFilter === "gacha"
                ? "bg-primary font-bold text-white"
                : "bg-surface-dark text-text-secondary"
            }`}
          >
            Gacha
          </button>
          <button
            onClick={() => setTypeFilter("order")}
            className={`rounded-lg px-4 py-1.5 text-sm ${
              typeFilter === "order"
                ? "bg-primary font-bold text-white"
                : "bg-surface-dark text-text-secondary"
            }`}
          >
            Orders
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {!notifications || notifications.length === 0 ? (
            <div className="bg-surface-dark border-border-dark rounded-xl border p-8 text-center">
              <p className="text-text-secondary">No notifications yet</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-surface-dark flex cursor-pointer items-start gap-4 rounded-r-xl border-l-4 p-4 hover:bg-white/5 ${
                  notification.type === "gacha"
                    ? "border-primary"
                    : notification.type === "order"
                      ? "border-blue-500"
                      : notification.type === "milestone"
                        ? "border-purple-500"
                        : "border-gray-500"
                }`}
                onClick={() => {
                  if (!notification.isRead) {
                    markAsReadMutation.mutate({ id: notification.id })
                  }
                }}
              >
                {notification.imageUrl ? (
                  <img
                    src={notification.imageUrl}
                    className="size-16 rounded-lg object-cover"
                    alt={notification.title}
                  />
                ) : (
                  <div
                    className={`flex size-16 items-center justify-center rounded-lg ${
                      notification.type === "gacha"
                        ? "bg-primary/20 text-primary"
                        : notification.type === "order"
                          ? "bg-blue-900/20 text-blue-500"
                          : notification.type === "milestone"
                            ? "bg-purple-900/20 text-purple-500"
                            : "bg-gray-900/20 text-gray-500"
                    }`}
                  >
                    <span className="material-symbols-outlined text-3xl">
                      {notification.type === "gacha"
                        ? "casino"
                        : notification.type === "order"
                          ? "local_shipping"
                          : notification.type === "milestone"
                            ? "emoji_events"
                            : "notifications"}
                    </span>
                  </div>
                )}
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                        notification.type === "gacha"
                          ? "bg-primary/20 text-primary"
                          : notification.type === "order"
                            ? "bg-blue-900/30 text-blue-400"
                            : notification.type === "milestone"
                              ? "bg-purple-900/30 text-purple-400"
                              : "bg-gray-900/30 text-gray-400"
                      }`}
                    >
                      {notification.type.toUpperCase()}
                    </span>
                    {!notification.isRead && (
                      <span className="bg-primary size-2 rounded-full"></span>
                    )}
                  </div>
                  <p className="font-bold text-white">{notification.title}</p>
                  <p className="text-text-secondary text-sm">
                    {notification.message}
                  </p>
                  <p className="text-text-secondary mt-2 text-xs">
                    {formatTimeAgo(new Date(notification.createdAt))}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
