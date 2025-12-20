import { eq, sql } from "drizzle-orm"
import { z } from "zod"

import { CACHE_KEYS, CACHE_TTL } from "@/lib/cache/keys"
import { getCached, setCached } from "@/lib/cache/redis"
import { userCards } from "@/lib/db/schema"
import { protectedProcedure, router } from "../trpc"

export const collectionRouter = router({
  getUserCards: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id
    const cacheKey = CACHE_KEYS.USER_COLLECTION(userId)
    const cached = await getCached<typeof cards>(cacheKey)
    if (cached) return cached

    const cards = await ctx.db.query.userCards.findMany({
      where: eq(userCards.userId, userId),
      with: {
        card: true,
      },
    })

    await setCached(cacheKey, cards, CACHE_TTL.USER_COLLECTION)
    return cards
  }),

  getCardDetails: protectedProcedure
    .input(z.object({ userCardId: z.string() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id

      const userCard = await ctx.db.query.userCards.findFirst({
        where: eq(userCards.id, input.userCardId),
        with: {
          card: true,
        },
      })

      if (!userCard || userCard.userId !== userId) {
        throw new Error("Card not found")
      }

      return userCard
    }),

  getStats: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id

    const [totalCards, uniqueCards] = await Promise.all([
      ctx.db
        .select({ count: sql<number>`count(*)` })
        .from(userCards)
        .where(eq(userCards.userId, userId)),
      ctx.db
        .select({ count: sql<number>`count(DISTINCT card_id)` })
        .from(userCards)
        .where(eq(userCards.userId, userId)),
    ])

    return {
      totalCards: Number(totalCards[0]?.count ?? 0),
      uniqueCards: Number(uniqueCards[0]?.count ?? 0),
    }
  }),
})
