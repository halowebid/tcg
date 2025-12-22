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
  XIcon,
  type LucideIcon,
} from "lucide-react"

import { useSession } from "@/lib/auth/client"

interface NavLinkProps {
  href: string
  icon: LucideIcon
  label: string
  isActive: boolean
  onClick?: () => void
}

const NavLink: React.FC<NavLinkProps> = ({
  href,
  icon: IconComponent,
  label,
  isActive,
  onClick,
}) => {
  return (
    <Link
      href={href}
      onClick={onClick}
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

interface AdminSidebarProps {
  isMobileOpen?: boolean
  onClose?: () => void
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  isMobileOpen = false,
  onClose,
}) => {
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
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`border-border-dark bg-surface-dark fixed z-50 flex h-screen w-64 flex-col border-r transition-transform duration-300 md:static md:translate-x-0 ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} `}
      >
        <button
          onClick={onClose}
          className="text-text-secondary absolute top-4 right-4 transition-colors hover:text-white md:hidden"
          aria-label="Close menu"
        >
          <XIcon className="size-6" />
        </button>

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
            onClick={onClose}
          />

          <NavLink
            href="/admin/inventory"
            icon={PackageIcon}
            label="Card Inventory"
            isActive={isInventoryActive}
            onClick={onClose}
          />

          <NavLink
            href="/admin/events"
            icon={DicesIcon}
            label="Gacha Events"
            isActive={isEventsActive}
            onClick={onClose}
          />

          {isAdmin && (
            <NavLink
              href="/admin/users"
              icon={UsersIcon}
              label="User Management"
              isActive={isUsersActive}
              onClick={onClose}
            />
          )}

          <NavLink
            href="/admin/milestones"
            icon={TrophyIcon}
            label="Milestones"
            isActive={isMilestonesActive}
            onClick={onClose}
          />

          {isAdmin && (
            <NavLink
              href="/admin/settings"
              icon={SettingsIcon}
              label="Settings"
              isActive={isSettingsActive}
              onClick={onClose}
            />
          )}
        </nav>
      </aside>
    </>
  )
}
