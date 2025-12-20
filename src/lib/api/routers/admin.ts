import { headers } from "next/headers"
import { desc, eq, sql } from "drizzle-orm"
import { z } from "zod"

import { auth } from "@/lib/auth"
import { CACHE_KEYS, CACHE_TTL } from "@/lib/cache/keys"
import { getCached, setCached } from "@/lib/cache/redis"
import {
  gachaEvents,
  pullHistory,
  transactions,
  userProfiles,
  users,
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
      const profile = await ctx.db.query.userProfiles.findFirst({
        where: eq(userProfiles.userId, input.userId),
      })

      if (!profile) {
        throw new Error("User not found")
      }

      const user = await ctx.db.query.users.findFirst({
        where: eq(users.id, input.userId),
      })

      return {
        ...profile,
        role: user?.role ?? "user",
        isBanned: user?.banned ?? false,
        banReason: user?.banReason,
        banExpires: user?.banExpires,
      }
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
          createdBy: ctx.session.user.id,
        })
      })

      return { success: true }
    }),

  banUser: adminProcedure
    .input(z.object({ userId: z.string(), banned: z.boolean() }))
    .mutation(async ({ input }) => {
      if (input.banned) {
        await auth.api.banUser({
          body: {
            userId: input.userId,
            banReason: "Banned by administrator",
          },
          headers: await headers(),
        })
      } else {
        await auth.api.unbanUser({
          body: { userId: input.userId },
          headers: await headers(),
        })
      }

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

  createUser: adminProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(8),
        name: z.string(),
        role: z.enum(["user", "admin"]).default("user"),
      }),
    )
    .mutation(async ({ input }) => {
      const user = await auth.api.createUser({
        body: {
          email: input.email,
          password: input.password,
          name: input.name,
          role: input.role,
        },
      })
      return user
    }),

  listUsers: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
        searchValue: z.string().optional(),
        searchField: z.enum(["email", "name"]).optional(),
      }),
    )
    .query(async ({ input }) => {
      const result = await auth.api.listUsers({
        query: {
          limit: input.limit,
          offset: input.offset,
          searchValue: input.searchValue,
          searchField: input.searchField,
        },
        headers: await headers(),
      })
      return result
    }),

  setRole: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        role: z.enum(["user", "admin"]),
      }),
    )
    .mutation(async ({ input }) => {
      await auth.api.setRole({
        body: {
          userId: input.userId,
          role: input.role,
        },
        headers: await headers(),
      })
      return { success: true }
    }),

  banUserAdmin: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        banReason: z.string().optional(),
        banExpiresIn: z.number().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      await auth.api.banUser({
        body: {
          userId: input.userId,
          banReason: input.banReason,
          banExpiresIn: input.banExpiresIn,
        },
        headers: await headers(),
      })
      return { success: true }
    }),

  unbanUser: adminProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ input }) => {
      await auth.api.unbanUser({
        body: { userId: input.userId },
        headers: await headers(),
      })
      return { success: true }
    }),

  listUserSessions: adminProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      const sessions = await auth.api.listUserSessions({
        body: { userId: input.userId },
        headers: await headers(),
      })
      return sessions
    }),

  revokeUserSession: adminProcedure
    .input(z.object({ sessionToken: z.string() }))
    .mutation(async ({ input }) => {
      await auth.api.revokeUserSession({
        body: { sessionToken: input.sessionToken },
        headers: await headers(),
      })
      return { success: true }
    }),

  revokeUserSessions: adminProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ input }) => {
      await auth.api.revokeUserSessions({
        body: { userId: input.userId },
        headers: await headers(),
      })
      return { success: true }
    }),

  impersonateUser: adminProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ input }) => {
      const result = await auth.api.impersonateUser({
        body: { userId: input.userId },
        headers: await headers(),
      })
      return result
    }),

  removeUser: adminProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ input }) => {
      const deleted = await auth.api.removeUser({
        body: { userId: input.userId },
        headers: await headers(),
      })
      return deleted
    }),
})
