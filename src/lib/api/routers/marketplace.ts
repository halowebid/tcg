import { and, eq, ilike, ne, or } from "drizzle-orm"
import { z } from "zod"

import { invalidatePattern } from "@/lib/cache/redis"
import { cards, transactions, userCards, userProfiles } from "@/lib/db/schema"
import { protectedProcedure, publicProcedure, router } from "../trpc"

export const marketplaceRouter = router({
  list: publicProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(50).default(20),
        rarity: z.enum(["common", "rare", "epic", "legendary"]).optional(),
        search: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const where = and(
        eq(cards.isActive, true),
        input.rarity ? eq(cards.rarity, input.rarity) : undefined,
        input.search ? ilike(cards.name, `%${input.search}%`) : undefined,
      )

      const items = await ctx.db.query.cards.findMany({
        where,
        limit: input.limit,
        offset: (input.page - 1) * input.limit,
      })

      return items
    }),

  getCardPrice: publicProcedure
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

      if (parseFloat(profile.balance) < price) {
        throw new Error("Insufficient balance")
      }

      await ctx.db.transaction(async (tx) => {
        await tx
          .update(userProfiles)
          .set({
            balance: (parseFloat(profile.balance) - price).toFixed(2),
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
          amountChange: (-price).toFixed(2),
          description: `Purchased card: ${card.name}`,
        })
      })

      await invalidatePattern(`user:collection:${userId}`)
      await invalidatePattern(`user:wallet:${userId}`)

      return { success: true }
    }),

  getRelatedCards: publicProcedure
    .input(
      z.object({
        cardId: z.string(),
        limit: z.number().min(1).max(10).default(4),
      }),
    )
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
            card.setId ? eq(cards.setId, card.setId) : undefined,
          ),
        ),
        limit: input.limit,
      })

      return relatedCards
    }),
})
