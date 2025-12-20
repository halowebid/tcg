import { boolean, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core"

import { users } from "./users"

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: text("type", {
    enum: ["gacha", "order", "system", "milestone"],
  }).notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  imageUrl: text("image_url"),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})
