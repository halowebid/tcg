import {
  index,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core"

import { cards } from "./cards"
import { users } from "./users"

export const cartItems = pgTable(
  "cart_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    cardId: uuid("card_id")
      .notNull()
      .references(() => cards.id, { onDelete: "cascade" }),
    addedAt: timestamp("added_at").defaultNow().notNull(),
  },
  (table) => ({
    userCardUnique: unique().on(table.userId, table.cardId),
    userIdIdx: index("cart_items_user_id_idx").on(table.userId),
    cardIdIdx: index("cart_items_card_id_idx").on(table.cardId),
  }),
)
