import { and, desc, eq } from "drizzle-orm"
import { z } from "zod"

import { notifications } from "@/lib/db/schema"
import { protectedProcedure, router } from "../trpc"

export const notificationsRouter = router({
  list: protectedProcedure
    .input(
      z.object({
        type: z
          .enum(["all", "gacha", "order", "system", "milestone"])
          .optional(),
        limit: z.number().min(1).max(50).default(20),
        offset: z.number().min(0).default(0),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id

      const where =
        input.type && input.type !== "all"
          ? and(
              eq(notifications.userId, userId),
              eq(notifications.type, input.type),
            )
          : eq(notifications.userId, userId)

      const items = await ctx.db.query.notifications.findMany({
        where,
        limit: input.limit,
        offset: input.offset,
        orderBy: [desc(notifications.createdAt)],
      })

      return items
    }),

  markAsRead: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id

      await ctx.db
        .update(notifications)
        .set({ isRead: true })
        .where(
          and(eq(notifications.id, input.id), eq(notifications.userId, userId)),
        )

      return { success: true }
    }),

  markAllAsRead: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.session.user.id

    await ctx.db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.userId, userId))

    return { success: true }
  }),
})
