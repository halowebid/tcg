import { desc, eq } from "drizzle-orm"
import { z } from "zod"

import { CACHE_KEYS, CACHE_TTL } from "@/lib/cache/keys"
import { getCached, invalidatePattern, setCached } from "@/lib/cache/redis"
import { transactions, userProfiles } from "@/lib/db/schema"
import { protectedProcedure, router } from "../trpc"

export const usersRouter = router({
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id
    const cacheKey = CACHE_KEYS.USER_PROFILE(userId)
    const cached = await getCached<typeof profile>(cacheKey)
    if (cached) return cached

    const profile = await ctx.db.query.userProfiles.findFirst({
      where: eq(userProfiles.userId, userId),
    })

    if (!profile) {
      throw new Error("Profile not found")
    }

    await setCached(cacheKey, profile, CACHE_TTL.USER_PROFILE)
    return profile
  }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        displayName: z.string().min(1).optional(),
        username: z.string().min(3).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id

      const [profile] = await ctx.db
        .update(userProfiles)
        .set({ ...input, updatedAt: new Date() })
        .where(eq(userProfiles.userId, userId))
        .returning()

      await invalidatePattern(`user:profile:${userId}`)

      return profile
    }),

  getWallet: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id
    const cacheKey = CACHE_KEYS.USER_WALLET(userId)
    const cached = await getCached<typeof wallet>(cacheKey)
    if (cached) return cached

    const profile = await ctx.db.query.userProfiles.findFirst({
      where: eq(userProfiles.userId, userId),
    })

    if (!profile) {
      throw new Error("Profile not found")
    }

    const wallet = {
      coins: profile.coins,
      gems: profile.gems,
    }

    await setCached(cacheKey, wallet, CACHE_TTL.USER_WALLET)
    return wallet
  }),

  getActivity: protectedProcedure
    .input(z.object({ limit: z.number().min(1).max(50).default(20) }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id

      const activity = await ctx.db.query.transactions.findMany({
        where: eq(transactions.userId, userId),
        orderBy: [desc(transactions.createdAt)],
        limit: input.limit,
      })

      return activity
    }),
})
