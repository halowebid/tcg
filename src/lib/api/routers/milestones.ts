import { and, eq, sql } from "drizzle-orm"
import { z } from "zod"

import {
  milestones,
  transactions,
  userMilestones,
  userProfiles,
} from "@/lib/db/schema"
import { adminProcedure, protectedProcedure, router } from "../trpc"

export const milestonesRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const allMilestones = await ctx.db.query.milestones.findMany({
      where: eq(milestones.isActive, true),
    })

    return allMilestones
  }),

  getUserProgress: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id

    const progress = await ctx.db.query.userMilestones.findMany({
      where: eq(userMilestones.userId, userId),
      with: {
        milestone: true,
      },
    })

    return progress
  }),

  claimReward: protectedProcedure
    .input(z.object({ milestoneId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id

      const [userMilestone, milestone] = await Promise.all([
        ctx.db.query.userMilestones.findFirst({
          where: and(
            eq(userMilestones.userId, userId),
            eq(userMilestones.milestoneId, input.milestoneId),
          ),
        }),
        ctx.db.query.milestones.findFirst({
          where: eq(milestones.id, input.milestoneId),
        }),
      ])

      if (!userMilestone || !milestone) {
        throw new Error("Milestone not found")
      }

      if (!userMilestone.isCompleted) {
        throw new Error("Milestone not completed")
      }

      if (userMilestone.isClaimed) {
        throw new Error("Reward already claimed")
      }

      await ctx.db.transaction(async (tx) => {
        await tx
          .update(userMilestones)
          .set({
            isClaimed: true,
            claimedAt: new Date(),
          })
          .where(
            and(
              eq(userMilestones.userId, userId),
              eq(userMilestones.milestoneId, input.milestoneId),
            ),
          )

        if (milestone.rewardType === "currency") {
          const rewardValue = parseFloat(milestone.rewardValue)
          await tx
            .update(userProfiles)
            .set({
              balance: sql`${userProfiles.balance} + ${rewardValue}`,
              updatedAt: new Date(),
            })
            .where(eq(userProfiles.userId, userId))

          await tx.insert(transactions).values({
            userId,
            type: "milestone_reward",
            amountChange: rewardValue.toFixed(2),
            description: `Milestone reward: ${milestone.title}`,
          })
        }
      })

      return { success: true }
    }),

  create: adminProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        icon: z.string(),
        requirementType: z.enum([
          "collection_size",
          "total_spend",
          "friend_count",
          "pulls_count",
          "login_streak",
        ]),
        requirementValue: z.number().int(),
        rewardType: z.enum(["currency", "badge", "frame", "title"]),
        rewardValue: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [milestone] = await ctx.db
        .insert(milestones)
        .values(input)
        .returning()

      return milestone
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        description: z.string().optional(),
        icon: z.string().optional(),
        requirementType: z
          .enum([
            "collection_size",
            "total_spend",
            "friend_count",
            "pulls_count",
            "login_streak",
          ])
          .optional(),
        requirementValue: z.number().int().optional(),
        rewardType: z
          .enum(["currency", "badge", "frame", "title"])
          .optional(),
        rewardValue: z.string().optional(),
        isActive: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input

      const [milestone] = await ctx.db
        .update(milestones)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(milestones.id, id))
        .returning()

      return milestone
    }),
})
