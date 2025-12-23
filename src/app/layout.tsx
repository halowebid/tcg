import type { Metadata } from "next"
import { Inter, Rajdhani } from "next/font/google"

import { CartSidebar } from "@/components/features/cart"
import { PublicHeader } from "@/components/Headers"
import { LayoutWrapper } from "@/components/Layouts"
import { Toaster } from "@/components/ui"
import { CartProvider } from "@/lib/context/CartContext"
import { TRPCReactProvider } from "@/lib/trpc/client"

import "./globals.css"

const rajdhani = Rajdhani({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-rajdhani",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "TCG",
  description: "Gacha-based trading card game platform",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${rajdhani.variable} ${inter.variable}`}>
      <body className="bg-background-dark flex min-h-screen flex-col text-white">
        <TRPCReactProvider>
          <CartProvider>
            <PublicHeader />
            <LayoutWrapper>
              <main className="custom-scrollbar flex-1 overflow-y-auto">
                {children}
              </main>
            </LayoutWrapper>
            <CartSidebar />
            <Toaster />
          </CartProvider>
        </TRPCReactProvider>
      </body>
    </html>
  )
}
