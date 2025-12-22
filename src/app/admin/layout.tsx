"use client"

import { useState } from "react"
import { MenuIcon } from "lucide-react"

import { AdminSidebar } from "@/components/AdminSidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden">
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="bg-surface-dark hover:bg-surface-highlight fixed top-4 left-4 z-[60] rounded-lg p-3 text-white shadow-lg transition-colors md:hidden"
        aria-label="Toggle menu"
      >
        <MenuIcon className="size-6" />
      </button>

      <AdminSidebar
        isMobileOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
      <main className="flex-1 overflow-y-auto pt-16 md:pt-0">{children}</main>
    </div>
  )
}
