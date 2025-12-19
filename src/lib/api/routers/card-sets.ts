import { z } from "zod"
import { router, publicProcedure, adminProcedure } from "../trpc"
import { cardSets } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"

export const cardSetsRouter = router({
  list: publicProcedure.query(async ({ ctx }) => {
    const sets = await ctx.db.query.cardSets.findMany({
      where: eq(cardSets.isActive, true),
      orderBy: [desc(cardSets.releaseDate)],
    })

    return sets
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const set = await ctx.db.query.cardSets.findFirst({
        where: eq(cardSets.id, input.id),
      })

      if (!set) {
        throw new Error("Card set not found")
      }

      return set
    }),

  create: adminProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        bannerUrl: z.string().optional(),
        releaseDate: z.date(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [set] = await ctx.db.insert(cardSets).values(input).returning()

      return set
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        description: z.string().optional(),
        bannerUrl: z.string().optional(),
        releaseDate: z.date().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input

      const [set] = await ctx.db
        .update(cardSets)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(cardSets.id, id))
        .returning()

      return set
    }),
})
