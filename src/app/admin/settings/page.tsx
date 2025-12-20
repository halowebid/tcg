"use client"

import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import {
  systemSettingsFormSchema,
  type SystemSettingsFormInput,
} from "@/lib/db/schema/validations"
import { DashboardHeader } from "@/components/Headers"
import { trpc } from "@/lib/trpc/client"

export default function AdminSettingsPage() {
  const { data: settings, isLoading } = trpc.settings.get.useQuery()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SystemSettingsFormInput>({
    resolver: zodResolver(systemSettingsFormSchema),
    defaultValues: {
      gameTitle: "TCG Gacha System",
      supportEmail: "support@tcg-gacha.com",
      maintenanceMode: false,
      currencyName: "Coins",
      premiumCurrencyName: "Gems",
      exchangeRate: 100,
    },
  })

  useEffect(() => {
    if (settings) {
      reset({
        gameTitle: settings.gameTitle,
        supportEmail: settings.supportEmail,
        maintenanceMode: settings.maintenanceMode,
        currencyName: settings.currencyName,
        premiumCurrencyName: settings.premiumCurrencyName,
        exchangeRate: settings.exchangeRate,
      })
    }
  }, [settings, reset])

  const updateMutation = trpc.settings.update.useMutation({
    onSuccess: () => {
      toast.success("Settings updated successfully!")
      window.location.reload()
    },
    onError: (error) => {
      toast.error(`Failed to update settings: ${error.message}`)
    },
  })

  const onSubmit = (data: SystemSettingsFormInput) => {
    updateMutation.mutate(data)
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
                  {...register("gameTitle")}
                  className={`bg-background-dark border-border-dark w-full rounded-lg border px-3 py-2 text-white ${
                    errors.gameTitle ? "border-red-500" : ""
                  }`}
                />
                {errors.gameTitle && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.gameTitle.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-text-secondary mb-1 block text-xs font-bold uppercase">
                  Support Email
                </label>
                <input
                  {...register("supportEmail")}
                  className={`bg-background-dark border-border-dark w-full rounded-lg border px-3 py-2 text-white ${
                    errors.supportEmail ? "border-red-500" : ""
                  }`}
                />
                {errors.supportEmail && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.supportEmail.message}
                  </p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="border-border-dark flex cursor-pointer items-center gap-3 rounded-lg border p-3 hover:bg-white/5">
                  <input
                    type="checkbox"
                    {...register("maintenanceMode")}
                    className="text-primary focus:ring-primary bg-background-dark size-5 rounded border-gray-600"
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
                  {...register("currencyName")}
                  className="bg-background-dark border-border-dark w-full rounded-lg border px-3 py-2 text-white"
                />
                {errors.currencyName && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.currencyName.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-text-secondary mb-1 block text-xs font-bold uppercase">
                  Premium Currency Name
                </label>
                <input
                  {...register("premiumCurrencyName")}
                  className="bg-background-dark border-border-dark w-full rounded-lg border px-3 py-2 text-white"
                />
                {errors.premiumCurrencyName && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.premiumCurrencyName.message}
                  </p>
                )}
              </div>
              <div>
                <label className="text-text-secondary mb-1 block text-xs font-bold uppercase">
                  Exchange Rate ($1 USD)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    {...register("exchangeRate", { valueAsNumber: true })}
                    className="bg-background-dark border-border-dark w-full rounded-lg border px-3 py-2 text-white"
                  />
                  <span className="font-bold text-white">Coins</span>
                </div>
                {errors.exchangeRate && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.exchangeRate.message}
                  </p>
                )}
              </div>
            </div>
          </section>

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
              onClick={handleSubmit(onSubmit)}
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
