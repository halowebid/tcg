import Link from "next/link"

export function HeroSection() {
  return (
    <div className="mb-16 text-center">
      <h1 className="mb-4 text-6xl font-bold">CardGacha TCG</h1>
      <p className="mb-8 text-xl text-gray-300">
        Collect, trade, and battle with unique trading cards
      </p>
      <div className="flex justify-center gap-4">
        <Link
          href="/gacha"
          className="rounded-lg bg-blue-600 px-8 py-4 text-lg font-semibold transition-colors hover:bg-blue-700"
        >
          Start Pulling Cards
        </Link>
        <Link
          href="/marketplace"
          className="rounded-lg border border-gray-600 bg-gray-700 px-8 py-4 text-lg font-semibold transition-colors hover:bg-gray-600"
        >
          Browse Marketplace
        </Link>
      </div>
    </div>
  )
}
