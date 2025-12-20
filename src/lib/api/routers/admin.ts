import { desc, eq, sql } from "drizzle-orm"
import { z } from "zod"

import { CACHE_KEYS, CACHE_TTL } from "@/lib/cache/keys"
import { getCached, setCached } from "@/lib/cache/redis"
import {
  gachaEvents,
  pullHistory,
  transactions,
  userProfiles,
} from "@/lib/db/schema"
import { adminProcedure, router } from "../trpc"

export const adminRouter = router({
  getDashboardStats: adminProcedure.query(async ({ ctx }) => {
    const cached = await getCached<typeof stats>(
      CACHE_KEYS.ADMIN_DASHBOARD_STATS,
    )
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
      totalUsers: Number(totalUsers[0]?.count ?? 0),
      totalPulls: Number(totalPulls[0]?.count ?? 0),
      totalRevenue: Number(totalRevenue[0]?.total ?? 0),
    }

    await setCached(
      CACHE_KEYS.ADMIN_DASHBOARD_STATS,
      stats,
      CACHE_TTL.ADMIN_DASHBOARD,
    )
    return stats
  }),

  getUserList: adminProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(20),
      }),
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
      }),
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

  getUserTransactions: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        limit: z.number().min(1).max(100).default(20),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userTransactions = await ctx.db.query.transactions.findMany({
        where: eq(transactions.userId, input.userId),
        orderBy: [desc(transactions.createdAt)],
        limit: input.limit,
      })

      return userTransactions
    }),

  getAllEvents: adminProcedure.query(async ({ ctx }) => {
    const events = await ctx.db.query.gachaEvents.findMany({
      orderBy: [desc(gachaEvents.createdAt)],
    })
    return events
  }),

  getEventById: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const event = await ctx.db.query.gachaEvents.findFirst({
        where: eq(gachaEvents.id, input.id),
      })

      if (!event) {
        throw new Error("Event not found")
      }

      return event
    }),

  createEvent: adminProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100),
        description: z.string(),
        bannerUrl: z.string().url(),
        startDate: z.date(),
        endDate: z.date(),
        packPriceCoins: z.number().int().positive(),
        packPriceGems: z.number().int().positive().optional(),
        commonRate: z.string(),
        rareRate: z.string(),
        epicRate: z.string(),
        legendaryRate: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [event] = await ctx.db
        .insert(gachaEvents)
        .values({
          ...input,
          isActive: true,
        })
        .returning()

      return event
    }),

  updateEvent: adminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).max(100).optional(),
        description: z.string().optional(),
        bannerUrl: z.string().url().optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        packPriceCoins: z.number().int().positive().optional(),
        packPriceGems: z.number().int().positive().optional(),
        commonRate: z.string().optional(),
        rareRate: z.string().optional(),
        epicRate: z.string().optional(),
        legendaryRate: z.string().optional(),
        isActive: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input

      const [updated] = await ctx.db
        .update(gachaEvents)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(eq(gachaEvents.id, id))
        .returning()

      return updated
    }),

  deleteEvent: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(gachaEvents).where(eq(gachaEvents.id, input.id))
      return { success: true }
    }),
})
