import { cache } from "react"
import { headers } from "next/headers"

import { appRouter } from "@/lib/api/root"
import { createTRPCContext } from "@/lib/api/trpc"

const createContext = cache(async () => {
  const heads = new Headers(await headers())
  heads.set("x-trpc-source", "rsc")

  return createTRPCContext({
    headers: heads,
  })
})

export const trpc = async () => {
  const ctx = await createContext()
  return appRouter.createCaller(ctx)
}
