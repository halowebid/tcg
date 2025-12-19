import { z } from "zod"
import { router, protectedProcedure, adminProcedure } from "../trpc"
import { systemSettings } from "@/lib/db/schema"
import { db } from "@/lib/db"
import { eq } from "drizzle-orm"

export const settingsRouter = router({
  get: protectedProcedure.query(async () => {
    const settings = await db.query.systemSettings.findFirst({
      where: eq(systemSettings.id, "default"),
    })

    if (!settings) {
      // Return defaults if no settings exist
      return {
        id: "default",
        gameTitle: "TCG Gacha System",
        supportEmail: "support@tcg-gacha.com",
        maintenanceMode: false,
        currencyName: "Coins",
        premiumCurrencyName: "Gems",
        exchangeRate: 100,
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
        currencyName: z.string().optional(),
        premiumCurrencyName: z.string().optional(),
        exchangeRate: z.number().int().positive().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const existing = await db.query.systemSettings.findFirst({
        where: eq(systemSettings.id, "default"),
      })

      if (!existing) {
        // Create if doesn't exist
        const [created] = await db.insert(systemSettings).values({
          id: "default",
          ...input,
        }).returning()
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
