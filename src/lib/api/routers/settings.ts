import { eq } from "drizzle-orm"
import { z } from "zod"

import { db } from "@/lib/db"
import { systemSettings } from "@/lib/db/schema"
import { adminProcedure, protectedProcedure, router } from "../trpc"

export const settingsRouter = router({
  get: protectedProcedure.query(async () => {
    const settings = await db.query.systemSettings.findFirst({
      where: eq(systemSettings.id, "default"),
    })

    if (!settings) {
      return {
        id: "default",
        gameTitle: "TCG Gacha System",
        supportEmail: "support@tcg-gacha.com",
        maintenanceMode: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    }

    return settings
  }),

  update: adminProcedure
    .input(
      z.object({
        gameTitle: z.string().optional(),
        supportEmail: z.string().email().optional(),
        maintenanceMode: z.boolean().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const existing = await db.query.systemSettings.findFirst({
        where: eq(systemSettings.id, "default"),
      })

      if (!existing) {
        // Create if doesn't exist
        const [created] = await db
          .insert(systemSettings)
          .values({
            id: "default",
            ...input,
          })
          .returning()
        return created
      }

      // Update existing
      const [updated] = await db
        .update(systemSettings)
        .set({
          ...input,
          updatedAt: new Date(),
        })
        .where(eq(systemSettings.id, "default"))
        .returning()

      return updated
    }),
})
