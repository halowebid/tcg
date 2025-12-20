"use client"

import React, { useEffect, useState } from "react"
import { toast } from "sonner"
import { z } from "zod"

import { DashboardHeader } from "@/components/Headers"
import { trpc } from "@/lib/trpc/client"

const settingsSchema = z.object({
  gameTitle: z
    .string()
    .min(1, "Game title is required")
    .max(100, "Must be less than 100 characters"),
  supportEmail: z.string().email("Must be a valid email address"),
  maintenanceMode: z.boolean(),
  currencyName: z
    .string()
    .min(1, "Currency name is required")
    .max(50, "Must be less than 50 characters"),
  premiumCurrencyName: z
    .string()
    .min(1, "Premium currency name is required")
    .max(50, "Must be less than 50 characters"),
  exchangeRate: z
    .number()
    .int()
    .positive("Exchange rate must be a positive number"),
})

export default function AdminSettingsPage() {
  const { data: settings, isLoading } = trpc.settings.get.useQuery()
  const updateMutation = trpc.settings.update.useMutation({
    onSuccess: () => {
      toast.success("Settings updated successfully!")
      window.location.reload()
    },
    onError: (error) => {
      toast.error(`Failed to update settings: ${error.message}`)
    },
  })

  const [formData, setFormData] = useState({
    gameTitle: "TCG Gacha System",
    supportEmail: "support@tcg-gacha.com",
    maintenanceMode: false,
    currencyName: "Coins",
    premiumCurrencyName: "Gems",
    exchangeRate: 100,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (settings) {
      setFormData({
        gameTitle: settings.gameTitle,
        supportEmail: settings.supportEmail,
        maintenanceMode: settings.maintenanceMode,
        currencyName: settings.currencyName,
        premiumCurrencyName: settings.premiumCurrencyName,
        exchangeRate: settings.exchangeRate,
      })
    }
  }, [settings])

  const handleSave = () => {
    // Validate form data
    const result = settingsSchema.safeParse(formData)

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
    updateMutation.mutate(formData)
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="border-primary mb-4 inline-block size-8 animate-spin rounded-full border-4 border-t-transparent"></div>
          <p className="text-text-secondary">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <DashboardHeader title="System Settings" />
      <div className="custom-scrollbar overflow-y-auto p-8">
        <div className="max-w-4xl space-y-8 pb-10">
          {/* General */}
          <section className="bg-surface-dark border-border-dark rounded-xl border p-6">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
              <span className="material-symbols-outlined text-primary">
                tune
              </span>
              General Configuration
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="text-text-secondary mb-1 block text-xs font-bold uppercase">
                  Game Title
                </label>
                <input
                  className={`bg-background-dark border-border-dark w-full rounded-lg border px-3 py-2 text-white ${
                    errors["gameTitle"] ? "border-red-500" : ""
                  }`}
                  value={formData.gameTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, gameTitle: e.target.value })
                  }
                />
                {errors["gameTitle"] && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors["gameTitle"]}
                  </p>
                )}
              </div>
              <div>
                <label className="text-text-secondary mb-1 block text-xs font-bold uppercase">
                  Support Email
                </label>
                <input
                  className={`bg-background-dark border-border-dark w-full rounded-lg border px-3 py-2 text-white ${
                    errors["supportEmail"] ? "border-red-500" : ""
                  }`}
                  value={formData.supportEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, supportEmail: e.target.value })
                  }
                />
                {errors["supportEmail"] && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors["supportEmail"]}
                  </p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="border-border-dark flex cursor-pointer items-center gap-3 rounded-lg border p-3 hover:bg-white/5">
                  <input
                    type="checkbox"
                    className="text-primary focus:ring-primary bg-background-dark size-5 rounded border-gray-600"
                    checked={formData.maintenanceMode}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maintenanceMode: e.target.checked,
                      })
                    }
                  />
                  <div>
                    <span className="block font-bold text-white">
                      Maintenance Mode
                    </span>
                    <span className="text-text-secondary text-xs">
                      Prevent regular users from logging in. Admins still have
                      access.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </section>

          {/* Economy */}
          <section className="bg-surface-dark border-border-dark rounded-xl border p-6">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
              <span className="material-symbols-outlined text-primary">
                paid
              </span>
              Economy Settings
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="text-text-secondary mb-1 block text-xs font-bold uppercase">
                  Currency Name
                </label>
                <input
                  className="bg-background-dark border-border-dark w-full rounded-lg border px-3 py-2 text-white"
                  value={formData.currencyName}
                  onChange={(e) =>
                    setFormData({ ...formData, currencyName: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-text-secondary mb-1 block text-xs font-bold uppercase">
                  Premium Currency Name
                </label>
                <input
                  className="bg-background-dark border-border-dark w-full rounded-lg border px-3 py-2 text-white"
                  value={formData.premiumCurrencyName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      premiumCurrencyName: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="text-text-secondary mb-1 block text-xs font-bold uppercase">
                  Exchange Rate ($1 USD)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    className="bg-background-dark border-border-dark w-full rounded-lg border px-3 py-2 text-white"
                    value={formData.exchangeRate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        exchangeRate: parseInt(e.target.value) ?? 0,
                      })
                    }
                  />
                  <span className="font-bold text-white">Coins</span>
                </div>
              </div>
            </div>
          </section>

          {/* Gacha Settings */}
          <section className="bg-surface-dark border-border-dark rounded-xl border p-6">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
              <span className="material-symbols-outlined text-primary">
                casino
              </span>
              Gacha Settings
            </h3>
            <div className="bg-background-dark border-border-dark rounded-lg border p-4">
              <p className="text-text-secondary text-sm">
                Default drop rates are configured per gacha event. Visit
                individual events to modify rates.
              </p>
              <div className="mt-4 grid grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-xs text-gray-400">Common</p>
                  <p className="mt-1 text-lg font-bold text-white">70%</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400">Rare</p>
                  <p className="mt-1 text-lg font-bold text-blue-400">20%</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400">Epic</p>
                  <p className="mt-1 text-lg font-bold text-purple-400">8%</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400">Legendary</p>
                  <p className="mt-1 text-lg font-bold text-yellow-400">2%</p>
                </div>
              </div>
            </div>
          </section>

          <div className="flex justify-end pt-4">
            <button
              onClick={handleSave}
              disabled={updateMutation.isPending}
              className="bg-primary hover:bg-primary-hover text-background-dark shadow-primary/20 rounded-xl px-8 py-3 font-bold shadow-lg transition-transform active:scale-95 disabled:opacity-50"
            >
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
