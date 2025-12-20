import Link from "next/link"

export function Navigation() {
  return (
    <nav className="bg-gray-800 text-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            CardGacha TCG
          </Link>
          <div className="flex gap-4">
            <Link
              href="/marketplace"
              className="transition-colors hover:text-gray-300"
            >
              Marketplace
            </Link>
            <Link
              href="/gacha"
              className="transition-colors hover:text-gray-300"
            >
              Gacha
            </Link>
            <Link
              href="/collection"
              className="transition-colors hover:text-gray-300"
            >
              Collection
            </Link>
            <Link
              href="/admin"
              className="transition-colors hover:text-gray-300"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
