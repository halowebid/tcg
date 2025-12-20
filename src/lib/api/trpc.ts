import { initTRPC, TRPCError } from "@trpc/server"
import superjson from "superjson"

import { getSession, requireAdmin } from "@/lib/auth/session"
import { db } from "@/lib/db"

export async function createTRPCContext(opts: { headers: Headers }) {
  const session = await getSession()

  return {
    db,
    session,
    headers: opts.headers,
  }
}

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
})

export const router = t.router
export const publicProcedure = t.procedure

export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({ code: "UNAUTHORIZED" })
  }

  return next({
    ctx: {
      ...ctx,
      session: ctx.session,
    },
  })
})

export const adminProcedure = t.procedure.use(async ({ ctx, next }) => {
  const session = await requireAdmin()

  return next({
    ctx: {
      ...ctx,
      session,
    },
  })
})
