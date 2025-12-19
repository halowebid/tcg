import { z } from "zod"
import { router, protectedProcedure } from "../trpc"
import { cards, userProfiles, transactions, userCards } from "@/lib/db/schema"
import { eq, and, ne, or } from "drizzle-orm"
import { invalidatePattern } from "@/lib/cache/redis"

export const marketplaceRouter = router({
  list: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(50).default(20),
        rarity: z.enum(["common", "rare", "epic", "legendary"]).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const where = and(
        eq(cards.isActive, true),
        input.rarity ? eq(cards.rarity, input.rarity) : undefined
      )

      const items = await ctx.db.query.cards.findMany({
        where,
        limit: input.limit,
        offset: (input.page - 1) * input.limit,
      })

      return items
    }),

  getCardPrice: protectedProcedure
    .input(z.object({ cardId: z.string() }))
    .query(async ({ ctx, input }) => {
      const card = await ctx.db.query.cards.findFirst({
        where: eq(cards.id, input.cardId),
      })

      if (!card) {
        throw new Error("Card not found")
      }

      return {
        cardId: input.cardId,
        price: card.marketValue ? parseFloat(card.marketValue) : 100,
      }
    }),

  purchase: protectedProcedure
    .input(z.object({ cardId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id

      const [card, profile] = await Promise.all([
        ctx.db.query.cards.findFirst({
          where: eq(cards.id, input.cardId),
        }),
        ctx.db.query.userProfiles.findFirst({
          where: eq(userProfiles.userId, userId),
        }),
      ])

      if (!card) {
        throw new Error("Card not found")
      }

      if (!profile) {
        throw new Error("Profile not found")
      }

      const price = card.marketValue ? parseFloat(card.marketValue) : 100

      if (profile.coins < price) {
        throw new Error("Insufficient coins")
      }

      await ctx.db.transaction(async (tx) => {
        await tx
          .update(userProfiles)
          .set({
            coins: profile.coins - price,
            updatedAt: new Date(),
          })
          .where(eq(userProfiles.userId, userId))

        await tx.insert(userCards).values({
          userId,
          cardId: input.cardId,
          acquiredVia: "purchase",
        })

        await tx.insert(transactions).values({
          userId,
          type: "card_purchase",
          coinsChange: -price,
          gemsChange: 0,
          description: `Purchased card: ${card.name}`,
        })
      })

      await invalidatePattern(`user:collection:${userId}`)
      await invalidatePattern(`user:wallet:${userId}`)

      return { success: true }
    }),

  getRelatedCards: protectedProcedure
    .input(z.object({ cardId: z.string(), limit: z.number().min(1).max(10).default(4) }))
    .query(async ({ ctx, input }) => {
      const card = await ctx.db.query.cards.findFirst({
        where: eq(cards.id, input.cardId),
      })

      if (!card) {
        throw new Error("Card not found")
      }

      // Get cards with same rarity or same set, excluding the current card
      const relatedCards = await ctx.db.query.cards.findMany({
        where: and(
          ne(cards.id, input.cardId),
          eq(cards.isActive, true),
          or(
            eq(cards.rarity, card.rarity),
            card.setId ? eq(cards.setId, card.setId) : undefined
          )
        ),
        limit: input.limit,
      })

      return relatedCards
    }),
})
