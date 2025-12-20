import { and, desc, eq, sql } from "drizzle-orm"
import { z } from "zod"

import { CACHE_KEYS, CACHE_TTL } from "@/lib/cache/keys"
import { getCached, invalidatePattern, setCached } from "@/lib/cache/redis"
import { cards } from "@/lib/db/schema"
import { adminProcedure, publicProcedure, router } from "../trpc"

export const cardsRouter = router({
  list: publicProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(20),
        rarity: z.enum(["common", "rare", "epic", "legendary"]).optional(),
        setId: z.string().uuid().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const cacheKey = CACHE_KEYS.CARDS_LIST(
        input.page,
        input.rarity,
        input.setId,
      )
      const cached = await getCached<typeof result>(cacheKey)
      if (cached) return cached

      const where = and(
        eq(cards.isActive, true),
        input.rarity ? eq(cards.rarity, input.rarity) : undefined,
        input.setId ? eq(cards.setId, input.setId) : undefined,
      )

      const [items, countResult] = await Promise.all([
        ctx.db.query.cards.findMany({
          where,
          limit: input.limit,
          offset: (input.page - 1) * input.limit,
          orderBy: [desc(cards.createdAt)],
        }),
        ctx.db
          .select({ count: sql<number>`count(*)` })
          .from(cards)
          .where(where),
      ])

      const result = {
        items,
        total: Number(countResult[0]?.count ?? 0),
        page: input.page,
        limit: input.limit,
      }

      await setCached(cacheKey, result, CACHE_TTL.CARDS_LIST)
      return result
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const cacheKey = CACHE_KEYS.CARD_DETAILS(input.id)
      const cached = await getCached<typeof card>(cacheKey)
      if (cached) return cached

      const card = await ctx.db.query.cards.findFirst({
        where: eq(cards.id, input.id),
      })

      if (!card) {
        throw new Error("Card not found")
      }

      await setCached(cacheKey, card, CACHE_TTL.CARD_DETAILS)
      return card
    }),

  search: publicProcedure
    .input(z.object({ query: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const results = await ctx.db.query.cards.findMany({
        where: and(
          eq(cards.isActive, true),
          sql`${cards.name} ILIKE ${"%" + input.query + "%"}`,
        ),
        limit: 20,
      })

      return results
    }),

  create: adminProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        imageUrl: z.string().url(),
        rarity: z.enum(["common", "rare", "epic", "legendary"]),
        setId: z.string().uuid().optional(),
        attackPower: z.number().int().min(0).optional(),
        defensePower: z.number().int().min(0).optional(),
        marketValue: z.string().optional(),
        dropWeight: z.string().default("1.0"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [card] = await ctx.db.insert(cards).values(input).returning()

      await invalidatePattern("cards:list:*")

      return card
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string().min(1).optional(),
        description: z.string().optional(),
        imageUrl: z.string().url().optional(),
        rarity: z.enum(["common", "rare", "epic", "legendary"]).optional(),
        setId: z.string().uuid().optional(),
        attackPower: z.number().int().min(0).optional(),
        defensePower: z.number().int().min(0).optional(),
        marketValue: z.string().optional(),
        dropWeight: z.string().optional(),
        isActive: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input

      const [card] = await ctx.db
        .update(cards)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(cards.id, id))
        .returning()

      await Promise.all([
        invalidatePattern("cards:list:*"),
        invalidatePattern(`cards:details:${id}`),
      ])

      return card
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(cards)
        .set({ isActive: false, updatedAt: new Date() })
        .where(eq(cards.id, input.id))

      await Promise.all([
        invalidatePattern("cards:list:*"),
        invalidatePattern(`cards:details:${input.id}`),
      ])

      return { success: true }
    }),
})
