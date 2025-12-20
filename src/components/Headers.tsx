import React from "react"
import Link from "next/link"

// --- Type 1: Public Header ---
export const PublicHeader: React.FC = () => {
  return (
    <header className="border-border-dark bg-background-dark/95 sticky top-0 z-50 flex items-center justify-between border-b px-6 py-3 whitespace-nowrap backdrop-blur-md lg:px-10">
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-4 text-white">
          <div className="text-primary size-8">
            <span className="material-symbols-outlined text-4xl">style</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            CardGacha
          </h2>
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
          <Link
            href="/collection"
            className="hover:text-primary text-sm font-medium text-white transition-colors"
          >
            Collection
          </Link>
          <Link
            href="/admin"
            className="hover:text-primary text-sm font-medium text-white transition-colors"
          >
            Admin
          </Link>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-end gap-6">
        <label className="hidden h-10 max-w-64 min-w-40 flex-col md:flex">
          <div className="border-border-dark bg-surface-dark focus-within:border-primary flex h-full w-full flex-1 items-stretch rounded-xl border transition-colors">
            <div className="text-text-secondary flex items-center justify-center pl-3">
              <span className="material-symbols-outlined text-[20px]">
                search
              </span>
            </div>
            <input
              className="placeholder:text-text-secondary flex h-full w-full min-w-0 flex-1 border-none bg-transparent px-3 text-sm text-white focus:outline-0"
              placeholder="Search cards..."
            />
          </div>
        </label>

        <div className="flex items-center gap-3">
          <button className="bg-surface-dark border-border-dark hover:bg-surface-highlight relative flex size-10 items-center justify-center rounded-xl border text-white transition-colors">
            <span className="material-symbols-outlined text-[20px]">
              shopping_cart
            </span>
            <span className="bg-primary absolute top-2 right-2 size-2 rounded-full"></span>
          </button>
          <button className="bg-surface-dark border-border-dark hover:bg-surface-highlight flex size-10 items-center justify-center rounded-xl border text-white transition-colors">
            <span className="material-symbols-outlined text-[20px]">
              notifications
            </span>
          </button>
          <div
            className="border-border-dark aspect-square size-10 cursor-pointer rounded-full border-2 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCzqrhFCKeNPAi8dUE4GRWzTWL9AHdeEnWS4ck8zF4qGtffGiOU2kRnG5-BpYVBBWl0-ZytTso4E4ReUuGttUuqi6RSRfHBzeDfq6K7qcUH5vggncjWrw_SGq1yeZWgx3ezmXA2qRGZZwWkJqqDmewzIvlP6tF5YANkb_w-9Xv8P29d3hqaSa1DxAP61cv0ZI-eifehe9EfMRI34F4nLMXJS_Xd6B38k4PseMX6HKLSYalRhGMBGJQ5a_8lBhoMYW-cHFQsMCKdOn_B")',
            }}
          ></div>
        </div>
      </div>
    </header>
  )
}

// --- Type 2: Dashboard Header (Admin / Contextual) ---
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
