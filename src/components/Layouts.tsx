import React from "react"

import { PublicHeader } from "./Headers"

export const PublicLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="bg-background-light dark:bg-background-dark flex h-screen flex-col overflow-hidden text-slate-900 dark:text-white">
      <PublicHeader />
      <main className="custom-scrollbar flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}

export const AdminLayout: React.FC<{
  children: React.ReactNode
  currentScreen: string
  onNavigate: (screen: any) => void
}> = ({ children, currentScreen, onNavigate }) => {
  // Simple sidebar component for admin layout
  const Sidebar = () => (
    <aside className="border-border-dark hidden h-full w-72 shrink-0 flex-col border-r bg-[#1e1915] md:flex">
      <div className="flex h-full flex-col justify-between p-6">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-4">
            <div
              className="border-primary size-12 rounded-full border-2 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAJTo5ozSEKMezTqTtcpCk3Bn34uCEvlew2jDQDuo7ywWPxWucvNyd3EZu4EQVJ0T5zgk_IuLlfi56I4rl15wobb1qeADvBiVV_UlDI3lraAXHCbAUi3UyRhUyXZgceNOk_gCu8eIUWEMQDH3-xo8jVPTRH-uNmXaL5oDVTQjI_3FP-MyvyQxQrY5joj2lAStOHg28402yx6eEca1CRXEpW6V2EHyhPR-g5kBTG0-fvy4meHW-EJXAHl_1j4fUENSTyHP-tqTPy1qnJ")',
              }}
            ></div>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold leading-tight text-white">
                TCG Admin
              </h1>
              <p className="text-text-secondary text-xs font-normal">
                System Admin
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {[
              { id: "admin_dashboard", icon: "dashboard", label: "Dashboard" },
              {
                id: "admin_inventory",
                icon: "inventory_2",
                label: "Card Inventory",
              },
              { id: "admin_event", icon: "casino", label: "Gacha Events" },
              { id: "admin_user", icon: "group", label: "User Management" },
              {
                id: "admin_milestones",
                icon: "emoji_events",
                label: "Milestones",
              },
              { id: "admin_settings", icon: "settings", label: "Settings" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left transition-colors ${currentScreen.startsWith(item.id) || (currentScreen === "admin_create" && item.id === "admin_inventory") ? "bg-primary text-[#181411]" : "hover:bg-surface-highlight text-text-secondary hover:text-white"}`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <p className="text-sm font-bold">{item.label}</p>
              </button>
            ))}
          </div>
        </div>
        <button className="bg-surface-highlight flex h-12 w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl px-4 text-sm font-bold text-white transition-colors hover:bg-[#4a3e33]">
          <span className="material-symbols-outlined text-sm">logout</span>
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  )

  return (
    <div className="bg-background-dark font-display flex h-screen w-full overflow-hidden text-white">
      <Sidebar />
      <main className="relative flex h-full flex-1 flex-col overflow-hidden">
        {children}
      </main>
    </div>
  )
}
