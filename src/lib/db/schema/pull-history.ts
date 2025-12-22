import { numeric, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"

import { cards } from "./cards"
import { gachaEvents } from "./gacha-events"
import { users } from "./users"

export const pullHistory = pgTable("pull_history", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  eventId: uuid("event_id").references(() => gachaEvents.id, {
    onDelete: "set null",
  }),
  cardId: uuid("card_id")
    .notNull()
    .references(() => cards.id, { onDelete: "cascade" }),
  rarityAtPull: text("rarity_at_pull").notNull(),
  cost: numeric("cost", { precision: 10, scale: 2 }),
  pulledAt: timestamp("pulled_at").defaultNow().notNull(),
  sessionId: uuid("session_id"),
})
