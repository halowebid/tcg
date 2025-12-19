import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"

export const cardSets = pgTable("card_sets", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  bannerUrl: text("banner_url"),
  releaseDate: timestamp("release_date").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})
