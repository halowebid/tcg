"use client"

/* eslint-disable @next/next/no-img-element */
import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  PencilIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
  UploadIcon,
} from "lucide-react"
import { toast } from "sonner"

import { ConfirmModal } from "@/components/ui"
import { trpc } from "@/lib/trpc/client"

export default function AdminInventoryPage() {
  const router = useRouter()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [rarityFilter, setRarityFilter] = useState<
    "common" | "rare" | "epic" | "legendary" | undefined
  >(undefined)
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean
    cardId: string | null
  }>({
    isOpen: false,
    cardId: null,
  })

  const { data, isLoading } = trpc.cards.list.useQuery({
    page,
    limit: 20,
    rarity: rarityFilter,
  })

  const deleteMutation = trpc.cards.delete.useMutation({
    onSuccess: () => {
      toast.success("Card deleted successfully!")
      setDeleteConfirm({ isOpen: false, cardId: null })
      window.location.reload()
    },
    onError: (error) => {
      toast.error(`Delete failed: ${error.message}`)
      setDeleteConfirm({ isOpen: false, cardId: null })
    },
  })

  const handleDelete = (id: string) => {
    setDeleteConfirm({ isOpen: true, cardId: id })
  }

  const confirmDelete = () => {
    if (deleteConfirm.cardId) {
      deleteMutation.mutate({ id: deleteConfirm.cardId })
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-text-secondary">Loading inventory...</div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="border-border-dark flex items-center justify-between border-b bg-[#2d241b] px-8 py-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Card Inventory</h1>
          <p className="text-text-secondary text-sm">
            Manage all cards in the system
          </p>
        </div>
        <div className="flex gap-2">
          <button className="bg-surface-dark border-border-dark hover:bg-surface-highlight flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-bold text-white">
            <UploadIcon className="size-4" /> Import
          </button>
          <button
            onClick={() => router.push("/admin/cards/create")}
            className="bg-primary text-background-dark hover:bg-primary-hover shadow-primary/20 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold shadow-lg"
          >
            <PlusIcon className="size-4" /> Create New
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden p-6">
        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-4">
          <div className="relative min-w-[200px] flex-1">
            <SearchIcon className="text-text-secondary absolute top-2.5 left-3 size-5" />
            <input
              className="bg-surface-dark border-border-dark focus:border-primary w-full rounded-xl border py-2.5 pr-4 pl-10 text-white outline-none"
              placeholder="Search by name, ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="bg-surface-dark border-border-dark focus:border-primary min-w-[140px] rounded-xl border px-4 py-2.5 text-white outline-none"
            value={rarityFilter ?? ""}
            onChange={(e) =>
              setRarityFilter(
                e.target.value
                  ? (e.target.value as "common" | "rare" | "epic" | "legendary")
                  : undefined,
              )
            }
          >
            <option value="">All Rarities</option>
            <option value="common">Common</option>
            <option value="rare">Rare</option>
            <option value="epic">Epic</option>
            <option value="legendary">Legendary</option>
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
              {data?.items
                .filter((card) =>
                  search
                    ? card.name.toLowerCase().includes(search.toLowerCase())
                    : true,
                )
                .map((card) => (
                  <tr
                    key={card.id}
                    className="border-border-dark group border-b transition-colors last:border-0 hover:bg-white/5"
                  >
                    <td className="p-4">
                      <div className="bg-background-dark border-border-dark size-12 overflow-hidden rounded-lg border">
                        <img
                          src={
                            card.imageUrl ?? "https://via.placeholder.com/48"
                          }
                          alt={card.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-white">{card.name}</div>
                      <div className="text-text-secondary text-xs">
                        ID: {card.id.slice(0, 8)}...
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`rounded border px-2 py-1 text-xs font-bold ${
                          card.rarity === "legendary"
                            ? "border-primary/30 bg-primary/40 text-primary"
                            : card.rarity === "epic"
                              ? "border-purple-500/30 bg-purple-900/40 text-purple-300"
                              : card.rarity === "rare"
                                ? "border-blue-500/30 bg-blue-900/40 text-blue-300"
                                : "border-gray-500/30 bg-gray-900/40 text-gray-300"
                        }`}
                      >
                        {card.rarity}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="text-text-secondary text-xs">
                        ATK:{" "}
                        <span className="text-white">
                          {card.attackPower ?? 0}
                        </span>
                      </div>
                      <div className="text-text-secondary text-xs">
                        DEF:{" "}
                        <span className="text-white">
                          {card.defensePower ?? 0}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-white">
                      {card.marketValue ?? "N/A"}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                          onClick={() => router.push(`/admin/cards/${card.id}`)}
                          className="rounded p-2 text-white hover:bg-white/10"
                        >
                          <PencilIcon className="size-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(card.id)}
                          disabled={deleteMutation.isPending}
                          className="rounded p-2 text-red-400 hover:bg-red-500/20 disabled:opacity-50"
                        >
                          <TrashIcon className="size-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-text-secondary text-sm">
            Showing {data?.items.length ?? 0} of {data?.total ?? 0} cards
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="bg-surface-dark border-border-dark rounded-lg border px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(page + 1)}
              disabled={!data || page * 20 >= data.total}
              className="bg-surface-dark border-border-dark rounded-lg border px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, cardId: null })}
        onConfirm={confirmDelete}
        title="Delete Card"
        message="Are you sure you want to delete this card? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  )
}
