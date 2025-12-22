import {
  boolean,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import type { z } from "zod"

export const gachaEvents = pgTable("gacha_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  bannerUrl: text("banner_url"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  singlePullPrice: numeric("single_pull_price", {
    precision: 10,
    scale: 2,
  }).notNull(),
  tenPullPrice: numeric("ten_pull_price", {
    precision: 10,
    scale: 2,
  }).notNull(),
  legendaryRate: numeric("legendary_rate", {
    precision: 5,
    scale: 4,
  }).notNull(),
  epicRate: numeric("epic_rate", { precision: 5, scale: 4 }).notNull(),
  rareRate: numeric("rare_rate", { precision: 5, scale: 4 }).notNull(),
  commonRate: numeric("common_rate", { precision: 5, scale: 4 }).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const insertGachaEventSchema = createInsertSchema(gachaEvents)
export const selectGachaEventSchema = createSelectSchema(gachaEvents)

export type InsertGachaEvent = z.infer<typeof insertGachaEventSchema>
export type SelectGachaEvent = z.infer<typeof selectGachaEventSchema>
