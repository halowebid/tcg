import {
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core"

import { users } from "./users"

export const transactionTypeEnum = pgEnum("transaction_type", [
  "gacha_pull",
  "card_purchase",
  "reward_claim",
  "admin_adjustment",
  "milestone_reward",
  "deposit",
])

export const transactions = pgTable("transactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: transactionTypeEnum("type").default("card_purchase").notNull(),
  amountChange: numeric("amount_change", { precision: 10, scale: 2 })
    .default("0.00")
    .notNull(),
  description: text("description").notNull(),
  referenceId: uuid("reference_id"),
  createdBy: text("created_by").references(() => users.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})
