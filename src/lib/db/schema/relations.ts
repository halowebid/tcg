import { relations } from "drizzle-orm"

import { cards } from "./cards"
import { cartItems } from "./cart-items"
import { milestones } from "./milestones"
import { userCards } from "./user-cards"
import { userMilestones } from "./user-milestones"
import { userProfiles } from "./user-profiles"
import { users } from "./users"

export const cardsRelations = relations(cards, ({ many }) => ({
  userCards: many(userCards),
  cartItems: many(cartItems),
}))

export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(userProfiles, {
    fields: [users.id],
    references: [userProfiles.userId],
  }),
  userCards: many(userCards),
  userMilestones: many(userMilestones),
  cartItems: many(cartItems),
}))

export const userProfilesRelations = relations(userProfiles, ({ one }) => ({
  user: one(users, {
    fields: [userProfiles.userId],
    references: [users.id],
  }),
}))

export const milestonesRelations = relations(milestones, ({ many }) => ({
  userMilestones: many(userMilestones),
}))

export const userMilestonesRelations = relations(userMilestones, ({ one }) => ({
  user: one(users, {
    fields: [userMilestones.userId],
    references: [users.id],
  }),
  milestone: one(milestones, {
    fields: [userMilestones.milestoneId],
    references: [milestones.id],
  }),
}))

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  user: one(users, {
    fields: [cartItems.userId],
    references: [users.id],
  }),
  card: one(cards, {
    fields: [cartItems.cardId],
    references: [cards.id],
  }),
}))
