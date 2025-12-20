import { and, eq, gte, lte } from "drizzle-orm"
import { z } from "zod"

import { CACHE_KEYS, CACHE_TTL } from "@/lib/cache/keys"
import { getCached, invalidatePattern, setCached } from "@/lib/cache/redis"
import {
  cards,
  eventFeaturedCards,
  gachaEvents,
  pullHistory,
  transactions,
  userCards,
  userProfiles,
} from "@/lib/db/schema"
import {
  protectedProcedure,
  publicProcedure,
  router,
  type createTRPCContext,
} from "../trpc"

export const gachaRouter = router({
  getActiveEvents: publicProcedure.query(async ({ ctx }) => {
    const cacheKey = CACHE_KEYS.ACTIVE_EVENTS
    const cached = await getCached<typeof activeEvents>(cacheKey)
    if (cached) return cached

    const now = new Date()
    const activeEvents = await ctx.db.query.gachaEvents.findMany({
      where: and(
        eq(gachaEvents.isActive, true),
        lte(gachaEvents.startDate, now),
        gte(gachaEvents.endDate, now),
      ),
    })

    await setCached(cacheKey, activeEvents, CACHE_TTL.ACTIVE_EVENTS)
    return activeEvents
  }),

  getEventById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const cacheKey = CACHE_KEYS.EVENT_DETAILS(input.id)
      const cached = await getCached<typeof event>(cacheKey)
      if (cached) return cached

      const event = await ctx.db.query.gachaEvents.findFirst({
        where: eq(gachaEvents.id, input.id),
      })

      if (!event) {
        throw new Error("Event not found")
      }

      await setCached(cacheKey, event, CACHE_TTL.EVENT_DETAILS)
      return event
    }),

  getDropRates: publicProcedure
    .input(z.object({ eventId: z.string() }))
    .query(async ({ ctx, input }) => {
      const event = await ctx.db.query.gachaEvents.findFirst({
        where: eq(gachaEvents.id, input.eventId),
      })

      if (!event) {
        throw new Error("Event not found")
      }

      return {
        legendary: parseFloat(event.legendaryRate),
        epic: parseFloat(event.epicRate),
        rare: parseFloat(event.rareRate),
        common: parseFloat(event.commonRate),
      }
    }),

  pull: protectedProcedure
    .input(
      z.object({
        eventId: z.string(),
        useGems: z.boolean().default(false),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id

      const event = await ctx.db.query.gachaEvents.findFirst({
        where: eq(gachaEvents.id, input.eventId),
      })

      if (!event) {
        throw new Error("Event not found")
      }

      const profile = await ctx.db.query.userProfiles.findFirst({
        where: eq(userProfiles.userId, userId),
      })

      if (!profile) {
        throw new Error("User profile not found")
      }

      const cost = input.useGems
        ? (event.packPriceGems ?? 0)
        : event.packPriceCoins

      if (input.useGems && cost === 0) {
        throw new Error("Gems not accepted for this event")
      }

      if (input.useGems && profile.gems < cost) {
        throw new Error("Insufficient gems")
      }

      if (!input.useGems && profile.coins < cost) {
        throw new Error("Insufficient coins")
      }

      const selectedCard = await selectRandomCard(ctx.db, input.eventId, event)

      const sessionId = crypto.randomUUID()

      await ctx.db.transaction(async (tx) => {
        await tx
          .update(userProfiles)
          .set({
            coins: input.useGems ? profile.coins : profile.coins - cost,
            gems: input.useGems ? profile.gems - cost : profile.gems,
            updatedAt: new Date(),
          })
          .where(eq(userProfiles.userId, userId))

        await tx.insert(pullHistory).values({
          userId,
          eventId: input.eventId,
          cardId: selectedCard.id,
          rarityAtPull: selectedCard.rarity,
          costCoins: input.useGems ? null : cost,
          costGems: input.useGems ? cost : null,
          sessionId,
        })

        await tx.insert(userCards).values({
          userId,
          cardId: selectedCard.id,
          acquiredVia: "gacha",
        })

        await tx.insert(transactions).values({
          userId,
          type: "gacha_pull",
          coinsChange: input.useGems ? 0 : -cost,
          gemsChange: input.useGems ? -cost : 0,
          description: `Gacha pull: ${selectedCard.name}`,
        })
      })

      await Promise.all([
        invalidatePattern(`user:collection:${userId}`),
        invalidatePattern(`user:wallet:${userId}`),
      ])

      return selectedCard
    }),

  pullTen: protectedProcedure
    .input(
      z.object({
        eventId: z.string(),
        useGems: z.boolean().default(false),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id

      const event = await ctx.db.query.gachaEvents.findFirst({
        where: eq(gachaEvents.id, input.eventId),
      })

      if (!event) {
        throw new Error("Event not found")
      }

      const profile = await ctx.db.query.userProfiles.findFirst({
        where: eq(userProfiles.userId, userId),
      })

      if (!profile) {
        throw new Error("User profile not found")
      }

      const costPerPull = input.useGems
        ? (event.packPriceGems ?? 0)
        : event.packPriceCoins
      const totalCost = costPerPull * 10

      if (input.useGems && costPerPull === 0) {
        throw new Error("Gems not accepted for this event")
      }

      if (input.useGems && profile.gems < totalCost) {
        throw new Error("Insufficient gems")
      }

      if (!input.useGems && profile.coins < totalCost) {
        throw new Error("Insufficient coins")
      }

      const selectedCards = await Promise.all(
        Array.from({ length: 10 }, () =>
          selectRandomCard(ctx.db, input.eventId, event),
        ),
      )

      const sessionId = crypto.randomUUID()

      await ctx.db.transaction(async (tx) => {
        await tx
          .update(userProfiles)
          .set({
            coins: input.useGems ? profile.coins : profile.coins - totalCost,
            gems: input.useGems ? profile.gems - totalCost : profile.gems,
            updatedAt: new Date(),
          })
          .where(eq(userProfiles.userId, userId))

        for (const card of selectedCards) {
          await tx.insert(pullHistory).values({
            userId,
            eventId: input.eventId,
            cardId: card.id,
            rarityAtPull: card.rarity,
            costCoins: input.useGems ? null : costPerPull,
            costGems: input.useGems ? costPerPull : null,
            sessionId,
          })

          await tx.insert(userCards).values({
            userId,
            cardId: card.id,
            acquiredVia: "gacha",
          })
        }

        await tx.insert(transactions).values({
          userId,
          type: "gacha_pull",
          coinsChange: input.useGems ? 0 : -totalCost,
          gemsChange: input.useGems ? -totalCost : 0,
          description: `10x Gacha pull`,
        })
      })

      await Promise.all([
        invalidatePattern(`user:collection:${userId}`),
        invalidatePattern(`user:wallet:${userId}`),
      ])

      return selectedCards
    }),
})

