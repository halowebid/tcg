import { router, adminProcedure } from "../trpc"
import { userProfiles, pullHistory, transactions } from "@/lib/db/schema"
import { sql, desc, eq } from "drizzle-orm"
import { getCached, setCached } from "@/lib/cache/redis"
import { CACHE_KEYS, CACHE_TTL } from "@/lib/cache/keys"
import { z } from "zod"

export const adminRouter = router({
  getDashboardStats: adminProcedure.query(async ({ ctx }) => {
    const cached = await getCached<typeof stats>(CACHE_KEYS.ADMIN_DASHBOARD_STATS)
    if (cached) return cached

    const [totalUsers, totalPulls, totalRevenue] = await Promise.all([
      ctx.db.select({ count: sql<number>`count(*)` }).from(userProfiles),
      ctx.db.select({ count: sql<number>`count(*)` }).from(pullHistory),
      ctx.db
        .select({
          total: sql<number>`sum(abs(${transactions.coinsChange}))`,
        })
        .from(transactions)
        .where(eq(transactions.type, "gacha_pull")),
    ])

    const stats = {
      totalUsers: Number(totalUsers[0]?.count || 0),
      totalPulls: Number(totalPulls[0]?.count || 0),
      totalRevenue: Number(totalRevenue[0]?.total || 0),
    }

    await setCached(CACHE_KEYS.ADMIN_DASHBOARD_STATS, stats, CACHE_TTL.ADMIN_DASHBOARD)
    return stats
  }),

  getUserList: adminProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      const users = await ctx.db.query.userProfiles.findMany({
        limit: input.limit,
        offset: (input.page - 1) * input.limit,
        orderBy: [desc(userProfiles.createdAt)],
      })

      return users
    }),

  getUserById: adminProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.query.userProfiles.findFirst({
        where: eq(userProfiles.userId, input.userId),
      })

      if (!user) {
        throw new Error("User not found")
      }

      return user
    }),

  updateUserWallet: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        coinsChange: z.number().int(),
        gemsChange: z.number().int(),
        reason: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        await tx
          .update(userProfiles)
          .set({
            coins: sql`${userProfiles.coins} + ${input.coinsChange}`,
            gems: sql`${userProfiles.gems} + ${input.gemsChange}`,
            updatedAt: new Date(),
          })
          .where(eq(userProfiles.userId, input.userId))

        await tx.insert(transactions).values({
          userId: input.userId,
          type: "admin_adjustment",
          coinsChange: input.coinsChange,
          gemsChange: input.gemsChange,
          description: input.reason,
          createdBy: ctx.profile.userId,
        })
      })

      return { success: true }
    }),

  banUser: adminProcedure
    .input(z.object({ userId: z.string(), banned: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(userProfiles)
        .set({ isBanned: input.banned, updatedAt: new Date() })
        .where(eq(userProfiles.userId, input.userId))

      return { success: true }
    }),
})
