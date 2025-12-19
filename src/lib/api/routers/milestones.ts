import { z } from "zod"
import { router, protectedProcedure, adminProcedure } from "../trpc"
import { milestones, userMilestones, userProfiles } from "@/lib/db/schema"
import { eq, and, sql } from "drizzle-orm"

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
            eq(userMilestones.milestoneId, input.milestoneId)
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
              eq(userMilestones.milestoneId, input.milestoneId)
            )
          )

        if (milestone.rewardType === "coins") {
          const rewardValue = parseInt(milestone.rewardValue)
          await tx
            .update(userProfiles)
            .set({
              coins: sql`${userProfiles.coins} + ${rewardValue}`,
              updatedAt: new Date(),
            })
            .where(eq(userProfiles.userId, userId))
        } else if (milestone.rewardType === "gems") {
          const rewardValue = parseInt(milestone.rewardValue)
          await tx
            .update(userProfiles)
            .set({
              gems: sql`${userProfiles.gems} + ${rewardValue}`,
              updatedAt: new Date(),
            })
            .where(eq(userProfiles.userId, userId))
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
        rewardType: z.enum(["coins", "gems", "badge", "frame", "title"]),
        rewardValue: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [milestone] = await ctx.db.insert(milestones).values(input).returning()

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
        rewardType: z.enum(["coins", "gems", "badge", "frame", "title"]).optional(),
        rewardValue: z.string().optional(),
        isActive: z.boolean().optional(),
      })
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
