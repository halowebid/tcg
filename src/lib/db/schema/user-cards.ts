import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

import { cards } from "./cards"
import { users } from "./users"

export const acquiredViaEnum = pgEnum("acquired_via", [
  "gacha",
  "purchase",
  "reward",
])

export const userCards = pgTable("user_cards", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  cardId: uuid("card_id")
    .notNull()
    .references(() => cards.id, { onDelete: "cascade" }),
  level: integer("level").default(1).notNull(),
  exp: integer("exp").default(0).notNull(),
  acquiredAt: timestamp("acquired_at").defaultNow().notNull(),
  acquiredVia: acquiredViaEnum("acquired_via").default("purchase").notNull(),
})

export const userCardsRelations = relations(userCards, ({ one }) => ({
  user: one(users, {
    fields: [userCards.userId],
    references: [users.id],
  }),
  card: one(cards, {
    fields: [userCards.cardId],
    references: [cards.id],
  }),
}))
