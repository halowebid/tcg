import { initTRPC, TRPCError } from "@trpc/server"
import { getSession, requireAdmin as requireAdminSession } from "@/lib/auth/session"
import { db } from "@/lib/db"
import superjson from "superjson"

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
  const { session, profile } = await requireAdminSession()

  return next({
    ctx: {
      ...ctx,
      session,
      profile,
    },
  })
})
