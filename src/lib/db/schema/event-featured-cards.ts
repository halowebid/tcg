import { numeric, pgTable, uuid } from "drizzle-orm/pg-core"

import { cards } from "./cards"
import { gachaEvents } from "./gacha-events"

export const eventFeaturedCards = pgTable("event_featured_cards", {
  id: uuid("id").defaultRandom().primaryKey(),
  eventId: uuid("event_id")
    .notNull()
    .references(() => gachaEvents.id, { onDelete: "cascade" }),
  cardId: uuid("card_id")
    .notNull()
    .references(() => cards.id, { onDelete: "cascade" }),
  rateMultiplier: numeric("rate_multiplier", { precision: 5, scale: 2 })
    .default("2.0")
    .notNull(),
})
