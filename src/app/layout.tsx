import type { Metadata } from "next"
import { Inter, Rajdhani } from "next/font/google"

import { PublicHeader } from "@/components/Headers"
import { Toaster } from "@/components/ui"
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
      <body className="bg-background-dark text-white">
        <TRPCReactProvider>
          <PublicHeader />
          <main className="custom-scrollbar overflow-y-auto">{children}</main>
          <Toaster />
        </TRPCReactProvider>
      </body>
    </html>
  )
}
