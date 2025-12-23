"use client"

import { useState } from "react"
import { QueryClientProvider, type QueryClient } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { httpBatchLink, loggerLink } from "@trpc/client"
import { createTRPCReact } from "@trpc/react-query"
import SuperJSON from "superjson"

import type { AppRouter } from "@/lib/api/root"
import { createQueryClient } from "./query-client"

let clientQueryClientSingleton: QueryClient | undefined = undefined
const getQueryClient = () => {
  if (typeof window === "undefined") {
    return createQueryClient()
  } else {
    return (clientQueryClientSingleton ??= createQueryClient())
  }
}

export const trpc = createTRPCReact<AppRouter>()

export function TRPCReactProvider(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient()

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        loggerLink({
          enabled: (op) =>
            op.direction === "down" && op.result instanceof Error,
        }),
        httpBatchLink({
          transformer: SuperJSON,
          url: getBaseUrl() + "/api/trpc",
          headers() {
            return {
              "x-trpc-source": "nextjs-react",
            }
          },
        }),
      ],
    }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        {props.children}
      </trpc.Provider>
    </QueryClientProvider>
  )
}

const getBaseUrl = () => {
  if (typeof window !== "undefined") return window.location.origin
  /* eslint-disable-next-line no-restricted-properties */
  return `http://localhost:${process.env["PORT"] ?? 3000}`
}
