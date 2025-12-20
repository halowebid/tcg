import type { Metadata } from "next"

import { PublicHeader } from "@/components/Headers"
import { Toaster } from "@/components/ui"
import { TRPCReactProvider } from "@/lib/trpc/client"

import "./globals.css"

export const metadata: Metadata = {
  title: "CardGacha TCG",
  description: "Gacha-based trading card game platform",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Spline+Sans:wght@300;400;500;600;700&family=Noto+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
          rel="stylesheet"
        />
      </head>
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
