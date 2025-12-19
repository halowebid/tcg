import { fetchRequestHandler } from "@trpc/server/adapters/fetch"
import { appRouter } from "@/lib/api/root"
import { createTRPCContext } from "@/lib/api/trpc"

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: async () =>
      createTRPCContext({
        headers: req.headers,
      }),
  })

export { handler as GET, handler as POST }
