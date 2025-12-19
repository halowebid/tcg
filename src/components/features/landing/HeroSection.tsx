import Link from "next/link"

export function HeroSection() {
  return (
    <div className="text-center mb-16">
      <h1 className="text-6xl font-bold mb-4">CardGacha TCG</h1>
      <p className="text-xl text-gray-300 mb-8">
        Collect, trade, and battle with unique trading cards
      </p>
      <div className="flex justify-center gap-4">
        <Link
          href="/gacha"
          className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-lg transition-colors"
        >
          Start Pulling Cards
        </Link>
        <Link
          href="/marketplace"
          className="px-8 py-4 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg font-semibold text-lg transition-colors"
        >
          Browse Marketplace
        </Link>
      </div>
    </div>
  )
}