async function selectRandomCard(
  db: Awaited<ReturnType<typeof createTRPCContext>>["db"],
  eventId: string,
  event: {
    legendaryRate: string
    epicRate: string
    rareRate: string
  },
) {
  const random = Math.random()

  let selectedRarity: string

  const legendaryRate = parseFloat(event.legendaryRate)
  const epicRate = parseFloat(event.epicRate)
  const rareRate = parseFloat(event.rareRate)

  if (random < legendaryRate) {
    selectedRarity = "legendary"
  } else if (random < legendaryRate + epicRate) {
    selectedRarity = "epic"
  } else if (random < legendaryRate + epicRate + rareRate) {
    selectedRarity = "rare"
  } else {
    selectedRarity = "common"
  }

  const availableCards = await db.query.cards.findMany({
    where: and(
      eq(
        cards.rarity,
        selectedRarity as "common" | "rare" | "epic" | "legendary",
      ),
      eq(cards.isActive, true),
    ),
  })

  if (availableCards.length === 0) {
    throw new Error(`No cards available for rarity: ${selectedRarity}`)
  }

  const featuredCards = await db.query.eventFeaturedCards.findMany({
    where: eq(eventFeaturedCards.eventId, eventId),
  })

  const featuredCardIds = featuredCards.map(
    (fc: typeof eventFeaturedCards.$inferSelect) => fc.cardId,
  )

  type Card = typeof cards.$inferSelect
  const weightedCards = availableCards.map((card: Card) => {
    const isFeatured = featuredCardIds.includes(card.id)
    const weight = parseFloat(card.dropWeight) * (isFeatured ? 2.0 : 1.0)
    return { card, weight }
  })

  const totalWeight = weightedCards.reduce(
    (sum: number, wc: { weight: number; card: Card }) => sum + wc.weight,
    0,
  )
  let randomWeight = Math.random() * totalWeight

  for (const wc of weightedCards) {
    randomWeight -= wc.weight
    if (randomWeight <= 0) {
      return wc.card
    }
  }

  return weightedCards[0].card
}
