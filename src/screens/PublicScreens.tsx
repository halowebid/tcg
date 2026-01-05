/* eslint-disable @next/next/no-img-element */
"use client"

import React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  CalendarOffIcon,
  CheckCheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CreditCardIcon,
  DicesIcon,
  DollarSignIcon,
  FlameIcon,
  MailIcon,
  MedalIcon,
  PackageIcon,
  PaletteIcon,
  PencilIcon,
  PercentIcon,
  SearchIcon,
  ShieldIcon,
  ShoppingCartIcon,
  SparklesIcon,
  SwordsIcon,
  TruckIcon,
  XIcon,
  ZapIcon,
} from "lucide-react"
import { toast } from "sonner"

import {
  CardGridSkeleton,
  CardSkeleton,
  EmptyState,
  ErrorDisplay,
  LoadingSpinner,
} from "@/components/ui"
import { useSession } from "@/lib/auth/client"
import { useCart } from "@/lib/hooks/useCart"
import { trpc } from "@/lib/trpc/client"
import { formatUSD } from "@/lib/utils/currency"

interface Card {
  id: string
  name: string
  description: string | null
  imageUrl: string
  rarity: "common" | "rare" | "epic" | "legendary"
  setId: string | null
  attackPower: number | null
  defensePower: number | null
  marketValue: string | null
  dropWeight: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

interface UserCard {
  id: string
  userId: string
  cardId: string
  level: number
  exp: number
  acquiredAt: Date
  acquiredVia: "gacha" | "purchase" | "reward"
  card: Card
}

// --- Screen 1: Landing (Dragon Banner) ---
export const LandingScreen: React.FC = () => {
  const { data: events, isLoading: eventsLoading } =
    trpc.gacha.getActiveEvents.useQuery()
  const { data: cardsData, isLoading: cardsLoading } = trpc.cards.list.useQuery(
    { page: 1, limit: 5 },
  )

  const firstEvent = events?.[0]

  return (
    <div className="flex w-full flex-col items-center pb-20">
      <section className="w-full max-w-[1400px] px-4 py-8 md:px-10">
        <div className="bg-surface-dark relative flex min-h-[480px] w-full flex-col justify-end overflow-hidden rounded-3xl p-6 shadow-2xl lg:p-12">
          <div
            className="absolute inset-0 h-full w-full bg-cover bg-center transition-transform duration-700 hover:scale-105"
            style={{
              backgroundImage: firstEvent?.bannerUrl
                ? `linear-gradient(180deg, rgba(24,20,17,0) 0%, rgba(24,20,17,0.8) 60%, rgba(24,20,17,1) 100%), url("${firstEvent.bannerUrl}")`
                : 'linear-gradient(180deg, rgba(24,20,17,0) 0%, rgba(24,20,17,0.8) 60%, rgba(24,20,17,1) 100%), url("https://images.pokemontcg.io/swsh35/logo.png")',
            }}
          ></div>
          <div className="relative z-10 flex max-w-2xl flex-col items-start gap-4">
            {firstEvent && (
              <>
                <div className="bg-primary/20 border-primary/30 flex items-center gap-2 rounded-full border px-3 py-1 backdrop-blur-sm">
                  <FlameIcon className="text-primary size-4" />
                  <span className="text-primary text-xs font-bold tracking-wider uppercase">
                    Limited Event
                  </span>
                </div>
                <h1 className="font-display text-4xl leading-tight font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                  {firstEvent.name}
                </h1>
                <p className="text-lg font-light text-gray-200 sm:text-xl">
                  {firstEvent.description}
                </p>
                <div className="mt-6 flex flex-wrap gap-4">
                  <Link
                    href={`/gacha/${firstEvent.id}`}
                    className="bg-primary text-background-dark hover:bg-primary-dark shadow-primary/20 flex h-14 items-center justify-center gap-2 rounded-xl px-8 text-lg font-bold shadow-lg transition-transform hover:scale-105"
                  >
                    <SparklesIcon className="size-6" />
                    Pull 10x • {formatUSD(parseFloat(firstEvent.tenPullPrice))}
                  </Link>
                  <Link
                    href={`/gacha/${firstEvent.id}`}
                    className="flex h-14 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/10 px-6 text-lg font-bold text-white backdrop-blur-md transition-colors hover:bg-white/20"
                  >
                    <SparklesIcon className="size-6" />
                    View Drop Rates
                  </Link>
                </div>
              </>
            )}
            {!firstEvent && !eventsLoading && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CalendarOffIcon className="text-text-secondary mb-4 size-16" />
                <h2 className="mb-2 text-2xl font-bold text-white">
                  No Active Events
                </h2>
                <p className="text-text-secondary mb-6 max-w-md">
                  There are currently no active gacha events. Check back later
                  for new packs!
                </p>
                <Link
                  href="/marketplace"
                  className="bg-primary text-background-dark hover:bg-primary-dark flex h-12 items-center justify-center gap-2 rounded-xl px-6 font-bold transition-transform hover:scale-105"
                >
                  Browse Marketplace
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Packs Grid */}
      <section className="w-full max-w-[1400px] px-4 pb-12 md:px-10">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-2xl font-bold text-white">
            Featured Packs
          </h2>
          <Link
            href="/gacha"
            className="text-primary text-sm font-bold transition-colors hover:text-white"
          >
            View All Packs
          </Link>
        </div>
        {eventsLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner message="Loading events..." />
          </div>
        ) : !events || events.length === 0 ? (
          <EmptyState
            icon={CalendarOffIcon}
            title="No active events"
            description="Check back soon for new gacha events!"
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.slice(0, 3).map((event, i) => (
              <Link
                key={event.id}
                href={`/gacha/${event.id}`}
                className="bg-surface-dark border-border-dark hover:border-primary/50 group relative h-64 cursor-pointer overflow-hidden rounded-2xl border transition-all"
              >
                <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-600 to-cyan-400 opacity-10 transition-opacity group-hover:opacity-20"></div>
                <div className="absolute -right-12 -bottom-12 z-0 h-48 w-48 rounded-full bg-gradient-to-br from-white/5 to-white/0 blur-2xl"></div>

                <div className="relative z-10 flex h-full items-center justify-between p-6">
                  <div className="flex h-full flex-col justify-center gap-4">
                    <div>
                      <span className="text-primary bg-primary/10 mb-2 inline-block rounded px-2 py-1 text-xs font-bold">
                        EVENT {i + 1}
                      </span>
                      <h3 className="max-w-[120px] text-2xl leading-tight font-bold text-white">
                        {event.name}
                      </h3>
                    </div>
                    <button className="flex w-fit items-center gap-2 rounded-lg border border-white/5 bg-white/10 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-white/20">
                      <DollarSignIcon className="text-primary size-4" />{" "}
                      {formatUSD(parseFloat(event.singlePullPrice))}
                    </button>
                  </div>
                  <div className="relative h-full w-1/2">
                    <img
                      src={
                        event.bannerUrl ||
                        "https://images.pokemontcg.io/swsh35/logo.png"
                      }
                      alt={event.name}
                      className="absolute top-1/2 left-1/2 h-[120%] -translate-x-1/2 -translate-y-1/2 object-contain drop-shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Trending Cards Section */}
      <section className="w-full max-w-[1400px] px-4 pb-12 md:px-10">
        <h2 className="mb-6 text-2xl font-bold text-white">Trending Now</h2>
        {cardsLoading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : !cardsData?.items || cardsData.items.length === 0 ? (
          <EmptyState
            icon={SparklesIcon}
            title="No cards available"
            description="Check back soon for new cards!"
          />
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
            {cardsData.items.map((card) => (
              <Link
                key={card.id}
                href={`/marketplace/${card.id}`}
                className="bg-surface-dark border-border-dark hover:border-primary/50 group cursor-pointer overflow-hidden rounded-xl border transition-all hover:-translate-y-1"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-[#2d241b]">
                  <div className="absolute top-2 left-2 z-10 rounded border border-white/10 bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white uppercase backdrop-blur-md">
                    {card.rarity}
                  </div>
                  <img
                    src={card.imageUrl}
                    alt={card.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-3">
                  <h4 className="truncate text-sm font-bold text-white">
                    {card.name}
                  </h4>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-text-secondary text-xs">Value</span>
                    <span className="text-primary text-sm font-bold">
                      ${card.marketValue ?? "2.50"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

// Helper function for rarity styles
const getRarityStyles = (rarity: string) => {
  const rarityMap: Record<string, string> = {
    legendary: "bg-orange-900/80 text-orange-200 border-orange-500/30",
    epic: "bg-yellow-600/80 text-yellow-100 border-yellow-400/30",
    rare: "bg-blue-900/80 text-blue-200 border-blue-500/30",
    common: "bg-gray-700/80 text-gray-200 border-gray-500/30",
  }
  return rarityMap[rarity] || rarityMap["common"]
}

// --- Screen 2: Marketplace Listing ---
export const MarketplaceScreen: React.FC = () => {
  const [page, setPage] = React.useState(1)
  const [selectedRarity, setSelectedRarity] = React.useState<
    "common" | "rare" | "epic" | "legendary" | undefined
  >()
  const [searchQuery, setSearchQuery] = React.useState("")
  const { addToCart } = useCart()

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      const search = params.get("search")
      if (search) {
        setSearchQuery(search)
      }
    }
  }, [])

  const {
    data: cards,
    isLoading,
    error,
    refetch,
  } = trpc.marketplace.list.useQuery({
    page,
    limit: 20,
    rarity: selectedRarity,
    search: searchQuery || undefined,
  })

  const { data: events, isLoading: eventsLoading } =
    trpc.gacha.getActiveEvents.useQuery()
  const featuredEvent = events?.[0]

  const handleAddToCart = async (cardId: string) => {
    await addToCart(cardId)
  }

  const purchaseMutation = trpc.marketplace.purchase.useMutation({
    onSuccess: () => {
      void refetch()
    },
    onError: (error) => {
      alert(error.message)
    },
  })

  const handlePurchase = (cardId: string) => {
    if (confirm("Are you sure you want to purchase this card?")) {
      purchaseMutation.mutate({ cardId })
    }
  }

  const filterButtons: {
    label: string
    value?: "common" | "rare" | "epic" | "legendary"
  }[] = [
    { label: "All Cards", value: undefined },
    { label: "Legendary", value: "legendary" },
    { label: "Epic", value: "epic" },
    { label: "Rare", value: "rare" },
    { label: "Common", value: "common" },
  ]

  return (
    <div className="flex w-full flex-col items-center px-4 py-8 lg:px-10">
      <div className="flex w-full max-w-[1400px] flex-col gap-8">
        {eventsLoading ? (
          <div className="bg-surface-dark relative mb-8 flex min-h-[300px] items-center justify-center overflow-hidden rounded-2xl">
            <LoadingSpinner message="Loading..." />
          </div>
        ) : featuredEvent ? (
          <div className="bg-surface-dark relative mb-8 flex min-h-[300px] items-center overflow-hidden rounded-2xl">
            <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/90 via-black/50 to-transparent"></div>
            <div
              className="absolute top-0 right-0 h-full w-3/4 bg-cover bg-center opacity-80"
              style={{
                backgroundImage: featuredEvent.bannerUrl
                  ? `url("${featuredEvent.bannerUrl}")`
                  : 'url("https://images.pokemontcg.io/swsh35/logo.png")',
              }}
            ></div>
            <div className="relative z-20 p-8 md:w-1/2 md:p-12">
              <span className="bg-primary/20 text-primary mb-2 inline-block rounded px-2 py-1 text-xs font-bold tracking-wider uppercase">
                Featured Event
              </span>
              <h1 className="mb-4 text-3xl leading-tight font-bold text-white drop-shadow-lg sm:text-4xl">
                {featuredEvent.name}
              </h1>
              <p className="text-text-secondary mb-4 text-sm">
                {featuredEvent.description}
              </p>
              <Link
                href="/gacha"
                className="bg-primary flex w-fit items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition-transform hover:scale-105"
              >
                <ZapIcon className="size-5" /> Pull Now -{" "}
                {formatUSD(parseFloat(featuredEvent.singlePullPrice))}
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-surface-dark relative mb-8 flex min-h-[300px] items-center overflow-hidden rounded-2xl">
            <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/90 via-black/50 to-transparent"></div>
            <div
              className="absolute top-0 right-0 h-full w-3/4 bg-cover bg-center opacity-80"
              style={{
                backgroundImage:
                  'url("https://images.pokemontcg.io/swsh35/logo.png")',
              }}
            ></div>
            <div className="relative z-20 p-8 md:w-1/2 md:p-12">
              <span className="bg-primary/20 text-primary mb-2 inline-block rounded px-2 py-1 text-xs font-bold tracking-wider uppercase">
                New Drop
              </span>
              <h1 className="mb-4 text-3xl leading-tight font-bold text-white drop-shadow-lg sm:text-4xl">
                Unlock the Future of Cards
              </h1>
              <Link
                href="/gacha"
                className="bg-primary flex w-fit items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition-transform hover:scale-105"
              >
                <ZapIcon className="size-5" /> Explore Gacha
              </Link>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="relative">
          <SearchIcon className="absolute top-1/2 left-3 size-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setPage(1) // Reset to page 1 when searching
            }}
            placeholder="Search cards by name..."
            className="bg-surface-dark border-border-dark focus:border-primary w-full rounded-xl border px-4 py-3 pl-10 text-white placeholder-gray-400 transition-colors outline-none"
          />
        </div>

        <div className="no-scrollbar mb-4 flex items-center gap-4 overflow-x-auto pb-2">
          {filterButtons.map((filter) => (
            <button
              key={filter.label}
              onClick={() => {
                setSelectedRarity(filter.value)
                setPage(1)
              }}
              className={`rounded-lg px-4 py-2 text-sm font-bold whitespace-nowrap transition-colors ${
                selectedRarity === filter.value
                  ? "bg-primary text-background-dark"
                  : "bg-surface-dark border-border-dark text-text-secondary border hover:text-white"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <CardGridSkeleton count={20} />
        ) : error ? (
          <ErrorDisplay
            title="Failed to load marketplace"
            message={error.message}
            onRetry={() => refetch()}
          />
        ) : !cards || cards.length === 0 ? (
          <EmptyState
            icon={ShoppingCartIcon}
            title="No cards available"
            description="Try changing the rarity filter or check back later!"
          />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {cards.map((card) => (
                <div
                  key={card.id}
                  className="bg-surface-dark border-border-dark hover:border-primary/50 group relative flex flex-col overflow-hidden rounded-2xl border transition-all hover:-translate-y-1"
                >
                  <Link
                    href={`/marketplace/${card.id}`}
                    className="relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden bg-[#2d241b] p-4"
                  >
                    <div
                      className={`absolute top-3 left-3 z-10 rounded-md border px-2 py-1 text-xs font-bold uppercase backdrop-blur-md ${getRarityStyles(card.rarity)}`}
                    >
                      {card.rarity}
                    </div>
                    <img
                      src={card.imageUrl}
                      alt={card.name}
                      className="h-full object-contain shadow-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-2"
                    />
                  </Link>
                  <div className="flex flex-col p-4">
                    <h3 className="group-hover:text-primary text-lg font-bold text-white transition-colors">
                      {card.name}
                    </h3>
                    <div className="border-border-dark mt-4 flex items-center justify-between border-t pt-4">
                      <div className="flex flex-col">
                        <span className="text-text-secondary text-xs">
                          Price
                        </span>
                        <div className="flex items-center gap-1">
                          <DollarSignIcon className="text-primary size-4" />
                          <span className="text-lg font-bold text-white">
                            {card.marketValue ?? "100"}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAddToCart(card.id)}
                          className="bg-surface-highlight border-border-dark flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-bold text-white transition-colors hover:bg-white hover:text-black"
                        >
                          <ShoppingCartIcon className="size-4" />
                        </button>
                        <button
                          onClick={() => handlePurchase(card.id)}
                          disabled={purchaseMutation.isPending}
                          className="bg-primary flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-bold text-white transition-colors hover:bg-orange-600 disabled:opacity-50"
                        >
                          {purchaseMutation.isPending ? "..." : "Buy"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-center gap-4 pt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="bg-surface-dark border-border-dark flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronLeftIcon className="size-4" />
                Previous
              </button>
              <span className="text-text-secondary text-sm">Page {page}</span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!cards || cards.length < 20}
                className="bg-surface-dark border-border-dark flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
                <ChevronRightIcon className="size-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// --- Screen 3: Detail Screen (Azure Dragon) ---
export const ProductDetailScreen: React.FC = () => {
  return (
    <div className="flex w-full flex-col items-center px-4 py-8 md:px-10">
      <div className="grid w-full max-w-[1200px] grid-cols-1 gap-12 lg:grid-cols-12">
        {/* Left: Image */}
        <div className="flex flex-col gap-6 lg:col-span-7">
          <div className="bg-surface-dark border-border-dark from-primary/10 relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-2xl border bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] to-transparent">
            <div className="bg-primary/20 absolute inset-0 opacity-20 blur-[100px]"></div>
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfnGf9Sc_OQOAi79UOhJsx8j1CzV_Zl2AvdZf8RBZNBVb9uX5gtdRP7Mn_ZK5QszE5_Z6Vd4D_LHFBM1gGV5wm7IZup6gpXo7W24qTk5liQlWQxpGKMzxHJHkKp8peLA76Vo2CvV_EIM6stQaf9DkNMuf5pahfv4fQprFcVpP6a_9NKkNQPJ10NdqpQxF7CPz_YIm8VTLOKYLaMdOggLoUn8R7DuRwy1Sq5gQYRMPQJSLP84tJGLXx7ThaqI8yaIm21WWn1W6_eW_X"
              className="z-10 h-[85%] object-contain shadow-2xl shadow-black/50"
            />
          </div>
        </div>
        {/* Right: Info */}
        <div className="flex flex-col lg:col-span-5">
          <div className="border-border-dark mb-6 border-b pb-6">
            <div className="mb-3 flex items-center gap-3">
              <span className="bg-primary/20 text-primary border-primary/20 rounded-full border px-3 py-1 text-xs font-bold tracking-wider uppercase">
                Legendary
              </span>
            </div>
            <h1 className="mb-2 text-4xl font-bold text-white">Azure Dragon</h1>
            <p className="text-text-secondary text-lg">
              Fantasy Set • 1st Edition • 2024
            </p>
          </div>
          <div className="mb-8 flex flex-col gap-4">
            <div className="border-primary/30 relative flex items-center justify-between overflow-hidden rounded-xl border bg-gradient-to-br from-[#3d2c1e] to-[#2a221b] p-5">
              <DicesIcon className="text-primary absolute top-[-20px] right-[-20px] size-36 rotate-12 opacity-10" />
              <div className="relative z-10">
                <p className="text-primary mb-1 text-sm font-bold uppercase">
                  Try your luck
                </p>
                <span className="text-3xl font-bold text-white">
                  $5.00{" "}
                  <span className="text-text-secondary text-sm font-normal">
                    / pull
                  </span>
                </span>
              </div>
              <button className="bg-primary hover:bg-primary-hover relative z-10 flex items-center gap-2 rounded-lg px-6 py-3 font-bold text-white shadow-lg">
                <ZapIcon className="size-6" /> Pull Now
              </button>
            </div>
            <div className="bg-surface-dark border-border-dark flex items-center justify-between rounded-xl border p-4">
              <div>
                <p className="text-text-secondary mb-1 text-xs font-bold uppercase">
                  Direct Purchase
                </p>
                <span className="text-xl font-bold text-white">$124.50</span>
              </div>
              <button className="border-border-dark rounded-lg border bg-transparent px-5 py-2 font-medium text-white hover:border-white">
                Add to Cart
              </button>
            </div>
          </div>
          {/* Stats Grid */}
          <div className="mb-8 grid grid-cols-2 gap-3">
            <div className="bg-surface-dark border-border-dark rounded-lg border p-3">
              <div className="text-text-secondary mb-1 flex items-center gap-1 text-xs font-bold uppercase">
                <SwordsIcon className="size-4" /> Attack
              </div>
              <div className="font-mono text-lg text-white">2,500</div>
            </div>
            <div className="bg-surface-dark border-border-dark rounded-lg border p-3">
              <div className="text-text-secondary mb-1 flex items-center gap-1 text-xs font-bold uppercase">
                <ShieldIcon className="size-4" /> Defense
              </div>
              <div className="font-mono text-lg text-white">1,850</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- Screen 4a: Gacha Listing (All Events as Cards) ---
export const GachaListingScreen: React.FC = () => {
  const router = useRouter()

  const {
    data: events,
    isLoading: eventsLoading,
    error: eventsError,
    refetch: refetchEvents,
  } = trpc.gacha.getActiveEvents.useQuery()

  if (eventsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner message="Loading gacha events..." />
      </div>
    )
  }

  if (eventsError) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <ErrorDisplay
          title="Failed to load events"
          message={eventsError.message}
          onRetry={() => refetchEvents()}
        />
      </div>
    )
  }

  if (!events || events.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <EmptyState
          icon={CalendarOffIcon}
          title="No active gacha events"
          description="There are currently no active gacha events. Check back later!"
          actions={[
            { label: "Browse Marketplace", href: "/marketplace" },
            { label: "View Collection", href: "/collection" },
          ]}
        />
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col items-center px-4 py-8 lg:px-10">
      <div className="flex w-full max-w-[1400px] flex-col gap-8">
        {/* Header */}
        <div className="border-border-dark flex flex-col items-end justify-between gap-4 border-b pb-6 md:flex-row">
          <div>
            <h1 className="mb-2 text-4xl font-black text-white">
              Gacha Events
            </h1>
            <p className="text-text-secondary">
              Try your luck and pull amazing cards from these limited-time
              events!
            </p>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div
              key={event.id}
              onClick={() => router.push(`/gacha/${event.id}`)}
              className="bg-surface-dark border-border-dark hover:border-primary/50 group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border transition-all hover:-translate-y-1 hover:shadow-2xl"
            >
              {/* Event Banner */}
              <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-[#3d2c1e] to-[#2a221b]">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <img
                  src={
                    event.bannerUrl ??
                    "https://images.pokemontcg.io/swsh35/logo.png"
                  }
                  alt={event.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-3 right-3 z-10">
                  <span className="bg-primary/90 text-background-dark rounded-full px-3 py-1 text-xs font-bold uppercase backdrop-blur-sm">
                    Active
                  </span>
                </div>
              </div>

              {/* Event Info */}
              <div className="flex flex-col p-6">
                <h3 className="group-hover:text-primary mb-2 text-xl font-bold text-white transition-colors">
                  {event.name}
                </h3>
                <p className="text-text-secondary mb-4 line-clamp-2 text-sm">
                  {event.description}
                </p>

                {/* Pricing */}
                <div className="border-border-dark mt-auto flex items-center justify-between border-t pt-4">
                  <div className="flex flex-col">
                    <span className="text-text-secondary text-xs">
                      Single Pull
                    </span>
                    <div className="flex items-center gap-1">
                      <DollarSignIcon className="text-primary size-4" />
                      <span className="text-lg font-bold text-white">
                        {parseFloat(event.singlePullPrice).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-text-secondary text-xs">
                      10x Pull
                    </span>
                    <div className="flex items-center gap-1">
                      <DollarSignIcon className="text-primary size-4" />
                      <span className="text-lg font-bold text-white">
                        {parseFloat(event.tenPullPrice).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Drop Rates Preview */}
                <div className="bg-surface-highlight mt-4 rounded-lg p-3">
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    <div>
                      <div className="font-bold text-orange-400">
                        {(parseFloat(event.legendaryRate) * 100).toFixed(1)}%
                      </div>
                      <div className="text-text-secondary">Legendary</div>
                    </div>
                    <div>
                      <div className="font-bold text-pink-400">
                        {(parseFloat(event.epicRate) * 100).toFixed(1)}%
                      </div>
                      <div className="text-text-secondary">Epic</div>
                    </div>
                    <div>
                      <div className="font-bold text-blue-400">
                        {(parseFloat(event.rareRate) * 100).toFixed(1)}%
                      </div>
                      <div className="text-text-secondary">Rare</div>
                    </div>
                    <div>
                      <div className="font-bold text-gray-400">
                        {(parseFloat(event.commonRate) * 100).toFixed(1)}%
                      </div>
                      <div className="text-text-secondary">Common</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// --- Screen 4b: Gacha Event Detail (Pull Screen) ---
export const GachaPullScreen: React.FC<{
  eventId: string
  triggerPull?: boolean
  pullType?: "single" | "ten" | null
}> = ({ eventId, triggerPull = false, pullType = null }) => {
  const router = useRouter()
  const [showResult, setShowResult] = React.useState(false)
  const [pulledCards, setPulledCards] = React.useState<Card[]>([])
  const [showDropRates, setShowDropRates] = React.useState(false)
  const { data: session } = useSession()
  const utils = trpc.useUtils()

  const {
    data: event,
    isLoading: eventLoading,
    error: eventError,
    refetch: refetchEvent,
  } = trpc.gacha.getEventById.useQuery({ id: eventId })

  const { data: dropRates } = trpc.gacha.getDropRates.useQuery(
    { eventId },
    { enabled: !!eventId },
  )

  const pullMutation = trpc.gacha.pull.useMutation({
    onSuccess: async (card) => {
      setPulledCards([card])
      setShowResult(true)
      await utils.users.getWallet.invalidate()
    },
    onError: (error) => {
      try {
        const errorData = JSON.parse(error.message)
        if (errorData.type === "INSUFFICIENT_BALANCE") {
          router.push(
            `/checkout?source=gacha&eventId=${errorData.eventId}&amount=${errorData.cost}&pulls=1&error=${encodeURIComponent("Insufficient balance for gacha pull")}`,
          )
          return
        }
      } catch {
        // Failed to parse error, continue to show generic error
      }
      toast.error(error.message)
    },
  })

  const pullTenMutation = trpc.gacha.pullTen.useMutation({
    onSuccess: async (cards) => {
      setPulledCards(cards)
      setShowResult(true)
      await utils.users.getWallet.invalidate()
    },
    onError: (error) => {
      try {
        const errorData = JSON.parse(error.message)
        if (errorData.type === "INSUFFICIENT_BALANCE") {
          router.push(
            `/checkout?source=gacha&eventId=${errorData.eventId}&amount=${errorData.cost}&pulls=10&error=${encodeURIComponent("Insufficient balance for gacha pull")}`,
          )
          return
        }
      } catch {
        // Failed to parse error, continue to show generic error
      }
      toast.error(error.message)
    },
  })

  const handleSinglePull = (eventId: string) => {
    if (!session?.user) {
      toast.error("Please login to pull gacha")
      router.push(`/login?redirect=/gacha/${eventId}`)
      return
    }
    pullMutation.mutate({ eventId })
  }

  const handleTenPull = (eventId: string) => {
    if (!session?.user) {
      toast.error("Please login to pull gacha")
      router.push(`/login?redirect=/gacha/${eventId}`)
      return
    }
    pullTenMutation.mutate({ eventId })
  }

  const closeResultModal = () => {
    setShowResult(false)
    setPulledCards([])
  }

  const toggleDropRates = () => {
    setShowDropRates((prev) => !prev)
  }

  React.useEffect(() => {
    if (
      triggerPull &&
      event &&
      !pullMutation.isPending &&
      !pullTenMutation.isPending
    ) {
      if (pullType === "ten") {
        pullTenMutation.mutate({ eventId: event.id })
      } else if (pullType === "single") {
        pullMutation.mutate({ eventId: event.id })
      }
      router.replace(`/gacha/${eventId}`)
    }
  }, [
    triggerPull,
    event,
    pullType,
    pullMutation,
    pullTenMutation,
    router,
    eventId,
  ])

  if (eventLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner message="Loading gacha event..." />
      </div>
    )
  }

  if (eventError) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <ErrorDisplay
          title="Failed to load event"
          message={eventError.message}
          onRetry={() => refetchEvent()}
        />
      </div>
    )
  }

  if (!event) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <EmptyState
          icon={CalendarOffIcon}
          title="Event not found"
          description="This gacha event does not exist or is no longer active."
          actions={[
            { label: "View All Events", href: "/gacha" },
            { label: "Browse Marketplace", href: "/marketplace" },
          ]}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-1 justify-center px-4 py-8 sm:px-10">
      <div className="flex max-w-[1024px] flex-1 flex-col gap-12">
        {/* Single event display */}
        <section className="bg-surface-dark border-border-dark relative flex min-h-[600px] items-center justify-center overflow-hidden rounded-3xl border shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-b from-[#2a221b] to-[#181411]"></div>
          <div className="bg-primary/5 pointer-events-none absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px]"></div>

          <div className="relative z-10 flex w-full flex-col items-center gap-12 p-8 md:flex-row">
            <div className="flex flex-1 justify-center">
              <div className="perspective-1000 group relative aspect-[4/5] w-full max-w-[320px] cursor-pointer">
                <div className="bg-primary/20 absolute inset-0 rounded-full blur-[50px]"></div>
                <img
                  src={
                    event.bannerUrl ??
                    "https://images.pokemontcg.io/swsh35/logo.png"
                  }
                  alt={event.name}
                  className="relative z-10 h-full w-full transform object-contain drop-shadow-2xl transition-transform duration-500 hover:scale-105"
                />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="mb-4 flex items-center justify-center gap-2 md:justify-start">
                <span className="bg-primary/10 text-primary border-primary/20 rounded-full border px-3 py-1 text-xs font-bold tracking-wider uppercase">
                  Active Event
                </span>
              </div>
              <h1 className="mb-4 text-5xl leading-none font-black text-white md:text-6xl">
                {event.name}
              </h1>
              <p className="text-text-secondary mx-auto mb-4 max-w-md text-lg md:mx-0">
                {event.description}
              </p>

              {/* Drop Rates Button */}
              <button
                onClick={() => toggleDropRates()}
                className="text-primary hover:text-primary-hover mb-6 text-sm underline"
              >
                {showDropRates ? "Hide" : "Show"} Drop Rates
              </button>

              {/* Drop Rates Display */}
              {showDropRates && dropRates && (
                <div className="bg-surface-highlight border-border-dark mb-6 rounded-lg border p-4">
                  <h3 className="mb-3 text-sm font-bold text-white">
                    Drop Rates
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-orange-400">Legendary:</span>
                      <span className="text-text-secondary">
                        {(parseFloat(event.legendaryRate) * 100).toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-pink-400">Epic:</span>
                      <span className="text-text-secondary">
                        {(parseFloat(event.epicRate) * 100).toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-400">Rare:</span>
                      <span className="text-text-secondary">
                        {(parseFloat(event.rareRate) * 100).toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Common:</span>
                      <span className="text-text-secondary">
                        {(parseFloat(event.commonRate) * 100).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col justify-center gap-4 sm:flex-row md:justify-start">
                <button
                  onClick={() => handleSinglePull(event.id)}
                  disabled={pullMutation.isPending}
                  className="bg-primary hover:bg-primary-hover text-background-dark shadow-primary/20 flex min-w-[160px] flex-col items-center rounded-xl px-8 py-4 text-lg font-bold shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span>
                    {pullMutation.isPending ? "PULLING..." : "PULL 1X"}
                  </span>
                  <span className="mt-1 flex items-center gap-1 text-xs font-normal opacity-80">
                    <DollarSignIcon className="size-3" />{" "}
                    {formatUSD(parseFloat(event.singlePullPrice))}
                  </span>
                </button>
                <button
                  onClick={() => handleTenPull(event.id)}
                  disabled={pullTenMutation.isPending}
                  className="bg-surface-highlight border-primary/50 text-primary hover:bg-primary/10 flex min-w-[160px] flex-col items-center rounded-xl border-2 px-8 py-4 text-lg font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span>
                    {pullTenMutation.isPending ? "PULLING..." : "PULL 10X"}
                  </span>
                  <span className="mt-1 flex items-center gap-1 text-xs font-normal opacity-80">
                    <DollarSignIcon className="size-3" />{" "}
                    {formatUSD(parseFloat(event.tenPullPrice))}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Result Modal */}
        {showResult && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={closeResultModal}
          >
            <div
              className="bg-surface-dark border-border-dark max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">
                  {pulledCards.length === 1
                    ? "Card Pulled!"
                    : `${pulledCards.length} Cards Pulled!`}
                </h2>
                <button
                  onClick={closeResultModal}
                  className="text-text-secondary hover:text-white"
                >
                  <XIcon className="size-6" />
                </button>
              </div>

              <div
                className={`grid gap-6 ${pulledCards.length === 1 ? "grid-cols-1 place-items-center" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"}`}
              >
                {pulledCards.map((card, index: number) => (
                  <div
                    key={index}
                    className="bg-surface-highlight border-border-dark group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden bg-gray-800">
                      <div className="absolute top-2 left-2 z-10">
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-bold text-white uppercase ${getRarityStyles(card.rarity)}`}
                        >
                          {card.rarity}
                        </span>
                      </div>
                      <img
                        src={card.imageUrl}
                        alt={card.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <p className="truncate text-sm font-bold text-white">
                        {card.name}
                      </p>
                      <p className="text-text-secondary truncate text-xs">
                        {card.rarity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-center gap-4">
                <button
                  onClick={closeResultModal}
                  className="bg-primary hover:bg-primary-hover rounded-lg px-6 py-2 font-bold text-white"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// --- Screen 5: My Collection ---
export const CollectionScreen: React.FC = () => {
  const {
    data: userCards,
    isLoading: cardsLoading,
    error: cardsError,
    refetch: refetchCards,
  } = trpc.collection.getUserCards.useQuery()
  const { data: stats, isLoading: statsLoading } =
    trpc.collection.getStats.useQuery()

  const isLoading = cardsLoading || statsLoading

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner message="Loading your collection..." />
      </div>
    )
  }

  if (cardsError) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <ErrorDisplay
          title="Failed to load collection"
          message={cardsError.message}
          onRetry={() => refetchCards()}
        />
      </div>
    )
  }

  const totalCards = stats?.totalCards ?? 0
  const uniqueCards = stats?.uniqueCards ?? 0

  return (
    <div className="flex w-full flex-col items-center px-4 py-8 lg:px-20">
      <div className="flex w-full max-w-[1400px] flex-col gap-8">
        <div className="border-border-dark flex flex-col items-end justify-between gap-4 border-b pb-6 md:flex-row">
          <div>
            <h1 className="mb-2 text-4xl font-black text-white">
              My Collection
            </h1>
            <p className="text-text-secondary">
              Manage your trading card empire.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="bg-surface-dark border-border-dark min-w-[160px] rounded-xl border p-4">
              <p className="text-text-secondary text-xs font-bold uppercase">
                Total Cards
              </p>
              <p className="text-2xl font-bold text-white">{totalCards}</p>
            </div>
            <div className="bg-surface-dark border-border-dark min-w-[160px] rounded-xl border p-4">
              <p className="text-text-secondary text-xs font-bold uppercase">
                Unique Cards
              </p>
              <p className="text-primary text-2xl font-bold">{uniqueCards}</p>
            </div>
          </div>
        </div>

        {/* Grid */}
        {!userCards || userCards.length === 0 ? (
          <EmptyState
            icon={PackageIcon}
            title="Your collection is empty"
            description="Visit the marketplace or try a gacha pull to start collecting!"
            actions={[
              { label: "Browse Marketplace", href: "/marketplace" },
              { label: "Try Gacha", href: "/gacha" },
            ]}
          />
        ) : (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
            {userCards.map((userCard: UserCard) => (
              <div
                key={userCard.id}
                className="bg-surface-dark border-border-dark hover:border-primary group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border transition-all duration-300 hover:shadow-lg"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-800">
                  <div className="absolute top-2 left-2 z-10 flex gap-1">
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold text-white uppercase ${getRarityStyles(userCard.card.rarity)}`}
                    >
                      {userCard.card.rarity}
                    </span>
                  </div>
                  <img
                    src={userCard.card.imageUrl}
                    alt={userCard.card.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-3">
                  <h3 className="truncate text-sm font-bold text-white">
                    {userCard.card.name}
                  </h3>
                  <p className="text-text-secondary mt-1 text-xs">
                    Acquired:{" "}
                    {new Date(userCard.acquiredAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// --- Screen 6: Checkout ---
export const CheckoutScreen: React.FC = () => {
  return (
    <div className="flex justify-center px-4 py-8">
      <div className="flex w-full max-w-[1200px] flex-col gap-12 lg:flex-row">
        <div className="flex-1">
          <h1 className="mb-8 text-3xl font-bold text-white">Checkout</h1>
          <div className="flex flex-col gap-6">
            <div className="bg-surface-dark border-border-dark rounded-xl border p-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
                <MailIcon className="text-primary size-6" /> Contact Info
              </h3>
              <input
                className="bg-background-dark border-border-dark focus:border-primary focus:ring-primary w-full rounded-xl border px-4 py-3 text-white outline-none focus:ring-1"
                placeholder="Email Address"
                value="kai.takahashi@example.com"
              />
            </div>
            <div className="bg-surface-dark border-border-dark rounded-xl border p-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
                <CreditCardIcon className="text-primary size-6" /> Payment
              </h3>
              <div className="mb-4 flex gap-2">
                <button className="bg-primary text-background-dark flex-1 rounded-lg py-2 font-bold">
                  Card
                </button>
                <button className="bg-background-dark text-text-secondary border-border-dark flex-1 rounded-lg border py-2">
                  PayPal
                </button>
              </div>
              <div className="space-y-4">
                <input
                  className="bg-background-dark border-border-dark focus:border-primary focus:ring-primary w-full rounded-xl border px-4 py-3 text-white outline-none focus:ring-1"
                  placeholder="Card Number"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    className="bg-background-dark border-border-dark focus:border-primary focus:ring-primary w-full rounded-xl border px-4 py-3 text-white outline-none focus:ring-1"
                    placeholder="MM/YY"
                  />
                  <input
                    className="bg-background-dark border-border-dark focus:border-primary focus:ring-primary w-full rounded-xl border px-4 py-3 text-white outline-none focus:ring-1"
                    placeholder="CVC"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-[400px]">
          <div className="bg-surface-dark border-border-dark sticky top-24 rounded-xl border p-6">
            <h3 className="mb-4 text-lg font-bold text-white">Your Cart</h3>
            <div className="mb-6 flex flex-col gap-4">
              <div className="flex gap-3">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfnRI62BxSLxnz5OJVem-u6k0nOGi_v0gqs4l00uy0vJbzVhveztYrcCdtosK6FkLavX5NMXqz3uZzxHRrFzf5TElDRo7ZDn4rHufJvDHD3c798ZBa9nLfQp_GwiTSgRXlBHvbs3sAfowWc9BqtFUflVdpup_ajoDlxAgK-bO72NJtyXm-VjjMx7uMtiLpjJ7OC_zQOH01P9E22Cu-qYkI4tdxuVpK2x0yPU556w77mEX_KvCM-r8A8IgCfXyE9JpXn1MSCHbLqH4T"
                  className="border-border-dark h-20 w-16 rounded-lg border object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm font-bold text-white">
                    Legendary Dragon Pack
                  </p>
                  <p className="text-primary mt-1 font-bold">$14.99</p>
                </div>
              </div>
            </div>
            <div className="border-border-dark flex flex-col gap-2 border-t pt-4">
              <div className="text-text-secondary flex justify-between text-sm">
                <span>Subtotal</span>
                <span>$39.94</span>
              </div>
              <div className="mt-2 flex justify-between text-lg font-bold text-white">
                <span>Total</span>
                <span>$48.14</span>
              </div>
            </div>
            <button className="bg-primary hover:bg-primary-hover text-background-dark mt-6 w-full rounded-xl py-3 font-bold">
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- Screen 7: User Profile ---
export const UserProfileScreen: React.FC = () => {
  return (
    <div className="flex-1 p-8">
      {/* Reusing the layout from sidebar but expanded */}
      <div className="mx-auto max-w-4xl">
        <div className="bg-surface-dark border-border-dark mb-8 flex flex-col items-center gap-8 rounded-2xl border p-8 md:flex-row">
          <div className="relative">
            <div
              className="border-primary h-32 w-32 rounded-full border-4 bg-cover bg-center"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB9JRJLfT8oZa5JAJj2RtM6Xr6jeQgV7RVPodUQoE0qN8VYw2oOPpSWbjOBPi2qsZLdsFWUiL4P0dlX9ofljHmTtsvyaQRvK0hETMomBNzmgjayb_5d81Md9HNR9Z411FaiJOhT5HGw3C_kcIdiMbn4HMvQyFPZw0h7_E8GzQAIjupV8fR1pxSeGMEBltqDTVLLtn3-BjSRPBQ2YvxFnEzYUnh-Hua9vZK_PhtZksTdlpsnVdlQ-j-OW8AJlOef4t8_EEc-gU9fR3uz")',
              }}
            ></div>
            <button className="bg-primary absolute right-0 bottom-0 rounded-full p-2 text-white">
              <PencilIcon className="size-4" />
            </button>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-white">DuelistKai</h1>
            <p className="text-text-secondary mt-1">
              Level 42 Collector • Joined 2023
            </p>
            <div className="mt-4 flex justify-center gap-4 md:justify-start">
              <div className="bg-background-dark text-text-secondary border-border-dark rounded-lg border px-4 py-2 text-sm">
                Verified
              </div>
              <div className="bg-background-dark text-text-secondary border-border-dark rounded-lg border px-4 py-2 text-sm">
                VIP Member
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="bg-surface-dark border-border-dark rounded-2xl border p-6">
            <h3 className="mb-4 font-bold text-white">Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="text-text-secondary text-sm">
                  Display Name
                </label>
                <input
                  className="bg-background-dark border-border-dark mt-1 w-full rounded-lg border px-3 py-2 text-white"
                  value="DuelistKai"
                />
              </div>
              <div>
                <label className="text-text-secondary text-sm">Email</label>
                <input
                  className="bg-background-dark border-border-dark mt-1 w-full rounded-lg border px-3 py-2 text-white"
                  value="kai.duelist@example.com"
                />
              </div>
            </div>
          </div>
          <div className="bg-surface-dark border-border-dark rounded-2xl border p-6">
            <h3 className="mb-4 font-bold text-white">Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Total Value</span>
                <span className="font-bold text-white">$12,450</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Rare Cards</span>
                <span className="font-bold text-white">142</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Trades Completed</span>
                <span className="font-bold text-white">58</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- Screen 8: User Milestones ---
export const UserMilestonesScreen: React.FC = () => {
  return (
    <div className="flex flex-1 flex-col items-center px-4 py-8">
      <div className="w-full max-w-[1024px]">
        <h1 className="mb-2 text-3xl font-black text-white">
          Collector Status
        </h1>
        <div className="bg-surface-dark border-border-dark relative mb-8 flex flex-col items-center gap-8 overflow-hidden rounded-xl border p-8 md:flex-row">
          <div className="bg-primary pointer-events-none absolute top-0 right-0 h-full w-1/2 rounded-l-full opacity-10"></div>
          <div className="border-primary/20 bg-background-dark relative z-10 flex h-32 w-32 items-center justify-center rounded-full border-4">
            <MedalIcon className="text-primary size-24" />
          </div>
          <div className="z-10 flex-1">
            <h2 className="text-2xl font-bold text-white">Expert Collector</h2>
            <p className="text-text-secondary mb-4">
              Top 5% of collectors this season.
            </p>
            <div className="bg-background-dark h-3 w-full overflow-hidden rounded-full">
              <div className="bg-primary h-full w-[77%]"></div>
            </div>
            <div className="text-text-secondary mt-1 flex justify-between text-xs">
              <span>Level 12</span>
              <span>1,550 / 2,000 XP</span>
            </div>
          </div>
        </div>
        <h2 className="mb-4 text-xl font-bold text-white">Rewards Ready</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="dark:bg-surface-dark border-border-dark flex flex-col gap-4 rounded-xl border bg-white p-4">
            <div className="bg-background-dark relative flex h-32 items-center justify-center overflow-hidden rounded-lg">
              <PercentIcon className="z-10 size-10 text-white" />
              <div className="bg-primary/20 absolute inset-0"></div>
            </div>
            <div>
              <span className="text-primary bg-primary/20 rounded px-2 py-0.5 text-xs font-bold">
                LEVEL 12
              </span>
              <h3 className="mt-1 text-lg font-bold text-white">
                10% Off Next Pack
              </h3>
            </div>
            <button className="bg-primary text-background-dark mt-auto w-full rounded-lg py-2 font-bold">
              Claim Reward
            </button>
          </div>

          <div className="dark:bg-surface-dark border-border-dark flex flex-col gap-4 rounded-xl border bg-white p-4">
            <div className="bg-background-dark relative flex h-32 items-center justify-center overflow-hidden rounded-lg">
              <DollarSignIcon className="z-10 size-10 text-white" />
              <div className="absolute inset-0 bg-blue-500/20"></div>
            </div>
            <div>
              <span className="rounded bg-blue-500/20 px-2 py-0.5 text-xs font-bold text-blue-400">
                LEVEL 10
              </span>
              <h3 className="mt-1 text-lg font-bold text-white">
                $5.00 Bonus Currency
              </h3>
            </div>
            <button className="bg-surface-highlight border-border-dark mt-auto w-full rounded-lg border py-2 font-bold text-white hover:bg-white/10">
              Claimed
            </button>
          </div>

          <div className="dark:bg-surface-dark border-border-dark flex flex-col gap-4 rounded-xl border bg-white p-4">
            <div className="bg-background-dark relative flex h-32 items-center justify-center overflow-hidden rounded-lg">
              <PaletteIcon className="z-10 size-10 text-white" />
              <div className="absolute inset-0 bg-orange-500/20"></div>
            </div>
            <div>
              <span className="rounded bg-orange-500/20 px-2 py-0.5 text-xs font-bold text-orange-400">
                LEVEL 5
              </span>
              <h3 className="mt-1 text-lg font-bold text-white">
                Exclusive Profile Frame
              </h3>
            </div>
            <button className="bg-surface-highlight border-border-dark mt-auto w-full rounded-lg border py-2 font-bold text-white hover:bg-white/10">
              Claimed
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- Screen 9: Notifications ---
export const NotificationsScreen: React.FC = () => {
  return (
    <div className="flex justify-center px-4 py-8">
      <div className="w-full max-w-[960px]">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-black text-white">Notifications</h1>
            <p className="text-text-secondary">
              Stay updated with your latest pulls.
            </p>
          </div>
          <button className="bg-surface-dark border-border-dark flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-bold text-white">
            <CheckCheckIcon className="size-4" /> Mark all read
          </button>
        </div>
        <div className="mb-4 flex gap-2">
          <button className="bg-primary rounded-lg px-4 py-1.5 text-sm font-bold text-white">
            All
          </button>
          <button className="bg-surface-dark text-text-secondary rounded-lg px-4 py-1.5 text-sm">
            Gacha
          </button>
          <button className="bg-surface-dark text-text-secondary rounded-lg px-4 py-1.5 text-sm">
            Orders
          </button>
        </div>
        <div className="flex flex-col gap-3">
          <div className="bg-surface-dark border-primary flex items-start gap-4 rounded-r-xl border-l-4 p-4">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuADBUoN1brN6-kDDfuZt_FZhIRjGcc023An98v4U6Lh8-8M9HiVFLRa7dz0DEPKrTiZYWQsFDK5d1n47eBUy78sNxge0M3aaKPI0IJl48TRFYbP4g2QQxfS7yj7x30WxP0GgwBuCAmKBHfrGke7W_jGnG4LgZE5dv40z7YxthggrkmSJfKGtBhrgYXUJ-Nq7jZekAsnodGhLP5So4-L0I2eDH-D_5-rZDEDAmnrvcfiUQ1p-9xUQWM4TkJ_638mUqnB7Fwr5p7W3S3y"
              className="size-16 rounded-lg object-cover"
            />
            <div>
              <div className="mb-1 flex items-center gap-2">
                <span className="bg-primary/20 text-primary rounded px-2 py-0.5 text-[10px] font-bold">
                  GACHA
                </span>
                <span className="bg-primary size-2 rounded-full"></span>
              </div>
              <p className="font-bold text-white">
                Legendary Pull: Azure Sky Dragon
              </p>
              <p className="text-text-secondary text-sm">
                Incredible luck! You just pulled a 5-star Legendary card.
              </p>
              <p className="text-text-secondary mt-2 text-xs">2 mins ago</p>
            </div>
          </div>
          <div className="bg-surface-dark flex items-start gap-4 rounded-r-xl border-l-4 border-blue-500 p-4">
            <div className="flex size-16 items-center justify-center rounded-lg bg-blue-900/20 text-blue-500">
              <TruckIcon className="size-8" />
            </div>
            <div>
              <div className="mb-1 flex items-center gap-2">
                <span className="rounded bg-blue-900/30 px-2 py-0.5 text-[10px] font-bold text-blue-400">
                  ORDER
                </span>
              </div>
              <p className="font-bold text-white">Order #8821 Shipped</p>
              <p className="text-text-secondary text-sm">
                Your order containing "Starter Deck: Fire" is on its way.
              </p>
              <p className="text-text-secondary mt-2 text-xs">4 hours ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
