"use client"

import React, { useState } from "react"
import { DashboardHeader } from "@/components/Headers"

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    gameTitle: "TCG Gacha System",
    supportEmail: "support@tcg-gacha.com",
    maintenanceMode: false,
    currencyName: "Coins",
    premiumCurrencyName: "Gems",
    exchangeRate: 100,
  })

  const handleSave = () => {
    // TODO: Implement settings save when backend router is created
    alert("Settings functionality requires a backend router to be implemented first.\n\nTo implement:\n1. Create system_settings table in database\n2. Add settings router in /src/lib/api/routers/settings.ts\n3. Add getSettings and updateSettings procedures\n4. Export in /src/lib/api/root.ts")
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <DashboardHeader title="System Settings" />
      <div className="custom-scrollbar overflow-y-auto p-8">
        <div className="max-w-4xl space-y-8 pb-10">
          {/* Notice Banner */}
          <div className="bg-yellow-500/10 border-yellow-500/20 rounded-xl border p-4">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-yellow-500">
                info
              </span>
              <div>
                <h4 className="font-bold text-yellow-500">Settings Backend Not Implemented</h4>
                <p className="text-text-secondary mt-1 text-sm">
                  This page requires a settings router to be created. Currently showing default values only.
                </p>
              </div>
            </div>
          </div>

          {/* General */}
          <section className="bg-surface-dark border-border-dark rounded-xl border p-6">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
              <span className="material-symbols-outlined text-primary">tune</span>
              General Configuration
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="text-text-secondary mb-1 block text-xs font-bold uppercase">
                  Game Title
                </label>
                <input
                  className="bg-background-dark border-border-dark w-full rounded-lg border px-3 py-2 text-white"
                  value={settings.gameTitle}
                  onChange={(e) => setSettings({ ...settings, gameTitle: e.target.value })}
                />
              </div>
              <div>
                <label className="text-text-secondary mb-1 block text-xs font-bold uppercase">
                  Support Email
                </label>
                <input
                  className="bg-background-dark border-border-dark w-full rounded-lg border px-3 py-2 text-white"
                  value={settings.supportEmail}
                  onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <label className="border-border-dark flex cursor-pointer items-center gap-3 rounded-lg border p-3 hover:bg-white/5">
                  <input
                    type="checkbox"
                    className="text-primary focus:ring-primary bg-background-dark size-5 rounded border-gray-600"
                    checked={settings.maintenanceMode}
                    onChange={(e) =>
                      setSettings({ ...settings, maintenanceMode: e.target.checked })
                    }
                  />
                  <div>
                    <span className="block font-bold text-white">Maintenance Mode</span>
                    <span className="text-text-secondary text-xs">
                      Prevent regular users from logging in. Admins still have access.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </section>

          {/* Economy */}
          <section className="bg-surface-dark border-border-dark rounded-xl border p-6">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
              <span className="material-symbols-outlined text-primary">paid</span>
              Economy Settings
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="text-text-secondary mb-1 block text-xs font-bold uppercase">
                  Currency Name
                </label>
                <input
                  className="bg-background-dark border-border-dark w-full rounded-lg border px-3 py-2 text-white"
                  value={settings.currencyName}
                  onChange={(e) => setSettings({ ...settings, currencyName: e.target.value })}
                />
              </div>
              <div>
                <label className="text-text-secondary mb-1 block text-xs font-bold uppercase">
                  Premium Currency Name
                </label>
                <input
                  className="bg-background-dark border-border-dark w-full rounded-lg border px-3 py-2 text-white"
                  value={settings.premiumCurrencyName}
                  onChange={(e) =>
                    setSettings({ ...settings, premiumCurrencyName: e.target.value })
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
                    value={settings.exchangeRate}
                    onChange={(e) =>
                      setSettings({ ...settings, exchangeRate: parseInt(e.target.value) || 0 })
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
              <span className="material-symbols-outlined text-primary">casino</span>
              Gacha Settings
            </h3>
            <div className="bg-background-dark border-border-dark rounded-lg border p-4">
              <p className="text-text-secondary text-sm">
                Default drop rates are configured per gacha event. Visit individual events to modify rates.
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
              className="bg-primary hover:bg-primary-hover text-background-dark shadow-primary/20 rounded-xl px-8 py-3 font-bold shadow-lg transition-transform active:scale-95"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
