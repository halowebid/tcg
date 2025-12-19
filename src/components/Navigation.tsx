import Link from "next/link"

export function Navigation() {
  return (
    <nav className="bg-gray-800 text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold">
            CardGacha TCG
          </Link>
          <div className="flex gap-4">
            <Link href="/marketplace" className="hover:text-gray-300 transition-colors">
              Marketplace
            </Link>
            <Link href="/gacha" className="hover:text-gray-300 transition-colors">
              Gacha
            </Link>
            <Link href="/collection" className="hover:text-gray-300 transition-colors">
              Collection
            </Link>
            <Link href="/admin" className="hover:text-gray-300 transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
