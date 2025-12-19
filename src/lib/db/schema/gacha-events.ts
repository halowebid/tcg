import {
  boolean,
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core"

export const gachaEvents = pgTable("gacha_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  bannerUrl: text("banner_url"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  packPriceCoins: integer("pack_price_coins").notNull(),
  packPriceGems: integer("pack_price_gems"),
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
