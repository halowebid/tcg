import React from "react"
import Link from "next/link"

interface EmptyStateAction {
  label: string
  href: string
}

interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
  actions?: EmptyStateAction[]
  className?: string
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = "inventory_2",
  title,
  description,
  actions,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 text-center ${className}`}
    >
      <div className="bg-surface-dark border-border-dark rounded-xl border p-12">
        <span className="material-symbols-outlined text-text-secondary mb-4 text-6xl opacity-50">
          {icon}
        </span>
        <h2 className="mb-2 text-xl font-bold text-white">{title}</h2>
        {description && (
          <p className="text-text-secondary mb-6 max-w-md">{description}</p>
        )}
        {actions && actions.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3">
            {actions.map((action, index) => (
              <Link
                key={index}
                href={action.href}
                className="bg-primary hover:bg-primary-dark inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white transition-colors"
              >
                {action.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
