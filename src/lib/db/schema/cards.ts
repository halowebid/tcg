import {
  boolean,
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"

export const rarityEnum = pgEnum("rarity", [
  "common",
  "rare",
  "epic",
  "legendary",
])

export const cards = pgTable("cards", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  rarity: rarityEnum("rarity").default("common").notNull(),
  setId: uuid("set_id"),
  attackPower: integer("attack_power"),
  defensePower: integer("defense_power"),
  marketValue: numeric("market_value", { precision: 10, scale: 2 }),
  dropWeight: numeric("drop_weight", { precision: 5, scale: 2 })
    .default("1.0")
    .notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const insertCardSchema = createInsertSchema(cards)
export const selectCardSchema = createSelectSchema(cards)

export type InsertCard = z.infer<typeof insertCardSchema>
export type SelectCard = z.infer<typeof selectCardSchema>
