"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { signOut, useSession } from "@/lib/auth/client"
import { trpc } from "@/lib/trpc/client"
import { formatUSD } from "@/lib/utils/currency"

export const PublicHeader: React.FC = () => {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { data: session } = useSession()
  const { data: wallet } = trpc.users.getWallet.useQuery(undefined, {
    enabled: !!session?.user,
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(
        `/marketplace?search=${encodeURIComponent(searchQuery.trim())}`,
      )
    }
  }

  const handleSignOut = async () => {
    await signOut()
    setShowUserMenu(false)
    router.push("/")
  }

  const isAdmin = session?.user?.role === "admin"
  const isStaff = session?.user?.role === "staff"

  return (
    <header className="border-border-dark bg-background-dark/95 sticky top-0 z-50 flex items-center justify-between border-b px-6 py-3 whitespace-nowrap backdrop-blur-md lg:px-10">
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-4 text-white">
          <div className="text-primary size-8">
            <span className="material-symbols-outlined text-4xl">style</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">TCG</h2>
        </Link>
        <div className="hidden items-center gap-8 lg:flex">
          <Link
            href="/marketplace"
            className="hover:text-primary text-sm font-medium text-white transition-colors"
          >
            Marketplace
          </Link>
          <Link
            href="/gacha"
            className="hover:text-primary text-sm font-medium text-white transition-colors"
          >
            Gacha
          </Link>
          {session?.user && (
            <Link
              href="/collection"
              className="hover:text-primary text-sm font-medium text-white transition-colors"
            >
              Collection
            </Link>
          )}
          {(isAdmin || isStaff) && (
            <Link
              href="/admin"
              className="hover:text-primary text-sm font-medium text-white transition-colors"
            >
              Admin
            </Link>
          )}
        </div>
      </div>

      <div className="flex flex-1 items-center justify-end gap-6">
        <form
          onSubmit={handleSearch}
          className="hidden h-10 max-w-64 min-w-40 flex-col md:flex"
        >
          <div className="border-border-dark bg-surface-dark focus-within:border-primary flex h-full w-full flex-1 items-stretch rounded-xl border transition-colors">
            <div className="text-text-secondary flex items-center justify-center pl-3">
              <span className="material-symbols-outlined text-[20px]">
                search
              </span>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="placeholder:text-text-secondary flex h-full w-full min-w-0 flex-1 border-none bg-transparent px-3 text-sm text-white focus:outline-0"
              placeholder="Search cards..."
            />
          </div>
        </form>

        <div className="flex items-center gap-3">
          {session?.user ? (
            <>
              <div className="bg-surface-dark border-border-dark hidden items-center gap-2 rounded-xl border px-3 py-2 md:flex">
                <span className="material-symbols-outlined text-primary text-[18px]">
                  attach_money
                </span>
                <span className="text-sm font-bold text-white">
                  {formatUSD(wallet?.balance ?? 0)}
                </span>
              </div>

              <Link
                href="/notifications"
                className="bg-surface-dark border-border-dark hover:bg-surface-highlight flex size-10 items-center justify-center rounded-xl border text-white transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">
                  notifications
                </span>
              </Link>

              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="border-border-dark hover:border-primary aspect-square size-10 cursor-pointer rounded-full border-2 bg-cover bg-center bg-no-repeat transition-colors"
                  style={{
                    backgroundImage: session.user.image
                      ? `url("${session.user.image}")`
                      : 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCzqrhFCKeNPAi8dUE4GRWzTWL9AHdeEnWS4ck8zF4qGtffGiOU2kRnG5-BpYVBBWl0-ZytTso4E4ReUuGttUuqi6RSRfHBzeDfq6K7qcUH5vggncjWrw_SGq1yeZWgx3ezmXA2qRGZZwWkJqqDmewzIvlP6tF5YANkb_w-9Xv8P29d3hqaSa1DxAP61cv0ZI-eifehe9EfMRI34F4nLMXJS_Xd6B38k4PseMX6HKLSYalRhGMBGJQ5a_8lBhoMYW-cHFQsMCKdOn_B")',
                  }}
                />

                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowUserMenu(false)}
                    />

                    <div className="bg-surface-dark border-border-dark absolute top-full right-0 z-50 mt-2 w-64 overflow-hidden rounded-xl border shadow-2xl">
                      <div className="border-border-dark border-b p-4">
                        <p className="font-bold text-white">
                          {session.user.name || session.user.email}
                        </p>
                        <p className="text-text-secondary text-sm">
                          {session.user.email}
                        </p>
                        {isAdmin && (
                          <span className="bg-primary/20 text-primary mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-bold">
                            ADMIN
                          </span>
                        )}
                        {isStaff && (
                          <span className="mt-2 inline-block rounded-full bg-blue-500/20 px-2 py-0.5 text-xs font-bold text-blue-400">
                            STAFF
                          </span>
                        )}
                      </div>

                      <div className="py-2">
                        <Link
                          href="/profile"
                          onClick={() => setShowUserMenu(false)}
                          className="hover:bg-surface-highlight flex items-center gap-3 px-4 py-2 text-sm text-white transition-colors"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            person
                          </span>
                          Profile
                        </Link>
                        <Link
                          href="/collection"
                          onClick={() => setShowUserMenu(false)}
                          className="hover:bg-surface-highlight flex items-center gap-3 px-4 py-2 text-sm text-white transition-colors"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            inventory_2
                          </span>
                          My Collection
                        </Link>
                        <Link
                          href="/milestones"
                          onClick={() => setShowUserMenu(false)}
                          className="hover:bg-surface-highlight flex items-center gap-3 px-4 py-2 text-sm text-white transition-colors"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            emoji_events
                          </span>
                          Milestones
                        </Link>
                        {(isAdmin || isStaff) && (
                          <Link
                            href="/admin"
                            onClick={() => setShowUserMenu(false)}
                            className="hover:bg-surface-highlight flex items-center gap-3 px-4 py-2 text-sm text-white transition-colors"
                          >
                            <span className="material-symbols-outlined text-[20px]">
                              admin_panel_settings
                            </span>
                            Admin Dashboard
                          </Link>
                        )}
                      </div>

                      <div className="border-border-dark border-t p-2">
                        <button
                          onClick={handleSignOut}
                          className="hover:bg-surface-highlight flex w-full items-center gap-3 rounded-lg px-4 py-2 text-sm text-red-400 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            logout
                          </span>
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="bg-surface-dark border-border-dark hover:bg-surface-highlight rounded-lg border px-4 py-2 text-sm font-bold text-white transition-colors"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="bg-primary hover:bg-primary-hover rounded-lg px-4 py-2 text-sm font-bold text-white transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

interface DashboardHeaderProps {
  title: string
  breadcrumbs?: string[]
  actions?: React.ReactNode
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  breadcrumbs,
  actions,
}) => {
  return (
    <div className="border-border-dark bg-background-dark shrink-0 border-b px-6 py-6">
      {breadcrumbs && (
        <div className="mb-4 flex items-center gap-2 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              <span
                className={`font-medium ${index === breadcrumbs.length - 1 ? "text-primary" : "text-text-secondary cursor-pointer transition-colors hover:text-white"}`}
              >
                {crumb}
              </span>
              {index < breadcrumbs.length - 1 && (
                <span className="text-text-secondary">/</span>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl leading-tight font-bold tracking-tight text-white">
            {title}
          </h1>
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
    </div>
  )
}
