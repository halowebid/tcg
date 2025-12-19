import React from "react"

import { DashboardHeader } from "../components/Headers"

// --- Admin 1: Dashboard Overview ---
export const AdminDashboardScreen: React.FC = () => {
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
            label: "Total Revenue",
            value: "$12,450",
            change: "+12%",
            icon: "payments",
            color: "text-primary",
          },
          {
            label: "Active Pulls",
            value: "1,203",
            change: "+5%",
            icon: "shopping_bag",
            color: "text-primary",
          },
          {
            label: "New Collectors",
            value: "85",
            change: "+2%",
            icon: "person_add",
            color: "text-primary",
          },
          {
            label: "Pending Approvals",
            value: "14",
            change: "Attention",
            icon: "pending_actions",
            color: "text-primary",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="border-border-dark bg-surface-dark group relative flex flex-col gap-2 overflow-hidden rounded-xl border p-6"
          >
            <div className="absolute right-[-20px] top-[-20px] h-24 w-24 rounded-full bg-white opacity-5 blur-2xl transition-opacity group-hover:opacity-10"></div>
            <div className="flex items-start justify-between">
              <p className="text-text-secondary text-sm font-medium">
                {stat.label}
              </p>
              <span className={`material-symbols-outlined ${stat.color}`}>
                {stat.icon}
              </span>
            </div>
            <p className="text-3xl font-bold leading-tight text-white">
              {stat.value}
            </p>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm text-[#0bda16]">
                trending_up
              </span>
              <p className="text-sm font-medium text-[#0bda16]">
                {stat.change}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 px-2 pb-8 lg:grid-cols-2">
        <div className="border-border-dark bg-surface-dark relative flex flex-col gap-6 overflow-hidden rounded-xl border p-6">
          <div className="bg-primary/5 pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full blur-3xl"></div>
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
              <p className="text-2xl font-bold text-white">1,240</p>
              <p className="text-text-secondary text-xs uppercase">
                Total Cards
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-400">15</p>
              <p className="text-text-secondary text-xs uppercase">Drafts</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-500">8</p>
              <p className="text-text-secondary text-xs uppercase">Series</p>
            </div>
          </div>
          <button className="bg-surface-highlight hover:border-primary/30 group flex w-full items-center justify-between rounded-lg border border-transparent p-4 transition-all hover:bg-[#4a3e33]">
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
          <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl"></div>
          <div className="z-10 flex items-start justify-between">
            <div>
              <h3 className="flex items-center gap-2 text-xl font-bold text-white">
                <span className="material-symbols-outlined text-primary">
                  casino
                </span>{" "}
                Gacha Operations
              </h3>
              <p className="text-text-secondary mt-1 text-sm">
                Configure events and drop rates.
              </p>
            </div>
          </div>
          <div className="border-border-dark z-10 grid grid-cols-3 gap-4 border-y py-4">
            <div>
              <p className="text-2xl font-bold text-white">3</p>
              <p className="text-text-secondary text-xs uppercase">
                Active Events
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">0.5%</p>
              <p className="text-text-secondary text-xs uppercase">SSR Rate</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">12</p>
              <p className="text-text-secondary text-xs uppercase">
                Pack Types
              </p>
            </div>
          </div>
          <button className="bg-primary hover:bg-primary-dark group flex w-full items-center justify-between rounded-lg p-4 transition-all">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-[#181411]/20 p-2 text-[#181411]">
                <span className="material-symbols-outlined">celebration</span>
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-[#181411]">
                  Launch New Event
                </p>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#181411]">
              chevron_right
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

// --- Admin 2: Inventory List ---
export const AdminInventoryScreen: React.FC<{ onCreate: () => void }> = ({
  onCreate,
}) => {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <DashboardHeader
        title="Card Inventory"
        actions={
          <div className="flex gap-2">
            <button className="bg-surface-dark border-border-dark hover:bg-surface-highlight flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-bold text-white">
              <span className="material-symbols-outlined text-sm">upload</span>{" "}
              Import
            </button>
            <button
              onClick={onCreate}
              className="bg-primary text-background-dark hover:bg-primary-hover shadow-primary/20 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold shadow-lg"
            >
              <span className="material-symbols-outlined text-sm">add</span>{" "}
              Create New
            </button>
          </div>
        }
      />
      <div className="flex flex-1 flex-col overflow-hidden p-6">
        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-4">
          <div className="relative min-w-[200px] flex-1">
            <span className="material-symbols-outlined text-text-secondary absolute left-3 top-2.5">
              search
            </span>
            <input
              className="bg-surface-dark border-border-dark focus:border-primary w-full rounded-xl border py-2.5 pl-10 pr-4 text-white outline-none"
              placeholder="Search by name, ID..."
            />
          </div>
          <select className="bg-surface-dark border-border-dark focus:border-primary min-w-[140px] rounded-xl border px-4 py-2.5 text-white outline-none">
            <option>All Rarities</option>
            <option>Legendary</option>
            <option>Epic</option>
          </select>
          <select className="bg-surface-dark border-border-dark focus:border-primary min-w-[140px] rounded-xl border px-4 py-2.5 text-white outline-none">
            <option>All Sets</option>
            <option>Season 1</option>
            <option>Dragon's Awakening</option>
          </select>
        </div>

        {/* Table */}
        <div className="custom-scrollbar bg-surface-dark border-border-dark flex-1 overflow-y-auto rounded-2xl border">
          <table className="w-full border-collapse text-left">
            <thead className="sticky top-0 z-10 bg-[#2d241b]">
              <tr>
                <th className="text-text-secondary border-border-dark border-b p-4 text-xs font-bold uppercase">
                  Asset
                </th>
                <th className="text-text-secondary border-border-dark border-b p-4 text-xs font-bold uppercase">
                  Name
                </th>
                <th className="text-text-secondary border-border-dark border-b p-4 text-xs font-bold uppercase">
                  Rarity
                </th>
                <th className="text-text-secondary border-border-dark border-b p-4 text-xs font-bold uppercase">
                  Stats
                </th>
                <th className="text-text-secondary border-border-dark border-b p-4 text-xs font-bold uppercase">
                  Value
                </th>
                <th className="text-text-secondary border-border-dark border-b p-4 text-right text-xs font-bold uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((item, i) => (
                <tr
                  key={i}
                  className="border-border-dark group border-b transition-colors last:border-0 hover:bg-white/5"
                >
                  <td className="p-4">
                    <div className="bg-background-dark border-border-dark size-12 overflow-hidden rounded-lg border">
                      <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCN1vOA2xdIpPnb0RTNNv7tjcq_GR1o7XQV0iWHCNyn-2nEoKmniFTvjwx8VgGx_1t9uC9ZsoZuAtzkLUgZrIYHAXyj4khCiim1_qDzZNgrWsNKDiGIWEsqRpnqiWjoZHratm6HNXJz9B65BXmG3IJVsSWHUR4nHjSR3xE24xr2LONAbEzSDXK6e30aqFzplyAk_hsf0xjJmA37m2xSLrSWClNzh4V2gciqW3A2-V2Y-lwVAUXcSaCwmTK-46yXsUSMz_1uZRkuWAsN"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-white">Mecha Samurai</div>
                    <div className="text-text-secondary text-xs">
                      ID: #839201
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="rounded border border-purple-500/30 bg-purple-900/40 px-2 py-1 text-xs font-bold text-purple-300">
                      Epic
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="text-text-secondary text-xs">
                      ATK: <span className="text-white">2400</span>
                    </div>
                    <div className="text-text-secondary text-xs">
                      DEF: <span className="text-white">1800</span>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-white">$ 24.50</td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <button className="rounded p-2 text-white hover:bg-white/10">
                        <span className="material-symbols-outlined text-lg">
                          edit
                        </span>
                      </button>
                      <button className="rounded p-2 text-red-400 hover:bg-red-500/20">
                        <span className="material-symbols-outlined text-lg">
                          delete
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// --- Admin 3: Create Card ---
export const AdminCreateCardScreen: React.FC = () => {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <DashboardHeader
        title="Create New Card"
        breadcrumbs={["Inventory", "Create Item"]}
        actions={
          <div className="flex gap-3">
            <button className="border-border-dark hover:bg-surface-highlight rounded-lg border px-4 py-2 text-sm font-bold text-white">
              Cancel
            </button>
            <button className="bg-primary text-background-dark shadow-primary/20 hover:bg-primary-hover flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold shadow-lg">
              <span className="material-symbols-outlined text-sm">save</span>{" "}
              Save Item
            </button>
          </div>
        }
      />
      <div className="custom-scrollbar overflow-y-auto p-8">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 pb-10 lg:grid-cols-12">
          <div className="flex flex-col gap-6 lg:col-span-4">
            <h3 className="text-lg font-bold text-white">Card Visuals</h3>
            <div className="border-border-dark bg-surface-dark hover:border-primary/50 group flex h-[400px] cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed p-6 transition-colors">
              <div className="group-hover:bg-primary/20 flex size-16 items-center justify-center rounded-full bg-[#27211b] transition-colors">
                <span className="material-symbols-outlined text-text-secondary group-hover:text-primary text-3xl">
                  cloud_upload
                </span>
              </div>
              <div className="text-center">
                <p className="text-base font-bold text-white">
                  Card Image Asset
                </p>
                <p className="text-text-secondary mt-1 text-sm">
                  Drag & drop or click to upload
                </p>
              </div>
            </div>
            <div className="bg-surface-dark border-border-dark rounded-xl border p-4">
              <h4 className="mb-2 text-sm font-bold text-white">Metadata</h4>
              <div className="border-border-dark flex justify-between border-b py-1 text-sm">
                <span className="text-text-secondary">Resolution</span>
                <span className="text-white">--</span>
              </div>
              <div className="border-border-dark flex justify-between border-b py-1 text-sm">
                <span className="text-text-secondary">Size</span>
                <span className="text-white">--</span>
              </div>
              <div className="flex justify-between py-1 text-sm">
                <span className="text-text-secondary">Format</span>
                <span className="text-white">--</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-8 lg:col-span-8">
            <div className="bg-surface-dark border-border-dark rounded-xl border p-6">
              <div className="border-border-dark mb-6 flex items-center gap-2 border-b pb-4">
                <span className="material-symbols-outlined text-primary">
                  edit_document
                </span>
                <h3 className="text-lg font-bold text-white">
                  Basic Information
                </h3>
              </div>
              <div className="space-y-6">
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-white">
                    Card Name <span className="text-primary">*</span>
                  </span>
                  <input
                    className="bg-background-dark border-border-dark focus:border-primary focus:ring-primary h-12 w-full rounded-xl border px-4 text-white outline-none focus:ring-1"
                    placeholder="e.g. Celestial Paladin"
                  />
                </label>
                <div className="grid grid-cols-2 gap-6">
                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-white">
                      Rarity <span className="text-primary">*</span>
                    </span>
                    <select className="bg-background-dark border-border-dark focus:border-primary h-12 w-full rounded-xl border px-4 text-white outline-none">
                      <option>Legendary</option>
                      <option>Epic</option>
                      <option>Rare</option>
                      <option>Common</option>
                    </select>
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-white">
                      Card Set
                    </span>
                    <select className="bg-background-dark border-border-dark focus:border-primary h-12 w-full rounded-xl border px-4 text-white outline-none">
                      <option>Base Set (2024)</option>
                      <option>Dragon's Awakening</option>
                    </select>
                  </label>
                </div>
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-white">
                    Description
                  </span>
                  <textarea
                    className="bg-background-dark border-border-dark focus:border-primary min-h-[120px] w-full rounded-xl border p-4 text-white outline-none"
                    placeholder="Flavor text..."
                  ></textarea>
                </label>
              </div>
            </div>

            <div className="bg-surface-dark border-border-dark rounded-xl border p-6">
              <div className="border-border-dark mb-6 flex items-center gap-2 border-b pb-4">
                <span className="material-symbols-outlined text-primary">
                  stat_0
                </span>
                <h3 className="text-lg font-bold text-white">Stats & Value</h3>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-white">
                    Attack Power
                  </span>
                  <input
                    type="number"
                    className="bg-background-dark border-border-dark focus:border-primary h-12 w-full rounded-xl border px-4 text-white outline-none"
                    placeholder="0"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-white">
                    Defense Power
                  </span>
                  <input
                    type="number"
                    className="bg-background-dark border-border-dark focus:border-primary h-12 w-full rounded-xl border px-4 text-white outline-none"
                    placeholder="0"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-white">
                    Market Value (Est.)
                  </span>
                  <input
                    className="bg-background-dark border-border-dark focus:border-primary h-12 w-full rounded-xl border px-4 text-white outline-none"
                    placeholder="$ 0.00"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-white">
                    Drop Rate Weight
                  </span>
                  <input
                    type="number"
                    className="bg-background-dark border-border-dark focus:border-primary h-12 w-full rounded-xl border px-4 text-white outline-none"
                    placeholder="0.5"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- Admin 4: Edit Event ---
export const AdminEventScreen: React.FC = () => {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <DashboardHeader
        title="Summer Heat Pack"
        breadcrumbs={["Dashboard", "Gacha Events", "Summer Heat Pack"]}
        actions={
          <span className="inline-flex items-center rounded-full bg-green-500/10 px-3 py-1 text-xs font-bold text-green-500 ring-1 ring-inset ring-green-500/20">
            Live Status: Active
          </span>
        }
      />
      <div className="custom-scrollbar overflow-y-auto p-8">
        <div className="mx-auto max-w-6xl space-y-8 pb-10">
          <section className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="flex flex-col gap-4 lg:col-span-1">
              <div className="mb-2 font-bold text-white">Event Banner</div>
              <div className="bg-surface-dark border-border-dark group relative flex aspect-video w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed">
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-50 transition-opacity group-hover:opacity-30"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAHk2B251jdAHYoziuYQ3Zdxg9viSjE2ZQOdpZUgyMZIY7HxuAr_1Bmsst_qQEXrYWTIg8qLrod3hO_B4Ed05BJNo1MJkbbGG0_rBSds7RiAPr8j6_W38pKkQHvD5t1y2_kG4q8k9vY8Z8m2-u1j8c5Z9l8p6m5n4b2v3c1x0z9")',
                  }}
                ></div>
                <div className="relative z-10 flex flex-col items-center">
                  <span className="material-symbols-outlined mb-2 text-white">
                    image
                  </span>
                  <span className="text-xs font-bold text-white">
                    Change Banner
                  </span>
                </div>
              </div>

              <div className="bg-surface-dark border-border-dark mt-4 rounded-xl border p-5">
                <h4 className="mb-4 font-bold text-white">Event Duration</h4>
                <div className="space-y-4">
                  <div>
                    <label className="text-text-secondary text-xs font-bold uppercase">
                      Start Date
                    </label>
                    <input
                      type="date"
                      className="bg-background-dark border-border-dark mt-1 w-full rounded-lg border px-3 py-2 text-white"
                      value="2023-06-01"
                    />
                  </div>
                  <div>
                    <label className="text-text-secondary text-xs font-bold uppercase">
                      End Date
                    </label>
                    <input
                      type="date"
                      className="bg-background-dark border-border-dark mt-1 w-full rounded-lg border px-3 py-2 text-white"
                      value="2023-08-31"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-surface-dark border-border-dark h-full rounded-xl border p-6">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">
                    Drop Rate Configuration
                  </h3>
                  <button className="text-primary text-sm font-bold transition-colors hover:text-white">
                    Reset to Default
                  </button>
                </div>

                <div className="space-y-6">
                  {[
                    {
                      rarity: "Legendary (SSR)",
                      color: "text-primary",
                      value: 0.5,
                    },
                    {
                      rarity: "Epic (SR)",
                      color: "text-purple-400",
                      value: 4.5,
                    },
                    { rarity: "Rare (R)", color: "text-blue-400", value: 15.0 },
                    {
                      rarity: "Common (C)",
                      color: "text-gray-400",
                      value: 80.0,
                    },
                  ].map((rate, idx) => (
                    <div key={idx}>
                      <div className="mb-2 flex justify-between">
                        <span className={`font-bold ${rate.color}`}>
                          {rate.rarity}
                        </span>
                        <span className="font-mono text-white">
                          {rate.value}%
                        </span>
                      </div>
                      <div className="bg-background-dark flex h-2 w-full overflow-hidden rounded-full">
                        <div
                          className="h-full rounded-full bg-current"
                          style={{
                            width: `${rate.value}%`,
                            color:
                              idx === 0
                                ? "#f48c25"
                                : idx === 1
                                  ? "#a855f7"
                                  : idx === 2
                                    ? "#60a5fa"
                                    : "#9ca3af",
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}

                  <div className="border-border-dark mt-6 border-t pt-6">
                    <h4 className="mb-4 font-bold text-white">
                      Featured Cards (Rate Up)
                    </h4>
                    <div className="flex gap-4 overflow-x-auto pb-2">
                      <div className="bg-background-dark border-primary relative size-20 shrink-0 rounded-lg border">
                        <img
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfnGf9Sc_OQOAi79UOhJsx8j1CzV_Zl2AvdZf8RBZNBVb9uX5gtdRP7Mn_ZK5QszE5_Z6Vd4D_LHFBM1gGV5wm7IZup6gpXo7W24qTk5liQlWQxpGKMzxHJHkKp8peLA76Vo2CvV_EIM6stQaf9DkNMuf5pahfv4fQprFcVpP6a_9NKkNQPJ10NdqpQxF7CPz_YIm8VTLOKYLaMdOggLoUn8R7DuRwy1Sq5gQYRMPQJSLP84tJGLXx7ThaqI8yaIm21WWn1W6_eW_X"
                          className="h-full w-full rounded-lg object-cover opacity-70"
                        />
                        <div className="absolute right-[-5px] top-[-5px] rounded bg-red-500 px-1 text-[10px] font-bold text-white">
                          x2
                        </div>
                      </div>
                      <div className="bg-background-dark border-border-dark text-text-secondary flex size-20 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-dashed transition-colors hover:border-white hover:text-white">
                        <span className="material-symbols-outlined">add</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

// --- Admin 5: User Edit ---
export const AdminUserEditScreen: React.FC = () => {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <DashboardHeader
        title="User Management"
        breadcrumbs={["Dashboard", "Users", "DuelistKai"]}
        actions={
          <div className="flex gap-2">
            <button className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-500/20">
              <span className="material-symbols-outlined text-sm">block</span>{" "}
              Ban User
            </button>
            <button className="bg-surface-dark border-border-dark flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-bold text-white">
              <span className="material-symbols-outlined text-sm">
                lock_reset
              </span>{" "}
              Reset Password
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
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB9JRJLfT8oZa5JAJj2RtM6Xr6jeQgV7RVPodUQoE0qN8VYw2oOPpSWbjOBPi2qsZLdsFWUiL4P0dlX9ofljHmTtsvyaQRvK0hETMomBNzmgjayb_5d81Md9HNR9Z411FaiJOhT5HGw3C_kcIdiMbn4HMvQyFPZw0h7_E8GzQAIjupV8fR1pxSeGMEBltqDTVLLtn3-BjSRPBQ2YvxFnEzYUnh-Hua9vZK_PhtZksTdlpsnVdlQ-j-OW8AJlOef4t8_EEc-gU9fR3uz")',
                }}
              ></div>
              <h2 className="text-xl font-bold text-white">DuelistKai</h2>
              <p className="text-text-secondary text-sm">ID: #8829102</p>
              <div className="border-border-dark mt-4 grid w-full grid-cols-2 gap-2 border-t pt-4 text-center">
                <div>
                  <span className="block font-bold text-white">42</span>
                  <span className="text-text-secondary text-xs">Level</span>
                </div>
                <div>
                  <span className="block font-bold text-white">Active</span>
                  <span className="text-xs text-green-500">Status</span>
                </div>
              </div>
            </div>

            <div className="bg-surface-dark border-border-dark mt-6 rounded-xl border p-6">
              <h3 className="mb-4 font-bold text-white">Contact Info</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-text-secondary text-xs font-bold uppercase">
                    Email
                  </label>
                  <p className="text-sm text-white">kai.duelist@example.com</p>
                </div>
                <div>
                  <label className="text-text-secondary text-xs font-bold uppercase">
                    Registration Date
                  </label>
                  <p className="text-sm text-white">Oct 24, 2023</p>
                </div>
                <div>
                  <label className="text-text-secondary text-xs font-bold uppercase">
                    Last Login
                  </label>
                  <p className="text-sm text-white">Today, 10:42 AM</p>
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
                </span>{" "}
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
                  <p className="mb-4 text-2xl font-bold text-white">2,500</p>
                  <div className="flex gap-2">
                    <input
                      className="bg-surface-dark border-border-dark focus:border-primary w-full rounded border px-2 text-sm text-white outline-none"
                      placeholder="+/- Amount"
                    />
                    <button className="bg-primary text-background-dark rounded px-3 text-sm font-bold">
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
                  <p className="mb-4 text-2xl font-bold text-white">450</p>
                  <div className="flex gap-2">
                    <input
                      className="bg-surface-dark border-border-dark focus:border-primary w-full rounded border px-2 text-sm text-white outline-none"
                      placeholder="+/- Amount"
                    />
                    <button className="bg-primary text-background-dark rounded px-3 text-sm font-bold">
                      Update
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-surface-dark border-border-dark rounded-xl border p-6">
              <h3 className="mb-4 font-bold text-white">Recent Activity</h3>
              <div className="space-y-4">
                {[
                  {
                    action: 'Purchased "Dragon Pack"',
                    time: "2 hours ago",
                    amount: "-500 Coins",
                  },
                  {
                    action: "Daily Login Reward",
                    time: "5 hours ago",
                    amount: "+100 Coins",
                  },
                  {
                    action: "Gacha Pull (10x)",
                    time: "1 day ago",
                    amount: "-5000 Coins",
                  },
                ].map((log, i) => (
                  <div
                    key={i}
                    className="border-border-dark flex items-center justify-between border-b py-2 last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-white">
                        {log.action}
                      </p>
                      <p className="text-text-secondary text-xs">{log.time}</p>
                    </div>
                    <span
                      className={`text-sm font-bold ${log.amount.startsWith("+") ? "text-green-500" : "text-red-400"}`}
                    >
                      {log.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- Admin 6: Milestones ---
export const AdminMilestonesScreen: React.FC = () => {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <DashboardHeader
        title="Milestone Configuration"
        actions={
          <button className="bg-primary text-background-dark hover:bg-primary-hover flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold">
            <span className="material-symbols-outlined text-sm">add</span> Add
            New Milestone
          </button>
        }
      />
      <div className="custom-scrollbar overflow-y-auto p-8">
        <div className="grid grid-cols-1 gap-6 pb-10 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Beginner Collector",
              desc: "Collect 10 unique cards",
              reward: "100 Coins",
              icon: "style",
              active: true,
            },
            {
              title: "Dragon Master",
              desc: "Collect all Dragon type cards",
              reward: "Exclusive Badge",
              icon: "local_fire_department",
              active: true,
            },
            {
              title: "Big Spender",
              desc: "Spend 50,000 Coins total",
              reward: "500 Gems",
              icon: "savings",
              active: false,
            },
            {
              title: "Social Butterfly",
              desc: "Add 5 friends",
              reward: "50 Coins",
              icon: "group",
              active: true,
            },
          ].map((milestone, i) => (
            <div
              key={i}
              className="bg-surface-dark border-border-dark hover:border-primary/50 group rounded-xl border p-6 transition-colors"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="bg-background-dark border-border-dark flex size-12 items-center justify-center rounded-lg border">
                  <span className="material-symbols-outlined text-primary text-2xl">
                    {milestone.icon}
                  </span>
                </div>
                <div
                  className={`h-3 w-3 rounded-full ${milestone.active ? "bg-green-500" : "bg-gray-600"}`}
                ></div>
              </div>
              <h3 className="mb-1 text-lg font-bold text-white">
                {milestone.title}
              </h3>
              <p className="text-text-secondary mb-4 text-sm">
                {milestone.desc}
              </p>
              <div className="bg-background-dark mb-4 flex items-center gap-3 rounded-lg p-3">
                <span className="material-symbols-outlined text-sm text-yellow-500">
                  emoji_events
                </span>
                <span className="text-sm font-bold text-white">
                  {milestone.reward}
                </span>
              </div>
              <div className="flex gap-2">
                <button className="bg-surface-highlight flex-1 rounded-lg py-2 text-sm font-bold text-white transition-colors hover:bg-white hover:text-black">
                  Edit
                </button>
                <button className="bg-surface-highlight text-text-secondary flex-1 rounded-lg py-2 text-sm font-bold transition-colors hover:bg-red-500/20 hover:text-red-500">
                  Delete
                </button>
              </div>
            </div>
          ))}

          {/* Add New Card Placeholder */}
          <div className="border-border-dark hover:border-primary/50 hover:bg-surface-dark/50 flex min-h-[280px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-all">
            <span className="material-symbols-outlined text-text-secondary mb-2 text-4xl">
              add_circle
            </span>
            <p className="text-text-secondary font-bold">
              Create New Milestone
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- Admin 7: Settings ---
export const AdminSettingsScreen: React.FC = () => {
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
              </span>{" "}
              General Configuration
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="text-text-secondary mb-1 block text-xs font-bold uppercase">
                  Game Title
                </label>
                <input
                  className="bg-background-dark border-border-dark w-full rounded-lg border px-3 py-2 text-white"
                  defaultValue="CardGacha"
                />
              </div>
              <div>
                <label className="text-text-secondary mb-1 block text-xs font-bold uppercase">
                  Support Email
                </label>
                <input
                  className="bg-background-dark border-border-dark w-full rounded-lg border px-3 py-2 text-white"
                  defaultValue="support@cardgacha.com"
                />
              </div>
              <div className="md:col-span-2">
                <label className="border-border-dark flex cursor-pointer items-center gap-3 rounded-lg border p-3 hover:bg-white/5">
                  <input
                    type="checkbox"
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

          {/* Economy */}
          <section className="bg-surface-dark border-border-dark rounded-xl border p-6">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
              <span className="material-symbols-outlined text-primary">
                paid
              </span>{" "}
              Economy Settings
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="text-text-secondary mb-1 block text-xs font-bold uppercase">
                  Currency Name
                </label>
                <input
                  className="bg-background-dark border-border-dark w-full rounded-lg border px-3 py-2 text-white"
                  defaultValue="Gold Coins"
                />
              </div>
              <div>
                <label className="text-text-secondary mb-1 block text-xs font-bold uppercase">
                  Premium Currency Name
                </label>
                <input
                  className="bg-background-dark border-border-dark w-full rounded-lg border px-3 py-2 text-white"
                  defaultValue="Gems"
                />
              </div>
              <div>
                <label className="text-text-secondary mb-1 block text-xs font-bold uppercase">
                  Exchange Rate ($1 USD)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    className="bg-background-dark border-border-dark w-full rounded-lg border px-3 py-2 text-white"
                    defaultValue="100"
                  />
                  <span className="font-bold text-white">Coins</span>
                </div>
              </div>
            </div>
          </section>

          <div className="flex justify-end pt-4">
            <button className="bg-primary hover:bg-primary-hover text-background-dark shadow-primary/20 rounded-xl px-8 py-3 font-bold shadow-lg transition-transform active:scale-95">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
