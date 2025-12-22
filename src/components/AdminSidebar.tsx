"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  DicesIcon,
  LayoutDashboardIcon,
  PackageIcon,
  SettingsIcon,
  TrophyIcon,
  UsersIcon,
  type LucideIcon,
} from "lucide-react"

import { useSession } from "@/lib/auth/client"

interface NavLinkProps {
  href: string
  icon: LucideIcon
  label: string
  isActive: boolean
}

const NavLink: React.FC<NavLinkProps> = ({
  href,
  icon: IconComponent,
  label,
  isActive,
}) => {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
        isActive
          ? "bg-primary text-[#181411]"
          : "text-text-secondary hover:bg-surface-highlight hover:text-white"
      }`}
    >
      <IconComponent className="size-5" />
      <span>{label}</span>
    </Link>
  )
}

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname()
  const { data: session } = useSession()

  const isAdmin = session?.user?.role === "admin"

  // Active state detection
  const isDashboardActive = pathname === "/admin"
  const isInventoryActive =
    pathname.startsWith("/admin/inventory") ||
    pathname.startsWith("/admin/cards")
  const isEventsActive = pathname.startsWith("/admin/events")
  const isUsersActive = pathname.startsWith("/admin/users")
  const isMilestonesActive = pathname.startsWith("/admin/milestones")
  const isSettingsActive = pathname.startsWith("/admin/settings")

  return (
    <aside className="border-border-dark bg-surface-dark flex h-screen w-64 flex-col border-r">
      <div className="border-border-dark border-b p-6">
        <h2 className="text-xl font-bold text-white">Admin Panel</h2>
        <p className="text-text-secondary mt-1 text-xs">
          {isAdmin ? "Administrator" : "Staff Member"}
        </p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        <NavLink
          href="/admin"
          icon={LayoutDashboardIcon}
          label="Dashboard"
          isActive={isDashboardActive}
        />

        <NavLink
          href="/admin/inventory"
          icon={PackageIcon}
          label="Card Inventory"
          isActive={isInventoryActive}
        />

        <NavLink
          href="/admin/events"
          icon={DicesIcon}
          label="Gacha Events"
          isActive={isEventsActive}
        />

        {isAdmin && (
          <NavLink
            href="/admin/users"
            icon={UsersIcon}
            label="User Management"
            isActive={isUsersActive}
          />
        )}

        <NavLink
          href="/admin/milestones"
          icon={TrophyIcon}
          label="Milestones"
          isActive={isMilestonesActive}
        />

        {isAdmin && (
          <NavLink
            href="/admin/settings"
            icon={SettingsIcon}
            label="Settings"
            isActive={isSettingsActive}
          />
        )}
      </nav>
    </aside>
  )
}
