import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core"

export const requirementTypeEnum = pgEnum("requirement_type", [
  "collection_size",
  "total_spend",
  "friend_count",
  "pulls_count",
  "login_streak",
])

export const rewardTypeEnum = pgEnum("reward_type", [
  "currency",
  "badge",
  "frame",
  "title",
])

export const milestones = pgTable("milestones", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  requirementType: requirementTypeEnum("requirement_type")
    .default("collection_size")
    .notNull(),
  requirementValue: integer("requirement_value").notNull(),
  rewardType: rewardTypeEnum("reward_type").default("currency").notNull(),
  rewardValue: text("reward_value").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})
